/**
 * Sitemap generator — single source of truth shared by the build script
 * (scripts/generate-sitemap.mjs, writes public/sitemap.xml at deploy).
 *
 * Article URLs are pulled from the live press API so a story published in the
 * CMS appears in the sitemap automatically. If the API is unreachable at build
 * time it falls back to the bundled src/data/pressReleases.js, so the sitemap
 * is never empty. Service URLs come from the bundled servicesData slugs.
 *
 * API base: CMS_API_BASE / VITE_CMS_API_BASE (default https://biznetconsulting.ae/api/cms).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_ORIGIN } from "../src/data/seoData.js";
import { PRESS_RELEASES } from "../src/data/pressReleases.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, ".."); // project root
const servicesDataFile = path.join(root, "src/data/servicesData.js");

export const SITEMAP_ORIGIN = SITE_ORIGIN;

const CMS_BASE = (
  process.env.CMS_API_BASE ||
  process.env.VITE_CMS_API_BASE ||
  `${SITE_ORIGIN}/api/cms`
).replace(/\/$/, "");

/** Fixed marketing / listing pages that are always present. */
export const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/news-and-insights",
  "/upcoming-projects",
  "/recent-projects",
  "/legacy",
  "/faqs",
  "/privacy-policy",
  "/terms-and-conditions",
];

/** Service detail slugs, read from servicesData.js without importing images. */
export function readServiceSlugs() {
  try {
    const src = fs.readFileSync(servicesDataFile, "utf8");
    const slugs = [];
    const re = /slug:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) slugs.push(m[1]);
    return [...new Set(slugs)];
  } catch {
    return [];
  }
}

async function fetchJson(url, timeoutMs = 10000) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/** Published article slugs from the live press API. */
async function fetchApiArticleSlugs() {
  const data = await fetchJson(`${CMS_BASE}/press-releases`);
  const items = Array.isArray(data?.items) ? data.items : [];
  const slugs = items
    .map((a) => (a && a.slug ? String(a.slug).trim() : ""))
    .filter(Boolean);
  if (slugs.length === 0) throw new Error("Press API returned no article slugs");
  return slugs;
}

/** Bundled article slugs (offline fallback). */
function bundledArticleSlugs() {
  return PRESS_RELEASES.map((a) => a.slug).filter(Boolean);
}

async function resolveArticleSlugs() {
  try {
    return await fetchApiArticleSlugs();
  } catch {
    return bundledArticleSlugs();
  }
}

/** Ordered, de-duplicated list of every path the sitemap should contain. */
export async function collectSitemapPaths() {
  const articleSlugs = await resolveArticleSlugs();
  const serviceSlugs = readServiceSlugs();

  const seen = new Set();
  const paths = [];
  const add = (loc) => {
    const normalized =
      loc === "/" ? "/" : `/${loc.replace(/^\/+|\/+$/g, "")}`;
    if (seen.has(normalized)) return;
    seen.add(normalized);
    paths.push(normalized);
  };

  STATIC_PATHS.forEach(add);
  serviceSlugs.forEach((slug) => add(`/services/${slug}`));
  articleSlugs.forEach((slug) => add(`/news-and-insights/${slug}`));

  return paths;
}

/** Full sitemap.xml document string. */
export async function buildSitemapXml() {
  const paths = await collectSitemapPaths();
  const today = new Date().toISOString().slice(0, 10);
  const body = paths
    .map(
      (loc) => `  <url>
    <loc>${SITEMAP_ORIGIN}${loc === "/" ? "/" : loc}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
