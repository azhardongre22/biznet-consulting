import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { HERO } from "./content";

/**
 * HomeHero — original editorial hero. A full-bleed Dubai skyline with a
 * serif (Ivy Presto) headline revealed line by line behind a solid-white
 * navigation. No outlined/solid wordmark stack — the headline is a real
 * sentence, carried by the brand serif.
 */
export default function HomeHero() {
  return (
    <section
      data-hero
      className="relative flex min-h-[620px] w-full items-end overflow-hidden mt-14"
      style={{ height: "clamp(620px, 92vh, 960px)" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          data-hero-image
          src={HERO.image}
          alt={HERO.imageAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
          style={{ objectPosition: "center 58%" }}
        />
      </div>

      {/* Legibility wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#06182c]/88 via-[#06182c]/30 to-[#06182c]/60"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-20 md:px-8 md:pb-28 lg:px-10 lg:pb-32">
        <p data-hero-copy className="hv2-eyebrow text-white/75">
          {HERO.eyebrow}
        </p>

        <h1 className="hv2-display mt-6 text-white">
          <span className="hv2-line-mask text-[38px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px]">
            <span data-hero-line className="hv2-display--light block leading-[1.08]">
              From land to landmark,
            </span>
          </span>
          <span className="hv2-line-mask text-[38px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px]">
            <span data-hero-line className="block leading-[1.08]">
              Development Consultancy
            </span>
          </span>
        </h1>

        <span
          data-hero-rule
          aria-hidden="true"
          className="mt-7 block h-[2px] w-[120px] origin-left bg-white/80"
        />

        <p data-hero-copy className="mt-7 max-w-[540px] text-[15px] leading-relaxed text-white/85 md:text-[17px]">
          {HERO.description}
        </p>

        <div data-hero-copy className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Link
            to={HERO.cta.to}
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0E4174] transition-colors hover:bg-[#0E4174] hover:text-white"
          >
            {HERO.cta.label}
          </Link>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {HERO.services.map((s, i) => (
              <span key={s.to} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/35">/</span>}
                <Link to={s.to} className="transition-colors hover:text-white">
                  {s.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
