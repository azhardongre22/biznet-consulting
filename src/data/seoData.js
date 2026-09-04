/**
 * SEO titles, descriptions and canonical helpers for Biznet Consulting.
 * Single source of truth shared by the app, the sitemap generator
 * (lib/sitemap.js) and the post-build prerender (scripts/prerender-seo.mjs).
 *
 * Keys are the pathname with NO trailing slash, except home which is "/".
 * Canonical URLs use no trailing slash to match the app's route links and
 * Vercel's default clean-URL serving of per-route index.html files.
 */

export const SITE_ORIGIN = "https://biznetconsulting.ae";

/** Default OG/share image (stable public asset, copied to dist root by Vite). */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

export const DEFAULT_SEO = {
  title: "Biznet Consulting | Integrated Development & Advisory in the UAE",
  description:
    "Biznet Consulting is built for bold visions, ambitious developments, and the people behind them — feasibility, development, project management, branding and business formation under one direction.",
};

/** Home crumb used as the root of every breadcrumb trail. */
export const HOME_CRUMB = { name: "Home", path: "/" };

/** News article pages live under /news-and-insights/:slug. */
export const articlePath = (slug) => `/news-and-insights/${slug}`;

/** Service detail pages live under /services/:slug. */
export const servicePath = (slug) => `/services/${slug}`;

/** Canonical public paths used in routes and links. */
export const PATHS = {
  home: "/",
  about: "/about",
  services: "/services",
  contact: "/contact",
  news: "/news-and-insights",
  upcomingProjects: "/upcoming-projects",
  recentProjects: "/recent-projects",
  legacy: "/legacy",
  comingSoon: "/coming-soon",
  faqs: "/faqs",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
};

export const PAGE_SEO = {
  "/": {
    title: "Biznet Consulting | Integrated Development & Advisory in the UAE",
    description:
      "Biznet Consulting brings feasibility, development, project management, branding and business formation under one aligned direction — for developers, investors and landowners across the UAE.",
  },
  "/about": {
    title: "About Biznet Consulting | Guided by Firasah",
    description:
      "Guided by Firasah — the Emirati philosophy of insight — Biznet Consulting anticipates needs and aligns vision with execution through precision, strategy and legacy thinking.",
  },
  "/services": {
    title: "Our Services | Biznet Consulting UAE",
    description:
      "Integrated consultancy across business formation, feasibility, project development, project management and branding — moving projects from concept to completion with intent.",
  },
  "/contact": {
    title: "Contact Biznet Consulting | Start the Conversation",
    description:
      "Every meaningful project begins with the right conversation. Share your details and let the Biznet Consulting team shape your development with insight and precision.",
  },
  "/news-and-insights": {
    title: "News & Insights | Biznet Consulting",
    description:
      "Announcements, recognitions, partnerships, market outlooks and leadership commentary from the Biznet Consulting newsroom.",
  },
  "/upcoming-projects": {
    title: "Upcoming Projects | Biznet Consulting",
    description:
      "Biznet Consulting continues to shape a new era of developments alongside developers, landowners, investors and private visionaries — structured from foundation to completion.",
  },
  "/recent-projects": {
    title: "Recent Projects | Biznet Consulting",
    description:
      "A closer look at the developments and milestones shaping Biznet Consulting's growing presence across the UAE.",
  },
  "/legacy": {
    title: "Legacy in Progress | Biznet Consulting",
    description:
      "Developments shaped with purpose, thoughtful planning and a long-term vision for value, impact and legacy.",
  },
  "/coming-soon": {
    title: "Coming Soon | Biznet Consulting",
    description:
      "We're putting the finishing touches on this chapter. Connect with Biznet Consulting to be the first to know when it's live.",
  },
  "/faqs": {
    title: "Frequently Asked Questions | Biznet Consulting",
    description:
      "Answers to the questions clients most often ask about Biznet Consulting's approach, services, and how we work alongside developers and investors across the UAE.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Biznet Consulting",
    description:
      "How Biznet Consulting collects, uses and protects the information you share — handled with the same discretion and care we bring to the work itself.",
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | Biznet Consulting",
    description:
      "The terms that govern your use of the Biznet Consulting website and the way we engage with clients and partners across the UAE.",
  },
};

export const getPageSeo = (pathname) => {
  const key =
    !pathname || pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
  return PAGE_SEO[key] || null;
};

/** Canonical absolute URL for a path (no trailing slash except root). */
export const canonicalUrl = (pathname = "/") => {
  if (!pathname || pathname === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}/${pathname.replace(/^\/+|\/+$/g, "")}`;
};
