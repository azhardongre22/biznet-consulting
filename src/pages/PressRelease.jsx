import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PressHeroSlider from "../components/press/PressHeroSlider";
import PressCard from "../components/press/PressCard";
import { fetchPressList } from "../lib/cms";
// Bundled data — used as an offline fallback so the page never breaks if the
// CMS API is unreachable.
import { PRESS_RELEASES } from "../data/pressReleases";
import { EnglishOnly } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

const HEAD = "#0E4174";

/**
 * Horizontal page gutter.
 * FloatingSocials is fixed flush-left from lg+ (~31px icons), so left/right
 * padding steps up there to keep content clear across devices:
 *  phone → tablet → small laptop → large laptop / desktop
 */
const PAGE_X = "px-5 sm:px-8 md:px-10 lg:px-[72px] xl:px-24 2xl:px-[102px]";

// Hidden for now — set to true to restore the sticky bottom ticker.
const SHOW_NEWS_TICKER = false;

const TICKER_ITEMS = [
  "UAE economy remains resilient with continued non-oil growth momentum",
  "Dubai business confidence supported by strong trade, tourism and investment activity",
  "UAE government platforms continue to highlight national economic and development updates",
  "Central Bank outlook points to sustained expansion across diversified sectors",
  "UAE reinforces its position as a regional destination for investment, enterprise and real estate",
];

function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-3 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.36em] text-[#0E4174] ${className}`}
    >
      <span className="h-px w-[22px] bg-current opacity-50" />
      {children}
    </span>
  );
}

// Full-height state shell (keeps the navbar + consistent background).
function StateShell({ children }) {
  return (
    <EnglishOnly>
      <Navbar />
      <main
        className={`relative mt-[68px] flex min-h-screen items-center justify-center bg-white font-['Aktiv_Grotesk'] text-[#151511] ${PAGE_X}`}
      >
        {children}
      </main>
    </EnglishOnly>
  );
}

