// Press data access for the public site.
// Reads from THIS site's OWN backend (server.js on :3001, proxied at /api),
// which queries MySQL directly. It does NOT depend on the CMS admin API — the
// CMS only writes to the database; the site reads from it. So the CMS API can
// be offline and the site still serves whatever is in the database.
//
// The endpoint shapes rows to match the old src/data/pressReleases.js keys
// (slug, group, category, title, excerpt, author, readTime, date, isoDate,
// image, imageAlt, slide*, featured, and body as sanitized HTML on the detail
// endpoint), so the existing press components consume it unchanged.

const CMS_BASE = import.meta.env.VITE_PRESS_API_BASE || "/api";

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
  const res = await getJson(`${CMS_BASE}/press-releases`);
  if (!res.ok) throw new Error(`Press list request failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

// GET /api/cms/press-releases/:slug
// Returns { notFound: true } for a 404, else { article, related }.
export async function fetchPressArticle(slug) {
  const res = await getJson(`${CMS_BASE}/press-releases/${encodeURIComponent(slug)}`);
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`Article request failed (${res.status})`);
  const data = await res.json();
  return { article: data.article, related: data.related || [] };
}
