# Deploying biznetconsulting.ae

Production is the VPS: nginx serves `dist/` statically and PM2 runs
`server.js` (contact, newsletter, SEO refresh) on port 3001.

## Every deploy

```bash
cd /var/www/biznet-website
git pull
npm ci
CMS_API_BASE="https://biznetconsulting.ae/api/cms" npm run build
pm2 restart <server process name>   # only when server.js or lib/ changed
```

`npm run build` does three things:

1. `vite build` — client bundle in `dist/`
2. `vite build --ssr src/entry-server.jsx --outDir .ssr` — server render bundle
3. `node scripts/prerender.mjs` — renders every page to
   `dist/<route>/index.html` with its own title, meta, Open Graph, Twitter and
   JSON-LD, plus `dist/404.html`, `dist/sitemap.xml`, `dist/llms.txt` and
   `dist/og/news/<slug>.jpg` share images for each article.

## One-time setup

### Environment (`.env` next to `server.js`)

| Variable | Purpose |
| --- | --- |
| `CMS_API_BASE` | CMS API used by the prerender and watchdog (default `https://biznetconsulting.ae/api/cms`) |
| `SEO_REFRESH_TOKEN` | Long random string; enables `POST /api/seo/refresh` |
| `SEO_WATCHDOG` | `off` disables the 5-minute CMS check |
| `SEO_WATCHDOG_INTERVAL_MS` / `SEO_FULL_REFRESH_MS` | Watchdog timing (defaults 5 min / 24 h) |

### nginx

Merge `deploy/nginx.conf` into `/etc/nginx/sites-available/biznetconsulting`:

- `try_files $uri $uri/index.html =404;` plus `error_page 404 /404.html;` —
  prerendered pages are served directly, unknown URLs return a real 404.
- `include /var/www/biznet-website/deploy/nginx-redirects.conf;` — 301s for
  retired URLs. Regenerate after editing `LEGACY_REDIRECTS` in
  `src/data/seoData.js`: `npm run generate:redirects`.
- `rewrite ^/(.+)/$ /$1 permanent;` — canonical URLs have no trailing slash.
- http → https and www → apex in one hop.

Then `sudo nginx -t && sudo systemctl reload nginx`.

### CMS publish hook

On publish, unpublish, slug or meta change, the CMS should call:

```bash
curl -X POST https://biznetconsulting.ae/api/seo/refresh \
  -H "x-seo-refresh-token: $SEO_REFRESH_TOKEN"
```

It returns `202` immediately and re-renders in the background. The watchdog in
`server.js` catches anything the hook misses (look for `[seo] watchdog ok` in
`pm2 logs`).

### Google Tag Manager

SPA navigations push `virtual_page_view` to the dataLayer (the first load is
already counted). In GTM add a Custom Event trigger `virtual_page_view` firing a
GA4 Event tag named `page_view` with `page_location`, `page_path` and
`page_title` from the dataLayer.

### Search Console

Paste the verification token into the commented `google-site-verification`
meta in `index.html`, then submit `https://biznetconsulting.ae/sitemap.xml`.

## Verify after deploy

```bash
curl -s -A Googlebot https://biznetconsulting.ae/feasibility-study | grep -E "<title>|og:image\"|<h1"
curl -s -o /dev/null -w "%{http_code}\n" https://biznetconsulting.ae/does-not-exist     # 404
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://biznetconsulting.ae/upcoming-projects  # 301 → /projects
curl -s -X POST -o /dev/null -w "%{http_code}\n" https://biznetconsulting.ae/api/seo/refresh             # 401
```

Spot-check share previews in the LinkedIn Post Inspector and the Facebook
Sharing Debugger, and structured data in Google's Rich Results Test.
