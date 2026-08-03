import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const logoPath = path.join(
  root,
  "src/assets/images/optimized/BN_Logo.webp",
);
const faviconSrc = path.join(
  root,
  "src/assets/images/optimized/FAVICON BLUE.webp",
);

await fs.mkdir(publicDir, { recursive: true });

const W = 1200;
const H = 630;

const logo = await sharp(logoPath)
  .resize(320, 320, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const logoMeta = await sharp(logo).metadata();
const left = Math.round((W - logoMeta.width) / 2);
const top = Math.round((H - logoMeta.height) / 2) - 36;

const svgText = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020812"/>
      <stop offset="55%" stop-color="#06131f"/>
      <stop offset="100%" stop-color="#0e4174"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="600" y="520" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="42" fill="#FFFFFF" letter-spacing="6">Biznet Consulting</text>
  <text x="600" y="562" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18" fill="#A8B4C0" letter-spacing="3">DUBAI</text>
</svg>
`);

await sharp(svgText)
  .composite([{ input: logo, left, top }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(publicDir, "og-image.jpg"));

await sharp(faviconSrc)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 2, g: 8, b: 18, alpha: 1 },
  })
  .png()
  .toFile(path.join(publicDir, "apple-touch-icon.png"));

await sharp(faviconSrc)
  .resize(32, 32, {
    fit: "contain",
    background: { r: 2, g: 8, b: 18, alpha: 1 },
  })
  .png()
  .toFile(path.join(publicDir, "favicon.png"));

await sharp(logoPath)
  .resize(1200, 1200, {
    fit: "contain",
    background: { r: 2, g: 8, b: 18, alpha: 1 },
  })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(publicDir, "og-image-square.jpg"));

console.log("Created public/og-image.jpg, favicon.png, apple-touch-icon.png");
