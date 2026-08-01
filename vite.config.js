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
      // Everything the site needs is served by its OWN backend (:3001):
      // contact/newsletter, press content (from MySQL), and uploaded media.
      // The CMS admin API (:3010) is NOT a dependency of the public site.
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:3001",
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