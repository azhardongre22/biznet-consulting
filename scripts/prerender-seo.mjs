/**
 * Post-Vite SEO prerender: writes per-route HTML under dist/ with correct
 * meta/Open Graph tags and full crawlable page content inside #root
 * (WordPress-like View Source — headings, body copy, absolute image URLs,
 * alt text, nav, breadcrumbs, footer).
 *
 * Covers: home, about, services listing + every /services/:slug detail page,
 * contact, the news listing, every /news-and-insights/:slug article, FAQs,
 * privacy, terms, and the coming-soon style pages.
 *
 * Run via `npm run build`, or on its own: node scripts/prerender-seo.mjs
 *
 * Articles: CMS_API_BASE / VITE_CMS_API_BASE (default
 * https://biznetconsulting.ae/api/cms), falling back to the bundled
 * src/data/pressReleases.js when the API is unreachable at build time.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_OG_IMAGE,
  PAGE_SEO,
  PATHS,
  SITE_ORIGIN,
  articlePath,
  canonicalUrl,
  servicePath,
} from "../src/data/seoData.js";
import { translations } from "../src/i18n/translations.js";
import { PRESS_RELEASES } from "../src/data/pressReleases.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const dataDir = path.join(root, "src/data");
const pagesDir = path.join(root, "src/pages");

const EN = translations.en;

const CMS_BASE = (
  process.env.CMS_API_BASE ||
  process.env.VITE_CMS_API_BASE ||
  `${SITE_ORIGIN}/api/cms`
).replace(/\/$/, "");

/** Dist stem for each service's hero image (mirrors servicesData imports). */
const SERVICE_IMAGE_STEM = {
  "business-company-formation": "Business formation",
  "feasibility-viability": "Land feasibility",
  "project-development": "project development",
  "project-management": "project management",
  "branding-marketing": "branding and marketing",
};

/* ----------------------------------------------------------------------- */
/* String / HTML helpers                                                    */
/* ----------------------------------------------------------------------- */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function absoluteUrl(src) {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${SITE_ORIGIN}${trimmed}`;
  return `${SITE_ORIGIN}/${trimmed}`;
}

function sanitizeHtml(html) {
  let out = String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");

  out = out.replace(
    /\b(src|href)=(["'])([^"']+)\2/gi,
    (match, attr, quote, url) => {
      if (
        !url ||
        url.startsWith("#") ||
        url.startsWith("mailto:") ||
        url.startsWith("tel:") ||
        url.startsWith("data:")
      ) {
        return match;
      }
      return `${attr}=${quote}${absoluteUrl(url)}${quote}`;
    },
  );

  return out;
}

function imgTag(src, alt, extraAttrs = "") {
  const url = absoluteUrl(src);
  if (!url) return "";
  return `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt || "")}"${extraAttrs ? ` ${extraAttrs}` : ""} />`;
}

function listHtml(items, ordered = false) {
  if (!Array.isArray(items) || items.length === 0) return "";
  const tag = ordered ? "ol" : "ul";
  const lis = items
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  return `<${tag}>${lis}</${tag}>`;
}

function paragraphsHtml(body) {
  if (Array.isArray(body)) {
    return body.filter(Boolean).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  }
  if (typeof body === "string" && body.trim()) {
    return `<p>${escapeHtml(body)}</p>`;
  }
  return "";
}

/**
 * Extract a top-level `const NAME = …` / `export const NAME = …` array literal
 * from a source file and evaluate it. `stripPatterns` removes non-serialisable
 * bindings (e.g. imported image identifiers) before evaluation.
 */
function extractArrayLiteral(filePath, constName, stripPatterns = []) {
  let src = fs.readFileSync(filePath, "utf8");
  for (const pattern of stripPatterns) src = src.replace(pattern, "");

  const marker = new RegExp(`(?:export\\s+)?const\\s+${constName}\\s*=`);
  const match = marker.exec(src);
  if (!match) throw new Error(`${constName} not found in ${filePath}`);
  let j = match.index + match[0].length;
  while (j < src.length && /\s/.test(src[j])) j += 1;
  if (src[j] !== "[") throw new Error(`${constName} is not an array literal`);

  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let k = j; k < src.length; k += 1) {
    const ch = src[k];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = ch;
      continue;
    }
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        const literal = src.slice(j, k + 1);
        return new Function(`"use strict"; return (${literal});`)();
      }
    }
  }
  throw new Error(`Unbalanced literal for ${constName}`);
}

