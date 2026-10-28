/**
 * Build-time render entry, bundled by `vite build --ssr` and driven by
 * scripts/prerender.mjs. Renders one route to static HTML (waiting for every
 * lazy chunk) and returns the SEO the page declared through usePageSeo.
 */
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router-dom";

import AppRoutes from "./routes";
import { SeoCollectorContext } from "./hooks/usePageSeo";
import { primePressCache } from "./lib/cms";

export { resolveSeo, headTags, jsonLdText } from "./seo/head.js";

/**
 * @param {string} url  Route path, e.g. "/about".
 * @param {{ press?: { list: object[], articles: {article, related}[] } }} data
 * @returns {Promise<{ html: string, seo: object|null }>}
 */
export async function render(url, { press } = {}) {
  primePressCache(press);
  const collector = { seo: null };

  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <SeoCollectorContext.Provider value={collector}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </SeoCollectorContext.Provider>
    </StrictMode>,
  );

  let html = "";
  for await (const chunk of prelude) html += chunk;
  return { html, seo: collector.seo };
}
