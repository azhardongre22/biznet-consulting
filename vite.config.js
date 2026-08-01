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
      // CMS public API (biznet-cms-api) — press releases, etc.
      // Must be registered before the broader /api rule.
      "/api/cms": {
        target: "http://127.0.0.1:3010",
        changeOrigin: true,
      },
      // Site API (contact, newsletter) — leave on the public Biznet API.
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
      // CMS-uploaded media (heroes, etc.). In production Nginx serves this.
      "/uploads": {
        target: "http://127.0.0.1:3010",
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