function findDistAssetByStem(stem) {
  if (!stem) return "";
  const assetsDir = path.join(distDir, "assets");
  if (!fs.existsSync(assetsDir)) return "";
  const files = fs.readdirSync(assetsDir);
  const normalized = stem.toLowerCase().replace(/\s+/g, "-");
  const match =
    files.find((name) => name.startsWith(`${stem}-`)) ||
    files.find((name) =>
      name.toLowerCase().replace(/\s+/g, "-").startsWith(`${normalized}-`),
    ) ||
    files.find((name) => {
      const n = name.toLowerCase().replace(/\s+/g, "-");
      return n.includes(normalized) && /\.(webp|png|jpe?g|svg)$/i.test(name);
    });
  return match ? `${SITE_ORIGIN}/assets/${encodeURIComponent(match)}` : "";
}

/* ----------------------------------------------------------------------- */
/* Data loaders                                                             */
/* ----------------------------------------------------------------------- */

function loadServicesData() {
  return extractArrayLiteral(
    path.join(dataDir, "servicesData.js"),
    "servicesData",
    [
      /^import\s.+;?\s*$/gm,
      // image: <ImportedIdentifier>,  →  drop the binding
      /image:\s*[A-Za-z_$][\w$]*,?/g,
    ],
  );
}

function serviceImageUrl(slug) {
  return findDistAssetByStem(SERVICE_IMAGE_STEM[slug] || "");
}

/* ----------------------------------------------------------------------- */
/* Shared chrome                                                            */
/* ----------------------------------------------------------------------- */

const LOGO_URL = () =>
  findDistAssetByStem("only biznet consulting blue") ||
  findDistAssetByStem("biznet logo nav bar") ||
  `${SITE_ORIGIN}/favicon.png`;

function siteHeaderHtml() {
  return `<header>
  <a href="${SITE_ORIGIN}/">
    ${imgTag(LOGO_URL(), "Biznet Consulting", 'width="140" height="40"')}
    <span>Biznet Consulting</span>
  </a>
  <nav aria-label="Primary">
    <a href="${SITE_ORIGIN}${PATHS.home}">Home</a>
    <a href="${SITE_ORIGIN}${PATHS.about}">About Us</a>
    <a href="${SITE_ORIGIN}${PATHS.services}">Services</a>
    <a href="${SITE_ORIGIN}${PATHS.upcomingProjects}">Projects</a>
    <a href="${SITE_ORIGIN}${PATHS.news}">News &amp; Insights</a>
    <a href="${SITE_ORIGIN}${PATHS.contact}">Contact</a>
  </nav>
</header>`;
}

function siteFooterHtml() {
  const f = EN.footer;
  return `<footer>
  <p>${escapeHtml(f.partnership)}</p>
  <p>Biznet Consulting — ${escapeHtml(f.address)}, Dubai, UAE</p>
  <p><a href="mailto:info@biznetconsulting.ae">info@biznetconsulting.ae</a> · <a href="tel:+97143433334">+971 4 343 33 34</a></p>
  <nav aria-label="Footer">
    <a href="${SITE_ORIGIN}${PATHS.services}">Services</a>
    <a href="${SITE_ORIGIN}${PATHS.news}">News &amp; Insights</a>
    <a href="${SITE_ORIGIN}${PATHS.faqs}">FAQs</a>
    <a href="${SITE_ORIGIN}${PATHS.privacy}">${escapeHtml(f.privacyPolicy)}</a>
    <a href="${SITE_ORIGIN}${PATHS.terms}">${escapeHtml(f.termsConditions)}</a>
  </nav>
</footer>`;
}

function breadcrumbHtml(items) {
  const crumbs = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      if (isLast) return `<li>${escapeHtml(item.name)}</li>`;
      return `<li><a href="${escapeAttr(absoluteUrl(item.path))}">${escapeHtml(item.name)}</a></li>`;
    })
    .join("\n    ");
  return `<nav aria-label="Breadcrumb"><ol>\n    ${crumbs}\n  </ol></nav>`;
}

function wrapPage(inner, crumbs) {
  return [
    siteHeaderHtml(),
    crumbs?.length ? breadcrumbHtml(crumbs) : "",
    `<main>`,
    inner,
    `</main>`,
    siteFooterHtml(),
  ]
    .filter(Boolean)
    .join("\n");
}

