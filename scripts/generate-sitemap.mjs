/**
 * Writes public/sitemap.xml from the current static routes plus the live press
 * article list (with a bundled fallback when the API is down) and the bundled
 * service slugs.
 *
 * Runs as the first step of `npm run build`, so each deploy regenerates the
 * sitemap. Can also be run on its own: node scripts/generate-sitemap.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSitemapXml } from "../lib/sitemap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const xml = await buildSitemapXml();
const count = (xml.match(/<url>/g) || []).length;

const out = path.join(root, "public/sitemap.xml");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, xml, "utf8");
console.log(`[sitemap] Wrote ${count} URLs to ${out}`);
