/**
 * SEO single source of truth for Biznet Consulting.
 *
 * Shared by the app (usePageSeo), the post-build prerender
 * (scripts/prerender.mjs), the sitemap (lib/sitemap.js) and the server.
 * Plain data only — no React or asset imports — so Node can import it.
 *
 * Keys are the pathname with NO trailing slash, except home which is "/".
 * Canonical URLs deliberately use no trailing slash: it matches every
 * react-router link and the nginx `try_files $uri $uri/index.html` rule, so
 * each URL is served directly (200) with no redirect hop.
 */

export const SITE_ORIGIN = "https://biznetconsulting.ae";
export const SITE_NAME = "Biznet Consulting";
export const SITE_LOCALE = "en_AE";
export const SITE_LANGUAGE = "en";
export const TWITTER_HANDLE = "@BizNetAE";

/** Brand share card (1200×630 JPG in public/). */
export const DEFAULT_OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Biznet Consulting — integrated development and project advisory in the UAE",
};

export const DEFAULT_SEO = {
  title: "Biznet Consulting | Development Advisory & Project Management UAE",
  description:
    "Biznet Consulting is a UAE development consultancy — feasibility studies, project development and owner-side project management for developers, landowners and investors.",
};

/** Organisation facts used in JSON-LD, the prerendered footer and llms.txt. */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Biznet Consulting",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/brand/biznet-logo.png`,
  email: "hello@biznetconsulting.ae",
  phones: [
    { telephone: "+971-4-343-3334", contactType: "customer service" },
    { telephone: "+971-52-748-8855", contactType: "sales" },
  ],
  address: {
    streetAddress: "Oud Metha Offices Building, Office 324",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  areaServed: "United Arab Emirates",
  sameAs: [
    "https://www.linkedin.com/company/biznet-consulting/",
    "https://www.instagram.com/biznetconsulting",
    "https://x.com/BizNetAE",
    "https://www.tiktok.com/@biznet.consulting8",
    "https://youtube.com/@biznetconsulting",
    "https://www.snapchat.com/add/bnconsultingae",
    "https://whatsapp.com/channel/0029VbCftkiJZg46tGLDkU3V",
  ],
};

/** News article pages live under /news-and-insights/:slug. */
export const articlePath = (slug) => `/news-and-insights/${slug}`;

/**
 * The three services, in their fixed order. Each has its own clean URL
 * (/feasibility-study, …) that renders the services page scrolled to that
 * section, with its own title and description.
 */
export const SERVICE_SECTIONS = [
  {
    id: "feasibility-study",
    title: "Feasibility Study",
    summary:
      "Evaluate development opportunities through highest and best use analysis, market assessment, financial modelling and investment return projections.",
    cta: "Explore Feasibility Studies",
    seoTitle: "Feasibility Study Services UAE | Biznet Consulting",
    seoDescription:
      "Real estate feasibility studies in the UAE — highest and best use, market study, financial modelling, investment return and risk assessment before you commit capital.",
  },
  {
    id: "project-development",
    title: "Project Development",
    summary:
      "Define the direction of a project through opportunity assessment, concept review, development planning and project positioning.",
    cta: "Explore Project Development",
    seoTitle: "Project Development Services UAE | Biznet Consulting",
    seoDescription:
      "Development strategy, land potential assessment, concept review and early-stage decision support — shaping the right project direction before execution begins.",
  },
  {
    id: "project-management",
    title: "Project Management",
    summary:
      "Maintain oversight of implementation through consultant and contractor coordination, cost and schedule monitoring, progress reporting and milestone tracking.",
    cta: "Explore Project Management",
    seoTitle: "Project Management Services UAE | Biznet Consulting",
    seoDescription:
      "Owner-side project management for investment, development and private villa projects in the UAE — coordination, progress monitoring, cost and time control, reporting.",
  },
];

/** Clean public URL of a service (e.g. /feasibility-study). */
export const servicePath = (id) => `/${id}`;