/* ----------------------------------------------------------------------- */
/* Page builders                                                            */
/* ----------------------------------------------------------------------- */

function homePageHtml(services) {
  const who = EN.whoWeAre.slides?.[0];
  const heroImg = findDistAssetByStem("who-we-are1");
  const aboutImg = findDistAssetByStem("about-core-philosophy");

  const serviceCards = EN.serviceGrid.cards
    .map(
      (c) => `<article>
  <h3>${escapeHtml(c.label)}</h3>
  <p>${escapeHtml(c.intro)}</p>
</article>`,
    )
    .join("\n");

  const exploreCards = EN.exploreGrid.cards
    .map(
      (c) => `<li>
  <h3>${escapeHtml(c.label)}</h3>
  <p>${escapeHtml(c.desc)}</p>
</li>`,
    )
    .join("\n");

  const serviceLinks = services
    .map(
      (s) =>
        `<li><a href="${SITE_ORIGIN}${servicePath(s.slug)}">${escapeHtml(s.title)}</a> — ${escapeHtml(s.tagline || "")}</li>`,
    )
    .join("\n");

  const inner = [
    `<h1>Biznet Consulting — Integrated Real Estate Development &amp; Project Advisory</h1>`,
    heroImg ? imgTag(heroImg, "Biznet Consulting — who we are") : "",
    who ? `<p>${escapeHtml(who.description)}</p>` : "",
    `<section>
  <h2>${escapeHtml(EN.serviceGrid.eyebrow || "Services")}</h2>
  ${serviceCards}
  <ul>
${serviceLinks}
  </ul>
  <p><a href="${SITE_ORIGIN}${PATHS.services}">Explore all services</a></p>
</section>`,
    `<section>
  <h2>${escapeHtml(EN.ceoMessage.eyebrow || "From the Visionary")}</h2>
  ${aboutImg ? imgTag(aboutImg, "Biznet Consulting core philosophy") : ""}
  <blockquote>${escapeHtml(EN.ceoMessage.quote)}</blockquote>
  <p>${escapeHtml(EN.ceoMessage.ceoName)} — ${escapeHtml(EN.ceoMessage.ceoTitle)}</p>
</section>`,
    `<section>
  <h2>${escapeHtml(EN.exploreGrid.lead || "A walk through Biznet")}</h2>
  <ul>
${exploreCards}
  </ul>
</section>`,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner);
}

function aboutPageHtml() {
  const a = EN.aboutPage;
  const heroImg = findDistAssetByStem("what-we-do-2");
  const solveImg = findDistAssetByStem("about-slider-1-1");
  const ceoImg = findDistAssetByStem("ceo4");

  const slides = a.slides
    .map(
      (s) => `<section>
  <h2>${escapeHtml([s.titleTop, s.titleBottom].filter(Boolean).join(" "))} ${escapeHtml(s.titleEm || "")}</h2>
  <p>${escapeHtml(s.subtitle)}</p>
</section>`,
    )
    .join("\n");

  const values = a.values.items
    .map(
      (v) => `<article>
  <h3>${escapeHtml(v.title)}</h3>
  <p>${escapeHtml(v.copy)}</p>
</article>`,
    )
    .join("\n");

  const steps = a.approach.steps
    .map(
      (st) => `<li>
  <h3>${escapeHtml(st.n)} — ${escapeHtml(st.label)}</h3>
  <p>${escapeHtml(st.copy)}</p>
</li>`,
    )
    .join("\n");

  const inner = [
    `<h1>About Biznet Consulting</h1>`,
    heroImg ? imgTag(heroImg, "About Biznet Consulting") : "",
    slides,
    `<section>
  <h2>${escapeHtml(a.philosophy.titleLead)} ${escapeHtml(a.philosophy.titleEm)} ${escapeHtml(a.philosophy.titleSub)}</h2>
  ${solveImg ? imgTag(solveImg, "Biznet Consulting core philosophy") : ""}
  <p>${escapeHtml(a.philosophy.body)}</p>
  <blockquote>${escapeHtml(a.philosophy.quote)} — ${escapeHtml(a.philosophy.quoteAttr)}</blockquote>
</section>`,
    `<section>
  <h2>${escapeHtml(a.values.titleLead)} ${escapeHtml(a.values.titleEm)} ${escapeHtml(a.values.titleSuffix)}</h2>
  <p>${escapeHtml(a.values.body)}</p>
  ${values}
</section>`,
    `<section>
  <h2>${escapeHtml(a.approach.title)} ${escapeHtml(a.approach.em)}</h2>
  ${ceoImg ? imgTag(ceoImg, "Ismail Al Hammadi, Chief Executive Officer of Biznet Consulting") : ""}
  <blockquote>${escapeHtml(a.approach.quote)}</blockquote>
  <p>${escapeHtml(a.approach.quoteCopy)}</p>
  <ul>
${steps}
  </ul>
  <p><a href="${SITE_ORIGIN}${PATHS.contact}">${escapeHtml(a.approach.cta)}</a></p>
</section>`,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "About Us", path: PATHS.about },
  ]);
}

