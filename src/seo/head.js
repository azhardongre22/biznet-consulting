/**
 * Turns a page's SEO description into concrete <head> tags.
 *
 * `resolveSeo` fills defaults (canonical, share image, breadcrumbs, JSON-LD);
 * `headTags` lists every managed tag. The client hook upserts them into the
 * live document and the prerender serialises the same list into static HTML,
 * so View Source and the hydrated page always agree.
 */
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  breadcrumbsFor,
  canonicalUrl,
  getPageSeo,
  normalizePath,
} from "../data/seoData.js";
import { breadcrumbSchema, webPageSchema } from "./schema.js";

const IMAGE_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

export function imageMimeType(url) {
  const ext = String(url || "").split(/[?#]/)[0].split(".").pop().toLowerCase();
  return IMAGE_TYPES[ext] || "";
}

/**
 * @param {object} input  { path, title?, description?, image?: {url,width,height,alt}|string,
 *   imageAlt?, type?: "website"|"article", breadcrumbs?, jsonLd?: object|object[],
 *   noindex?, publishedTime?, modifiedTime?, section? }
 * Missing title/description/image fall back to PAGE_SEO for the path, then defaults.
 */
export function resolveSeo(input = {}) {
  const path = normalizePath(input.path || "/");
  const page = getPageSeo(path) || {};
  const title = input.title || page.title || DEFAULT_SEO.title;
  const description = input.description || page.description || DEFAULT_SEO.description;

  let image = input.image ?? page.image ?? DEFAULT_OG_IMAGE;
  if (typeof image === "string") image = { url: image };
  image = {
    ...image,
    url: absoluteUrl(image.url) || absoluteUrl(DEFAULT_OG_IMAGE.url),
    alt: input.imageAlt || image.alt || title,
  };

  const noindex = Boolean(input.noindex ?? page.noindex);
  const breadcrumbs = input.breadcrumbs ?? breadcrumbsFor(path);
  const type = input.type || "website";

  const extra = [].concat(input.jsonLd || []).filter(Boolean);
  const jsonLd = [
    type === "article" ? null : webPageSchema({ type: input.pageType, path, title, description, image }),
    breadcrumbSchema(breadcrumbs),
    ...extra,
  ].filter(Boolean);

  return {
    path,
    url: canonicalUrl(path),
    title,
    description,
    image,
    type,
    noindex,
    breadcrumbs,
    jsonLd,
    publishedTime: input.publishedTime || "",
    modifiedTime: input.modifiedTime || input.publishedTime || "",
    section: input.section || "",
  };
}

/** Every managed head tag for a resolved SEO object. Order = output order. */
export function headTags(seo) {
  const meta = (key, name, content) => (content ? { tag: "meta", key, attrs: { [key]: name, content: String(content) } } : null);
  const name = (n, c) => meta("name", n, c);
  const prop = (p, c) => meta("property", p, c);
  const mime = imageMimeType(seo.image.url);

  return [
    name("description", seo.description),
    name("robots", seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"),
    { tag: "link", key: "rel", attrs: { rel: "canonical", href: seo.url } },
    prop("og:type", seo.type),
    prop("og:site_name", SITE_NAME),
    prop("og:locale", SITE_LOCALE),
    prop("og:url", seo.url),
    prop("og:title", seo.title),
    prop("og:description", seo.description),
    prop("og:image", seo.image.url),
    prop("og:image:secure_url", seo.image.url),
    prop("og:image:type", mime),
    prop("og:image:width", seo.image.width),
    prop("og:image:height", seo.image.height),
    prop("og:image:alt", seo.image.alt),
    seo.type === "article" ? prop("article:published_time", seo.publishedTime) : null,
    seo.type === "article" ? prop("article:modified_time", seo.modifiedTime) : null,
    seo.type === "article" ? prop("article:section", seo.section) : null,
    seo.type === "article" ? prop("article:publisher", "https://www.linkedin.com/company/biznet-consulting/") : null,
    name("twitter:card", "summary_large_image"),
    name("twitter:site", TWITTER_HANDLE),
    name("twitter:title", seo.title),
    name("twitter:description", seo.description),
    name("twitter:image", seo.image.url),
    name("twitter:image:alt", seo.image.alt),
  ].filter(Boolean);
}

/** Managed meta names/properties — anything here not in the current list is removed. */
export const MANAGED_META = [
  "description", "robots",
  "og:type", "og:site_name", "og:locale", "og:url", "og:title", "og:description",
  "og:image", "og:image:secure_url", "og:image:type", "og:image:width", "og:image:height", "og:image:alt",
  "article:published_time", "article:modified_time", "article:section", "article:publisher",
  "twitter:card", "twitter:site", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt",
];

/** JSON for a <script type="application/ld+json">, safe to inline in HTML. */
export function jsonLdText(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
