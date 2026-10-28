// Press data access for the public site.
// Reads from this repo's Express API (server.js) via same-origin /api/cms/…
// which Vite rewrites to /api/… in local dev. Production Nginx can keep the
// /api/cms prefix or map it the same way.
//
// Response shapes match what the press UI already consumes
// (slug, group, category, title, excerpt, author, readTime, date, isoDate,
// image, imageAlt, slide*, featured, and body as sanitized HTML on detail).

const CMS_BASE = import.meta.env.VITE_CMS_API_BASE || "/api/cms";
// Static demo builds (GitHub Pages) read a JSON snapshot instead of the API.
const EXT = import.meta.env.VITE_CMS_STATIC ? ".json" : "";

// Fail fast-ish so a hung API doesn't freeze the page; callers fall back.
async function getJson(url, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

// GET /api/cms/press-releases  -> array of articles (published only)
export async function fetchPressList() {
  const res = await getJson(`${CMS_BASE}/press-releases${EXT}`);
  if (!res.ok) throw new Error(`Press list request failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

// GET /api/cms/press-releases/:slug
// Returns { notFound: true } for a 404, else { article, related }.
export async function fetchPressArticle(slug) {
  const res = await getJson(
    `${CMS_BASE}/press-releases/${encodeURIComponent(slug)}${EXT}`,
  );
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`Article request failed (${res.status})`);
  const data = await res.json();
  return { article: data.article, related: data.related || [] };
}

// ---------------------------------------------------------------------------
// Build-time prerender seeds this cache (scripts/prerender.mjs → entry-server)
// so press pages render their real content synchronously on the server. In
// the browser it stays empty and the pages fetch as normal.
// ---------------------------------------------------------------------------
const prefetched = { list: null, articles: new Map() };

export function primePressCache({ list = null, articles = [] } = {}) {
  prefetched.list = list;
  prefetched.articles = new Map(articles.map((a) => [a.article.slug, a]));
}

/** Prefetched list, or null when nothing was primed. */
export const getCachedPressList = () => prefetched.list;

/** Prefetched { article, related }, or null. */
export const getCachedPressArticle = (slug) => prefetched.articles.get(slug) || null;
