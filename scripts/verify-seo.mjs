/**
 * Audits the prerendered build in dist/ — run after `npm run build`:
 *   npm run verify:seo           (add --remote to also HEAD-check og:image URLs)
 *
 * Checks every HTML file for: one <title>, description, canonical matching
 * its file path, full Open Graph + Twitter set, og:image absolute with a
 * matching og:image:type, parseable JSON-LD, a single <h1> inside #root, and
 * alt text on every image. Also checks every sitemap URL has a prerendered
 * file and that no two indexable pages share a title or description.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_ORIGIN } from "../src/data/seoData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const remote = process.argv.includes("--remote");
const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
// Article copy comes from the CMS — report length issues without failing.
const lengthIssue = (file, msg) => (file.startsWith("news-and-insights/") && file !== "news-and-insights/index.html" ? warnings : errors).push(`${file}: ${msg}`);

const REQUIRED = [
  "og:type", "og:site_name", "og:locale", "og:url", "og:title", "og:description",
  "og:image", "og:image:type", "og:image:alt",
  "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt",
];
const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) files.push(p);
  }
})(dist);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, key) => {
  const m = html.match(new RegExp(`<meta (?:name|property)="${key.replace(/:/g, "\\:")}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};

const titles = new Map();
const descriptions = new Map();
const images = new Set();
const rows = [];

for (const file of files) {
  const rel = path.relative(dist, file).split(path.sep).join("/");
  const route = rel === "index.html" ? "/" : rel === "404.html" ? "/404" : `/${rel.replace(/\/index\.html$/, "")}`;
  const html = fs.readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const body = html.slice(html.indexOf('<div id="root">'));

  const titleTags = head.match(/<title>[^<]*<\/title>/g) || [];
  if (titleTags.length !== 1) fail(rel, `${titleTags.length} <title> tags`);
  const title = decode((titleTags[0] || "").replace(/<\/?title>/g, ""));
  const description = meta(head, "description");
  const robots = meta(head, "robots") || "";
  const noindex = robots.includes("noindex");
  const canonical = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];

  if (!description) fail(rel, "missing meta description");
  else if (description.length < 70 || description.length > 170) lengthIssue(rel, `description length ${description.length}`);
  if (title.length > 95) lengthIssue(rel, `title length ${title.length}`);
  const expected = route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
  if (route !== "/404" && canonical !== expected) fail(rel, `canonical ${canonical} ≠ ${expected}`);
  for (const k of REQUIRED) if (!meta(head, k)) fail(rel, `missing ${k}`);
  if (meta(head, "og:url") !== canonical) fail(rel, "og:url ≠ canonical");

  const ogImage = meta(head, "og:image") || "";
  if (!ogImage.startsWith("https://")) fail(rel, `og:image not absolute: ${ogImage}`);
  const ext = ogImage.split(/[?#]/)[0].split(".").pop().toLowerCase();
  if (MIME[ext] && meta(head, "og:image:type") !== MIME[ext]) fail(rel, `og:image:type ${meta(head, "og:image:type")} ≠ ${MIME[ext]}`);
  images.add(ogImage);

  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const [, json] of ld) {
    try {
      const d = JSON.parse(json);
      types.push(d["@type"]);
    } catch (err) {
      fail(rel, `invalid JSON-LD: ${err.message}`);
    }
  }
  if (route !== "/" && !noindex && !types.includes("BreadcrumbList")) fail(rel, "no BreadcrumbList");

  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1 && route !== "/scan") fail(rel, `${h1} <h1> in #root`);
  const imgs = body.match(/<img\b[^>]*>/g) || [];
  for (const tag of imgs) if (!/\salt="[^"]+"/.test(tag)) fail(rel, `img without alt: ${tag.slice(0, 90)}`);
  const text = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (!noindex) {
    if (titles.has(title)) fail(rel, `duplicate title with ${titles.get(title)}`);
    if (descriptions.has(description)) fail(rel, `duplicate description with ${descriptions.get(description)}`);
    titles.set(title, rel);
    descriptions.set(description, rel);
  }
  rows.push({ route, title: title.slice(0, 60), words: text.split(" ").length, imgs: imgs.length, ld: types.join(","), robots: noindex ? "noindex" : "" });
}

// Sitemap ↔ files
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = loc.replace(SITE_ORIGIN, "") || "/";
  const file = p === "/" ? "index.html" : `${p.slice(1)}/index.html`;
  if (!fs.existsSync(path.join(dist, file))) fail("sitemap.xml", `${loc} has no prerendered file`);
  const html = fs.existsSync(path.join(dist, file)) ? fs.readFileSync(path.join(dist, file), "utf8") : "";
  if (/content="noindex/.test(html)) fail("sitemap.xml", `${loc} is noindex`);
}

// og:image targets exist (local) or respond (remote)
for (const url of images) {
  if (url.startsWith(SITE_ORIGIN)) {
    const local = path.join(dist, decodeURIComponent(new URL(url).pathname));
    if (!fs.existsSync(local) && !remote) fail("og:image", `${url} not in dist/`);
  }
  if (remote) {
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
      if (!res.ok) fail("og:image", `${url} → HTTP ${res.status}`);
    } catch (err) {
      fail("og:image", `${url} → ${err.message}`);
    }
  }
}

console.table(rows.sort((a, b) => a.route.localeCompare(b.route)));
const imageCount = (sitemap.match(/<image:image>/g) || []).length;
console.log(`${files.length} HTML files · ${(sitemap.match(/<url>/g) || []).length} sitemap URLs · ${imageCount} sitemap images · ${images.size} distinct og:images`);
if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s) — fix in the CMS (meta title / meta description):\n  ${warnings.join("\n  ")}`);
}
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("SEO checks passed.");