function servicesListPageHtml(services) {
  const cards = services
    .map((s) => {
      const img = serviceImageUrl(s.slug);
      return `<li>
  <a href="${SITE_ORIGIN}${servicePath(s.slug)}">
    ${img ? imgTag(img, `${s.title} — Biznet Consulting`) : ""}
    <h2>${escapeHtml(s.num)} — ${escapeHtml(s.title)}</h2>
    <p>${escapeHtml(s.tagline || "")}</p>
    <p>${escapeHtml(s.intro || s.overview || "")}</p>
  </a>
</li>`;
    })
    .join("\n");

  const inner = [
    `<h1>Our Services</h1>`,
    `<p>${escapeHtml(PAGE_SEO[PATHS.services].description)}</p>`,
    `<section>
  <h2>Integrated consultancy services</h2>
  <ul>
${cards}
  </ul>
</section>`,
    `<p><a href="${SITE_ORIGIN}${PATHS.contact}">Start the conversation</a></p>`,
  ].join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "Services", path: PATHS.services },
  ]);
}

function serviceDetailPageHtml(service) {
  const img = serviceImageUrl(service.slug);
  const offerings = (service.offerings || [])
    .map(
      (o) => `<li>
  <h3>${escapeHtml(o.title)}</h3>
  <p>${escapeHtml(o.text)}</p>
</li>`,
    )
    .join("\n");
  const process = (service.process || [])
    .map(
      (p) => `<li>
  <h3>${escapeHtml(p.title)}</h3>
  <p>${escapeHtml(p.text)}</p>
</li>`,
    )
    .join("\n");

  const inner = [
    `<article>`,
    `<h1>${escapeHtml(service.title)}</h1>`,
    service.tagline ? `<p>${escapeHtml(service.tagline)}</p>` : "",
    img ? `<figure>${imgTag(img, `${service.title} — Biznet Consulting`)}</figure>` : "",
    service.intro ? `<p>${escapeHtml(service.intro)}</p>` : "",
    service.overview ? `<p>${escapeHtml(service.overview)}</p>` : "",
    service.stage ? `<p><strong>${escapeHtml(service.stage)}</strong></p>` : "",
    service.problem ? `<h2>The challenge</h2>\n<p>${escapeHtml(service.problem)}</p>` : "",
    service.solution ? `<h2>How Biznet helps</h2>\n<p>${escapeHtml(service.solution)}</p>` : "",
    offerings ? `<h2>What we deliver</h2>\n<ul>\n${offerings}\n</ul>` : "",
    service.sectors?.length
      ? `<h2>${escapeHtml(service.sectorsLabel || "Sectors")}</h2>\n${listHtml(service.sectors)}`
      : "",
    process ? `<h2>Our process</h2>\n<ol>\n${process}\n</ol>` : "",
    service.outcome ? `<h2>The outcome</h2>\n<p>${escapeHtml(service.outcome)}</p>` : "",
    `<p><a href="${SITE_ORIGIN}${PATHS.contact}">Enquire about this service</a> · <a href="${SITE_ORIGIN}${PATHS.services}">All services</a></p>`,
    `</article>`,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "Services", path: PATHS.services },
    { name: service.title, path: servicePath(service.slug) },
  ]);
}

function contactPageHtml() {
  const c = EN.contactPage;
  const inner = [
    `<h1>${escapeHtml(c.title)}</h1>`,
    `<p>${escapeHtml(c.lead)}</p>`,
    `<section>
  <h2>${escapeHtml(c.contactLabel)}</h2>
  <p>${escapeHtml(c.addressLabel)}: ${escapeHtml(c.address)}</p>
  <p>${escapeHtml(c.emailLabel)}: <a href="mailto:info@biznetconsulting.ae">info@biznetconsulting.ae</a></p>
  <p>Phone: <a href="tel:+97143433334">+971 4 343 33 34</a></p>
</section>`,
  ].join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "Contact", path: PATHS.contact },
  ]);
}

