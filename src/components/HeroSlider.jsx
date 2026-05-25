import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SocialMediaIcons, {
  defaultSocialLinks,
} from "../components/SocialMediaIcons";
import { useLanguage } from "../i18n/LanguageContext";

// Maps a slide's `bgPositionMobile` value to a Tailwind class that sets
// the background-position on mobile and resets to centered from `md` up.
// Static class strings so the Tailwind JIT can pick them up.
function getBgPositionClass(mobile) {
  switch (mobile) {
    case "right":
      return "bg-right md:bg-center"; // 100%
    case "right-soft":
      return "bg-[position:75%_50%] md:bg-center"; // 75%
    case "right-softer":
      return "bg-[position:65%_50%] md:bg-center"; // 65%
    case "left":
      return "bg-left md:bg-center"; // 0%
    case "left-soft":
      return "bg-[position:25%_50%] md:bg-center"; // 25%
    case "top":
      return "bg-top md:bg-center";
    case "bottom":
      return "bg-bottom md:bg-center";
    default:
      return "bg-center";
  }
}

function HeroSlider({
  slides = [],
  sectionId = "home",
  autoPlay = true,
  autoPlayDelay = 6500,
  socialLinks = defaultSocialLinks,
}) {
  const [active, setActive] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goToSlide = (index) => {
    if (slides.length === 0) return;
    setActive((index + slides.length) % slides.length);
  };

  const handleCtaClick = (slide) => {
    const href = slide?.ctaHref;
    if (!href) return;

    const currentPath = location.pathname.replace(/\/+$/, "") || "/";
    const targetPath = href.replace(/\/+$/, "") || "/";

    if (currentPath === targetPath) {
      // Same page → scroll past the hero to the next section.
      const heroEl =
        document.getElementById(sectionId) ||
        document.querySelector(`[data-hero-slider="${sectionId}"]`);
      const nextEl = heroEl?.nextElementSibling;
      if (nextEl) {
        if (window.lenis?.scrollTo) {
          window.lenis.scrollTo(nextEl, { offset: -68 });
        } else {
          nextEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(window.innerHeight, { offset: -68 });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
      return;
    }

    navigate(href);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return undefined;

    const timer = setInterval(() => {
      goToSlide(active + 1);
    }, autoPlayDelay);

    return () => clearInterval(timer);
  }, [active, autoPlay, autoPlayDelay, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="relative h-screen w-full overflow-hidden"
    >
      <aside className="absolute left-0 top-[68px] z-40 hidden h-[calc(100vh-68px)] w-[102px] bg-[#020812] md:block">
        <div className="absolute left-1/2 top-[43px] -translate-x-1/2 font-serif text-[42px] font-light leading-none text-[#7C878E]">
          {String(active + 1).padStart(2, "0")}
        </div>

        <div className="absolute left-1/2 top-[91px] -translate-x-1/2 text-[12px] tracking-[0.18em] text-[#2f6f9e]">
          / {String(slides.length).padStart(2, "0")}
        </div>

        <div className="absolute left-1/2 top-[188px] flex -translate-x-1/2 flex-col items-center">
          <div className="mb-[34px] h-[48px] w-px bg-white/45" />

          <div className="flex rotate-90 items-center gap-[22px]">
            <button
              type="button"
              onClick={() => goToSlide(active - 1)}
              className="cursor-pointer text-[10px] uppercase tracking-[0.38em] text-[#7f9ab4] transition hover:text-white"
            >
              {t("whoWeAre.prev")}
            </button>

            <button
              type="button"
              onClick={() => goToSlide(active + 1)}
              className="cursor-pointer text-[10px] uppercase tracking-[0.38em] text-[#7f9ab4] transition hover:text-white"
            >
              {t("whoWeAre.next")}
            </button>
          </div>

          <div className="mt-[34px] h-[28px] w-px bg-white/45" />
        </div>

        <div className="absolute bottom-[34px] left-1/2 -translate-x-1/2">
          <SocialMediaIcons links={socialLinks} direction="col" />
        </div>
      </aside>

      {slides.map((slide, index) => (
        <div
          key={`${slide.eyebrow}-${index}`}
          className={`absolute inset-y-0 left-0 right-0 transition-opacity duration-1000 md:left-[102px] ${
            active === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 bg-cover transition-transform duration-[7000ms] ${getBgPositionClass(slide.bgPositionMobile)}`}
            style={{
              backgroundImage: `url(${slide.bg})`,
              transform: active === index ? "scale(1.015)" : "scale(1.05)",
            }}
          />

          <div className="absolute inset-0 bg-[#06111d]/12" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020812]/40 via-[#020812]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020812]/12 via-transparent to-[#020812]/8" />

          <div className="relative z-20 flex h-full items-center px-7 pt-[68px] md:px-[75px]">
            <div className="mt-[36px] max-w-[930px]">
              <div className="mb-[22px] text-[11px] font-semibold uppercase tracking-[0.58em] text-[#ffffff]">
                {slide.eyebrow}
              </div>

              <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-light leading-[1] tracking-[-0.035em] text-[#eef3f8]">
                {slide.emphasisFirst ? (
                  <>
                    <span className="block font-light  text-[#5aa9d6] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                      {slide.titleTop}
                    </span>

                    <span className="block text-[#f1f4f7] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                      {slide.titleBottom}
                    </span>
                  </>
                ) : slide.inlineTitle ? (
                  <span className="block text-[#f1f4f7] text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    {slide.titleTop}{" "}
                    <span className="font-light  text-[#5aa9d6]">
                      {slide.titleEm}
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="block text-[#f1f4f7] text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                      {slide.titleTop}
                    </span>

                    <span className="block font-light text-[#5aa9d6] text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                      {slide.titleEm}
                    </span>
                  </>
                )}
              </h2>

              <div className="mb-[26px] mt-[34px] h-px w-[54px] bg-[#7C878E]" />

              <p className="max-w-[300px] break-words text-justify font-['Inter',Arial,sans-serif] text-[17px] font-light leading-[1.75] text-white [hyphens:auto] [word-spacing:-0.04em] lg:max-w-[300px] xl:max-w-[450px]">
                {slide.subtitle}
              </p>
              <button
                type="button"
                onClick={() => handleCtaClick(slide)}
                className="mt-[44px] cursor-pointer border border-white px-[33px] py-[16px] text-[11px] font-semibold uppercase tracking-[0.32em] text-white transition hover:border-white hover:bg-white hover:text-[#06101c]"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-[83px] right-[40px] z-30 hidden h-[112px] w-[112px] border-b border-r border-white/10 lg:block">
        <span className="absolute right-0 top-0 h-[45px] w-px bg-[#7C878E]" />
      </div>
    </section>
  );
}

export default HeroSlider;
