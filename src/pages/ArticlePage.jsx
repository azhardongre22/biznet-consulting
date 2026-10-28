import { Suspense, lazy, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

import "../styles/site.css";
import Navbar from "../components/layout/Navbar";
import { fetchPressArticle, getCachedPressArticle } from "../lib/cms";
import usePageSeo from "../hooks/usePageSeo";
import { PAGE_SEO, PATHS, articlePath, withHomeBreadcrumbs } from "../data/seoData";
import { articleSchema } from "../seo/schema";
import NotFoundPage from "./NotFoundPage";
import { trackShare } from "../lib/tracking";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1120px] px-5 md:px-8 lg:px-10";

function ArticleBody({ body }) {
  if (typeof body === "string" && body.trim()) {
    return <div className="press-prose" dangerouslySetInnerHTML={{ __html: body }} />;
  }
  return null;
}

function Shell({ children }) {
  return (
    <>
      <main className="home-v2 min-h-screen">
        <Navbar />
        {children}
        <div id="contact">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function RelatedCard({ post }) {
  return (
    <Link to={`/news-and-insights/${post.slug}`} className="group flex flex-col">
      <div className="hv2-photo hv2-frame aspect-[4/3]">
        <img
          src={post.image}
          alt={post.imageAlt || post.title}
          loading="lazy"
          decoding="async"
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A95A0]">
        <span className="text-[#0E4174]">{post.category}</span>
        {post.date ? (
          <>
            <span className="h-1 w-1 rounded-full bg-[#CBD3DA]" />
            <span>{post.date}</span>
          </>
        ) : null}
      </div>
      <h3 className="hv2-display mt-2.5 text-[20px] leading-[1.22] text-[#111A24]">{post.title}</h3>
    </Link>
  );
}

const SHARE_ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]" aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.9 9.9 0 0 0 4.88 1.25h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 1.82c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.76c0 4.5-3.66 8.15-8.16 8.15a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.06.8.82-2.98-.2-.31a8.09 8.09 0 0 1-1.24-4.34c0-4.5 3.66-8.15 8.16-8.15Zm-2.7 4.38c-.14 0-.37.05-.56.26-.19.21-.74.72-.74 1.76s.76 2.04.86 2.18c.1.14 1.49 2.28 3.62 3.19.51.22.9.35 1.21.45.51.16.97.14 1.34.08.41-.06 1.26-.51 1.44-1.01.18-.5.18-.92.13-1.01-.05-.09-.19-.14-.4-.24-.21-.11-1.26-.62-1.45-.69-.19-.07-.34-.11-.48.11-.14.21-.55.69-.67.83-.12.14-.25.16-.46.05-.21-.11-.9-.33-1.71-1.06-.63-.56-1.06-1.26-1.18-1.47-.12-.21-.01-.32.09-.43.09-.09.21-.25.32-.37.11-.12.14-.21.21-.35.07-.14.04-.26-.02-.37-.06-.11-.48-1.19-.66-1.62-.17-.42-.35-.36-.48-.37h-.41Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.9 3.78-3.9 1.1 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