/* ----- Press / news ----------------------------------------------------- */

function pressBodyToHtml(body) {
  if (typeof body === "string") return sanitizeHtml(body);
  if (!Array.isArray(body)) return "";
  return body
    .map((block) => {
      if (typeof block === "string") return `<p>${escapeHtml(block)}</p>`;
      if (!block || typeof block !== "object") return "";
      if (block.h) return `<h2>${escapeHtml(block.h)}</h2>`;
      if (block.quote) {
        return `<blockquote>${escapeHtml(block.quote)}${
          block.by ? `<cite>${escapeHtml(block.by)}</cite>` : ""
        }</blockquote>`;
      }
      if (Array.isArray(block.list)) return listHtml(block.list);
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function pressCardHtml(article) {
  const href = absoluteUrl(articlePath(article.slug));
  return `<li>
  <a href="${escapeAttr(href)}">
    ${article.image ? imgTag(article.image, article.imageAlt || article.title) : ""}
    <span>${escapeHtml(article.category || "News")}</span>
    <h2>${escapeHtml(article.title)}</h2>
    ${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}
    ${article.date ? `<p>${escapeHtml(article.date)}</p>` : ""}
  </a>
</li>`;
}

function newsListingPageHtml(articles) {
  const cards = articles.slice(0, 60).map(pressCardHtml).join("\n");
  const inner = [
    `<h1>News &amp; Insights</h1>`,
    `<p>${escapeHtml(PAGE_SEO[PATHS.news].description)}</p>`,
    `<section>
  <h2>Latest stories</h2>
  <ul>
${cards}
  </ul>
</section>`,
  ].join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "News & Insights", path: PATHS.news },
  ]);
}

function articlePageHtml(article, related) {
  const heroAlt = article.imageAlt || article.title;
  const metaBits = [article.author, article.date, article.readTime].filter(
    Boolean,
  );

  const relatedHtml =
    Array.isArray(related) && related.length
      ? `<section>
  <h2>Related stories</h2>
  <ul>
${related.map(pressCardHtml).join("\n")}
  </ul>
</section>`
      : "";

  const inner = [
    article.category
      ? `<p><strong>${escapeHtml(article.category)}</strong></p>`
      : "",
    `<h1>${escapeHtml(article.title)}</h1>`,
    metaBits.length
      ? `<p>${metaBits.map((b) => escapeHtml(b)).join(" · ")}</p>`
      : "",
    article.image ? `<figure>${imgTag(article.image, heroAlt)}</figure>` : "",
    article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : "",
    pressBodyToHtml(article.body),
    `<p><a href="${SITE_ORIGIN}${PATHS.news}">← All stories</a> · <a href="${SITE_ORIGIN}${PATHS.contact}">Connect with Biznet</a></p>`,
    relatedHtml,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "News & Insights", path: PATHS.news },
    { name: article.title, path: articlePath(article.slug) },
  ]);
}

/* ----- FAQ -------------------------------------------------------------- */

function faqsPageHtml() {
  const faqs = extractArrayLiteral(path.join(pagesDir, "FAQ.jsx"), "faqs");
  const items = faqs
    .map(
      (f) => `<details>
  <summary><h3>${escapeHtml(f.q)}</h3></summary>
  <p>${escapeHtml(f.a)}</p>
</details>`,
    )
    .join("\n");

  const inner = [
    `<h1>Frequently Asked Questions</h1>`,
    `<p>Answers to the questions clients most often ask about our approach, services, and how we work alongside developers and investors across the UAE.</p>`,
    items,
    `<p><a href="${SITE_ORIGIN}${PATHS.contact}">Contact us</a></p>`,
  ].join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "FAQs", path: PATHS.faqs },
  ]);
}

/* ----- Legal ------------------------------------------------------------ */

/** Legal section bodies mix paragraph strings and nested string arrays (lists). */
function legalBodyHtml(body) {
  if (typeof body === "string") return `<p>${escapeHtml(body)}</p>`;
  if (!Array.isArray(body)) return "";
  return body
    .map((item) =>
      Array.isArray(item) ? listHtml(item) : `<p>${escapeHtml(item)}</p>`,
    )
    .filter(Boolean)
    .join("\n");
}

