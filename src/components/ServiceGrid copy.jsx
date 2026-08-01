import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Service1 from "../assets/images/project-development.png";
import Service2 from "../assets/images/project-management.png";
import Service3 from "../assets/images/branding3.png";
import Service4 from "../assets/images/hospitality.png";
import Service5 from "../assets/images/business-formation.png";
import { useLanguage } from "../i18n/LanguageContext";

const serviceImages = [Service1, Service2, Service5, Service4, Service3];
const serviceObjectPositions = [undefined, undefined, undefined, undefined, "right-softer"];

const EASE = [0.22, 1, 0.36, 1];

// Per-card `objectPositionMobile` → Tailwind class. Mobile gets the shift,
// md+ never sees it since the mobile card is hidden at md+. Static strings
// so the Tailwind JIT can pick them up.
function getObjectPositionClass(mobile) {
  switch (mobile) {
    case "left":
      return "object-left";
    case "left-soft":
      return "object-[35%_50%]";
    case "right":
      return "object-right";
    case "right-soft":
      return "object-[65%_50%]";
    case "right-softer":
      return "object-[67%_50%]";
    case "top":
      return "object-top";
    case "bottom":
      return "object-bottom";
    default:
      return "";
  }
}

function ServiceContent({ card, isMobile = false, isRTL = false }) {
  const introLines = Array.isArray(card?.intro)
    ? card.intro
    : card?.intro
      ? [card.intro]
      : [];
  const includeItems = Array.isArray(card?.includes) ? card.includes : [];

  return (
    <>
      <h3
        className={[
          "w-full break-words font-headline font-light leading-[1.2] text-white md:max-w-[520px] lg:max-w-[440px] xl:max-w-[480px]",
          isRTL ? "tracking-normal" : "uppercase tracking-[-0.01em]",
          isMobile
            ? isRTL
              ? "text-[22px] sm:text-[26px]"
              : "text-[20px] sm:text-[24px]"
            : isRTL
              ? "text-[20px] md:text-[22px] lg:text-[26px] xl:text-[32px]"
              : "text-lg md:text-xl lg:text-2xl xl:text-3xl",
        ].join(" ")}
      >
        {card?.label ?? ""}
      </h3>

      <div
        className={[
          "mt-5 w-full break-words pr-2 font-subtext font-light text-[#cdd8e4] text-justify [word-spacing:-0.04em] md:max-w-[520px] lg:max-w-[440px] xl:max-w-[480px]",
          isRTL ? "whitespace-pre-line" : "[hyphens:auto]",
          isMobile
            ? isRTL
              ? "text-[15px] leading-[1.85]"
              : "text-[13px] leading-[1.65]"
            : isRTL
              ? "text-[15px] leading-[1.85] md:text-[16px]"
              : "text-[13px] leading-[1.75] md:text-[14px]",
        ].join(" ")}
      >
        <div className="space-y-2.5">
          {introLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {includeItems.length > 0 && card?.includesTitle ? (
          <>
            <p
              className={`mt-5 text-white/70 ${
                isRTL
                  ? "text-[12px] tracking-normal"
                  : "text-[10px] uppercase tracking-[0.32em]"
              }`}
            >
              {card?.includesTitle}
            </p>

            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {includeItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[#dbe6f2]/85">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#7C878E]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {card?.closing ? (
          <p className="mt-5 max-w-[580px] text-white/72">{card?.closing}</p>
        ) : null}
      </div>
    </>
  );
}

function DesktopCard({ card, isActive, isAnyActive, onEnter, onClick, isRTL }) {
  return (
    <motion.div
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      animate={{ flexGrow: isActive ? 8 : 1 }}
      transition={{ duration: 1.1, ease: EASE }}
      style={{ flexBasis: 0 }}
      tabIndex={0}
      role="group"
      dir={isRTL ? "rtl" : "ltr"}
      className={`group relative h-full min-w-[72px] overflow-hidden outline-none lg:min-w-[88px] ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <motion.img
        src={card?.image ?? ""}
        alt={card?.label ?? "Service card"}
        loading="lazy"
        animate={{
          scale: isActive ? 1.04 : 1.06,
          filter:
            isAnyActive && !isActive
              ? "grayscale(100%) brightness(0.5) contrast(0.95)"
              : "grayscale(0%) brightness(0.82)",
        }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <motion.div
        animate={{ opacity: isActive ? 0.5 : isAnyActive ? 0.8 : 0.58 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/62 to-transparent"
      />

      <motion.div
        animate={{ opacity: isActive ? 0.52 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="absolute inset-0 bg-gradient-to-tr from-[#0E4174]/55 via-transparent to-[#384967]/35 mix-blend-multiply"
      />

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
          {card?.num ?? ""}
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
                  ? "text-[10px] tracking-normal lg:text-[12px]"
                  : "text-[8px] uppercase tracking-[0.42em] lg:text-[10px]"
              }`}
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {card?.label ?? ""}
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
            className="relative z-10 flex h-full flex-col justify-end px-7 pb-8 md:px-9 lg:px-10 lg:pb-10 xl:px-12 xl:pb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
            >
              <ServiceContent card={card} isRTL={isRTL} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

function StackedCard({ card, index, isRTL }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.06 }}
      dir={isRTL ? "rtl" : "ltr"}
      className={`group relative block min-h-[620px] w-full overflow-hidden sm:min-h-[560px] ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <img
        src={card?.image ?? ""}
        alt={card?.label ?? "Service card"}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] group-active:scale-[1.04] ${getObjectPositionClass(card?.objectPositionMobile)}`}
        style={{ filter: "brightness(0.82)" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/72 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0E4174]/40 via-transparent to-[#384967]/25 mix-blend-multiply" />

      <div
        className={`absolute top-5 flex items-center gap-3 ${
          isRTL ? "right-5" : "left-5"
        }`}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/85">
          {card?.num ?? ""}
        </span>
        <span className="block h-px w-8 bg-white/65" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col px-5 pb-7 sm:px-7 sm:pb-9">
        <ServiceContent card={card} isMobile isRTL={isRTL} />
      </div>

      <span
        className={`pointer-events-none absolute bottom-0 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#7C878E] to-[#0E4174] ${
          isRTL ? "right-0" : "left-0"
        }`}
      />
    </motion.div>
  );
}

function ServiceGrid({ variant = "dark" }) {
  const [active, setActive] = useState(null);
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";
  const isLight = variant === "light";
  const cardContent = tArray("serviceGrid.cards");
  const safeCards = cardContent.map((c, i) => ({
    ...c,
    image: serviceImages[i],
    objectPositionMobile: serviceObjectPositions[i],
    includes: [],
    closing: "",
  }));
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const tabletWidthQuery = window.matchMedia("(max-width: 1023px)");

    const update = () =>
      setIsTouchDevice(touchQuery.matches || tabletWidthQuery.matches);

    update();

    const attach = (mq) => {
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
      } else {
        mq.addListener(update);
      }
    };

    const detach = (mq) => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", update);
      } else {
        mq.removeListener(update);
      }
    };

    attach(touchQuery);
    attach(tabletWidthQuery);
    return () => {
      detach(touchQuery);
      detach(tabletWidthQuery);
    };
  }, []);

  return (
    <section
      className={`relative isolate min-h-screen overflow-hidden md:h-screen ${
        isLight ? "bg-[#EEF3F8] text-[#384967]" : "bg-[#04080f] text-white"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLight
            ? "bg-gradient-to-b from-[#EEF3F8] to-[#DDE5E8]"
            : "bg-gradient-to-b from-[#04080f] via-[#070d18] to-[#04080f]"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(14,65,116,0.16),transparent_38%),radial-gradient(circle_at_8%_85%,rgba(56,73,103,0.14),transparent_40%)]" />

      
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1540px] flex-col px-5 py-10 sm:px-7 sm:py-12 md:h-screen md:min-h-0 md:px-12 md:pt-2 lg:px-[102px] lg:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-8 flex shrink-0 flex-col gap-5 md:mb-8 lg:mb-4"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`${isLight ? "text-[#384967]" : "text-[#7C878E] "} ${
                isRTL
                  ? "text-[11px] tracking-normal sm:text-[12px] md:text-[13px] lg:text-[14px]"
                  : "text-[9px] uppercase tracking-[0.32em] sm:text-[10px] md:text-[11px] md:tracking-[0.46em] lg:text-[12px]"
              }`}
            >
              {t("serviceGrid.eyebrow")}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, ease: EASE }}
          onMouseLeave={isTouchDevice ? undefined : () => setActive(null)}
          className="hidden min-h-0 flex-1 gap-3 md:flex"
        >
          {safeCards.map((card, i) => (
            <DesktopCard
              key={card?.num ?? i}
              card={card}
              isActive={active === i}
              isAnyActive={active !== null}
              onEnter={isTouchDevice ? undefined : () => setActive(i)}
              onClick={() => setActive((prev) => (prev === i ? null : i))}
              isRTL={isRTL}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:hidden">
          {safeCards.map((card, i) => (
            <StackedCard
              key={card?.num ?? i}
              card={card}
              index={i}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceGrid;
