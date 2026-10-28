import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "../common/FloatingSocials";
import { SOCIAL_CLOSING } from "./content";

/**
 * HomeSocialContact — centered, airy closing field: a serif closing CTA then
 * a row of verified company social profiles. No broken embeds. The full footer
 * follows separately.
 */
export default function HomeSocialContact() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[880px] px-5 py-24 text-center md:px-8 md:py-32">
        <p data-reveal className="hv2-eyebrow">Let's talk</p>
        <h2 data-reveal className="hv2-display mx-auto mt-6 max-w-[620px] text-[36px] leading-[1.08] text-[#092D54] sm:text-[48px] md:text-[60px]">
          {SOCIAL_CLOSING.closingHeading}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[540px] text-[16px] leading-[1.75] text-[#596573]">
          {SOCIAL_CLOSING.description}
        </p>
        <div data-reveal className="mt-9">
          <Link
            to={SOCIAL_CLOSING.cta.to}
            className="inline-flex h-12 items-center rounded-full bg-[#0E4174] px-9 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
          >
            {SOCIAL_CLOSING.cta.label}
          </Link>
        </div>

        <div className="mt-20">
          <p className="hv2-display text-[22px] text-[#092D54]">{SOCIAL_CLOSING.socialHeading}</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Biznet on ${item.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E1E6EC] transition-colors hover:border-[#0E4174]/40 hover:bg-[#0E4174]/[0.04]"
                >
                  <img src={item.icon} alt={`${item.name} icon`} className="h-[18px] w-[18px] object-contain" draggable="false" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