function legalPageHtml(data, crumbName, crumbPath) {
  const sections = (data.sections || [])
    .map(
      (s) => `<section>
  <h2>${escapeHtml(s.n ? `${s.n}. ` : "")}${escapeHtml(s.title)}</h2>
  ${legalBodyHtml(s.body)}
</section>`,
    )
    .join("\n");

  const inner = [
    `<h1>${escapeHtml(data.titleLead)} ${escapeHtml(data.titleEm)}</h1>`,
    data.intro ? `<p>${escapeHtml(data.intro)}</p>` : "",
    data.lastUpdated || data.effective
      ? `<p>${escapeHtml(data.lastUpdated || data.effective)}</p>`
      : "",
    sections,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: crumbName, path: crumbPath },
  ]);
}

/* ----- Coming-soon style placeholder pages ------------------------------ */

function placeholderPageHtml(data, crumbName, crumbPath) {
  const heading = [data.headlinePrefix, data.headlineEm].filter(Boolean).join(" ");
  const inner = [
    data.eyebrow ? `<p><strong>${escapeHtml(data.eyebrow)}</strong></p>` : "",
    `<h1>${escapeHtml(heading || crumbName)}</h1>`,
    data.cardDescription
      ? `<p>${escapeHtml(String(data.cardDescription).replace(/\n/g, " "))}</p>`
      : "",
    `<p><a href="${SITE_ORIGIN}${PATHS.contact}">Contact Biznet Consulting</a></p>`,
  ]
    .filter(Boolean)
    .join("\n");

  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: crumbName, path: crumbPath },
  ]);
}

function upcomingProjectsPageHtml() {
  const u = EN.upcomingProjects;
  const inner = [
    `<h1>${escapeHtml(u.titleLead)} ${escapeHtml(u.titleEm)}</h1>`,
    `<p>${escapeHtml(u.p1)}</p>`,
    `<p>${escapeHtml(u.p2)}</p>`,
    `<p>${escapeHtml(u.closing)}</p>`,
    `<p><a href="${SITE_ORIGIN}${PATHS.contact}">Contact Biznet Consulting</a></p>`,
  ].join("\n");
  return wrapPage(inner, [
    { name: "Home", path: "/" },
    { name: "Upcoming Projects", path: PATHS.upcomingProjects },
  ]);
}

/* ----------------------------------------------------------------------- */
/* Meta injection                                                           */
/* ----------------------------------------------------------------------- */

