import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import whoWeAreImage from "../assets/images/optimized/who-we-are1.webp";
import whatWeAreImage from "../assets/images/optimized/what-we-are-2.webp";
import whatWeDoImage from "../assets/images/optimized/what-we-do-2.webp";

import { useLanguage } from "../i18n/LanguageContext";

const slideImages = [whoWeAreImage, whatWeAreImage, whatWeDoImage];
const slideObjectPositions = ["right-softer", undefined, "right-soft"];

const EASE = [0.22, 1, 0.36, 1];

const wordVariants = {
  initial: { opacity: 0, y: 48 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -32,
    transition: { duration: 0.42, ease: EASE },
  },
};

const detailVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.45 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.32, ease: EASE },
  },
};

const SCROLL_SMOOTHNESS = 100;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Per-slide `objectPositionMobile` → Tailwind class. Mobile gets the shift,
// md+ reverts to centered. Static strings so the JIT picks them up.
function getObjectPositionClass(mobile) {
  switch (mobile) {
    case "left":
      return "object-left md:object-center";
    case "left-soft":
      return "object-[35%_50%] md:object-center";
    case "right":
      return "object-right md:object-center";
    case "right-soft":
      return "object-[65%_50%] md:object-center";
    case "right-softer":
      return "object-[56%_50%] md:object-center";
    case "right-softest":
      return "object-[52%_50%] md:object-center";
    case "top":
      return "object-top md:object-center";
    case "bottom":
      return "object-bottom md:object-center";
    default:
      return "";
  }
}

function renderSplitWord(word, side) {
  if (typeof word === "object" && word?.partOne && word?.partTwo) {
    return (
      <>
        <span className={side === "left" ? "text-[#0d5094]" : "text-[#0d5094]"}>
          {word.partOne}
        </span>
        <span className={side === "left" ? "text-[#7C878E]" : "text-white"}>
          {word.partTwo}
        </span>
      </>
    );
  }

  return word;
}

