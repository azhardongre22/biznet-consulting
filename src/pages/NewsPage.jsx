import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import "../styles/site.css";
import Navbar from "../components/layout/Navbar";
import { fetchPressList, getCachedPressList } from "../lib/cms";
import usePageSeo from "../hooks/usePageSeo";
import { PATHS, articlePath } from "../data/seoData";
import { itemListSchema } from "../seo/schema";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";

// Two editorial categories only (no "Press Release" tab).
const CATEGORIES = ["News", "Blog"];

// Normalise whatever `category` an item carries into News / Blog. Tolerant of
// casing and label drift. Announcements / press / corporate news → News;
// everything else (articles, insights, opinion) → Blog.
function normalizeCategory(raw) {
  const v = String(raw || "").toLowerCase();
  if (
    v.includes("news") ||
    v.includes("press") ||
    v.includes("release") ||
    v.includes("announce") ||
    v.includes("corporate")
  )
    return "News";
  return "Blog";
}

function ArticleCard({ post }) {
  const cat = normalizeCategory(post.category);
  return (
    <Link
      to={`/news-and-insights/${post.slug}`}
      className="group flex flex-col"
    >
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
        <span className="text-[#0E4174]">{cat}</span>
        {post.date ? (
          <>
            <span className="h-1 w-1 rounded-full bg-[#CBD3DA]" />
            <span>{post.date}</span>
          </>
        ) : null}
      </div>
      <h3 className="hv2-display mt-2.5 text-[20px] leading-[1.22] text-[#111A24]">
        {post.title}
      </h3>
      {post.excerpt ? (
        <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-[1.6] text-[#8A95A0]">
          {post.excerpt}
        </p>
      ) : null}
      <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]">
        <span className="border-b border-[#0E4174]/40 pb-0.5 transition-colors duration-300 group-hover:border-[#0E4174]">
          Read more
        </span>
        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
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

export default function NewsPage() {
  const cached = getCachedPressList();
  const [status, setStatus] = useState(cached ? "ready" : "loading");
  const [articles, setArticles] = useState(cached || []);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    html.style.background = "#ffffff";
    body.style.background = "#ffffff";
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await fetchPressList();
        if (alive) setArticles(items);
      } catch (err) {
        console.warn("[press] CMS unavailable:", err.message);
        if (alive) setArticles([]);
      } finally {
        if (alive) setStatus("ready");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const pressArticles = useMemo(
    () =>
      articles
        .filter((p) => p.group === "press")
        .map((p) => ({ ...p, _category: normalizeCategory(p.category) })),
    [articles],
  );
  const ceoArticles = useMemo(() => articles.filter((p) => p.group === "ceo"), [articles]);

  usePageSeo({
    path: PATHS.news,
    ready: status === "ready",
    pageType: "CollectionPage",
    jsonLd: itemListSchema(
      "News & Insights",
      articles.map((a) => ({ name: a.title, path: articlePath(a.slug), image: a.image, description: a.excerpt })),
    ),
  });

  const counts = useMemo(() => {
    const c = { All: pressArticles.length, News: 0, Blog: 0 };
    pressArticles.forEach((p) => {
      c[p._category] += 1;
    });
    return c;
  }, [pressArticles]);

  const pool = useMemo(
    () => (filter === "All" ? pressArticles : pressArticles.filter((p) => p._category === filter)),
    [pressArticles, filter],
  );

  if (status === "loading") {
    return (
      <Shell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-[#8A95A0]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5EAF0] border-t-[#0E4174]" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">Loading newsroom…</p>
        </div>
      </Shell>
    );
  }

  if (!pressArticles.length && !ceoArticles.length) {
    return (
      <Shell>
        <section className={`${SHELL} flex min-h-[70vh] flex-col items-center justify-center pt-[90px] text-center`}>
          <p className="hv2-eyebrow">News & Insights</p>
          <h1 className="hv2-display mt-5 text-[34px] leading-[1.08] text-[#092D54] md:text-[48px]">
            Nothing published yet.
          </h1>
          <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-[#596573]">
            News and articles will appear here soon. Please check back.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
          >
            Contact Us <ArrowUpRight size={16} />
          </Link>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Header */}
      <section className={`${SHELL} pt-28 md:pt-32`}>
        <p className="hv2-eyebrow">News & Insights</p>
        <h1 className="hv2-display mt-5 text-[40px] leading-[1.06] text-[#092D54] md:text-[64px]">
          Blogs &amp; Perspectives
        </h1>
        <p className="mt-6 max-w-[640px] text-[16px] leading-relaxed text-[#596573]">
          Explore the latest perspectives, updates and stories on real estate, feasibility and
          project development across the UAE. Discover Biznet Consulting's milestones,
          projects and work shaping the future of development.
        </p>

        {/* Tabs + count */}
        <div className="mt-12 flex flex-col gap-4 border-b border-[#E5EAF0] sm:flex-row sm:items-end sm:justify-between">
          <div role="tablist" aria-label="Filter stories by category" className="-mb-px flex flex-wrap items-center gap-x-9 gap-y-3">
            {["All", ...CATEGORIES].map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`relative cursor-pointer pb-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active ? "text-[#0E4174]" : "text-[#AEB8C2] hover:text-[#596573]"
                  }`}
                >
                  {cat}
                  <span className={`absolute inset-x-0 bottom-0 h-[2px] ${active ? "bg-[#0E4174]" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
          <span className="pb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#AEB8C2]">
            {counts[filter] ?? 0} {counts[filter] === 1 ? "Entry" : "Entries"}
          </span>
        </div>
      </section>

      {/* Grid */}
      <section aria-label="Articles" className={`${SHELL} py-16 md:py-20`}>
        {pool.length ? (
          <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {pool.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="hv2-display text-[24px] text-[#092D54]">No {filter.toLowerCase()} entries yet.</p>
            <button
              type="button"
              onClick={() => setFilter("All")}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-[#D3DBE3] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174] transition-colors hover:bg-[#0E4174] hover:text-white"
            >
              View all stories
            </button>
          </div>
        )}
      </section>

      {/* From the CEO */}
      {filter === "All" && ceoArticles.length ? (
        <section aria-label="From the CEO" className={`${SHELL} border-t border-[#EEF1F4] py-16 md:py-24`}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[560px]">
              <p className="hv2-eyebrow">From the leadership</p>
              <h2 className="hv2-display mt-5 text-[30px] leading-[1.12] text-[#092D54] md:text-[42px]">
                Notes from the CEO.
              </h2>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {ceoArticles.slice(0, 3).map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Media inquiries CTA */}
      <section className={`${SHELL} border-t border-[#EEF1F4] py-24 md:py-28`}>
        <div className="border-l-2 border-[#0E4174] pl-6 md:pl-10">
          <p className="hv2-eyebrow">Media inquiries</p>
          <h2 className="hv2-display mt-5 max-w-[720px] text-[30px] leading-[1.1] text-[#092D54] md:text-[46px]">
            For press, interviews and announcements.
          </h2>
          <p className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-[#596573]">
            For journalist requests, partner announcements and official statements, reach the
            team directly.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
          >
            Contact the Newsroom <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
