import { useEffect, useRef, useState } from "react";

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";

// Headline portfolio figures (confirmed by Biznet). Shared by the homepage and
// the About page so the numbers never drift apart.
const STATS = [
  {
    end: 80,
    suffix: "+",
    label: "Projects",
    note: "Across our portfolio",
  },
  {
    end: 50,
    suffix: "+",
    label: "Private Villas",
    note: "Luxury villa projects",
  },
  {
    end: 15,
    suffix: "+",
    label: "Residential & Mixed-Use",
    note: "Residential buildings & mixed-use developments",
  },
  {
    end: 15,
    suffix: "+",
    label: "Commercial Buildings",
    note: "Warehouses, shopping malls & more",
  },
];

// Hairline dividers for the 1 → 2 → 4 column stats grid.
const STAT_BORDERS = [
  "",
  "border-t sm:border-l sm:border-t-0",
  "border-t lg:border-l lg:border-t-0",
  "border-t sm:border-l lg:border-t-0",
];

const DEFAULT_INTRO =
  "From investment-led developments and commercial properties to residential buildings and private villas, Biznet's involvement reflects the specific requirements of each project.";

// ── Count-up (animates 0 → end once in view; respects reduced motion) ────────
function CountUp({ end, duration = 1700, className = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    let cleanup;
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setValue(end);
        return;
      }
      const start = performance.now();
      let raf;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * end));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      cleanup = () => cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        }),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}

/**
 * StoryInNumbers — the portfolio figures band (count-up stats in a hairline
 * grid) under an optional centred heading. Pass `intro={null}` to drop the
 * paragraph, or `heading={null}` to show the figures alone.
 */
export default function StoryInNumbers({
  eyebrow = "Our Experience",
  heading = "Projects Across UAE",
  intro = DEFAULT_INTRO,
}) {
  const hasHeader = eyebrow || heading || intro;
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className={`${SHELL} py-20 md:py-24`}>
        {hasHeader ? (
          <div data-reveal className="mx-auto max-w-[680px] text-center">
            {eyebrow ? <p className="hv2-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 className="hv2-display mt-5 text-[30px] leading-[1.14] text-[#092D54] sm:text-[34px] md:text-[44px]">
                {heading}
              </h2>
            ) : null}
            {intro ? (
              <p className="mx-auto mt-5 max-w-[580px] text-[15px] leading-relaxed text-[#596573]">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          data-reveal
          className={`${hasHeader ? "mt-14" : ""} grid grid-cols-1 border-y border-[#E5EAF0] sm:grid-cols-2 lg:grid-cols-4`}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex min-h-[170px] flex-col items-center justify-center border-[#E5EAF0] px-4 py-8 text-center ${STAT_BORDERS[i]}`}
            >
              <div className="hv2-display flex items-end justify-center text-[42px] leading-none text-[#0E4174] md:text-[52px]">
                <CountUp end={s.end} />
                {s.suffix ? <span>{s.suffix}</span> : null}
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#092D54]">
                {s.label}
              </p>
              <p className="mt-1 max-w-[200px] text-[12px] leading-[1.5] text-[#8A95A0]">
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
