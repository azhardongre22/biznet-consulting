import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_MS = 7000;

function PressHeroSlider({ slides = [], autoPlay = true }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const count = slides.length;

  const goTo = useCallback(
    (i) => {
      if (!count) return;
      setActive(((i % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (!autoPlay || count <= 1 || paused) return undefined;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoPlay, count, next, paused]);

  if (!count) return null;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const current = slides[active];

  return (
    <section
      aria-label="Press release highlights"
      className="relative overflow-hidden bg-[#04080f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[clamp(480px,78vh,820px)] w-full sm:h-[clamp(520px,80vh,820px)] md:h-[clamp(560px,82vh,820px)]">
        {/* Slides — cross-fade + slow Ken Burns */}
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <article
              key={s.slug}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={s.image}
                alt={s.imageAlt || s.title}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter: "saturate(.92) contrast(1.02)",
                  transform: isActive ? "scale(1.04)" : "scale(1.10)",
                  transition: "transform 9000ms cubic-bezier(.22,1,.36,1)",
                }}
              />
              {/* Left → middle veil: 50% at left, 0% by center */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(4,8,15,0.5) 0%, rgba(4,8,15,0) 50%)",
                }}
              />
            </article>
          );
        })}

        {/* Copy block — keyed on `active` so the entrance replays each slide */}
        <div
          key={current.slug}
          className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:px-10 md:pb-24 md:pt-36 lg:px-[72px] lg:pb-28 xl:px-24 2xl:px-[102px]"
        >
          <div className="press-hero-rise max-w-[860px]">
            <p
              className="mb-5 font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.36em] text-white sm:mb-7 sm:text-[11px] sm:tracking-[0.42em]"
              style={{ animationDelay: "120ms" }}
            >
              <span className="mr-3 inline-block h-px w-6 align-middle bg-white sm:w-8" />
              {current.slideKicker || current.category}
            </p>

            <h1
              className="font-['Ivy_Presto'] text-[clamp(28px,5.5vw,44px)] font-light leading-[0.96] tracking-[-0.03em] text-white sm:text-4xl"
              style={{ animationDelay: "200ms" }}
            >
              {current.slideHeading || current.title}
            </h1>

            <div
              className="mb-5 mt-6 h-px w-[48px] bg-white sm:mb-7 sm:mt-9 sm:w-[64px]"
              style={{ animationDelay: "320ms" }}
            />

            <div className="mt-2.5 max-w-[430px] space-y-2.5 whitespace-normal break-words text-justify font-['Aktiv_Grotesk'] text-[13.5px] font-bold leading-[1.75] text-white [hyphens:auto] [overflow-wrap:anywhere] [word-break:break-word] [word-spacing:-0.04em] sm:mt-3 sm:space-y-3 sm:text-[14.5px] lg:max-w-[320px] xl:max-w-[420px]">
              {(Array.isArray(current.excerpt)
                ? current.excerpt
                : [current.excerpt]
              ).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div
              className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7"
              style={{ animationDelay: "500ms" }}
            >
              <Link
                to={`/news-and-insights/${current.slug}`}
                className="group inline-flex min-h-[46px] w-full items-center justify-center gap-3 border border-white bg-white/[0.04] px-6 font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.32em] text-white backdrop-blur-md transition-all duration-500 hover:bg-white hover:text-[#0E4174] sm:min-h-[50px] sm:w-auto sm:justify-start sm:px-8 sm:text-[11px]"
              >
                <span>{current.slideCta || "Read the story"}</span>
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <span className="inline-flex items-center bg-[#04080f]/70 px-4 py-2.5 font-['Aktiv_Grotesk'] text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md sm:px-5 sm:py-3">
                {current.date} · {current.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Slide index — top-right (tablet+) */}
        <div className="pointer-events-none absolute right-5 top-24 z-20 hidden flex-col items-end gap-3 sm:right-8 sm:top-32 md:flex md:right-10 md:top-36 lg:right-[72px] xl:right-24 2xl:right-[102px]">
          <span
            className="font-['Ivy_Presto'] text-[36px] font-bold leading-none text-white md:text-[44px]"
            aria-hidden
          >
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="h-10 w-px bg-white/40 md:h-12" aria-hidden />
          <span className="font-['Aktiv_Grotesk'] text-[11px] font-bold uppercase tracking-[0.32em] text-white">
            of {String(count).padStart(2, "0")}
          </span>
        </div>

        {/* Prev / Next — quieter, line-only */}
        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 mx-auto hidden w-full max-w-[1440px] px-5 sm:px-8 md:flex md:items-center md:justify-end md:px-10 lg:px-[72px] xl:px-24 2xl:px-[102px]">
            <div className="pointer-events-auto flex items-center gap-6 font-['Aktiv_Grotesk'] text-[11px] font-bold uppercase tracking-[0.32em] text-white">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="group inline-flex cursor-pointer items-center gap-2 transition"
              >
                <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1">
                  ←
                </span>
                <span>Prev</span>
              </button>
              <span className="h-3 w-px bg-white/35" aria-hidden />
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="group inline-flex cursor-pointer items-center gap-2 transition"
              >
                <span>Next</span>
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Pagination — segmented lines, more editorial than dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-8 md:left-10 md:translate-x-0 lg:left-[72px] xl:left-24 2xl:left-[102px]">
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive}
                className="group relative h-6 cursor-pointer"
                style={{ width: isActive ? 56 : 28 }}
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/30" />
                {isActive ? (
                  <span
                    key={`${i}-${paused ? "p" : "r"}`}
                    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white"
                    style={{
                      width: paused ? "100%" : "0%",
                      animation: paused
                        ? "none"
                        : `biznet-press-progress ${AUTOPLAY_MS}ms linear forwards`,
                    }}
                  />
                ) : (
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/0 transition-colors duration-500 group-hover:bg-white/55" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes biznet-press-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes biznet-press-rise {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .press-hero-rise > * {
          opacity: 0;
          animation: biznet-press-rise 900ms cubic-bezier(.22,1,.36,1) forwards;
        }
      `}</style>
    </section>
  );
}

export default PressHeroSlider;