function upsertMeta(html, selectorRe, tag) {
  if (selectorRe.test(html)) return html.replace(selectorRe, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceMeta(html, { title, description, url, imageUrl, imageAlt, type }) {
  let out = html;

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  out = upsertMeta(
    out,
    /<meta[^>]*name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  );
  out = upsertMeta(
    out,
    /<link[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  const og = [
    [/property=["']og:type["']/i, "og:type", type || "website"],
    [/property=["']og:url["']/i, "og:url", url],
    [/property=["']og:title["']/i, "og:title", title],
    [/property=["']og:description["']/i, "og:description", description],
  ];
  for (const [re, prop, value] of og) {
    out = upsertMeta(
      out,
      new RegExp(`<meta[^>]*${re.source}[^>]*>`, "i"),
      `<meta property="${prop}" content="${escapeAttr(value)}" />`,
    );
  }

  if (imageUrl) {
    out = upsertMeta(
      out,
      /<meta[^>]*property=["']og:image["'](?![:])[^>]*>/i,
      `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
    );
    out = upsertMeta(
      out,
      /<meta[^>]*property=["']og:image:secure_url["'][^>]*>/i,
      `<meta property="og:image:secure_url" content="${escapeAttr(imageUrl)}" />`,
    );
    out = upsertMeta(
      out,
      /<meta[^>]*property=["']og:image:alt["'][^>]*>/i,
      `<meta property="og:image:alt" content="${escapeAttr(imageAlt || title)}" />`,
    );
  }

  const tw = [
    [/name=["']twitter:title["']/i, "twitter:title", title],
    [/name=["']twitter:description["']/i, "twitter:description", description],
  ];
  for (const [re, name, value] of tw) {
    out = upsertMeta(
      out,
      new RegExp(`<meta[^>]*${re.source}[^>]*>`, "i"),
      `<meta name="${name}" content="${escapeAttr(value)}" />`,
    );
  }
  if (imageUrl) {
    out = upsertMeta(
      out,
      /<meta[^>]*name=["']twitter:image["'](?![:])[^>]*>/i,
      `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
    );
    out = upsertMeta(
      out,
      /<meta[^>]*name=["']twitter:image:alt["'][^>]*>/i,
      `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt || title)}" />`,
    );
  }

  return out;
}

// Markers make re-injection idempotent: a stale/already-prerendered
// dist/index.html can be re-rendered without a fresh `vite build`. The
// non-greedy match stops at the unique end marker, so nested <div>s in a CMS
// article body never confuse it.
const ROOT_OPEN = "<!--prerender-->";
const ROOT_CLOSE = "<!--/prerender-->";

function injectRoot(html, bodyInner) {
  const inner = `${ROOT_OPEN}\n      ${bodyInner.trim().replace(/\n/g, "\n      ")}\n    ${ROOT_CLOSE}`;
  const filled = `<div id="root">${inner}</div>`;

  if (/<div id="root">\s*<\/div>/.test(html)) {
    return html.replace(/<div id="root">\s*<\/div>/, filled);
  }
  const markedRe = new RegExp(
    `<div id="root">[\\s\\S]*?${ROOT_CLOSE}</div>`,
  );
  if (markedRe.test(html)) {
    return html.replace(markedRe, filled);
  }
  throw new Error('Could not find <div id="root"></div> in dist/index.html');
}

function renderPage(template, route) {
  const url = canonicalUrl(route.path);
  const withMeta = replaceMeta(template, {
    title: route.title,
    description: route.description,
    url,
    imageUrl: route.imageUrl || DEFAULT_OG_IMAGE,
    imageAlt: route.imageAlt || route.title,
    type: route.type,
  });
  return injectRoot(withMeta, route.bodyHtml);
}

function writeRouteHtml(routePath, html) {
  const normalized =
    !routePath || routePath === "/"
      ? "/"
      : `/${routePath.replace(/^\/+|\/+$/g, "")}`;

  if (normalized === "/") {
    fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
    return path.join(distDir, "index.html");
  }

  const segments = normalized.slice(1).split("/");
  const dir = path.join(distDir, ...segments);
  fs.mkdirSync(dir, { recursive: true });
  const outFile = path.join(dir, "index.html");
  fs.writeFileSync(outFile, html, "utf8");
  return outFile;
}

/* ----------------------------------------------------------------------- */
/* Article resolution (live API → bundled fallback)                         */
/* ----------------------------------------------------------------------- */

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchApiArticles() {
  const list = await fetchJson(`${CMS_BASE}/press-releases`);
  const items = Array.isArray(list?.items) ? list.items : [];
  if (items.length === 0) throw new Error("Press API returned no articles");

  const articles = [];
  for (const item of items) {
    if (!item?.slug) continue;
    try {
      const detail = await fetchJson(
        `${CMS_BASE}/press-releases/${encodeURIComponent(item.slug)}`,
      );
      if (detail?.article?.slug) {
        articles.push({
          ...detail.article,
          related: Array.isArray(detail.related) ? detail.related : [],
        });
        continue;
      }
    } catch {
      /* fall through to list payload */
    }
    articles.push({ ...item, related: [] });
  }
  return articles;
}

function bundledArticlesWithRelated() {
  return PRESS_RELEASES.map((a) => {
    const related = PRESS_RELEASES.filter(
      (o) => o.slug !== a.slug && o.group === a.group,
    ).slice(0, 3);
    return { ...a, related };
  });
}

async function resolveArticles() {
  try {
    const articles = await fetchApiArticles();
    console.log(
      `[prerender-seo] Loaded ${articles.length} articles from API (${CMS_BASE})`,
    );
    return articles;
  } catch (err) {
    console.warn(
      `[prerender-seo] Press API unavailable (${err.message}); using bundled pressReleases.js`,
    );
    const bundled = bundledArticlesWithRelated();
    console.log(`[prerender-seo] Loaded ${bundled.length} bundled articles`);
    return bundled;
  }
}

/* ----------------------------------------------------------------------- */
/* Route collection                                                         */
/* ----------------------------------------------------------------------- */

function collectStaticRoutes(services, articles) {
  const routes = [];
  const push = (routePath, extra) =>
    routes.push({
      path: routePath,
      title: PAGE_SEO[routePath]?.title,
      description: PAGE_SEO[routePath]?.description,
      ...extra,
    });

  push("/", {
    bodyHtml: homePageHtml(services),
    imageUrl: DEFAULT_OG_IMAGE,
    imageAlt: "Biznet Consulting",
  });
  push(PATHS.about, {
    bodyHtml: aboutPageHtml(),
    imageAlt: "About Biznet Consulting",
  });
  push(PATHS.services, {
    bodyHtml: servicesListPageHtml(services),
    imageAlt: "Biznet Consulting services",
  });
  push(PATHS.contact, {
    bodyHtml: contactPageHtml(),
    imageAlt: "Contact Biznet Consulting",
  });
  push(PATHS.news, {
    bodyHtml: newsListingPageHtml(articles),
    imageAlt: "Biznet Consulting News & Insights",
  });
  push(PATHS.upcomingProjects, {
    bodyHtml: upcomingProjectsPageHtml(),
    imageAlt: "Biznet Consulting upcoming projects",
  });
  push(PATHS.recentProjects, {
    bodyHtml: placeholderPageHtml(
      EN.recentProjects,
      "Recent Projects",
      PATHS.recentProjects,
    ),
    imageAlt: "Biznet Consulting recent projects",
  });
  push(PATHS.legacy, {
    bodyHtml: placeholderPageHtml(EN.legacy, "Legacy in Progress", PATHS.legacy),
    imageAlt: "Biznet Consulting legacy in progress",
  });
  push(PATHS.comingSoon, {
    bodyHtml: placeholderPageHtml(EN.comingSoon, "Coming Soon", PATHS.comingSoon),
    imageAlt: "Biznet Consulting",
  });
  push(PATHS.faqs, {
    bodyHtml: faqsPageHtml(),
    imageAlt: "Biznet Consulting FAQs",
  });
  push(PATHS.privacy, {
    bodyHtml: legalPageHtml(EN.privacyPolicy, "Privacy Policy", PATHS.privacy),
    imageAlt: "Biznet Consulting",
  });
  push(PATHS.terms, {
    bodyHtml: legalPageHtml(EN.terms, "Terms & Conditions", PATHS.terms),
    imageAlt: "Biznet Consulting",
  });

  return routes;
}

function collectServiceRoutes(services) {
  return services.map((service) => ({
    path: servicePath(service.slug),
    title: `${service.title} | Biznet Consulting`,
    description:
      service.intro || service.overview || PAGE_SEO[PATHS.services].description,
    bodyHtml: serviceDetailPageHtml(service),
    // Share preview uses the brand JPG for cross-platform reliability
    // (WhatsApp/Facebook handle WebP inconsistently); the per-service image
    // still appears in the crawlable page body above.
    imageUrl: DEFAULT_OG_IMAGE,
    imageAlt: `${service.title} — Biznet Consulting`,
  }));
}

function collectArticleRoutes(articles) {
  return articles.map((article) => ({
    path: articlePath(article.slug),
    title: `${article.title} | Biznet Consulting`,
    description: article.excerpt || PAGE_SEO[PATHS.news].description,
    bodyHtml: articlePageHtml(article, article.related),
    imageUrl: absoluteUrl(article.image) || DEFAULT_OG_IMAGE,
    imageAlt: article.imageAlt || article.title,
    type: "article",
  }));
}

/* ----------------------------------------------------------------------- */

async function main() {
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error(
      "[prerender-seo] dist/index.html missing — run `vite build` first",
    );
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const services = loadServicesData();
  const articles = await resolveArticles();

  const routes = [
    ...collectStaticRoutes(services, articles),
    ...collectServiceRoutes(services),
    ...collectArticleRoutes(articles),
  ];

  let written = 0;
  for (const route of routes) {
    if (!route.title || !route.description) {
      console.warn(`[prerender-seo] Skipping ${route.path} — missing SEO`);
      continue;
    }
    try {
      const html = renderPage(template, route);
      writeRouteHtml(route.path, html);
      written += 1;
    } catch (err) {
      console.warn(
        `[prerender-seo] Failed to render ${route.path}: ${err.message}`,
      );
    }
  }

  console.log(
    `[prerender-seo] Wrote ${written} HTML files under dist/ (origin ${SITE_ORIGIN})`,
  );
}

main().catch((err) => {
  console.error("[prerender-seo] Failed:", err);
  process.exit(1);
});
