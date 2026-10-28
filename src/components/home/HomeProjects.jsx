import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "./content";

/**
 * HomeProjects — the portfolio's development types, each shown with a real
 * Biznet project and linking to its section on /projects.
 */
export default function HomeProjects() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[560px]">
            <p data-reveal className="hv2-eyebrow">{PROJECTS.eyebrow}</p>
            <h2 data-reveal className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[52px]">
              {PROJECTS.heading}
            </h2>
            <p data-reveal className="mt-5 text-[15px] leading-relaxed text-[#596573]">
              {PROJECTS.intro}
            </p>
          </div>
          <Link
            to={PROJECTS.cta.to}
            data-reveal
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#0E4174] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0b3560] md:self-auto"
          >
            {PROJECTS.cta.label}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3 lg:gap-x-10">
          {PROJECTS.items.map((p) => (
            <Link
              key={p.id}
              to={p.to}
              data-reveal-item
              aria-label={`${p.title} — view projects`}
              className="group flex h-full flex-col"
            >
              <figure className="flex h-full flex-col">
                <div
                  className="hv2-parallax hv2-frame aspect-[4/5] w-full"
                  data-parallax="6"
                >
                  <div className="hv2-parallax__inner" data-parallax-inner>
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                      style={{ objectPosition: p.focus }}
                    />
                  </div>
                  {/* legibility wash for the overlaid label */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06182c]/80 to-transparent"
                  />
                  <figcaption className="absolute bottom-5 left-5 right-5">
                    <p className="hv2-display text-[24px] leading-[1.1] text-white md:text-[26px]">
                      {p.title}
                    </p>
                  </figcaption>
                </div>
                <p className="mt-5 max-w-[440px] flex-1 text-[14px] leading-[1.7] text-[#596573]">
                  {p.summary}
                </p>
                <span className="mt-4 inline-flex self-start items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]">
                  <span className="border-b border-[#0E4174]/40 pb-0.5 transition-colors duration-300 group-hover:border-[#0E4174]">
                    View projects
                  </span>
                  <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
