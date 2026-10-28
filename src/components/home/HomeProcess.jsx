import { PROCESS } from "./content";

/**
 * HomeProcess — four sequential process steps as large serif numerals with
 * small-caps labels. Sequential capabilities, not metrics (no count-up).
 */
export default function HomeProcess() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-20 lg:px-10">
        <p data-reveal className="hv2-eyebrow">{PROCESS.eyebrow}</p>
        <h2 data-reveal className="hv2-display mb-10 mt-5 max-w-[620px] text-[30px] leading-[1.1] text-[#092D54] md:mb-14 md:text-[42px]">
          {PROCESS.heading}
        </h2>
        <div data-reveal-stagger className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-10">
          {PROCESS.items.map((item) => (
            <div key={item.number} data-reveal-item className="border-t border-[#E5EAF0] pt-6">
              <span className="hv2-display block text-[58px] leading-none text-[#0E4174] md:text-[80px]">
                {item.number}
              </span>
              <h3 className="mt-5 text-[12px] font-bold uppercase tracking-[0.18em] text-[#092D54]">
                {item.label}
              </h3>
              <p className="mt-2.5 max-w-[240px] text-[13px] leading-[1.6] text-[#8A95A0]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
