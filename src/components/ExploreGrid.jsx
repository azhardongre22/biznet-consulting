import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import recentProjectsImage from "../assets/images/recent-project.png";
import servicesImage from "../assets/images/services.jpg";
import legacyInProgressImage from "../assets/images/legacy-in-progress.png";
import pressReleaseImage from "../assets/images/press-release.png";
import { useLanguage } from "../i18n/LanguageContext";

const cardImages = [
  servicesImage,
  recentProjectsImage,
  legacyInProgressImage,
  pressReleaseImage,
];

const cardHrefs = [
  "/services",
  "/recent-projects",
  "/legacy",
  "/press-release",
];
const cardObjectPositions = [
  undefined,
  undefined,
  undefined,
  "press-release-right",
];

const EASE = [0.22, 1, 0.36, 1];

// Per-card `objectPositionMobile` → Tailwind class. Mobile gets the shift;
// the desktop expanding row uses its own <DesktopCard> so it isn't affected.
// Static class strings so the Tailwind JIT can pick them up.
function getObjectPositionClass(mobile) {
  switch (mobile) {
    case "left":
      return "object-left";
    case "left-soft":
      return "object-[28%_50%]";
    case "right":
      return "object-right";
    case "right-soft":
      return "object-[65%_50%]";
    case "right-softer":
      return "object-[58%_50%]";
    case "top":
      return "object-top";
    case "bottom":
      return "object-bottom";
    case "press-release-right":
      return "object-[35%_50%]";
    default:
      return "";
  }
}

