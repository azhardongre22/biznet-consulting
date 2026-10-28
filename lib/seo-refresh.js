/**
 * Keeps the prerendered pages and sitemap in step with the CMS.
 *
 *   POST /api/seo/refresh   (header x-seo-refresh-token: $SEO_REFRESH_TOKEN)
 *     Call from the CMS on publish / unpublish / slug or meta change. Replies
 *     202 at once, then re-runs scripts/prerender.mjs in the background.
 *     Single-flight: bursts of publishes coalesce into one trailing run.
 *
 *   Watchdog (safety net if a webhook is missed), every SEO_WATCHDOG_INTERVAL_MS
 *   (default 5 min): fingerprints the CMS article list and checks every
 *   published article has dist/news-and-insights/<slug>/index.html. Refreshes
 *   when something is missing or the fingerprint changed, and in full every
 *   SEO_FULL_REFRESH_MS (default 24 h). Skips the tick if the CMS is down
 *   (never regenerates from fallback data). SEO_WATCHDOG=off disables it.
 *
 *   GET /sitemap.xml  serves dist/sitemap.xml (nginx normally serves it first).
 */
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_ORIGIN } from "../src/data/seoData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const CMS_BASE = (process.env.CMS_API_BASE || `${SITE_ORIGIN}/api/cms`).replace(/\/$/, "");
const log = (...a) => console.log("[seo]", ...a);

let running = false;
let queued = false;

function runPrerender(reason) {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  log(`refresh started (${reason})`);
  const child = spawn(process.execPath, [path.join(root, "scripts", "prerender.mjs")], {
    cwd: root,
    env: { ...process.env, CMS_API_BASE: CMS_BASE },
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    running = false;
    log(`refresh finished (exit ${code})`);
    if (queued) {
      queued = false;
      runPrerender("queued");
    }
  });
}

async function cmsList() {
  const res = await fetch(`${CMS_BASE}/press-releases`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

function startWatchdog() {
  if (process.env.SEO_WATCHDOG === "off") return;
  const interval = Number(process.env.SEO_WATCHDOG_INTERVAL_MS || 5 * 60 * 1000);
  const fullEvery = Number(process.env.SEO_FULL_REFRESH_MS || 24 * 60 * 60 * 1000);
  let lastFingerprint = null;
  let lastFull = Date.now();
  let lastMissingKey = null;

  const tick = async () => {
    let items;
    try {
      items = await cmsList();
    } catch (err) {
      log(`watchdog: CMS unreachable (${err.message}); skipping`);
      return;
    }
    const fingerprint = crypto.createHash("sha1").update(JSON.stringify(items)).digest("hex");
    const missing = items
      .map((a) => a.slug)
      .filter((slug) => slug && !fs.existsSync(path.join(distDir, "news-and-insights", slug, "index.html")));
    const missingKey = missing.sort().join(",");

    if (Date.now() - lastFull >= fullEvery) {
      lastFull = Date.now();
      runPrerender("daily full refresh");
    } else if (missing.length && missingKey !== lastMissingKey) {
      runPrerender(`missing ${missing.length} article page(s)`);
    } else if (lastFingerprint && fingerprint !== lastFingerprint) {
      runPrerender("CMS content changed");
    } else {
      log(`watchdog ok (${items.length} articles)`);
    }
    lastMissingKey = missingKey;
    lastFingerprint = fingerprint;
  };

  setTimeout(tick, 60 * 1000).unref();
  setInterval(tick, interval).unref();
}

export function registerSeoRoutes(app) {
  app.post("/api/seo/refresh", (req, res) => {
    const expected = process.env.SEO_REFRESH_TOKEN;
    if (!expected) return res.status(503).json({ ok: false, error: "SEO refresh is not configured." });
    const given = String(req.get("x-seo-refresh-token") || "");
    const ok =
      given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
    if (!ok) return res.status(401).json({ ok: false, error: "Invalid token." });
    res.status(202).json({ ok: true, queued: running });
    runPrerender("webhook");
  });

  app.get("/sitemap.xml", (_req, res) => {
    const file = path.join(distDir, "sitemap.xml");
    if (!fs.existsSync(file)) return res.status(503).type("text/plain").send("Sitemap not built yet.");
    res.type("application/xml").set("Cache-Control", "public, max-age=300").sendFile(file);
  });

  startWatchdog();
}
