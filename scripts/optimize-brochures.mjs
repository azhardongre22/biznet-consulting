/**
 * Offline course-brochure PDF compressor.
 *
 * Reads every PDF in src/assets/company-profile/ and writes a compressed copy
 * to src/assets/company-profile/optimized/<same filename>.pdf. Originals are
 * left in place as the editable masters; only the optimized copies are imported
 * by the app (see src/components/LeadModal.jsx).
 *
 * Run:   npm run optimize:brochures
 *
 * Two backends, picked automatically:
 *
 *  1. Ghostscript, if `gs` / `gswin64c` is on PATH. Highest fidelity and the
 *     industry-standard tool. Install it with:
 *       macOS    brew install ghostscript
 *       Debian   apt install ghostscript
 *       Windows  winget install ArtifexSoftware.GhostScript
 *     Force this backend with `--backend=gs`.
 *
 *  2. A built-in Sharp + pdf-lib pass (the default when Ghostscript is
 *     missing, so the script works on a clean checkout with no system deps).
 *     It rewrites only the oversized embedded *photographs* — every downscaled
 *     to at most MAX_IMAGE_EDGE px and re-encoded as JPEG. Vector text, fonts,
 *     logos and soft masks are copied through untouched, so headlines and
 *     branding stay perfectly crisp. Force it with `--backend=node`.
 *
 * These brochures are bloated by print-resolution photos (the CIPD Level 3
 * deck embeds 6720x4480 CMYK JPEGs), which is exactly what backend 2 targets.
 *
 * NOTE: this is deliberately NOT part of `vite build`. Re-run it whenever you
 * add or replace a source PDF, and commit the generated files.
 */

import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFArray } from "pdf-lib";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../src/assets/company-profile");
const OUT_DIR = path.join(SRC_DIR, "optimized");

/**
 * Longest edge kept for an embedded photo. ~190dpi on an A4 page, and roughly
 * 1:1 with a 1080p screen on the wide 1440pt slide decks — i.e. no visible
 * softening at the sizes these brochures are actually read at.
 */
const MAX_IMAGE_EDGE = 1600;
/** JPEG quality for re-encoded photos. */
const JPEG_QUALITY = 72;
/** Don't bother rewriting images already smaller than this. */
const MIN_IMAGE_BYTES = 24 * 1024;
/** Embedded ICC profiles above this size are replaced by their device fallback. */
const MIN_ICC_BYTES = 128 * 1024;

