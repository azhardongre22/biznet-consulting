import { createContext, useContext, useEffect } from "react";

import { MANAGED_META, headTags, jsonLdText, resolveSeo } from "../seo/head.js";
import { trackPageView } from "../lib/tracking";

/**
 * During the build-time prerender a collector is provided here; the page's
 * SEO is recorded synchronously while rendering (effects never run on the
 * server) and written into the static <head>.
 */
export const SeoCollectorContext = createContext(null);

const PAGE_SCHEMA_ATTR = "data-page-schema";
let lastTrackedPath = null;

function upsert(tag) {
  const { key, attrs } = tag;
  const selector =
    tag.tag === "link" ? `link[rel="${attrs.rel}"]` : `meta[${key}="${attrs[key]}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag.tag);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

function apply(seo) {
  document.title = seo.title;

  const tags = headTags(seo);
  const present = new Set(tags.map((t) => t.attrs.name || t.attrs.property));
  for (const n of MANAGED_META) {
    if (present.has(n)) continue;
    document.head.querySelectorAll(`meta[name="${n}"], meta[property="${n}"]`).forEach((el) => el.remove());
  }
  tags.forEach(upsert);

  document.head.querySelectorAll(`script[${PAGE_SCHEMA_ATTR}]`).forEach((el) => el.remove());
  for (const data of seo.jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute(PAGE_SCHEMA_ATTR, "");
    s.textContent = jsonLdText(data);
    document.head.appendChild(s);
  }
}

/**
 * Declare a page's SEO. Every page calls this once.
 *
 * usePageSeo({ path, title, description, image, imageAlt, type, breadcrumbs,
 *              jsonLd, noindex, publishedTime, modifiedTime, section })
 *
 * Anything omitted falls back to PAGE_SEO[path] and the site defaults.
 * Pass `ready: false` while data is loading so the prerender/analytics only
 * see final values.
 */
export default function usePageSeo(input) {
  const collector = useContext(SeoCollectorContext);
  const ready = input?.ready !== false;
  const seo = resolveSeo(input);

  if (collector && ready) collector.seo = seo;

  const signature = JSON.stringify(seo);
  useEffect(() => {
    if (!ready) return;
    apply(seo);
    // The initial load is counted by GTM itself; only report SPA navigations.
    if (lastTrackedPath !== null && lastTrackedPath !== seo.path) {
      trackPageView({ title: seo.title, path: seo.path });
    }
    lastTrackedPath = seo.path;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, ready]);
}
