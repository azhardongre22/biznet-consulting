import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "./content";

/**
 * HomeServices — a concise overview of the core services (no in-depth
 * explanation on the homepage). Each card links to its section on /services.
 */
export default function HomeServices() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[620px]">
            <p data-reveal className="hv2-eyebrow">{SERVICES.eyebrow}</p>
            <h2 data-reveal className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[48px]">
              {SERVICES.heading}
            </h2>
            <p data-reveal className="mt-5 text-[15px] leading-relaxed text-[#596573]">
              {SERVICES.intro}
            </p>
          </div>
          <Link
            to={SERVICES.cta.to}
            data-reveal
            className="group inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
          >
            <span className="border-b border-[#0E4174]/40 pb-0.5">{SERVICES.cta.label}</span>
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-3 lg:gap-x-10">
          {SERVICES.items.map((s) => (
            <Link
              key={s.number}
              to={s.to}
              data-reveal-item
              className="group flex flex-col border-t border-[#D8E0E8] py-7 transition-colors"
            >
              <span className="hv2-display text-[14px] text-[#AEB8C2]">{s.number}</span>
              <h3 className="hv2-display mt-4 text-[23px] leading-[1.14] text-[#0E4174] transition-colors group-hover:text-[#092D54]">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[13.5px] leading-[1.65] text-[#8A95A0]">
                {s.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]">
                {s.cta}
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
