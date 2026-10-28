# Biznet Consulting website

Marketing site for [biznetconsulting.ae](https://biznetconsulting.ae) — React 19 +
Vite + Tailwind v4 SPA, prerendered at build time so every URL ships complete
HTML (content, meta, Open Graph, JSON-LD) to search engines and link previews.
A small Express API (`server.js`) handles the contact form, newsletter and SEO
refresh. News articles come from the Biznet CMS API.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5174 (proxies `/api` to `server.js`) |
| `npm run server` | Express API on :3001 |
| `npm run build` | Client build → SSR bundle → prerender every route into `dist/` |
| `npm run prerender` | Re-run only the prerender (uses the cached template) |
| `npm run verify:seo` | Audit `dist/` (titles, canonicals, OG, JSON-LD, h1, alt text, sitemap) |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm run generate:og` | Rebuild share cards + favicons in `public/` |
| `npm run generate:redirects` | Rebuild `deploy/nginx-redirects.conf` |
| `npm run optimize:images` | Masters in `assets-src/` → WebP in `src/assets/images/` |

Deployment, nginx, env vars and the CMS publish hook: [deploy/README.md](deploy/README.md).

## Structure

```
├── index.html               HTML shell; <!--seo--> block is rewritten per page
├── server.js                Express API (contact, newsletter, press fallback, SEO refresh)
├── lib/                     Node modules shared by server.js and the build
│   ├── sitemap.js           sitemap.xml builder (pages, articles, images, lastmod)
│   └── seo-refresh.js       POST /api/seo/refresh + CMS watchdog
├── scripts/                 Build-time tooling
│   ├── prerender.mjs        Renders every route → dist/<route>/index.html, 404, sitemap, llms.txt
│   ├── verify-seo.mjs       Post-build SEO audit
│   ├── generate-og-images.mjs
│   ├── generate-nginx-redirects.mjs
│   └── optimize-images.mjs
├── deploy/                  nginx config, generated redirects, deploy guide
├── docs/                    Project notes
├── public/                  Copied verbatim: robots.txt, favicons, og/ share cards, brand/
├── assets-src/              (git-ignored) full-resolution image masters
└── src/
    ├── main.jsx             Browser entry
    ├── entry-server.jsx     Prerender entry (react-dom/static)
    ├── App.jsx              Router, smooth scroll, boot-loader dismissal
    ├── routes.jsx           Route table + legacy redirects (shared by both entries)
    ├── pages/               One component per route
    ├── components/
    │   ├── layout/          Navbar, Footer, ScrollToTop
    │   ├── home/            Home page sections + their copy/images
    │   ├── forms/           PhoneField, CampaignLeadModal
    │   └── common/          Floating WhatsApp/logo buttons, socials, SmartImage
    ├── hooks/               usePageSeo, useScrollMotion
    ├── seo/                 head.js (meta tags), schema.js (JSON-LD builders)
    ├── data/                seoData.js (all SEO + routes), siteCopy.js (contact + legal copy), projects, press fallback
    ├── lib/                 cms.js (press API), tracking.js (dataLayer events)
    ├── styles/              index.css (Tailwind + base), site.css (editorial `.hv2-*` system)
    └── assets/
        ├── fonts/
        └── images/{brand,clients,people,photos,projects}/
```

## SEO in one paragraph

Every page calls `usePageSeo({ path, … })`. Titles, descriptions, breadcrumb
names and share images live in `src/data/seoData.js`; `src/seo/head.js` turns
them into tags and `src/seo/schema.js` into JSON-LD. In the browser the hook
updates `<head>` on navigation; at build time `scripts/prerender.mjs` renders
the same React tree on the server, collects what each page declared and writes
it into static HTML. Adding a page: add its route in `src/routes.jsx`, an entry
in `PAGE_SEO`, a share card in `scripts/generate-og-images.mjs` if wanted, and
its source file in `PAGE_SOURCES` (`lib/sitemap.js`) for `<lastmod>`.
