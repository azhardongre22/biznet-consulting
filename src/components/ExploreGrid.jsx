import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import recentProjectsImage from "../assets/images/recent-project.png";
import servicesImage from "../assets/images/services.png";
import legacyInProgressImage from "../assets/images/legacy-in-progress.png";
import pressReleaseImage from "../assets/images/press-release.png";
import { useLanguage } from "../i18n/LanguageContext";

const cardImages = [
  recentProjectsImage,
  servicesImage,
  legacyInProgressImage,
  pressReleaseImage,
];
const cardHrefs = ["/recent-projects", "/services", "/legacy", "/press-release"];
const cardObjectPositions = [undefined, undefined, undefined, "left-soft"];

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
        className="absolute inset-0 h-full w-full object-cover"
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
              className="font-headline text-[12px] font-medium uppercase tracking-[0.42em] text-white/85 lg:text-[13px]"
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
              className="w-full break-words font-headline font-light uppercase leading-[1.08] tracking-[-0.01em] text-white text-lg md:max-w-[520px] md:text-xl lg:max-w-[440px] lg:text-2xl xl:max-w-[480px] xl:text-3xl"
            >
              {card.label}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
              className="mt-5 w-full break-words pr-2 font-subtext font-light text-[#cdd8e4] text-justify [hyphens:auto] [word-spacing:-0.04em] text-[13px] leading-[1.75] md:max-w-[320px] md:text-[14px] lg:max-w-[300px] xl:max-w-[320px]"
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
                className="mt-7 inline-flex items-center gap-3 self-start border-b border-[#7C878E]/45 pb-2 text-[10px] uppercase tracking-[0.36em] text-white transition-all duration-500 hover:border-white"
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
        <h3 className="w-full break-words font-headline font-light uppercase leading-[1.08] tracking-[-0.01em] text-white text-[20px] sm:text-[24px]">
          {card.label}
        </h3>

        <p className="mt-3 w-full break-words pr-2 font-subtext font-light text-[#cdd8e4] text-justify [hyphens:auto] [word-spacing:-0.04em] text-[13px] leading-[1.65]">
          {card.desc}
        </p>

        <Link
          to={card.href}
          className="mt-5 inline-flex items-center gap-3 self-start border-b border-[#7C878E]/45 pb-1.5 text-[10px] uppercase tracking-[0.34em] text-white transition-all duration-500 hover:border-white"
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
    <section className="relative isolate min-h-screen overflow-hidden bg-[#04080f] text-white md:h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1540px] flex-col px-5 py-10 sm:px-7 sm:py-12 md:h-screen md:min-h-0 md:px-12 md:py-12 lg:px-[102px] lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-8 flex shrink-0 flex-col gap-5 md:mb-8 lg:mb-10"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.46em] text-[#7C878E]">
              {t("exploreGrid.eyebrow")}
            </span>

            <span className="max-w-[680px] font-subtext text-[13px] font-light leading-[1.65] text-[#dbe6f2] md:text-[14px]">
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
