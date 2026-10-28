import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { INSIGHTS } from "./content";
import { PRESS_RELEASES } from "../../data/pressReleases";
import { fetchPressList, getCachedPressList } from "../../lib/cms";

const latestPress = (list) => list.filter((a) => a.group === "press").slice(0, 6);
const FALLBACK = latestPress(PRESS_RELEASES);

/**
 * HomeInsights — a light editorial news rail. Serif heading with prev/next
 * controls over a horizontal track of framed article cards (real CMS articles,
 * static published fallback). No dark inset panel; no invented metadata.
 */
export default function HomeInsights() {
  // Prerender passes the live CMS list in, so crawlers only see real article links.
  const [items, setItems] = useState(() => {
    const cached = getCachedPressList();
    return cached?.length ? latestPress(cached) : FALLBACK;
  });
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await fetchPressList();
        const latest = latestPress(list);
        if (alive && latest.length) setItems(latest);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };
  useEffect(() => {
    updateArrows();
  }, [items]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-news-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-reveal className="hv2-eyebrow">{INSIGHTS.eyebrow}</p>
            <h2 data-reveal className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[52px]">
              {INSIGHTS.heading}
            </h2>
            <p data-reveal className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-[#596573]">
              {INSIGHTS.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous insights"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D3DBE3] text-[#0E4174] transition-colors enabled:hover:bg-[#0E4174] enabled:hover:text-white disabled:opacity-35"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next insights"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D3DBE3] text-[#0E4174] transition-colors enabled:hover:bg-[#0E4174] enabled:hover:text-white disabled:opacity-35"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        >
          {items.map((a) => (
            <Link
              key={a.slug}
              to={`/news-and-insights/${a.slug}`}
              data-news-card
              className="group w-[80%] shrink-0 snap-start sm:w-[47%] lg:w-[31.5%]"
            >
              <div className="hv2-photo hv2-frame aspect-[4/3]">
                <img
                  src={a.image}
                  alt={a.imageAlt || a.title}
                  loading="lazy"
                  decoding="async"
                  className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A95A0]">
                <span className="text-[#0E4174]">{a.category}</span>
                <span className="h-1 w-1 rounded-full bg-[#CBD3DA]" />
                <span>{a.date}</span>
              </div>
              <h3 className="hv2-display mt-2.5 text-[20px] leading-[1.22] text-[#111A24]">
                {a.title}
              </h3>
              <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-[1.6] text-[#8A95A0]">
                {a.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            to={INSIGHTS.cta.to}
            className="inline-flex items-center gap-2 rounded-full border border-[#D3DBE3] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174] transition-colors hover:bg-[#0E4174] hover:text-white"
          >
            {INSIGHTS.cta.label}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
