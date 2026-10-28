import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { organizationSchema, websiteSchema } from "./src/seo/schema.js"
import { jsonLdText } from "./src/seo/head.js"

// Site-wide Organization + WebSite JSON-LD, generated from src/data/seoData.js
// so index.html never drifts from the per-page schema.
const siteSchema = () => ({
  name: "site-schema",
  transformIndexHtml: () =>
    [organizationSchema(), websiteSchema()].map((data) => ({
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: jsonLdText(data),
      injectTo: "head",
    })),
})

export default defineConfig({
  plugins: [react(), tailwindcss(), siteSchema()],
  server: {
    // Distinct port so this can run alongside the CMS admin SPA (5173).
    port: 5174,
    proxy: {
      // Press/CMS reads are served by this repo's server.js (port 3001),
      // not the separate biznet-cms-api (3010). Rewrite /api/cms → /api.
      "/api/cms": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/cms/, "/api"),
      },
      // Site API (contact, newsletter, press) — local Express backend.
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
      // CMS-uploaded media — also served by server.js from PRESS_UPLOADS_DIR.
      "/uploads": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
})
