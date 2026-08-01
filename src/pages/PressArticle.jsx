import { Suspense, lazy, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PressCard from "../components/press/PressCard";
import { fetchPressArticle } from "../lib/cms";
// Bundled fallback so a CMS outage never breaks the article page.
import { getArticleBySlug, getRelatedArticles } from "../data/pressReleases";
import { EnglishOnly } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

const HEAD = "#0E4174";

// Renders the article body. The CMS sends sanitized HTML (already run through a
// strict server-side allowlist), while the bundled fallback uses a block array.
// We support both shapes.
function ArticleBody({ body }) {
  if (typeof body === "string") {
    return (
      <div
        className="press-prose"
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>
    );
  }

  const blocks = Array.isArray(body) ? body : [];
  return (
    <div className="space-y-8 font-['Aktiv_Grotesk'] text-[17px] font-light leading-[1.92] text-[#2a2a26]">
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="text-[17px] leading-[1.92]">
              {block}
            </p>
          );
        }
        if (block.h) {
          return (
            <h2
              key={i}
              className="mt-14 font-['Ivy_Presto'] text-[clamp(24px,2.4vw,32px)] font-light leading-[1.18] tracking-[-0.02em]"
              style={{ color: HEAD }}
            >
              {block.h}
            </h2>
          );
        }
        if (block.quote) {
          return (
            <figure
              key={i}
              className="my-14 border-l-2 border-[#0E4174] bg-[#fbfaf6] py-10 pl-10 pr-8"
            >
              <blockquote
                className="font-['Ivy_Presto'] text-[clamp(22px,2.1vw,28px)] font-light italic leading-[1.42]"
                style={{ color: HEAD }}
              >
                “{block.quote}”
              </blockquote>
              {block.by ? (
                <figcaption className="mt-6 flex items-center gap-3 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#77736a]">
                  <span className="h-px w-8 bg-[#77736a]/60" />
                  {block.by}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        if (block.list?.length) {
          return (
            <ul key={i} className="my-2 space-y-3 pl-0">
              {block.list.map((li, idx) => (
                <li
                  key={idx}
                  className="relative pl-9 text-[16.5px] font-light leading-[1.8] text-[#2a2a26]"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[14px] h-px w-6 bg-[#0E4174]"
                  />
                  {li}
                </li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

function LoadingShell() {
  return (
    <EnglishOnly>
      <Navbar />
      <main className="relative flex min-h-screen items-center justify-center bg-white px-6 pt-[68px] font-['Aktiv_Grotesk'] text-[#151511]">
        <div className="flex flex-col items-center gap-4 text-[#615c54]">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e1d6] border-t-[#0E4174]"
            aria-hidden
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.3em]">
            Loading article…
          </p>
        </div>
      </main>
    </EnglishOnly>
  );
}

export default function PressArticle() {
  const { slug } = useParams();
  // "loading" | "ready" | "notfound"
  const [status, setStatus] = useState("loading");
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let alive = true;
    setStatus("loading");

    // Fall back to the bundled copy of this article, if we have one.
    const useFallback = () => {
      const a = getArticleBySlug(slug);
      if (!alive) return;
      if (a) {
        setArticle(a);
        setRelated(getRelatedArticles(slug, 3));
        setStatus("ready");
      } else {
        setStatus("notfound");
      }
    };

    (async () => {
      try {
        const res = await fetchPressArticle(slug);
        if (!alive) return;
        if (res.notFound) {
          // Published article genuinely not in the CMS → try bundled, else 404.
          useFallback();
          return;
        }
        setArticle(res.article);
        setRelated(res.related);
        setStatus("ready");
      } catch (err) {
        console.warn(
          "[press] CMS unavailable, using bundled data:",
          err.message,
        );
        useFallback();
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (status === "loading") return <LoadingShell />;
  if (status === "notfound" || !article) {
    return <Navigate to="/news-and-insights" replace />;
  }

  return (
    <EnglishOnly>
      <Navbar />

      <main className="relative min-h-screen bg-white font-headline text-[#151511]">
        {/* HERO — gap below 68px navbar */}
        <section className="relative mt-[68px]">
          <div className="relative h-[clamp(460px,72vh,720px)] w-full overflow-hidden bg-[#04080f]">
            <img
              src={article.image}
              alt={article.imageAlt || article.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(.92) contrast(1.02)" }}
            />
            {/* Left → middle veil: 50% at left, 0% by center */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(4,8,15,0.5) 0%, rgba(4,8,15,0) 50%)",
              }}
            />

            <div className="relative z-10 flex h-full w-full max-w-[1440px] flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20 md:px-10 md:pb-24 lg:px-[72px] xl:px-24 2xl:px-[102px]">
              <div className="max-w-[420px] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[540px]">
                <Link
                  to="/news-and-insights"
                  className="mb-7 flex w-fit items-center gap-2 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-white transition"
                >
                  <span>←</span> Back to Newsroom
                </Link>

                <span className="inline-flex w-fit items-center gap-2 bg-[#0E4174] px-3 py-2 font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white">
                  {article.category}
                </span>

                <h1 className="mt-2 font-headline text-[18px] font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-[22px] md:text-[24px] lg:text-[28px]">
                  {article.title}
                </h1>

                <div className="mt-6 h-px w-[64px] bg-white" />

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.3em] text-white sm:text-[11px]">
                  <span>{article.author}</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white sm:inline-block" />
                  <time dateTime={article.isoDate}>{article.date}</time>
                  <span className="hidden h-1 w-1 rounded-full bg-white sm:inline-block" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:pt-14 md:pb-24">
          <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-14 lg:grid-cols-[1fr_240px]">
            <article className="min-w-0">
              <p className="mb-10 font-['Ivy_Presto'] text-[clamp(20px,1.8vw,24px)] font-light italic leading-[1.5] text-[#3d3a34]">
                {article.excerpt}
              </p>
              <div className="mb-12 h-px w-[64px] bg-[#0E4174]" />
              <ArticleBody body={article.body} />

              <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-[#e6e1d6] pt-10">
                <Link
                  to="/news-and-insights"
                  className="inline-flex items-center gap-2 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#0E4174] transition hover:text-[#163d6a]"
                >
                  <span>←</span> All Press Releases
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[46px] items-center gap-3 bg-[#0E4174] px-7 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-white transition hover:bg-[#163d6a]"
                >
                  <span>Media Inquiries</span>
                  <span>→</span>
                </Link>
              </div>
            </article>

            {/* Sidebar — sticky meta + share rail */}
            <aside className="hidden lg:block">
              <div className="sticky top-[96px] flex flex-col gap-9">
                {[
                  ["Published", article.date],
                  ["Source", article.author],
                  ["Category", article.category],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#77736a]">
                      {k}
                    </p>
                    <p
                      className="mt-3 font-['Ivy_Presto'] text-[17px] font-light leading-[1.32] tracking-[-0.01em]"
                      style={{ color: HEAD }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED */}
        {related.length ? (
          <section className="border-t border-[#e6e1d6] bg-[#fbfaf6] px-5 py-20 sm:px-8 md:px-12 lg:px-16 lg:py-24">
            <div className="mx-auto w-full max-w-[1280px]">
              <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="inline-flex items-center gap-3 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.36em] text-[#0E4174]">
                    <span className="h-px w-[22px] bg-current opacity-50" />
                    Continue Reading
                  </span>
                  <h2
                    className="mt-4 font-['Ivy_Presto'] text-[clamp(28px,3.2vw,44px)] font-light leading-[1.05] tracking-[-0.02em]"
                    style={{ color: HEAD }}
                  >
                    Related stories
                  </h2>
                </div>
                <Link
                  to="/news-and-insights"
                  className="inline-flex min-h-[46px] items-center gap-2 border border-[#e6e1d6] px-7 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] transition-all duration-500 hover:bg-[#0E4174] hover:text-white"
                  style={{ color: HEAD }}
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
                {related.map((r) => (
                  <PressCard key={r.slug} post={r} variant="feature" />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>

      {/* Editorial styling for CMS HTML bodies. Mirrors the block-array look. */}
      <style>{`
        .press-prose { color:#2a2a26; font-family:"Aktiv Grotesk", system-ui, sans-serif; font-size:17px; font-weight:300; line-height:1.92; }
        .press-prose > * + * { margin-top:2rem; }
        .press-prose p { font-size:17px; line-height:1.92; }
        .press-prose h2 {
          font-family:"Ivy Presto", serif; color:#0E4174; font-weight:300;
          font-size:clamp(24px,2.4vw,32px); line-height:1.18; letter-spacing:-0.02em; margin-top:3.5rem;
        }
        .press-prose blockquote {
          border-left:2px solid #0E4174; background:#fbfaf6; margin:3.5rem 0; padding:2.5rem 2rem 2.5rem 2.5rem;
        }
        .press-prose blockquote p {
          font-family:"Ivy Presto", serif; color:#0E4174; font-style:italic; font-weight:300;
          font-size:clamp(22px,2.1vw,28px); line-height:1.42; margin:0;
        }
        .press-prose blockquote cite {
          display:block; margin-top:1.5rem; font-family:"Aktiv Grotesk", sans-serif; font-style:normal;
          text-transform:uppercase; letter-spacing:0.32em; font-size:10px; font-weight:500; color:#77736a;
        }
        .press-prose ul { list-style:none; margin:2rem 0; padding:0; }
        .press-prose ul li { position:relative; padding-left:2.25rem; font-size:16.5px; font-weight:300; line-height:1.8; }
        .press-prose ul li + li { margin-top:.75rem; }
        .press-prose ul li::before { content:""; position:absolute; left:0; top:14px; width:1.5rem; height:1px; background:#0E4174; }
        .press-prose ol { padding-left:1.5rem; margin:2rem 0; }
        .press-prose ol li { margin-top:.5rem; }
        .press-prose strong { font-weight:600; }
        .press-prose em { font-style:italic; }
        .press-prose a { color:#0E4174; text-decoration:underline; }
      `}</style>
    </EnglishOnly>
  );
}