export default function PressRelease() {
  // "loading" | "ready"  — on API failure we fall back to bundled data and
  // still render (status becomes "ready"), so the public page never breaks.
  const [status, setStatus] = useState("loading");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await fetchPressList();
        if (!alive) return;
        setArticles(items.length ? items : PRESS_RELEASES);
      } catch (err) {
        // Graceful fallback — keep the site working if the CMS is down.
        console.warn(
          "[press] CMS unavailable, using bundled data:",
          err.message,
        );
        if (!alive) return;
        setArticles(PRESS_RELEASES);
      } finally {
        if (alive) setStatus("ready");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <StateShell>
        <div className="flex flex-col items-center gap-4 text-[#615c54]">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e1d6] border-t-[#0E4174]"
            aria-hidden
          />
          <p className="font-['Aktiv_Grotesk'] text-[11px] font-medium uppercase tracking-[0.3em]">
            Loading newsroom…
          </p>
        </div>
      </StateShell>
    );
  }

  const pressArticles = articles.filter((p) => p.group === "press");
  const ceoArticles = articles.filter((p) => p.group === "ceo");

  if (!pressArticles.length && !ceoArticles.length) {
    return (
      <StateShell>
        <div className="max-w-[520px] text-center">
          <Eyebrow className="justify-center">Newsroom</Eyebrow>
          <h1
            className="mt-5 font-['Ivy_Presto'] text-[clamp(28px,4vw,44px)] font-light leading-[1.05] tracking-[-0.02em]"
            style={{ color: HEAD }}
          >
            No press releases yet
          </h1>
          <p className="mt-4 font-['Aktiv_Grotesk'] text-[15px] font-light leading-[1.8] text-[#615c54]">
            Announcements and CEO posts will appear here soon. Please check
            back.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex min-h-[46px] items-center gap-3 bg-[#0E4174] px-7 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] text-white transition hover:bg-[#163d6a]"
          >
            Contact the Newsroom <span>→</span>
          </Link>
        </div>
      </StateShell>
    );
  }

  const featured = pressArticles.filter((p) => p.featured).slice(0, 5);
  const latest = pressArticles.slice(0, 4);
  const featureRow = pressArticles.slice(1, 3);
  const popular = pressArticles.slice(0, 4);

  return (
    <EnglishOnly>
      <Navbar />

      <main className="relative min-h-screen bg-white font-['Aktiv_Grotesk'] text-[#151511]">
        {/* HERO SLIDER — proper gap below the fixed 68px navbar */}
        <div className="mt-[68px]">
          {featured.length ? <PressHeroSlider slides={featured} /> : null}
        </div>

        {/* SECTION HEAD — LATEST */}
        <section
          id="latest"
          className={`flex flex-col items-start justify-between gap-5 border-y border-[#e6e1d6] py-8 sm:flex-row sm:items-end sm:gap-6 sm:py-9 md:py-10 ${PAGE_X}`}
        >
          <div className="min-w-0">
            <Eyebrow>Newsroom</Eyebrow>
            <h2
              className="mt-4 font-['Ivy_Presto'] text-[clamp(26px,3.2vw,40px)] font-light leading-[1] tracking-[-0.02em]"
              style={{ color: HEAD }}
            >
              Featured Insights
            </h2>
          </div>
          <a
            href="#journal"
            className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center border border-[#e6e1d6] px-6 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] transition-all duration-500 hover:bg-[#0E4174] hover:text-white sm:min-h-[46px] sm:w-auto sm:px-7"
            // style={{ color: HEAD }}
          >
            Explore Journal
          </a>
        </section>

        {/* LATEST GRID — 1 col phone, 2 col tablet/small laptop, 4 col large laptop+ */}
        <section
          aria-label="Latest press releases"
          className={`grid grid-cols-1 border-b border-[#e6e1d6] sm:grid-cols-2 xl:grid-cols-4 ${PAGE_X}`}
        >
          {latest.map((post, i) => {
            const isLast = i === latest.length - 1;
            const cellClasses = [
              isLast ? "" : "border-b border-[#e6e1d6]",
              i % 2 === 0 ? "sm:border-r sm:border-[#e6e1d6]" : "",
              i >= 2 ? "sm:border-b-0" : "",
              // On xl 4-col: right border on all but last; drop bottom borders
              i < latest.length - 1 ? "xl:border-r xl:border-[#e6e1d6]" : "",
              "xl:border-b-0",
              // At sm–lg (2-col), restore bottom border for first row only
              i < 2 ? "sm:border-b sm:border-[#e6e1d6] xl:border-b-0" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={post.slug}
                className={`px-0 pb-10 pt-9 sm:px-5 sm:pb-11 sm:pt-10 md:px-6 lg:px-7 ${cellClasses}`}
              >
                <PressCard post={post} variant="standard" />
              </div>
            );
          })}
        </section>

        {/* POPULAR + FEATURED — stack → 2-up features → 3-col on large laptops */}
        <section
          id="journal"
          className={`grid grid-cols-1 gap-12 border-b border-[#e6e1d6] py-14 sm:py-16 md:gap-14 md:py-20 xl:grid-cols-[0.9fr_1.25fr_1.25fr] xl:gap-0 xl:py-24 ${PAGE_X}`}
        >
          <aside className="min-w-0 xl:border-r xl:border-[#e6e1d6] xl:pr-12">
            <h2
              className="mb-8 mt-4 font-['Ivy_Presto'] text-[clamp(22px,2.4vw,24px)] font-light leading-[1.1] sm:mb-9"
              style={{ color: HEAD }}
            >
              Popular right now
            </h2>
            <ul className="space-y-6 sm:space-y-7">
              {popular.map((post) => (
                <li key={`popular-${post.slug}`}>
                  <PressCard post={post} variant="compact" />
                </li>
              ))}
            </ul>
          </aside>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 xl:contents">
            {featureRow.map((post, idx) => (
              <PressCard
                key={`feature-${post.slug}`}
                post={post}
                variant="feature"
                className={idx === 0 ? "min-w-0 xl:pl-12" : "min-w-0 xl:pl-10"}
              />
            ))}
          </div>
        </section>

        {/* CEO POSTS — From the Visionary */}
        {ceoArticles.length ? (
          <section
            aria-label="CEO Posts"
            className={`border-b border-[#e6e1d6] py-14 sm:py-16 md:py-20 xl:py-24 ${PAGE_X}`}
          >
            <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:mb-12 sm:gap-6 md:mb-14 md:flex-row md:items-end">
              <div className="min-w-0 max-w-[640px]">
                <Eyebrow>From the Visionary</Eyebrow>
                <h2
                  className="mt-5 font-['Ivy_Presto'] text-[clamp(28px,3.6vw,52px)] font-light leading-[1.02] tracking-[-0.02em]"
                  style={{ color: HEAD }}
                >
                  CEO Posts
                </h2>
                <p className="mt-5 max-w-[560px] font-['Aktiv_Grotesk'] text-[14px] font-light leading-[1.8] text-[#615c54] sm:text-[15px]">
                  Letters, reflections and field notes from our CEO — on
                  leadership, long-horizon thinking, and the discipline behind
                  every Biznet engagement.
                </p>
              </div>
              {ceoArticles[0] ? (
                <Link
                  to={`/news-and-insights/${ceoArticles[0].slug}`}
                  className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center border border-[#e6e1d6] px-6 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.32em] transition-all duration-500 hover:bg-[#0E4174] hover:text-white sm:min-h-[46px] sm:w-auto sm:px-7"
                  style={{ color: HEAD }}
                >
                  Read Latest Letter →
                </Link>
              ) : null}
            </div>

            {/* 1 col phone, 2 col tablet, 3 col laptop+ */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
              {ceoArticles.slice(0, 3).map((post) => (
                <PressCard key={post.slug} post={post} variant="ceo" />
              ))}
            </div>
          </section>
        ) : null}

        {/* MEDIA INQUIRIES */}
        <section
          id="contact"
          className={`grid grid-cols-1 border-b border-[#e6e1d6] xl:grid-cols-2 ${PAGE_X}`}
        >
          <div className="py-14 sm:py-16 md:py-20 xl:py-24 xl:pr-10 2xl:pr-12">
            <Eyebrow>Media Inquiries</Eyebrow>
            <h2
              className="mt-5 font-['Ivy_Presto'] text-[clamp(28px,4vw,60px)] font-light leading-[1.02] tracking-[-0.02em]"
              style={{ color: HEAD }}
            >
              For press, interviews and corporate announcements.
            </h2>
            <p className="mt-6 max-w-[560px] font-['Aktiv_Grotesk'] text-[14px] font-light leading-[1.8] text-[#615c54] sm:mt-7 sm:text-[15px]">
              Use this section for journalist requests, partner announcements,
              official statements, executive commentary, and future downloadable
              press assets.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center gap-3 bg-[#0E4174] px-6 font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.34em] text-white transition hover:bg-[#163d6a] sm:mt-9 sm:min-h-[50px] sm:w-auto sm:justify-start sm:px-8"
            >
              <span>Contact the Newsroom</span>
              <span>→</span>
            </Link>
          </div>
          <div className="grid gap-0 border-t border-[#e6e1d6] py-14 sm:py-16 md:py-20 xl:border-l xl:border-t-0 xl:py-24 xl:pl-10 2xl:pl-12">
            {[
              ["Company", "Biznet Consulting"],
              ["Email", "hello@biznetconsulting.ae"],
              ["Website", "biznetconsulting.ae"],
              [
                "Focus",
                "Strategy · Development · Branding · Feasibility · Execution",
              ],
            ].map(([k, v], idx) => (
              <div
                key={k}
                className={`grid grid-cols-1 gap-2 py-5 sm:grid-cols-[140px_1fr] sm:gap-5 sm:py-6 md:grid-cols-[160px_1fr] md:gap-6 ${
                  idx === 0 ? "" : "border-t border-[#e6e1d6]"
                }`}
              >
                <small className="font-['Aktiv_Grotesk'] text-[10px] font-medium uppercase tracking-[0.3em] text-[#77736a]">
                  {k}
                </small>
                <strong
                  className="break-words font-['Ivy_Presto'] text-[16px] font-light tracking-[-0.01em] sm:text-[18px]"
                  style={{ color: HEAD }}
                >
                  {v}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        {/* Spacer so the fixed ticker never sits on top of footer content */}
        {SHOW_NEWS_TICKER && <div aria-hidden className="h-[60px]" />}
      </main>

      {/* STICKY BOTTOM NEWS TICKER — hidden for now via SHOW_NEWS_TICKER */}
      {SHOW_NEWS_TICKER && (
        <>
          <aside
            aria-label="UAE news ticker"
            className="fixed inset-x-0 bottom-0 z-[200] grid h-[48px] grid-cols-[auto_1fr] overflow-hidden border-t border-black/30 bg-[#04080f] text-white sm:h-[52px]"
          >
            <div className="grid place-items-center whitespace-nowrap border-r border-white/15 bg-black px-3 font-['Aktiv_Grotesk'] text-[9px] font-medium uppercase tracking-[0.24em] sm:px-6 sm:text-[10px] sm:tracking-[0.32em]">
              UAE News
            </div>
            <div className="flex items-center overflow-hidden">
              <div
                className="flex w-max"
                style={{ animation: "biznet-press-ticker 48s linear infinite" }}
              >
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center whitespace-nowrap font-['Ivy_Presto'] text-[13px] font-light italic tracking-[0.01em] text-white/85 sm:text-[15px]"
                  >
                    {item}
                    <span className="ml-8 text-white/40 sm:ml-10">•</span>
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <style>{`
            @keyframes biznet-press-ticker {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            aside[aria-label="UAE news ticker"]:hover > div > div {
              animation-play-state: paused !important;
            }
          `}</style>
        </>
      )}
    </EnglishOnly>
  );
}
