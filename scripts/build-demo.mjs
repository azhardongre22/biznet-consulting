/**
 * Static demo build for GitHub Pages (client preview, no backend).
 *
 *   DEMO_BASE=/biznet-consulting/ node scripts/build-demo.mjs
 *
 * - Builds the SPA under the repo sub-path (vite --base).
 * - Snapshots the live CMS press articles into dist/demo-cms/*.json, which the
 *   app reads instead of /api/cms (VITE_CMS_STATIC), with media URLs pointed
 *   at the live site.
 * - Copies index.html to every route folder (200 on deep links) and 404.html
 *   (SPA fallback for anything else).
 *
 * Contact / newsletter forms need server.js and will not submit on the demo.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PAGE_SEO, SITE_ORIGIN, articlePath } from "../src/data/seoData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const base = `/${(process.env.DEMO_BASE || "/biznet-consulting/").replace(/^\/|\/$/g, "")}/`;
const CMS_BASE = (process.env.CMS_API_BASE || `${SITE_ORIGIN}/api/cms`).replace(/\/$/, "");
const log = (...a) => console.log("[demo]", ...a);

execSync(`npx vite build --base=${base}`, {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VITE_CMS_API_BASE: `${base}demo-cms`, VITE_CMS_STATIC: "1" },
});

/** Relative CMS media paths ("/uploads/…") resolve against the live site. */
const absolutiseMedia = (json) => json.replace(/"\/uploads\//g, `"${SITE_ORIGIN}/uploads/`);

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

const cmsDir = path.join(distDir, "demo-cms");
fs.mkdirSync(path.join(cmsDir, "press-releases"), { recursive: true });

let slugs = [];
try {
  const listText = absolutiseMedia(await fetchJson(`${CMS_BASE}/press-releases`));
  fs.writeFileSync(path.join(cmsDir, "press-releases.json"), listText);
  slugs = (JSON.parse(listText).items || []).map((a) => a.slug).filter(Boolean);
  for (const slug of slugs) {
    const text = absolutiseMedia(await fetchJson(`${CMS_BASE}/press-releases/${encodeURIComponent(slug)}`));
    fs.writeFileSync(path.join(cmsDir, "press-releases", `${slug}.json`), text);
  }
  log(`snapshotted ${slugs.length} articles from ${CMS_BASE}`);
} catch (err) {
  console.warn("[demo] CMS snapshot failed; newsroom will be empty:", err.message);
  fs.writeFileSync(path.join(cmsDir, "press-releases.json"), JSON.stringify({ ok: true, items: [] }));
}

const index = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const routes = [...Object.keys(PAGE_SEO), ...slugs.map(articlePath)].filter((p) => p !== "/");
for (const route of routes) {
  const dir = path.join(distDir, ...route.slice(1).split("/"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), index);
}
fs.writeFileSync(path.join(distDir, "404.html"), index);
fs.writeFileSync(path.join(distDir, ".nojekyll"), "");
// Keep the demo out of search results so it never competes with the live site.
fs.writeFileSync(path.join(distDir, "robots.txt"), "User-agent: *\nDisallow: /\n");

log(`wrote ${routes.length} route pages + 404.html under ${base}`);