const formatBytes = (bytes) =>
  bytes >= 1048576 ? `${(bytes / 1048576).toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

/* ------------------------------------------------------------------ */
/* Ghostscript backend                                                 */
/* ------------------------------------------------------------------ */

async function findGhostscript() {
  for (const bin of ["gswin64c", "gswin32c", "gs"]) {
    try {
      await execFileAsync(bin, ["--version"]);
      return bin;
    } catch {
      /* not on PATH — try the next name */
    }
  }
  return null;
}

async function compressWithGhostscript(bin, inputPath, outputPath) {
  await execFileAsync(bin, [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.7",
    // /ebook is the right profile for a download brochure: /screen destroys
    // logo edges, /printer barely shrinks these files.
    "-dPDFSETTINGS=/ebook",
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    "-dDetectDuplicateImages=true",
    // Explicit downsampling — 150dpi keeps photos clean on screen and in print
    // without carrying the original 300-600dpi masters.
    "-dDownsampleColorImages=true",
    "-dColorImageResolution=150",
    "-dDownsampleGrayImages=true",
    "-dGrayImageResolution=150",
    "-dDownsampleMonoImages=true",
    "-dMonoImageResolution=300",
    `-sOutputFile=${outputPath}`,
    inputPath,
  ]);
}

/* ------------------------------------------------------------------ */
/* Node backend: recompress oversized embedded photos                  */
/* ------------------------------------------------------------------ */

/** Undo the PNG row predictor that Acrobat applies to Flate image streams. */
function unpredict(data, colors, bitsPerComponent, columns) {
  const bpp = Math.max(1, Math.ceil((colors * bitsPerComponent) / 8));
  const rowLength = Math.ceil((colors * bitsPerComponent * columns) / 8);
  const rows = Math.floor(data.length / (rowLength + 1));
  const out = Buffer.alloc(rows * rowLength);

  for (let row = 0; row < rows; row++) {
    const filter = data[row * (rowLength + 1)];
    const src = row * (rowLength + 1) + 1;
    const dst = row * rowLength;
    const prev = dst - rowLength;

    for (let i = 0; i < rowLength; i++) {
      const raw = data[src + i];
      const left = i >= bpp ? out[dst + i - bpp] : 0;
      const up = row > 0 ? out[prev + i] : 0;
      const upLeft = row > 0 && i >= bpp ? out[prev + i - bpp] : 0;

      switch (filter) {
        case 0:
          out[dst + i] = raw;
          break;
        case 1:
          out[dst + i] = raw + left;
          break;
        case 2:
          out[dst + i] = raw + up;
          break;
        case 3:
          out[dst + i] = raw + ((left + up) >> 1);
          break;
        case 4: {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          out[dst + i] = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
          break;
        }
        default:
          throw new Error(`unsupported PNG predictor filter ${filter}`);
      }
    }
  }

  return out;
}

/** Resolve an /Indexed palette into a flat RGB lookup table. */
function readIndexedPalette(context, colorSpace) {
  if (String(colorSpace.get(1)) !== "/DeviceRGB") return null;
  const lookup = context.lookup(colorSpace.get(3));

  if (lookup instanceof PDFRawStream) {
    const filter = String(lookup.dict.get(PDFName.of("Filter")));
    const bytes = Buffer.from(lookup.contents);
    return filter === "/FlateDecode" ? zlib.inflateSync(bytes) : bytes;
  }
  // Palettes can also be stored inline as a (hex) string.
  return typeof lookup?.asBytes === "function" ? Buffer.from(lookup.asBytes()) : null;
}

/**
 * Does this JPEG carry an Adobe APP14 marker? Photoshop-authored CMYK JPEGs
 * do, and they store every component *inverted* — without undoing that, the
 * photo comes out as a yellow/teal negative.
 */
function hasAdobeMarker(jpeg) {
  let offset = 2; // skip SOI
  while (offset + 4 <= jpeg.length && jpeg[offset] === 0xff) {
    const marker = jpeg[offset + 1];
    if (marker === 0xda || marker === 0xd9) break; // start of scan / end of image
    const length = jpeg.readUInt16BE(offset + 2);
    if (marker === 0xee && jpeg.slice(offset + 4, offset + 9).toString("latin1") === "Adobe") {
      return true;
    }
    offset += 2 + length;
  }
  return false;
}

/** Flatten 8-bit CMYK samples to packed RGB. */
function cmykToRgb(data, pixels, invert) {
  const rgb = Buffer.alloc(pixels * 3);
  for (let i = 0; i < pixels; i++) {
    const at = i * 4;
    const c = invert ? 255 - data[at] : data[at];
    const m = invert ? 255 - data[at + 1] : data[at + 1];
    const y = invert ? 255 - data[at + 2] : data[at + 2];
    const k = invert ? 255 - data[at + 3] : data[at + 3];
    const ink = (255 - k) / 255;
    rgb[i * 3] = (255 - c) * ink;
    rgb[i * 3 + 1] = (255 - m) * ink;
    rgb[i * 3 + 2] = (255 - y) * ink;
  }
  return rgb;
}

/** Expand 8-bit /Indexed samples to packed RGB via the palette. */
function indexedToRgb(indices, pixels, palette) {
  const rgb = Buffer.alloc(pixels * 3);
  for (let i = 0; i < pixels; i++) {
    const at = indices[i] * 3;
    rgb[i * 3] = palette[at];
    rgb[i * 3 + 1] = palette[at + 1];
    rgb[i * 3 + 2] = palette[at + 2];
  }
  return rgb;
}

/**
 * Decode one image XObject and return it as an sRGB Sharp pipeline already
 * scaled to `maxEdge`. Returns null for anything we deliberately leave alone.
 *
 * Every branch ends in packed RGB so the rewritten dict can always declare
 * /DeviceRGB — print-accurate CMYK is irrelevant for a web download.
 */
async function decodeImage(context, stream, maxEdge) {
  const dict = stream.dict;
  const num = (key) => dict.get(PDFName.of(key))?.asNumber?.();

  if (dict.get(PDFName.of("ImageMask"))) return null; // stencil mask — vector-crisp
  if ((num("BitsPerComponent") ?? 8) !== 8) return null;

  const width = num("Width");
  const height = num("Height");
  if (!width || !height) return null;

  const filter = String(dict.get(PDFName.of("Filter")));
  const rawColorSpace = context.lookup(dict.get(PDFName.of("ColorSpace")));
  const colorSpace = String(rawColorSpace);
  const bytes = Buffer.from(stream.contents);

  // Grayscale streams here are soft masks and are already tiny — recompressing
  // them risks halos around cut-outs for no meaningful saving.
  if (colorSpace === "/DeviceGray") return null;

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const target = {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
  const fromRgb = (rgb, dims) =>
    sharp(rgb, { raw: { width: dims.width, height: dims.height, channels: 3 } })
      .resize(target.width, target.height, { fit: "fill" });

  if (filter === "/DCTDecode") {
    if (colorSpace === "/DeviceRGB") {
      return { image: sharp(bytes, { failOn: "none" }).resize(target.width, target.height, { fit: "fill" }), ...target };
    }
    if (colorSpace !== "/DeviceCMYK") return null;

    // Sharp's pipeline defaults to sRGB, which would silently round-trip these
    // scans through a wrong conversion. Pin the whole pipeline to CMYK so we
    // get the untouched components back, then convert them ourselves.
    const { data, info } = await sharp(bytes, { failOn: "none" })
      .pipelineColorspace("cmyk")
      .toColorspace("cmyk")
      .resize(target.width, target.height, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.channels !== 4) return null;

    const rgb = cmykToRgb(data, info.width * info.height, hasAdobeMarker(bytes));
    return { image: sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }), ...target };
  }

  if (filter !== "/FlateDecode") return null;

  const parms = context.lookup(dict.get(PDFName.of("DecodeParms")));
  const predictor = parms?.get?.(PDFName.of("Predictor"))?.asNumber?.() ?? 1;
  const isIndexed = rawColorSpace instanceof PDFArray && String(rawColorSpace.get(0)) === "/Indexed";
  const channels = isIndexed ? 1 : { "/DeviceRGB": 3, "/DeviceCMYK": 4 }[colorSpace];
  if (!channels) return null; // ICCBased, Separation, … — leave untouched

  let raw = zlib.inflateSync(bytes);
  if (predictor >= 10) {
    raw = unpredict(raw, channels, 8, parms.get(PDFName.of("Columns"))?.asNumber() ?? width);
  } else if (predictor !== 1) {
    return null; // TIFF predictor — rare, not worth the risk
  }
  if (raw.length < width * height * channels) return null;

  const pixels = width * height;
  if (isIndexed) {
    const palette = readIndexedPalette(context, rawColorSpace);
    if (!palette) return null;
    return { image: fromRgb(indexedToRgb(raw, pixels, palette), { width, height }), ...target };
  }
  if (channels === 4) {
    // Raw CMYK samples in a PDF are true ink coverage — no Adobe inversion.
    return { image: fromRgb(cmykToRgb(raw, pixels, false), { width, height }), ...target };
  }
  return { image: fromRgb(raw, { width, height }), ...target };
}

/**
 * Swap oversized embedded /ICCBased colour profiles for their device
 * equivalents. Print-authored brochures often carry a multi-megabyte CMYK
 * profile (the CIPD Level 3 deck spends 2.5MB on one) that no longer buys
 * anything once the photos have been re-encoded as /DeviceRGB. PDF 32000-1
 * §8.6.5.5 already defines DeviceGray/RGB/CMYK as the fallback for an
 * unusable profile, so this only makes that fallback explicit.
 */
function pruneLargeIccProfiles(context, minBytes) {
  const deviceByComponents = { 1: "DeviceGray", 3: "DeviceRGB", 4: "DeviceCMYK" };
  const replacements = new Map();

  for (const [ref, object] of context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFRawStream)) continue;
    if (object.contents.length < minBytes) continue;
    const components = object.dict.get(PDFName.of("N"))?.asNumber?.();
    const device = deviceByComponents[components];
    // /N is unique to ICC profile streams, so it doubles as the type check.
    if (device) replacements.set(ref, PDFName.of(device));
  }
  if (replacements.size === 0) return 0;

  /** @returns the replacement for `value`, or null to leave it alone. */
  const rewrite = (value) => {
    if (value instanceof PDFArray) {
      if (String(value.get(0)) === "/ICCBased") {
        const replacement = replacements.get(value.get(1));
        if (replacement) return replacement;
      }
      for (let i = 0; i < value.size(); i++) {
        const next = rewrite(value.get(i));
        if (next) value.set(i, next);
      }
      return null;
    }
    // Only descend into inline dicts — following refs could loop forever.
    if (typeof value?.keys === "function") {
      for (const key of value.keys()) {
        const next = rewrite(value.get(key));
        if (next) value.set(key, next);
      }
    }
    return null;
  };

  for (const [ref, object] of context.enumerateIndirectObjects()) {
    if (replacements.has(ref)) continue;
    const next = rewrite(object instanceof PDFRawStream ? object.dict : object);
    // A colour space can also be an indirect object in its own right.
    if (next) context.assign(ref, next);
  }
  for (const ref of replacements.keys()) context.delete(ref);

  return replacements.size;
}

async function compressWithNode(inputPath, outputPath) {
  const doc = await PDFDocument.load(await fs.readFile(inputPath), {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  const { context } = doc;
  let rewritten = 0;

  for (const [ref, object] of context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFRawStream)) continue;
    if (String(object.dict.get(PDFName.of("Subtype"))) !== "/Image") continue;
    if (object.contents.length < MIN_IMAGE_BYTES) continue;

    let decoded;
    let jpeg;
    try {
      decoded = await decodeImage(context, object, MAX_IMAGE_EDGE);
      if (!decoded) continue;
      jpeg = await decoded.image
        .jpeg({ quality: JPEG_QUALITY, chromaSubsampling: "4:2:0", mozjpeg: true })
        .toBuffer();
    } catch {
      continue; // anything we can't confidently parse stays as-is
    }

    const { width: targetWidth, height: targetHeight } = decoded;

    if (jpeg.length >= object.contents.length) continue;

    const dict = object.dict;
    dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
    dict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceRGB"));
    dict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(8));
    dict.set(PDFName.of("Width"), PDFNumber.of(targetWidth));
    dict.set(PDFName.of("Height"), PDFNumber.of(targetHeight));
    dict.set(PDFName.of("Length"), PDFNumber.of(jpeg.length));
    dict.delete(PDFName.of("DecodeParms"));
    dict.delete(PDFName.of("Decode"));

    context.assign(ref, PDFRawStream.of(dict, jpeg));
    rewritten++;
  }

  pruneLargeIccProfiles(context, MIN_ICC_BYTES);

  await fs.writeFile(outputPath, await doc.save({ useObjectStreams: true }));
  return rewritten;
}

/* ------------------------------------------------------------------ */

async function main() {
  const forced = process.argv.find((arg) => arg.startsWith("--backend="))?.split("=")[1];
  const ghostscript = forced === "node" ? null : await findGhostscript();

  if (forced === "gs" && !ghostscript) {
    throw new Error("--backend=gs requested but Ghostscript is not on PATH.");
  }

  console.log(
    ghostscript
      ? `Backend: Ghostscript (${ghostscript})\n`
      : "Backend: Sharp + pdf-lib (install Ghostscript for higher fidelity)\n",
  );

  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(SRC_DIR)).filter((name) => name.toLowerCase().endsWith(".pdf"));
  let totalIn = 0;
  let totalOut = 0;

  for (const name of files) {
    const inputPath = path.join(SRC_DIR, name);
    const outputPath = path.join(OUT_DIR, name);
    const { size } = await fs.stat(inputPath);

    if (ghostscript) {
      await compressWithGhostscript(ghostscript, inputPath, outputPath);
    } else {
      await compressWithNode(inputPath, outputPath);
    }

    let { size: outSize } = await fs.stat(outputPath);

    // Small, already-tight PDFs can come out larger. Ship the original so
    // every source file still has a counterpart in optimized/.
    if (outSize >= size) {
      await fs.copyFile(inputPath, outputPath);
      outSize = size;
    }

    totalIn += size;
    totalOut += outSize;

    const saved = Math.round((1 - outSize / size) * 100);
    console.log(`  ${name.padEnd(72)} ${formatBytes(size)} -> ${formatBytes(outSize)} (-${saved}%)`);
  }

  console.log(
    `\n${files.length} brochures: ${formatBytes(totalIn)} -> ${formatBytes(totalOut)} ` +
      `(-${Math.round((1 - totalOut / totalIn) * 100)}%)`,
  );
}

await main();
