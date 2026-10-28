import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ABOUT } from "./content";

/**
 * HomeAbout — editorial white "About" split. Serif headline on the left with
 * a narrow measure of copy and a circle CTA; a tall framed portrait on the
 * right with a clipped reveal + gentle y-parallax.
 */
export default function HomeAbout() {
  return (
    <section className="hv2-section relative">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-16 lg:px-10">
        {/* Left */}
        <div className="lg:col-span-7">
          <p data-reveal className="hv2-eyebrow">{ABOUT.eyebrow}</p>

          <h2 data-reveal className="hv2-display mt-6 text-[36px] leading-[1.08] text-[#092D54] sm:text-[46px] md:text-[56px]">
            {ABOUT.heading}
          </h2>

          <span data-rule aria-hidden="true" className="hv2-rule mt-7 w-[90px] origin-left" />

          <div className="mt-8 max-w-[480px]">
            {ABOUT.paragraphs.map((p) => (
              <p key={p} data-reveal className="mb-4 text-[15.5px] leading-[1.8] text-[#596573]">
                {p}
              </p>
            ))}

            <Link
              to={ABOUT.cta.to}
              data-reveal
              className="group mt-6 inline-flex items-center gap-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0E4174]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0E4174]/35 transition-colors group-hover:border-[#0E4174] group-hover:bg-[#0E4174]">
                <ArrowUpRight
                  size={18}
                  className="text-[#0E4174] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </span>
              {ABOUT.cta.label}
            </Link>
          </div>
        </div>

        {/* Right — tall framed portrait */}
        <div className="lg:col-span-5 lg:pt-10">
          <div
            data-clip
            data-parallax="8"
            className="hv2-parallax hv2-frame mx-auto aspect-[3/4] w-full max-w-[400px] lg:mr-0"
          >
            <div className="hv2-parallax__inner" data-parallax-inner>
              <img src={ABOUT.image} alt={ABOUT.imageAlt} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
