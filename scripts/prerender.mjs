/**
 * Build-time prerender. Runs after `vite build` (client) and
 * `vite build --ssr src/entry-server.jsx --outDir .ssr` (server bundle).
 *
 * For every indexable route it renders the real React page with
 * react-dom/static and writes dist/<route>/index.html containing:
 *   - the page's own <title>, description, canonical, robots, Open Graph,
 *     Twitter card and JSON-LD (declared by the page through usePageSeo)
 *   - the full rendered markup inside #root (headings, copy, links, images
 *     with absolute URLs and alt text), so crawlers and link scrapers read
 *     complete pages without executing JavaScript.
 * Also writes dist/404.html, dist/sitemap.xml (with image entries),
 * dist/llms.txt and 1200×630 JPG share images for every article.
 *
 * Re-runnable without a Vite build (used by POST /api/seo/refresh): the
 * pristine template is cached in .prerender-template.html.
 *
 * Env: CMS_API_BASE (default https://biznetconsulting.ae/api/cms).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

import {
  DEFAULT_SEO,
  INDEXABLE_PATHS,
  ORGANIZATION,
  PAGE_SEO,
  PATHS,
  SERVICE_SECTIONS,
  SITE_NAME,
  SITE_ORIGIN,
  absoluteUrl,
  articlePath,
  canonicalUrl,
  servicePath,
} from "../src/data/seoData.js";
import { PRESS_RELEASES } from "../src/data/pressReleases.js";
import { buildSitemapXml, collectSitemapEntries } from "../lib/sitemap.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, ".ssr", "entry-server.js");
const templateCache = path.join(root, ".prerender-template.html");

const CMS_BASE = (process.env.CMS_API_BASE || process.env.VITE_CMS_API_BASE || `${SITE_ORIGIN}/api/cms`).replace(/\/$/, "");
const SEO_START = "<!--seo-->";
const SEO_END = "<!--/seo-->";
const log = (...a) => console.log("[prerender]", ...a);
const warn = (...a) => console.warn("[prerender]", ...a);

/* ── Template ──────────────────────────────────────────────────────────── */

function loadTemplate() {
  const distIndex = path.join(distDir, "index.html");
  if (fs.existsSync(distIndex)) {
    const html = fs.readFileSync(distIndex, "utf8");
    if (/<div id="root"><\/div>/.test(html)) {
      fs.writeFileSync(templateCache, html);
      return html;
    }
  }
  if (fs.existsSync(templateCache)) return fs.readFileSync(templateCache, "utf8");
  console.error("[prerender] No pristine template: run `npm run build` first.");
  process.exit(1);
}

/* ── HTML helpers ──────────────────────────────────────────────────────── */

const escapeHtml = (v) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function headHtml(seo, { headTags, jsonLdText }) {
  const tags = headTags(seo).map(({ tag, attrs }) => {
    const a = Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(" ");
    return `<${tag} ${a} />`;
  });
  const ld = seo.jsonLd.map((d) => `<script type="application/ld+json" data-page-schema>${jsonLdText(d)}</script>`);
  return [`<title>${escapeHtml(seo.title)}</title>`, ...tags, ...ld].join("\n    ");
}

/**
 * Make the static markup crawler-ready: absolute src/href, and drop the
 * framer-motion entrance styles (opacity:0 / offset transforms) so content
 * is visible without JavaScript.
 */
function finaliseBody(html) {
  return html
    .replace(/style="([^"]*)"/g, (m, css) => {
      if (!/opacity:0(?![.\d])/.test(css)) return m;
      const kept = css.split(";").filter((d) => d && !/^\s*(opacity|transform)\s*:/.test(d)).join(";");
      return kept ? `style="${kept}"` : "";
    })
    .replace(/\s(src|href|poster)="(\/(?!\/)[^"]*)"/g, (m, attr, url) => ` ${attr}="${SITE_ORIGIN}${url}"`);
}

