/**
 * Sitemap builder shared by the prerender (writes dist/sitemap.xml with image
 * entries) and server.js (serves it, rebuilding when missing).
 *
 * Only indexable URLs: static pages from INDEXABLE_PATHS plus published
 * articles. Redirected and noindex routes never appear. <lastmod> is the real
 * content date — the article's updatedAt/isoDate, or the last git commit of
 * the page's source file for static pages.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { INDEXABLE_PATHS, articlePath, canonicalUrl } from "../src/data/seoData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Source files whose last change dates each static page. */
const PAGE_SOURCES = {
  "/": ["src/pages/HomePage.jsx", "src/components/home/content.js"],
  "/about": ["src/pages/AboutPage.jsx"],
  "/services": ["src/pages/ServicesPage.jsx"],
  "/feasibility-study": ["src/pages/ServicesPage.jsx"],
  "/project-development": ["src/pages/ServicesPage.jsx"],
  "/project-management": ["src/pages/ServicesPage.jsx"],
  "/projects": ["src/pages/ProjectsPage.jsx", "src/data/projectsData.js"],
  "/news-and-insights": ["src/pages/NewsPage.jsx"],
  "/contact": ["src/pages/ContactPage.jsx"],
  "/faqs": ["src/pages/FaqPage.jsx"],
  "/privacy-policy": ["src/pages/SitePolicyPage.jsx"],
  "/terms-and-conditions": ["src/pages/TermsPage.jsx"],
};

function fileDate(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return null;
  try {
    const dirty = execFileSync("git", ["status", "--porcelain", "--", rel], { cwd: root, encoding: "utf8" }).trim();
    if (!dirty) {
      const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", rel], { cwd: root, encoding: "utf8" }).trim();
      if (iso) return new Date(iso);
    }
  } catch {
    /* no git — fall through to mtime */
  }
  return fs.statSync(abs).mtime;
}

const day = (d) => (d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null);

export function staticLastmod(p) {
  const dates = (PAGE_SOURCES[p] || []).map(fileDate).filter(Boolean);
  return dates.length ? day(new Date(Math.max(...dates))) : null;
}

/**
 * @param {object[]} articles      Published articles ({slug, isoDate, updatedAt}).
 * @param {Record<string, {loc, title}[]>} imagesByPath  Optional image entries per path.
 */
export function collectSitemapEntries(articles = [], imagesByPath = {}) {
  const seen = new Set();
  const entries = [];
  const add = (p, lastmod) => {
    const loc = canonicalUrl(p);
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push({ loc, lastmod, images: imagesByPath[p] || [] });
  };
  for (const p of INDEXABLE_PATHS) add(p, staticLastmod(p));
  for (const a of articles) {
    if (!a?.slug) continue;
    add(articlePath(a.slug), day(new Date(a.updatedAt || a.isoDate || NaN)));
  }
  return entries;
}

const xmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function buildSitemapXml(entries) {
  const urls = entries
    .map((e) => {
      const imgs = e.images
        .slice(0, 1000)
        .map(
          (img) =>
            `    <image:image>\n      <image:loc>${xmlEscape(img.loc)}</image:loc>${
              img.title ? `\n      <image:title>${xmlEscape(img.title)}</image:title>` : ""
            }\n    </image:image>`,
        )
        .join("\n");
      return [
        "  <url>",
        `    <loc>${xmlEscape(e.loc)}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        imgs || null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}