/** Service whose clean URL matches a pathname, if any. */
export const serviceForPath = (pathname) =>
  SERVICE_SECTIONS.find((s) => servicePath(s.id) === pathname) || null;

/** Retired /services/:slug detail pages → their clean service URL. */
export const LEGACY_SERVICE_SLUGS = {
  "feasibility-viability": "feasibility-study",
  "project-development": "project-development",
  "project-management": "project-management",
};

/** Canonical public paths used in routes and links. */
export const PATHS = {
  home: "/",
  about: "/about",
  services: "/services",
  contact: "/contact",
  news: "/news-and-insights",
  projects: "/projects",
  faqs: "/faqs",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  scan: "/scan",
};

/**
 * Permanent (301) redirects for retired URLs. Mirrored as <Navigate replace>
 * routes in the SPA and emitted as nginx rules (deploy/nginx-redirects.conf).
 * `:slug` segments are carried over.
 */
export const LEGACY_REDIRECTS = [
  { from: "/upcoming-projects", to: PATHS.projects },
  { from: "/recent-projects", to: PATHS.projects },
  { from: "/legacy", to: PATHS.projects },
  { from: "/coming-soon", to: PATHS.home },
  { from: "/press-release", to: PATHS.news },
  { from: "/press-release/:slug", to: "/news-and-insights/:slug" },
  ...Object.entries(LEGACY_SERVICE_SLUGS).map(([slug, id]) => ({
    from: `/services/${slug}`,
    to: servicePath(id),
  })),
];

/** Social share images generated by scripts/generate-og-images.mjs. */
const og = (name, alt) => ({ url: `/og/${name}.jpg`, width: 1200, height: 630, alt });

/**
 * Per-page SEO. `name` is the breadcrumb label; `image` the share card.
 * `noindex` pages are prerendered (so shares still preview) but kept out of
 * the sitemap and llms.txt.
 */
export const PAGE_SEO = {
  "/": {
    name: "Home",
    title: "Biznet Consulting | Development Consultancy Dubai",
    description:
      "Biznet Consulting offers real estate project development, project management and feasibility studies in Dubai and across the UAE.",
    image: og("home", "Dubai skyline at blue hour — Biznet Consulting, development advisory in the UAE"),
  },
  "/about": {
    name: "About Us",
    title: "About Biznet Consulting | Development Consultancy UAE",
    description:
      "Learn about Biznet Consulting, a UAE-based development consultancy specialising in feasibility studies, project development and project management.",
    image: og("about", "Biznet Consulting team coordinating a development on site"),
  },
  "/services": {
    name: "Services",
    title: "Development Consultancy Services Dubai | Biznet",
    description:
      "Explore Biznet Consulting's feasibility studies, project development and project management services for development and construction projects in Dubai and the UAE.",
    image: og("services", "Consultants reviewing architectural plans — Biznet Consulting services"),
  },
  "/feasibility-study": {
    name: "Feasibility Study",
    title: SERVICE_SECTIONS[0].seoTitle,
    description: SERVICE_SECTIONS[0].seoDescription,
    image: og("feasibility-study", "Aerial view of land assessed for development feasibility"),
  },
  "/project-development": {
    name: "Project Development",
    title: SERVICE_SECTIONS[1].seoTitle,
    description: SERVICE_SECTIONS[1].seoDescription,
    image: og("project-development", "Architectural model and planning drawings for an early-stage development"),
  },
  "/project-management": {
    name: "Project Management",
    title: SERVICE_SECTIONS[2].seoTitle,
    description: SERVICE_SECTIONS[2].seoDescription,
    image: og("project-management", "Project team reviewing progress and controls on a construction project"),
  },
  "/projects": {
    name: "Projects",
    title: "Biznet Consulting Projects | UAE Development Portfolio",
    description:
      "Explore Biznet Consulting’s portfolio of residential buildings, commercial developments and private villas across the UAE.",
    image: og("projects", "Contemporary private villa in stone and timber — Biznet Consulting projects"),
  },
  "/news-and-insights": {
    name: "News & Insights",
    title: "News & Insights | Biznet Consulting",
    description:
      "Announcements, recognitions, partnerships, market outlooks and leadership commentary from the Biznet Consulting newsroom.",
    image: og("news-and-insights", "Glass office towers in Dubai — Biznet Consulting News & Insights"),
  },
  "/contact": {
    name: "Contact",
    title: "Contact Biznet Consulting | Development Consultancy Dubai",
    description:
      "Contact Biznet Consulting in Dubai for feasibility studies, project development and project management services across the UAE.",
    image: og("contact", "Urban development in central Dubai — contact Biznet Consulting"),
  },
  "/faqs": {
    name: "FAQs",
    title: "Frequently Asked Questions | Biznet Consulting",
    description:
      "Answers to the questions clients most often ask about Biznet Consulting's approach, services, and how we work alongside developers and investors across the UAE.",
    image: og("faqs", "Architectural blueprints on a desk — Biznet Consulting FAQs"),
  },
  "/privacy-policy": {
    name: "Privacy Policy",
    title: "Privacy Policy | Biznet Consulting",
    description:
      "How Biznet Consulting collects, uses and protects the information you share — handled with the same discretion and care we bring to the work itself.",
  },
  "/terms-and-conditions": {
    name: "Terms & Conditions",
    title: "Terms & Conditions | Biznet Consulting",
    description:
      "The terms that govern your use of the Biznet Consulting website and the way we engage with clients and partners across the UAE.",
  },
  "/scan": {
    name: "A Message from the CEO",
    title: "A Message from the CEO | Biznet Consulting",
    description:
      "A personal message from Ismail Al Hammadi, CEO of Biznet Consulting, for the partners and guests we meet in person.",
    noindex: true,
  },
};

