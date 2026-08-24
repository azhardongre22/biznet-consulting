import { Suspense, lazy, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PressCard from "../components/press/PressCard";
import { fetchPressArticle, fetchPressList } from "../lib/cms";
import { EnglishOnly } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

const HEAD = "#0E4174";

// CMS article bodies are sanitized HTML from /api/cms/press-releases/:slug.
function ArticleBody({ body }) {
  if (typeof body === "string" && body.trim()) {
    return (
      <div
        className="press-prose"
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>
    );
  }
  return null;
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

// Social share icons — compact inline glyphs (no external deps).
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

// Sidebar share rail. Uses the live page URL and standard share intents.
function ShareRail({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent;

  const links = [
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      key: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      key: "whatsapp",
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${enc(`${title} ${url}`)}`,
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const btn =
    "grid h-9 w-9 place-items-center rounded-full border border-[#d8d2c6] text-[#615c54] transition-colors hover:border-transparent hover:bg-[#0E4174] hover:text-white";

  return (
    <div className="border-t border-[#e6e1d6] pt-9">
      <p className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#77736a]">
        Share
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {links.map((l) => (
          <a
            key={l.key}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            className={btn}
          >
            {SHARE_ICONS[l.key]}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={btn}
        >
          {SHARE_ICONS.link}
        </button>
        {copied ? (
          <span className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.22em] text-[#0E4174]">
            Copied
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function PressArticle() {
  const { slug } = useParams();
  // "loading" | "ready" | "notfound"
  const [status, setStatus] = useState("loading");
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  // Previous / next articles in the newsroom feed (newest-first order).
  const [neighbors, setNeighbors] = useState({ prev: null, next: null });

  useEffect(() => {
    let alive = true;
    setStatus("loading");

    (async () => {
      try {
        const res = await fetchPressArticle(slug);
        if (!alive) return;
        if (res.notFound || !res.article) {
          setStatus("notfound");
          return;
        }
        setArticle(res.article);
        setRelated(res.related || []);
        setStatus("ready");
      } catch (err) {
        console.warn("[press] CMS unavailable:", err.message);
        if (!alive) return;
        setStatus("notfound");
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  // Resolve prev/next from the full list so the arrows walk the whole feed.
  // List is newest-first: prev = newer (idx-1), next = older (idx+1).
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await fetchPressList();
        if (!alive) return;
        const idx = items.findIndex((i) => i.slug === slug);
        setNeighbors(
          idx === -1
            ? { prev: null, next: null }
            : {
                prev: idx > 0 ? items[idx - 1] : null,
                next: idx < items.length - 1 ? items[idx + 1] : null,
              },
        );
      } catch {
        if (alive) setNeighbors({ prev: null, next: null });
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
        {/* HERO — left-aligned editorial masthead (gap under 68px navbar) */}
        <section className="relative mt-[68px] px-5 pt-9 sm:px-8 sm:pt-12 md:pt-14">
          <div className="mx-auto w-full max-w-[1120px]">
            {/* Breadcrumb + category rail */}
            <div className="flex items-center justify-between gap-4 pb-7">
              <Link
                to="/news-and-insights"
                className="inline-flex items-center gap-2 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#77736a] transition hover:text-[#0E4174]"
              >
                <span aria-hidden>←</span> News &amp; Insights
              </Link>
              <span className="inline-flex items-center bg-[#0E4174] px-3 py-2 font-['Aktiv_Grotesk'] text-[9px] font-bold uppercase leading-none tracking-[0.28em] text-white">
                {article.category}
              </span>
            </div>

            {/* Masthead — title left, byline set to the right on large screens */}
            <div className="grid gap-7 border-t border-[#e6e1d6] pt-9 sm:pt-11 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div className="max-w-[820px]">
                <p className="flex items-center gap-3 font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.34em] text-[#77736a]">
                  <span className="h-px w-8 bg-[#0E4174]" aria-hidden />
                  {article.date}
                </p>
                <h1 className="mt-6 font-['Ivy_Presto'] text-[clamp(24px,3.2vw,38px)] font-light leading-[1.12] tracking-[-0.02em] text-[#151511]">
                  {article.title}
                </h1>
              </div>
              <div className="flex flex-col gap-1 lg:text-right">
                <span className="font-['Ivy_Presto'] text-[18px] font-light tracking-[-0.01em] text-[#0E4174]">
                  {article.author}
                </span>
                <span className="font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#77736a]">
                  {article.readTime}
                </span>
              </div>
            </div>

            {/* Hero image — full content width, squared */}
            <div className="mt-9 overflow-hidden bg-[#04080f] sm:mt-12">
              <img
                src={article.image}
                alt={article.imageAlt || article.title}
                className="h-[clamp(230px,50vw,600px)] w-full object-cover"
                style={{ filter: "saturate(.96) contrast(1.02)" }}
              />
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

              

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-[#e6e1d6] pt-10">
                <Link
                  to="/news-and-insights"
                  className="inline-flex items-center gap-2 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-[#0E4174] transition hover:text-[#163d6a]"
                >
                  <span>←</span> All Stories
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[46px] items-center gap-3 bg-[#0E4174] px-7 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-white transition hover:bg-[#163d6a]"
                >
                  <span>Connect With Biznet</span>
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

                <ShareRail title={article.title} />
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