function WhoWeAreSection() {
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";
  const sectionRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const slideContent = tArray("whoWeAre.slides");
  const slides = slideContent.map((s, i) => ({
    ...s,
    image: slideImages[i],
    objectPositionMobile: slideObjectPositions[i],
    description: Array.isArray(s.description) ? s.description : [s.description],
    points: [],
    // Slide 1 ("BIZNESS NETWORK") is brand wordmark — never translated, never RTL-swapped.
    ...(i === 0 && {
      leftWord: { partOne: "Biz", partTwo: "ness" },
      rightWord: { partOne: "Net", partTwo: "work" },
    }),
  }));

  const total = slides.length;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let rafId = null;

    const updateActiveFromScroll = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollableDistance = node.offsetHeight - viewportH;

      if (scrollableDistance <= 0) {
        if (activeRef.current !== 0) {
          setActive(0);
        }
        return;
      }

      const scrolledInside = clamp(-rect.top, 0, scrollableDistance);
      const progress = scrolledInside / scrollableDistance;

      const nextIndex = clamp(Math.round(progress * (total - 1)), 0, total - 1);

      if (nextIndex !== activeRef.current) {
        setActive(nextIndex);
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [total]);

  const goToSlide = (idx) => {
    const node = sectionRef.current;
    if (!node) return;

    const clamped = clamp(idx, 0, total - 1);
    const sectionTop = node.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = node.offsetHeight - window.innerHeight;

    const targetY =
      sectionTop + scrollableDistance * (clamped / Math.max(1, total - 1));

    if (window.lenis?.scrollTo) {
      window.lenis.scrollTo(targetY);
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  const slide = slides[active];
  // In Arabic, swap which word renders on each side so the natural
  // right-to-left reading order is preserved. e.g. slide 3 should read
  // "ماذا نعمل" — that means "ماذا" (originally the leftWord) needs to
  // sit on the right and "نعمل" on the left. Slide 1 is the brand
  // wordmark ("BIZNESS NETWORK") and stays LTR regardless.
  const headingRTL = isRTL && active !== 0;
  // Slide 1's heading is the brand wordmark — keep its original font/case/tracking
  // even when the document is in Arabic mode.
  const headingLangKeep = active === 0 ? " lang-keep" : "";

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-white"
      style={{ height: `${total * SCROLL_SMOOTHNESS}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={`bg-${slide.number}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 1.15, ease: EASE }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt=""
              loading="eager"
              decoding="async"
              className={`h-full w-full object-cover ${getObjectPositionClass(slide.objectPositionMobile)}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Left frosted panel and central divider */}
        <div className="absolute inset-y-0 left-0 z-10 hidden md:block md:w-1/2">
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[#5aa9d6]/18" />
          <div className="absolute inset-0 bg-linear-to-r from-[#5aa9d6]/28 via-[#9FB4D4]/20 to-[#EEF3F8]/12" />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-full w-px -translate-x-1/2 bg-white/24 md:block" />

        {/* Global atmospheric overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-[#06131f]/72 via-transparent to-[#06131f]/38" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-linear-to-l from-[#06131f]/48 to-transparent" />

        {/* Mobile stacked heading */}
        <div
          className="absolute inset-x-5 top-[17%] z-30 md:hidden"
          dir={headingRTL ? "rtl" : "ltr"}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={`M-${slide.number}`}
              variants={wordVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={
                headingRTL
                  ? "font-headline text-[32px] font-extrabold leading-[1.15] tracking-normal text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:text-[36px]"
                  : `font-['Inter',Arial,sans-serif] text-[30px] font-extrabold uppercase leading-[0.95] tracking-[0.035em] text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:text-[34px]${headingLangKeep}`
              }
            >
              <span className="block text-[#DDE5E8]/72">
                {renderSplitWord(slide.leftWord, "left")}
              </span>
              <span className="block">
                {renderSplitWord(slide.rightWord, "right")}
              </span>
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Main split word title — the two-column grid stays LTR (left
            column → right column physically). The word swap for Arabic
            is handled below via `headingRTL` on the renderSplitWord call. */}
        <div
          className="relative z-30 hidden h-full md:grid md:grid-cols-2"
          dir="ltr"
        >
          <div className="relative">
            <div className="absolute right-0 top-[33%] pr-4 md:pr-2">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`L-${slide.number}`}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={
                    headingRTL
                      ? `text-right font-headline text-[50px] font-extrabold leading-[1.1] tracking-normal ${
                          active === 1 || active === 2
                            ? "text-[#0d5094]"
                            : "text-[#DDE5E8]/48"
                        } lg:text-[68px] xl:text-[84px]`
                      : `text-right font-['Inter',Arial,sans-serif] text-[48px] font-extrabold uppercase leading-[0.92] tracking-[0.035em] ${
                          active === 1 || active === 2
                            ? "text-[#0d5094]"
                            : "text-[#DDE5E8]/48"
                        } lg:text-[66px] xl:text-[82px]${headingLangKeep}`
                  }
                >
                  {renderSplitWord(
                    headingRTL ? slide.rightWord : slide.leftWord,
                    "left",
                  )}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute left-0 top-[45%] pl-2">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`R-${slide.number}`}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={
                    headingRTL
                      ? "font-headline text-[50px] font-extrabold leading-[1.1] tracking-normal text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] lg:text-[68px] xl:text-[84px]"
                      : `font-['Inter',Arial,sans-serif] text-[48px] font-extrabold uppercase leading-[0.92] tracking-[0.035em] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] lg:text-[66px] xl:text-[82px]${headingLangKeep}`
                  }
                >
                  {renderSplitWord(
                    headingRTL ? slide.leftWord : slide.rightWord,
                    "right",
                  )}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom left content card */}
        <div className="absolute bottom-16 left-4 right-4 z-30 sm:left-5 sm:right-5 md:bottom-10 md:left-10 md:right-auto md:max-w-[470px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`D-${slide.number}`}
              variants={detailVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-h-[56vh] overflow-y-auto rounded-2xl bg-[#0E4174]/74 p-4 ring-1 ring-[#7C878E]/38 sm:p-5 md:max-h-none md:overflow-visible md:p-6 md:backdrop-blur-sm"
            >
              <p
                className={`font-semibold text-[#E7EDF0] ${
                  isRTL
                    ? "text-[12px] tracking-normal sm:text-[13px]"
                    : "text-[10px] uppercase tracking-[0.2em] sm:text-[11px] sm:tracking-[0.22em]"
                }`}
              >
                {slide.discover}
              </p>

              <div
                className={`mt-2.5 whitespace-pre-line space-y-2.5 text-white/92 sm:mt-3 sm:space-y-3 ${
                  isRTL
                    ? "max-w-[420px] break-words text-justify font-light leading-[1.85] [word-spacing:-0.04em] text-[15px] sm:text-[16px] lg:max-w-[300px] xl:max-w-[360px]"
                    : "max-w-[420px] break-words text-justify text-[13px] leading-normal [hyphens:auto] [word-spacing:-0.04em] sm:text-[14px] lg:max-w-[300px] xl:max-w-[360px]"
                }`}
              >
                {(Array.isArray(slide.description)
                  ? slide.description
                  : [slide.description]
                ).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {slide.points.length > 0 && (
                <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                  {slide.points.map((point, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 break-words text-justify text-white/86 [hyphens:auto] [word-spacing:-0.04em] sm:gap-2.5 ${
                        isRTL
                          ? "text-[15px] leading-[1.9] sm:text-[16px]"
                          : "text-[12px] leading-snug sm:text-[13px]"
                      }`}
                    >
                      <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#7C878E]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal navigation + progress */}
        <div className="absolute bottom-4 right-20 z-30 flex items-center gap-3 sm:right-24 sm:gap-4 md:bottom-11 md:right-28">
          <button
            type="button"
            onClick={() => goToSlide(active - 1)}
            disabled={active === 0}
            className={`cursor-pointer text-white/76 transition hover:text-white disabled:opacity-30 ${
              isRTL
                ? "text-[11px] tracking-normal sm:text-[12px]"
                : "text-[9px] uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.28em]"
            }`}
          >
            {t("whoWeAre.prev")}
          </button>

          <span className="h-px w-8 bg-white/30" />

          <button
            type="button"
            onClick={() => goToSlide(active + 1)}
            disabled={active === total - 1}
            className={`cursor-pointer text-white/76 transition hover:text-white disabled:opacity-30 ${
              isRTL
                ? "text-[11px] tracking-normal sm:text-[12px]"
                : "text-[9px] uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.28em]"
            }`}
          >
            {t("whoWeAre.next")}
          </button>
        </div>

        <div className="absolute bottom-5 left-4 z-30 flex items-center gap-2.5 sm:left-5 sm:gap-3 md:bottom-4 md:left-10">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E7EDF0] sm:text-[11px] sm:tracking-[0.25em]">
            {slide.number}
          </span>

          <div className="relative h-px w-20 overflow-hidden bg-white/25 sm:w-28 md:w-40">
            <motion.div
              animate={{ width: `${((active + 1) / total) * 100}%` }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute left-0 top-0 h-full bg-[#7C878E]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoWeAreSection;