/** Collect sitemap image entries (content photos only, not icons or logos). */
function pageImages(html) {
  const out = [];
  const seen = new Set();
  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || src.startsWith("data:") || seen.has(src)) continue;
    if (!/\.(webp|jpe?g|png|avif)(\?|$)|images\.unsplash\.com/i.test(src)) continue;
    if (/email-signature|flagcdn|\/brand\/|biznet-mark|biznet-wordmark|clients?\//i.test(src)) continue;
    seen.add(src);
    const alt = (tag.match(/\salt="([^"]*)"/) || [])[1] || "";
    out.push({ loc: src.replace(/&amp;/g, "&"), title: alt.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"') });
  }
  return out;
}

function writeRoute(routePath, html) {
  const rel = routePath === "/" ? "index.html" : routePath === "/404" ? "404.html" : path.join(...routePath.slice(1).split("/"), "index.html");
  const file = path.join(distDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

/* ── Press data (live CMS → bundled fallback) ──────────────────────────── */

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function blocksToHtml(body) {
  if (typeof body === "string") return body;
  if (!Array.isArray(body)) return "";
  return body
    .map((b) => {
      if (typeof b === "string") return `<p>${escapeHtml(b)}</p>`;
      if (b?.h) return `<h2>${escapeHtml(b.h)}</h2>`;
      if (b?.quote) return `<blockquote><p>${escapeHtml(b.quote)}</p>${b.by ? `<cite>${escapeHtml(b.by)}</cite>` : ""}</blockquote>`;
      if (Array.isArray(b?.list)) return `<ul>${b.list.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
      return "";
    })
    .join("\n");
}

function bundledPress() {
  const list = PRESS_RELEASES.map(({ body: _body, ...rest }) => rest);
  const articles = PRESS_RELEASES.map((a) => ({
    article: { ...a, body: blocksToHtml(a.body) },
    related: list.filter((o) => o.slug !== a.slug && o.group === a.group).slice(0, 3),
  }));
  return { list, articles, source: "bundled" };
}

export async function loadPress() {
  try {
    const data = await fetchJson(`${CMS_BASE}/press-releases`);
    const list = (Array.isArray(data?.items) ? data.items : []).filter((a) => a?.slug && (!a.status || a.status === "published"));
    if (!list.length) throw new Error("CMS returned no published articles");
    const articles = [];
    for (const item of list) {
      try {
        const d = await fetchJson(`${CMS_BASE}/press-releases/${encodeURIComponent(item.slug)}`);
        articles.push({ article: d.article || item, related: d.related || [] });
      } catch (err) {
        warn(`detail ${item.slug} failed (${err.message}); using list payload`);
        articles.push({ article: item, related: [] });
      }
    }
    return { list, articles, source: CMS_BASE };
  } catch (err) {
    warn(`CMS unavailable (${err.message}); using bundled pressReleases.js`);
    return bundledPress();
  }
}

/* ── Article share images (1200×630 JPG; WhatsApp/LinkedIn handle WebP badly) ── */

async function articleShareImage(article) {
  if (!article.image) return null;
  const outRel = `/og/news/${article.slug}.jpg`;
  const outAbs = path.join(distDir, outRel);
  try {
    const res = await fetch(absoluteUrl(article.image), { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    await sharp(buf).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 84, mozjpeg: true }).toFile(outAbs);
    return { url: outRel, width: 1200, height: 630, alt: article.imageAlt || article.title };
  } catch (err) {
    warn(`share image for ${article.slug} failed (${err.message}); using source image`);
    return null;
  }
}

/* ── llms.txt ──────────────────────────────────────────────────────────── */

function llmsTxt(articles) {
  const line = (p, label) => `- [${label || PAGE_SEO[p].name}](${canonicalUrl(p)}): ${PAGE_SEO[p].description}`;
  return `# ${SITE_NAME}

> ${DEFAULT_SEO.description}

${SITE_NAME} is based at ${ORGANIZATION.address.streetAddress}, ${ORGANIZATION.address.addressLocality}, UAE. Contact: ${ORGANIZATION.email}, ${ORGANIZATION.phones[0].telephone}.

## Company
${[PATHS.home, PATHS.about, PATHS.projects, PATHS.contact].map((p) => line(p)).join("\n")}

## Services
${[PATHS.services, ...SERVICE_SECTIONS.map((s) => servicePath(s.id))].map((p) => line(p)).join("\n")}

## News & Insights
${line(PATHS.news)}
${articles.map(({ article: a }) => `- [${a.title}](${canonicalUrl(articlePath(a.slug))}): ${a.metaDescription || a.excerpt || ""}`).join("\n")}

## Optional
${[PATHS.faqs, PATHS.privacy, PATHS.terms].map((p) => line(p)).join("\n")}
`;
}

/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  if (!fs.existsSync(ssrEntry)) {
    console.error("[prerender] .ssr/entry-server.js missing — run `npm run build`.");
    process.exit(1);
  }
  const template = loadTemplate();
  if (!template.includes(SEO_START) || !template.includes(SEO_END)) throw new Error("index.html is missing the <!--seo--> block");

  const ssr = await import(pathToFileURL(ssrEntry).href);
  const press = await loadPress();
  log(`${press.articles.length} articles from ${press.source}`);

  const shareImages = new Map();
  for (const { article } of press.articles) {
    const img = await articleShareImage(article);
    if (img) shareImages.set(article.slug, img);
  }

  const routes = [
    ...INDEXABLE_PATHS,
    ...Object.keys(PAGE_SEO).filter((p) => PAGE_SEO[p].noindex),
    ...press.articles.map(({ article }) => articlePath(article.slug)),
    "/404",
  ];

  const imagesByPath = {};
  const titles = new Map();
  let written = 0;

  for (const route of routes) {
    let seo;
    let body;
    try {
      const out = await ssr.render(route === "/404" ? "/__not-found__" : route, { press });
      if (!out.seo) throw new Error("page did not call usePageSeo");
      seo = { ...out.seo };
      const slug = route.startsWith(`${PATHS.news}/`) ? route.slice(PATHS.news.length + 1) : null;
      if (slug && shareImages.has(slug)) seo.image = { ...shareImages.get(slug), url: absoluteUrl(shareImages.get(slug).url) };
      body = finaliseBody(out.html);
    } catch (err) {
      warn(`${route}: deep render failed (${err.message}); writing minimal page`);
      seo = ssr.resolveSeo({ path: route, noindex: route === "/404" });
      body = `<main><h1>${escapeHtml(seo.title.split(" | ")[0])}</h1><p>${escapeHtml(seo.description)}</p><p><a href="${SITE_ORIGIN}/">${SITE_NAME}</a></p></main>`;
    }

    if (!seo.noindex) {
      imagesByPath[route] = pageImages(body);
      if (titles.has(seo.title)) warn(`duplicate title on ${route} and ${titles.get(seo.title)}`);
      titles.set(seo.title, route);
    }

    const html = template
      .replace(new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}`), `${SEO_START}\n    ${headHtml(seo, ssr)}\n    ${SEO_END}`)
      .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
    writeRoute(route, html);
    written += 1;
  }

  const entries = collectSitemapEntries(press.list, imagesByPath);
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemapXml(entries));
  fs.writeFileSync(path.join(distDir, "llms.txt"), llmsTxt(press.articles));

  log(`wrote ${written} HTML files, sitemap.xml (${entries.length} URLs), llms.txt, ${shareImages.size} article share images`);
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