function DesktopCard({
  card,
  isActive,
  isAnyActive,
  onEnter,
  discoverLabel,
  isRTL,
}) {
  return (
    <motion.div
      onMouseEnter={onEnter}
      onFocus={onEnter}
      animate={{ flexGrow: isActive ? 8 : 1 }}
      transition={{ duration: 1.1, ease: EASE }}
      style={{ flexBasis: 0 }}
      dir={isRTL ? "rtl" : "ltr"}
      className={`group relative h-full min-w-[72px] overflow-hidden lg:min-w-[88px] ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* IMAGE */}
      <motion.img
        src={card.image}
        alt={card.label}
        loading="lazy"
        animate={{
          scale: isActive ? 1.04 : 1.06,
          filter:
            isAnyActive && !isActive
              ? "grayscale(100%) brightness(0.5) contrast(0.95)"
              : "grayscale(0%) brightness(0.85)",
        }}
        transition={{ duration: 1.1, ease: EASE }}
        className={`absolute inset-0 h-full w-full object-cover ${
          card.href === "/press-release"
            ? "lg:object-[35%_50%] xl:object-[40%_50%]"
            : ""
        }`}
      />

      {/* TINT */}
      <motion.div
        animate={{ opacity: isActive ? 0.45 : isAnyActive ? 0.78 : 0.55 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/55 to-transparent"
      />

      {/* Active brand wash */}
      <motion.div
        animate={{ opacity: isActive ? 0.5 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-0 bg-gradient-to-tr from-[#0E4174]/55 via-transparent to-[#384967]/35 mix-blend-multiply"
      />

      {/* Index marker */}
      <div
        className={`absolute top-5 z-10 flex items-center gap-3 ${
          isRTL ? "right-5" : "left-5"
        }`}
      >
        <motion.span
          animate={{ opacity: isAnyActive && !isActive ? 0.45 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/85"
        >
          {card.num}
        </motion.span>

        <motion.span
          animate={{
            scaleX: isActive ? 1 : 0.4,
            opacity: isActive ? 1 : 0.35,
          }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: isRTL ? "right" : "left" }}
          className="block h-px w-8 bg-white/65"
        />
      </div>

      {/* COLLAPSED */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <span
              className={`font-headline font-medium text-white/85 ${
                isRTL
                  ? "text-[14px] tracking-normal lg:text-[15px]"
                  : "text-[12px] uppercase tracking-[0.42em] lg:text-[13px]"
              }`}
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {card.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 flex h-full flex-col justify-end px-8 pb-10 md:px-10 lg:px-14 lg:pb-12"
          >
            <motion.h3
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
              className={`w-full break-words font-headline font-light leading-[1.2] text-white md:max-w-[520px] lg:max-w-[440px] xl:max-w-[480px] ${
                isRTL
                  ? "text-[20px] tracking-normal md:text-[22px] lg:text-[26px] xl:text-[32px]"
                  : "text-lg uppercase tracking-[-0.01em] md:text-xl lg:text-2xl xl:text-3xl"
              }`}
            >
              {card.label}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
              className={`mt-5 w-full pr-2 font-subtext font-light text-[#cdd8e4] md:max-w-[320px] lg:max-w-[300px] xl:max-w-[320px] ${
                isRTL
                  ? "whitespace-pre-line break-words text-justify text-[15px] leading-[1.85] [word-spacing:-0.04em] md:text-[16px]"
                  : "break-words text-justify text-[13px] leading-[1.75] [hyphens:auto] [word-spacing:-0.04em] md:text-[14px]"
              }`}
            >
              {card.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            >
              <Link
                to={card.href}
                className={`mt-7 inline-flex items-center gap-3 self-start border-b border-[#7C878E]/45 pb-2 text-white transition-all duration-500 hover:border-white ${
                  isRTL
                    ? "text-[12px] tracking-normal"
                    : "text-[10px] uppercase tracking-[0.36em]"
                }`}
              >
                {discoverLabel}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-[#7C878E]"
                >
                  ↗
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side accent — flips to the right edge in Arabic */}
      <motion.span
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ transformOrigin: "bottom" }}
        className={`pointer-events-none absolute bottom-0 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#7C878E] to-[#0E4174] ${
          isRTL ? "right-0" : "left-0"
        }`}
      />
    </motion.div>
  );
}

function StackedCard({ card, index, discoverLabel, isRTL }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.06 }}
      dir={isRTL ? "rtl" : "ltr"}
      className={`group relative block aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <img
        src={card.image}
        alt={card.label}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] ${getObjectPositionClass(card.objectPositionMobile)}`}
        style={{ filter: "brightness(0.85)" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/65 to-transparent" />

      <div
        className={`absolute top-5 flex items-center gap-3 ${
          isRTL ? "right-5" : "left-5"
        }`}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/85">
          {card.num}
        </span>

        <span className="block h-px w-8 bg-white/65" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col px-5 pb-7 sm:px-7 sm:pb-9">
        <h3
          className={`w-full break-words font-headline font-light leading-[1.2] text-white ${
            isRTL
              ? "text-[22px] tracking-normal sm:text-[26px]"
              : "text-[20px] uppercase tracking-[-0.01em] sm:text-[24px]"
          }`}
        >
          {card.label}
        </h3>

        <p
          className={`mt-3 w-full pr-2 font-subtext font-light text-[#cdd8e4] ${
            isRTL
              ? "whitespace-pre-line break-words text-justify text-[15px] leading-[1.85] [word-spacing:-0.04em]"
              : "break-words text-justify text-[13px] leading-[1.65] [hyphens:auto] [word-spacing:-0.04em]"
          }`}
        >
          {card.desc}
        </p>

        <Link
          to={card.href}
          className={`mt-5 inline-flex items-center gap-3 self-start border-b border-[#7C878E]/45 pb-1.5 text-white transition-all duration-500 hover:border-white ${
            isRTL
              ? "text-[12px] tracking-normal"
              : "text-[10px] uppercase tracking-[0.34em]"
          }`}
        >
          {discoverLabel}
          <span className="text-[#7C878E]">↗</span>
        </Link>
      </div>

      <span
        className={`pointer-events-none absolute bottom-0 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#7C878E] to-[#0E4174] ${
          isRTL ? "right-0" : "left-0"
        }`}
      />
    </motion.div>
  );
}

function ExploreGrid() {
  const [active, setActive] = useState(null);
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";
  const cardContent = tArray("exploreGrid.cards");
  const cards = cardContent.map((c, i) => ({
    ...c,
    href: cardHrefs[i],
    image: cardImages[i],
    objectPositionMobile: cardObjectPositions[i],
  }));
  const discoverLabel = t("exploreGrid.discover");

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-[#EEF3F8] to-[#DDE5E8] text-[#384967] md:h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1540px] flex-col px-5 py-10 sm:px-7 sm:py-12 md:h-screen md:min-h-0 md:px-12 md:py-12 lg:px-[102px] lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-8 flex shrink-0 flex-col gap-5 md:mb-8 lg:mb-10"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`text-[#0E4174] ${
                isRTL
                  ? "text-[16px] tracking-normal"
                  : "text-[12px] uppercase tracking-[0.46em]"
              }`}
            >
              {t("exploreGrid.eyebrow")}
            </span>

            <span
              className={`max-w-[680px] font-subtext font-light text-[#5F6F7A] ${
                isRTL
                  ? "break-words text-justify text-[17px] leading-[1.65] md:text-[20px] [word-spacing:-0.04em]"
                  : "text-[13px] leading-[1.65] md:text-[16px]"
              }`}
            >
              {t("exploreGrid.lead")}
            </span>
          </div>
        </motion.div>

        {/* Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, ease: EASE }}
          onMouseLeave={() => setActive(null)}
          className="hidden min-h-0 flex-1 gap-3 md:flex"
        >
          {cards.map((card, i) => (
            <DesktopCard
              key={card.num}
              card={card}
              isActive={active === i}
              isAnyActive={active !== null}
              onEnter={() => setActive(i)}
              discoverLabel={discoverLabel}
              isRTL={isRTL}
            />
          ))}
        </motion.div>

        {/* Mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:hidden">
          {cards.map((card, i) => (
            <StackedCard
              key={card.num}
              card={card}
              index={i}
              discoverLabel={discoverLabel}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreGrid;
