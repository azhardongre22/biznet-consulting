import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
