/**
 * schema.org JSON-LD builders. Pure functions over plain data so the client
 * (usePageSeo) and the prerender emit exactly the same structured data.
 */
import {
  ORGANIZATION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_ORIGIN,
  absoluteUrl,
  canonicalUrl,
} from "../data/seoData.js";

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

/** Reference to the site-wide Organization node (declared in index.html). */
export const orgRef = { "@id": ORG_ID };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: `${SITE_ORIGIN}/`,
    logo: { "@type": "ImageObject", url: ORGANIZATION.logo, width: 512, height: 512 },
    image: `${SITE_ORIGIN}/og-image.jpg`,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.phones[0].telephone,
    address: { "@type": "PostalAddress", ...ORGANIZATION.address },
    areaServed: { "@type": "Country", name: ORGANIZATION.areaServed },
    sameAs: ORGANIZATION.sameAs,
    contactPoint: ORGANIZATION.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.telephone,
      contactType: p.contactType,
      email: ORGANIZATION.email,
      areaServed: "AE",
      availableLanguage: ["English"],
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    inLanguage: SITE_LANGUAGE,
    publisher: orgRef,
  };
}

/** [{name, path}] → BreadcrumbList. */
export function breadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function webPageSchema({ type = "WebPage", path, title, description, image }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${canonicalUrl(path)}#webpage`,
    url: canonicalUrl(path),
    name: title,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    about: orgRef,
    ...(image ? { primaryImageOfPage: imageObject(image) } : {}),
  };
}

export function imageObject(image) {
  if (!image?.url) return undefined;
  return {
    "@type": "ImageObject",
    url: absoluteUrl(image.url),
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(image.alt ? { caption: image.alt } : {}),
  };
}

export function serviceSchema({ name, description, path, serviceType, offers = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl(path)}#service`,
    name,
    serviceType: serviceType || name,
    description,
    url: canonicalUrl(path),
    provider: orgRef,
    areaServed: { "@type": "Country", name: ORGANIZATION.areaServed },
    ...(offers.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${name} scope`,
            itemListElement: offers.map((o) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: o },
            })),
          },
        }
      : {}),
  };
}

/** [{q, a}] → FAQPage. */
export function faqSchema(faqs) {
  if (!Array.isArray(faqs) || !faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** [{name, path?, url?, image?, description?}] → ItemList. */
export function itemListSchema(name, items) {
  if (!Array.isArray(items) || !items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path || item.url ? { url: item.url || canonicalUrl(item.path) } : {}),
      ...(item.image ? { image: absoluteUrl(item.image) } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function articleSchema({ path, title, description, image, imageAlt, author, datePublished, dateModified, section }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${canonicalUrl(path)}#article`,
    mainEntityOfPage: canonicalUrl(path),
    headline: String(title || "").slice(0, 110),
    description,
    ...(image ? { image: [imageObject({ url: image, alt: imageAlt })] } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
    ...(section ? { articleSection: section } : {}),
    inLanguage: SITE_LANGUAGE,
    author: author
      ? { "@type": author === SITE_NAME ? "Organization" : "Person", name: author }
      : orgRef,
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: ORGANIZATION.logo },
    },
  };
}