function ShareRail({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent;
  const slug =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).pop()
      : undefined;

  const links = [
    { key: "linkedin", label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { key: "x", label: "Share on X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { key: "whatsapp", label: "Share on WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { key: "facebook", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackShare({ method: "copy_link", itemId: slug });
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const btn =
    "grid h-9 w-9 place-items-center rounded-full border border-[#D3DBE3] text-[#596573] transition-colors hover:border-transparent hover:bg-[#0E4174] hover:text-white";

  return (
    <div className="border-t border-[#E5EAF0] pt-8">
      <p className="hv2-eyebrow text-[#8A95A0]">Share</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {links.map((l) => (
          <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={btn} onClick={() => trackShare({ method: l.key, itemId: slug })}>
            {SHARE_ICONS[l.key]}
          </a>
        ))}
        <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} className={btn}>
          {SHARE_ICONS.link}
        </button>
        {copied ? <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0E4174]">Copied</span> : null}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const cached = getCachedPressArticle(slug);
  const [status, setStatus] = useState(cached ? "ready" : "loading");
  const [article, setArticle] = useState(cached?.article || null);
  const [related, setRelated] = useState(cached?.related || []);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const ph = html.style.background;
    const pb = body.style.background;
    html.style.background = "#ffffff";
    body.style.background = "#ffffff";
    return () => {
      html.style.background = ph;
      body.style.background = pb;
    };
  }, []);

  useEffect(() => {
    if (getCachedPressArticle(slug)) return undefined;
    let alive = true;
    setStatus("loading");
    (async () => {
      try {
        const res = await fetchPressArticle(slug);
        if (!alive) return;
        if (res.notFound || !res.article) return setStatus("notfound");
        setArticle(res.article);
        setRelated(res.related || []);
        setStatus("ready");
      } catch (err) {
        console.warn("[press] CMS unavailable:", err.message);
        // A network/API failure is not a missing article — never 404 it.
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const path = articlePath(slug);
  const title = article ? article.metaTitle || `${article.title} | Biznet Consulting` : "Loading article… | Biznet Consulting";
  const description = article?.metaDescription || article?.excerpt || PAGE_SEO[PATHS.news].description;
  const published = article?.isoDate || article?.publishedAt || "";
  const modified = article?.updatedAt || published;
  usePageSeo({
    path,
    ready: status === "ready",
    title,
    description,
    image: article?.image || undefined,
    imageAlt: article?.imageAlt || article?.title,
    type: "article",
    publishedTime: published,
    modifiedTime: modified,
    section: article?.category,
    noindex: article?.status && article.status !== "published",
    breadcrumbs: withHomeBreadcrumbs(
      { name: PAGE_SEO[PATHS.news].name, path: PATHS.news },
      { name: article?.title || "Article", path },
    ),
    jsonLd: article
      ? articleSchema({
          path,
          title: article.title,
          description,
          image: article.image,
          imageAlt: article.imageAlt,
          author: article.author,
          datePublished: published,
          dateModified: modified,
          section: article.category,
        })
      : null,
  });

  if (status === "loading") {
    return (
      <Shell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-[#8A95A0]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5EAF0] border-t-[#0E4174]" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">Loading article…</p>
        </div>
      </Shell>
    );
  }
  if (status === "error") {
    return (
      <Shell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-5 text-center">
          <p className="hv2-eyebrow">News &amp; Insights</p>
          <p className="hv2-display text-[28px] text-[#092D54]">This article couldn’t be loaded right now.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center rounded-full bg-[#0E4174] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Try again
            </button>
            <Link
              to="/news-and-insights"
              className="inline-flex h-11 items-center rounded-full border border-[#D3DBE3] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
            >
              All stories
            </Link>
          </div>
        </div>
      </Shell>
    );
  }
  if (status === "notfound" || !article) return <NotFoundPage />;

  return (
    <Shell>
      {/* Masthead */}
      <section className={`${SHELL} pt-28 md:pt-32`}>
        <div className="flex items-center justify-between gap-4">
          <Link to="/news-and-insights" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A95A0] transition-colors hover:text-[#0E4174]">
            <ArrowLeft size={14} /> News &amp; Insights
          </Link>
          {article.category ? (
            <span className="inline-flex items-center bg-[#0E4174] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              {article.category}
            </span>
          ) : null}
        </div>

        <div className="mt-10 border-t border-[#E5EAF0] pt-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-[820px]">
            {article.date ? (
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A95A0]">
                <span className="h-px w-8 bg-[#0E4174]" aria-hidden />
                {article.date}
              </p>
            ) : null}
            <h1 className="hv2-display mt-6 text-[30px] leading-[1.12] text-[#092D54] md:text-[44px]">
              {article.title}
            </h1>
          </div>
          {(article.author || article.readTime) && (
            <div className="mt-6 flex flex-col gap-1 lg:mt-0 lg:text-right">
              {article.author ? <span className="hv2-display text-[18px] text-[#0E4174]">{article.author}</span> : null}
              {article.readTime ? <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A95A0]">{article.readTime}</span> : null}
            </div>
          )}
        </div>

        {article.image ? (
          <div className="hv2-frame mt-10 aspect-[16/9] w-full md:mt-12">
            <img
              src={article.image}
              alt={article.imageAlt || article.title}
              title={article.title}
              width="1600"
              height="900"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </section>

      {/* Body */}
      <section className={`${SHELL} pt-12 pb-16 md:pt-16 md:pb-24`}>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_240px]">
          <article className="min-w-0">
            {article.excerpt ? (
              <>
                <p className="hv2-display mb-9 text-[20px] font-light leading-[1.5] text-[#384967] md:text-[24px]">
                  {article.excerpt}
                </p>
                <div className="mb-11 h-px w-[64px] bg-[#0E4174]" />
              </>
            ) : null}
            <ArticleBody body={article.body} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[#E5EAF0] pt-10">
              <Link to="/news-and-insights" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E4174] transition-colors hover:text-[#0b3560]">
                <ArrowLeft size={14} /> All stories
              </Link>
              <Link to="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0E4174] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0b3560]">
                Connect with Biznet <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-8">
              {[
                ["Published", article.date],
                ["Source", article.author],
                ["Category", article.category],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <p className="hv2-eyebrow text-[#8A95A0]">{k}</p>
                    <p className="hv2-display mt-2.5 text-[17px] leading-[1.32] text-[#0E4174]">{v}</p>
                  </div>
                ))}
              <ShareRail title={article.title} />
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="border-t border-[#EEF1F4]">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-20 md:px-8 md:py-24 lg:px-10">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="hv2-eyebrow">Continue reading</p>
                <h2 className="hv2-display mt-4 text-[30px] leading-[1.1] text-[#092D54] md:text-[42px]">Related stories</h2>
              </div>
              <Link to="/news-and-insights" className="inline-flex h-11 items-center gap-2 rounded-full border border-[#D3DBE3] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174] transition-colors hover:bg-[#0E4174] hover:text-white">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RelatedCard key={r.slug} post={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <style>{`
        .press-prose { color:#3C4753; font-family:"Inter", system-ui, sans-serif; font-size:16.5px; font-weight:400; line-height:1.85; }
        .press-prose > * + * { margin-top:1.75rem; }
        .press-prose p { font-size:16.5px; line-height:1.85; }
        .press-prose h2 { font-family:"Ivy Presto", serif; color:#092D54; font-weight:600; font-size:clamp(23px,2.2vw,30px); line-height:1.2; letter-spacing:-0.01em; margin-top:3rem; }
        .press-prose h3 { font-family:"Ivy Presto", serif; color:#0E4174; font-weight:600; font-size:clamp(19px,1.6vw,22px); line-height:1.25; margin-top:2.25rem; }
        .press-prose blockquote { border-left:2px solid #0E4174; background:#F4F6F9; margin:3rem 0; padding:2rem 2rem 2rem 2.25rem; }
        .press-prose blockquote p { font-family:"Ivy Presto", serif; color:#092D54; font-weight:600; font-size:clamp(20px,2vw,26px); line-height:1.4; margin:0; }
        .press-prose blockquote cite { display:block; margin-top:1.25rem; font-family:"Inter", sans-serif; font-style:normal; text-transform:uppercase; letter-spacing:0.16em; font-size:11px; font-weight:600; color:#8A95A0; }
        .press-prose ul { list-style:none; margin:1.75rem 0; padding:0; }
        .press-prose ul li { position:relative; padding-left:1.75rem; font-size:16px; line-height:1.75; }
        .press-prose ul li + li { margin-top:.6rem; }
        .press-prose ul li::before { content:""; position:absolute; left:0; top:12px; width:1.1rem; height:1px; background:#0E4174; }
        .press-prose ol { padding-left:1.4rem; margin:1.75rem 0; }
        .press-prose ol li { margin-top:.5rem; }
        .press-prose strong { font-weight:700; color:#273340; }
        .press-prose em { font-style:italic; }
        .press-prose a { color:#0E4174; text-decoration:underline; text-underline-offset:2px; }
      `}</style>
    </Shell>
  );
}
