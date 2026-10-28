/**
 * Generates the static social-share and icon assets in public/:
 *   og-image.jpg            1200×630 brand card (default share image)
 *   og/<page>.jpg           1200×630 per-page cards (page photo + headline)
 *   favicon.svg / favicon.png (48px) / apple-touch-icon.png (180px)
 *   brand/biznet-logo.png   512×512 logo referenced by the Organization JSON-LD
 *
 * JPG because WhatsApp, LinkedIn and Facebook preview WebP inconsistently.
 * Run after changing a page photo or headline, then commit public/:
 *   npm run generate:og
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const img = (rel) => path.join(root, "src/assets/images", rel);
const W = 1200;
const H = 630;
const NAVY = "#0E4174";
const NAVY_DEEP = "#092D54";

/** Per-page card: [file name, source photo, eyebrow, headline]. Names match PAGE_SEO image urls. */
const PAGES = [
  ["home", "photos/dubai-skyline-blue-hour.webp", "Development advisory · UAE", "Clarity from feasibility to handover."],
  ["about", "photos/site-team-coordination.webp", "About us", "We are Biznet Consulting."],
  ["services", "photos/consultants-reviewing-plans.webp", "Services", "Clarity at every project decision."],
  ["feasibility-study", "photos/aerial-land-assessment.webp", "Service · 01", "Feasibility Study"],
  ["project-development", "photos/architectural-model-planning.webp", "Service · 02", "Project Development"],
  ["project-management", "photos/project-controls-review.webp", "Service · 03", "Project Management"],
  ["projects", "projects/projects-hero.webp", "Projects", "Residential, commercial & private villas."],
  ["news-and-insights", "photos/glass-office-towers.webp", "News & Insights", "Blogs & news from Biznet."],
  ["contact", "photos/dubai-urban-development.webp", "Contact", "Start the conversation."],
  ["faqs", "photos/architectural-blueprints.webp", "FAQs", "Questions clients ask us."],
];

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Brand SVG recoloured (the source files are navy). */
async function brandSvg(name, color) {
  const svg = await fs.readFile(img(`brand/${name}.svg`), "utf8");
  return Buffer.from(svg.replace(/#174274|#074174/gi, color));
}

async function wordmark(color, width) {
  return sharp(await brandSvg("biznet-wordmark", color), { density: 300 }).resize({ width }).png().toBuffer();
}

async function mark(color, height) {
  return sharp(await brandSvg("biznet-mark", color), { density: 600 }).resize({ height }).png().toBuffer();
}

/** Wrap a headline into ≤2 lines of roughly `max` characters. */
function wrap(text, max = 26) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  lines.push(line);
  return lines.slice(0, 2);
}

async function pageCard(name, photo, eyebrow, headline) {
  const lines = wrap(headline);
  const size = lines.length > 1 ? 64 : 72;
  const top = H - 150 - (lines.length - 1) * (size + 8);
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY_DEEP}" stop-opacity="0.15"/>
      <stop offset="0.45" stop-color="${NAVY_DEEP}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${NAVY_DEEP}" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="72" y="${top - 64}" width="48" height="3" fill="#FFFFFF"/>
  <text x="72" y="${top - 26}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="4" fill="#FFFFFF" fill-opacity="0.8">${escape(eyebrow.toUpperCase())}</text>
  ${lines
    .map((l, i) => `<text x="72" y="${top + size * 0.82 + i * (size + 8)}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="#FFFFFF">${escape(l)}</text>`)
    .join("\n  ")}
</svg>`);
  const logo = await wordmark("#FFFFFF", 300);
  await sharp(img(photo))
    .resize(W, H, { fit: "cover", position: "attention" })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 72, top: 64 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(pub, "og", `${name}.jpg`));
}

async function brandCard() {
  const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${NAVY_DEEP}"/><stop offset="1" stop-color="${NAVY}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="600" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="5" fill="#FFFFFF" fill-opacity="0.7">DEVELOPMENT ADVISORY · PROJECT MANAGEMENT · UAE</text>
</svg>`);
  const m = await mark("#FFFFFF", 170);
  const wm = await wordmark("#FFFFFF", 560);
  const mMeta = await sharp(m).metadata();
  const wMeta = await sharp(wm).metadata();
  await sharp(bg)
    .composite([
      { input: m, left: Math.round((W - mMeta.width) / 2), top: 150 },
      { input: wm, left: Math.round((W - wMeta.width) / 2), top: 150 + mMeta.height + 50 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(pub, "og-image.jpg"));
}

/** Navy mark centred on white, `size` px square. */
async function squareIcon(size, padRatio, out) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const m = await sharp(await mark(NAVY, inner)).resize(inner, inner, { fit: "inside" }).toBuffer();
  const meta = await sharp(m).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#FFFFFF" } })
    .composite([{ input: m, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(out);
}

await fs.mkdir(path.join(pub, "og"), { recursive: true });
await fs.mkdir(path.join(pub, "brand"), { recursive: true });
await brandCard();
for (const page of PAGES) await pageCard(...page);
await fs.copyFile(img("brand/biznet-mark.svg"), path.join(pub, "favicon.svg"));
await squareIcon(48, 0.06, path.join(pub, "favicon.png"));
await squareIcon(180, 0.14, path.join(pub, "apple-touch-icon.png"));
await squareIcon(512, 0.12, path.join(pub, "brand", "biznet-logo.png"));

console.log(`Generated og-image.jpg, ${PAGES.length} page cards in public/og/, favicons and brand/biznet-logo.png`);