/** SEO for the catch-all 404 page (prerendered to dist/404.html). */
export const NOT_FOUND_SEO = {
  name: "Page Not Found",
  title: "Page Not Found | Biznet Consulting",
  description: "The page you were looking for has moved or no longer exists. Explore Biznet Consulting's services, projects and insights.",
  noindex: true,
};

export const getPageSeo = (pathname) => PAGE_SEO[normalizePath(pathname)] || null;

/** "/about/" → "/about", "" → "/". */
export function normalizePath(pathname = "/") {
  const clean = `/${String(pathname).split(/[?#]/)[0].replace(/^\/+|\/+$/g, "")}`;
  return clean === "/" ? "/" : clean;
}

/** Canonical absolute URL for a path (no trailing slash except root). */
export const canonicalUrl = (pathname = "/") => {
  const p = normalizePath(pathname);
  return p === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${p}`;
};

/** Absolute URL for a root-relative or protocol-relative asset/link. */
export function absoluteUrl(src) {
  if (!src || typeof src !== "string") return "";
  const s = src.trim();
  if (/^(https?:|data:|mailto:|tel:)/i.test(s)) return s;
  if (s.startsWith("//")) return `https:${s}`;
  return `${SITE_ORIGIN}${s.startsWith("/") ? "" : "/"}${s}`;
}

/** Root breadcrumb + helper to build a trail ending at the current page. */
export const HOME_CRUMB = { name: "Home", path: "/" };
export const withHomeBreadcrumbs = (...items) => [HOME_CRUMB, ...items.filter(Boolean)];

/** Breadcrumbs for a static page derived from PAGE_SEO (services nest under /services). */
export function breadcrumbsFor(pathname) {
  const p = normalizePath(pathname);
  if (p === "/") return [];
  const page = PAGE_SEO[p];
  if (!page) return [];
  const parent = serviceForPath(p) ? { name: PAGE_SEO[PATHS.services].name, path: PATHS.services } : null;
  return withHomeBreadcrumbs(parent, { name: page.name, path: p });
}

/** Indexable static paths, in sitemap order. */
export const INDEXABLE_PATHS = Object.keys(PAGE_SEO).filter((p) => !PAGE_SEO[p].noindex);
