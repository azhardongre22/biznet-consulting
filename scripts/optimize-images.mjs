/**
 * Offline raster-image optimizer (Sharp).
 *
 * Reads every PNG/JPG/WEBP under src/assets/images/, downscales it to a width
 * that matches how it is actually displayed, and writes a WebP copy to
 * src/assets/images/optimized/<same subfolder>/<name>.webp.
 *
 * Originals are never modified or deleted — they stay as the editable masters.
 * Components must import from `optimized/` so Vite only ever bundles the WebP.
 *
 * Run:   npm run optimize:images
 *
 * NOTE: this is deliberately NOT part of `vite build`. Encoding ~80 images at
 * effort 6 takes far too long for a normal build. Re-run it manually whenever
 * you add or replace a source image, and commit the generated WebP files.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

/**
 * Per-use-case encoding presets, matched against the source path relative to a
 * source root (POSIX separators). This project keeps its images in a flat
 * folder, so most matches are on the file name. First match wins — order
 * matters.
 *
 * maxWidth is an upper bound only — images are never enlarged.
 */
const PRESETS = [
  // Full-bleed hero / slider backgrounds.
  { name: "hero", test: /^herobg\./i, maxWidth: 1920, quality: 80 },
  { name: "hero", test: /^serviceslider/i, maxWidth: 1920, quality: 80 },
  { name: "hero", test: /^about-slider/i, maxWidth: 1920, quality: 80 },
  { name: "hero", test: /^mobile-view-slider/i, maxWidth: 1080, quality: 80 },

  // Portrait / people photography — a little more quality on faces.
  { name: "portrait", test: /^ceo\d*\./i, maxWidth: 1200, quality: 82 },
  { name: "portrait", test: /^who-we-are/i, maxWidth: 1400, quality: 82 },

  // Logos, wordmarks and favicons: crisp edges and flat colour, so quality
  // matters far more than resolution.
  {
    name: "logo",
    test: /^(bn_logo|favicon|ceo logo|biznet-sec|biznet-tagline|x logo)/i,
    maxWidth: 1000,
    quality: 92,
  },

  // Everything else under images/ is content / section / card art.
  { name: "card", test: /.*/, maxWidth: 1400, quality: 80 },
];

const presetFor = (relativePath) =>
  PRESETS.find((preset) => preset.test.test(relativePath)) ?? {
    name: "default",
    maxWidth: 1200,
    quality: 80,
  };

/**
 * Source roots to process. Each root is scanned recursively for raster images
 * and gets its own sibling `optimized/` output folder, mirroring the same
 * relative layout. Originals are never touched. Add a root here if raster
 * assets ever live somewhere new.
 */
const ROOTS = [
  path.resolve(__dirname, "../src/assets/images"),
  path.resolve(__dirname, "../src/assets/icons"),
];

const formatBytes = (bytes) =>
  bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;

async function collectSources(dir, outDir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Never walk our own output folder.
      if (absolute === outDir) continue;
      files.push(...(await collectSources(absolute, outDir, base)));
      continue;
    }
    // SVGs are already tiny and lossless — leave them alone.
    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    files.push(path.relative(base, absolute).split(path.sep).join("/"));
  }

  return files;
}

/**
 * Two sources can map onto the same .webp output (e.g. a logo shipped as both
 * `foo.png` and `foo.webp`). Keep the heavier source — it is the one carrying
 * the most original detail — and report the rest.
 */
async function dedupeByOutput(relativePaths, srcDir) {
  const byOutput = new Map();

  for (const relativePath of relativePaths) {
    const output = relativePath.replace(/\.[^./]+$/, ".webp");
    const { size } = await fs.stat(path.join(srcDir, relativePath));
    const existing = byOutput.get(output);
    if (!existing || size > existing.size) {
      if (existing) console.warn(`  ! ${output}: also from ${existing.relativePath} (skipped)`);
      byOutput.set(output, { relativePath, size });
    } else {
      console.warn(`  ! ${output}: also from ${relativePath} (skipped)`);
    }
  }

  return [...byOutput.entries()].map(([output, value]) => ({ ...value, output }));
}

async function optimizeRoot(srcDir, totals) {
  const outDir = path.join(srcDir, "optimized");

  let sources;
  try {
    sources = await collectSources(srcDir, outDir);
  } catch (error) {
    // A configured root that doesn't exist yet is not fatal — just skip it.
    if (error.code === "ENOENT") return;
    throw error;
  }
  if (sources.length === 0) return;

  console.log(`${path.relative(path.resolve(__dirname, ".."), srcDir).split(path.sep).join("/")}/`);

  const jobs = await dedupeByOutput(sources, srcDir);

  for (const { relativePath, output, size } of jobs) {
    const preset = presetFor(relativePath);
    const inputPath = path.join(srcDir, relativePath);
    const outputPath = path.join(outDir, output);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const image = sharp(inputPath, { failOn: "none" });
    const { width } = await image.metadata();

    await image
      // `withoutEnlargement` keeps small logos at their native size.
      .resize({ width: Math.min(width ?? preset.maxWidth, preset.maxWidth), withoutEnlargement: true })
      .webp({ quality: preset.quality, effort: 6 })
      .toFile(outputPath);

    let { size: outSize } = await fs.stat(outputPath);

    // Some sources are already well-optimised WebP; re-encoding them can cost
    // bytes. When that happens, ship the original untouched.
    if (outSize > size && path.extname(relativePath).toLowerCase() === ".webp") {
      await fs.copyFile(inputPath, outputPath);
      outSize = size;
    }

    totals.in += size;
    totals.out += outSize;
    totals.count += 1;

    const saved = size > 0 ? Math.round((1 - outSize / size) * 100) : 0;
    console.log(
      `  ${output.padEnd(64)} ${preset.name.padEnd(8)} ${formatBytes(size)} -> ${formatBytes(outSize)} (-${saved}%)`,
    );
  }
}

async function main() {
  const totals = { in: 0, out: 0, count: 0 };

  for (const srcDir of ROOTS) {
    await optimizeRoot(srcDir, totals);
  }

  if (totals.count === 0) {
    console.log("No source images found.");
    return;
  }

  console.log(
    `\n${totals.count} images: ${formatBytes(totals.in)} -> ${formatBytes(totals.out)} ` +
      `(-${Math.round((1 - totals.out / totals.in) * 100)}%)`,
  );
}

await main();
