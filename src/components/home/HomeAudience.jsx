import { CREDIBILITY } from "./content";

/**
 * HomeAudience — who we work with. An editorial viewpoint beside a quiet
 * numbered list of the four audience categories (an honest substitute for
 * client logos — these are audiences, not client marks). No fabricated
 * testimonials.
 */
export default function HomeAudience() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Viewpoint */}
          <div className="lg:col-span-5">
            <p data-reveal className="hv2-eyebrow">{CREDIBILITY.eyebrow}</p>
            <h2 data-reveal className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[48px]">
              {CREDIBILITY.heading}
            </h2>
            <span data-rule aria-hidden="true" className="hv2-rule mt-7 w-[90px] origin-left" />
            <p data-reveal className="mt-8 max-w-[440px] text-[16px] leading-[1.75] text-[#596573]">
              {CREDIBILITY.body}
            </p>
          </div>

          {/* Audience list */}
          <div data-reveal-stagger className="lg:col-span-7 lg:pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {CREDIBILITY.audiences.map((a, i) => (
                <div
                  key={a.name}
                  data-reveal-item
                  className="flex items-baseline gap-5 border-t border-[#E5EAF0] py-7 sm:pr-8"
                >
                  <span className="hv2-display text-[15px] text-[#AEB8C2]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="hv2-display text-[26px] leading-[1.1] text-[#1D2A3A] md:text-[30px]">
                      {a.name}
                    </h3>
                    <p className="mt-3 max-w-[280px] text-[13.5px] leading-[1.65] text-[#8A95A0]">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
