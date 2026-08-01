import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ServiceBusinessFormation from "../assets/images/optimized/services images/Business formation.webp";
import ServiceLandFeasibility from "../assets/images/optimized/services images/Land feasibility.webp";
import ServiceProjectDevelopment from "../assets/images/optimized/services images/project development.webp";
import ServiceProjectManagement from "../assets/images/optimized/services images/project management.webp";
import ServiceBrandingMarketing from "../assets/images/optimized/services images/branding and marketing.webp";
import { useLanguage } from "../i18n/LanguageContext";

const serviceSlides = [
  {
    heading: "BUSINESS & COMPANY FORMATION",
    description:
      "Building strong foundations of businesses & company licensing, business feasibility, market evaluation, and investment planning to create a clear base for companies and businesses formulated in the UAE.",
    image: ServiceBusinessFormation,
  },
  {
    heading: "FEASIBILITY & VIABILITY",
    description:
      "Evaluating opportunities through feasibility studies, market understanding, best-use assessment, and early development planning to define the right direction before execution.",
    image: ServiceLandFeasibility,
  },
  {
    heading: "PROJECT DEVELOPMENT",
    description:
      "Transforming concepts into structured developments through planning, design coordination, technical direction, and execution readiness.",
    image: ServiceProjectDevelopment,
  },
  {
    heading: "PROJECT MANAGEMENT",
    description:
      "Managing every stage of development through structured execution, quality control, cost management, timeline oversight, and project delivery.",
    image: ServiceProjectManagement,
  },
  {
    heading: "BRANDING & MARKETING",
    description:
      "Creating market-ready brands through positioning, communication, digital presence, content, campaigns, and brand experiences.",
    image: ServiceBrandingMarketing,
  },
];

export default function ServiceSliderNew() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  /* Translation.js version kept for later use
  const { t, tArray, language } = useLanguage();
  const cards = tArray("serviceGrid.cards");
  const baseSlides = useMemo(
    () =>
      cards.map((card, i) => ({
        id: card?.num ?? i,
        image: serviceSlides[i]?.image,
        num: card?.num ?? "",
        label: card?.label ?? "",
        intro: Array.isArray(card?.intro)
          ? card.intro.join(" ")
          : (card?.intro ?? ""),
      })),
    [cards],
  );
  */

  const baseSlides = useMemo(
    () =>
      serviceSlides.map((slide, i) => ({
        id: i,
        image: slide.image,
        num: String(i + 1).padStart(2, "0"),
        label: slide.heading,
        intro: slide.description,
      })),
    [],
  );

  const [order, setOrder] = useState(() => baseSlides.map((_, i) => i));
  const [animation, setAnimation] = useState("");
  const [locked, setLocked] = useState(false);

  const slides = order.map((i) => baseSlides[i]);
  const active = slides[0];

  const thumbnails = useMemo(() => {
    return [...slides.slice(1), slides[0]];
  }, [slides]);

  const moveSlider = (direction) => {
    if (locked) return;
    setLocked(true);

    if (direction === "next") {
      setOrder((current) => [...current.slice(1), current[0]]);
      setAnimation("next");
    } else {
      setOrder((current) => [
        current[current.length - 1],
        ...current.slice(0, -1),
      ]);
      setAnimation("prev");
    }

    window.setTimeout(() => {
      setAnimation("");
      setLocked(false);
    }, 650);
  };

  /** Jump so the clicked thumbnail becomes the active (first) slide. */
  const goToSlide = (targetId) => {
    if (locked || active?.id === targetId) return;

    const targetPos = slides.findIndex((s) => s.id === targetId);
    if (targetPos <= 0) return;

    if (targetPos === 1) {
      moveSlider("next");
      return;
    }

    setLocked(true);
    setAnimation("next");
    setOrder((current) => {
      const idx = current.findIndex((i) => baseSlides[i].id === targetId);
      if (idx <= 0) return current;
      return [...current.slice(idx), ...current.slice(0, idx)];
    });

    window.setTimeout(() => {
      setAnimation("");
      setLocked(false);
    }, 650);
  };

  // Auto-advance every 8s; timer resets after each slide change
  useEffect(() => {
    if (baseSlides.length <= 1 || locked) return undefined;

    const id = window.setTimeout(() => {
      setLocked(true);
      setOrder((current) => [...current.slice(1), current[0]]);
      setAnimation("next");
      window.setTimeout(() => {
        setAnimation("");
        setLocked(false);
      }, 650);
    }, 8000);

    return () => window.clearTimeout(id);
  }, [baseSlides.length, locked, order]);

  return (
    <section
      className={`service-slider-new ${animation} ${isRTL ? "is-rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <style>{`
        .service-slider-new {
          height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: relative;
          background: #04080f;
          isolation: isolate;
        }

        .service-slider-new * {
          box-sizing: border-box;
        }

        .service-slider-new .rs-list .rs-item {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .service-slider-new .rs-list .rs-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .service-slider-new .rs-list .rs-item:first-child {
          z-index: 1;
        }

        /* ---- Service number / rule (flows directly below the content) ---- */
        .service-slider-new .rs-index {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .service-slider-new .rs-index .rs-num {
          font-size: 13px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
        }

        .service-slider-new .rs-index .rs-rule {
          display: block;
          height: 1px;
          width: 40px;
          background: rgba(255, 255, 255, 0.55);
        }

        /* ---- Content block (aligned with card row) ---- */
        .service-slider-new .rs-content {
          position: absolute;
          left: max(72px, 8%);
          top: auto;
          bottom: 50px;
          transform: none;
          z-index: 20;
          max-width: 420px;
          width: min(40%, 420px);
        }

        .service-slider-new .rs-content-panel {
          padding: 16px 18px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(4, 8, 15, 0.38) 0%,
            rgba(4, 8, 15, 0.26) 55%,
            rgba(4, 8, 15, 0.16) 100%
          );
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .service-slider-new.is-rtl .rs-content {
          left: auto;
          right: max(72px, 8%);
          text-align: right;
        }

        .service-slider-new .rs-label {
          color: #fff;
          line-height: 1.2;
          font-weight: 300;
        }

        .service-slider-new .rs-intro {
          margin-top: 10px;
          color: #fff;
          font-weight: 300;
          text-align: justify;
          word-spacing: -0.04em;
        }

        .service-slider-new.is-rtl .rs-intro {
          white-space: pre-line;
        }

        .service-slider-new .rs-main-button {
          margin-top: 30px;
          min-width: 168px;
          height: 48px;
          padding: 0 26px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
          cursor: pointer;
          transition: background 0.4s ease, color 0.4s ease, letter-spacing 0.4s ease, border-color 0.4s ease;
        }

        .service-slider-new.is-rtl .rs-main-button {
          letter-spacing: 0.06em;
          text-transform: none;
        }

        .service-slider-new .rs-main-button:hover {
          background: #0e4174;
          border-color: #0e4174;
          color: #fff;
          letter-spacing: 0.34em;
        }

        /* ---- Thumbnails ---- */
        .service-slider-new .rs-thumbnail {
          position: absolute;
          bottom: 50px;
          left: 50%;
          width: max-content;
          z-index: 30;
          display: flex;
          gap: 20px;
        }

        /* RTL: mirror the strip to the left half, reverse reading order */
        .service-slider-new.is-rtl .rs-thumbnail {
          left: auto;
          right: 50%;
          flex-direction: row-reverse;
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item {
          width: 150px;
          height: 220px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          border: none;
          padding: 0;
          margin: 0;
          background: transparent;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          transition: transform 0.35s ease;
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item:hover {
          transform: translateY(-4px);
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item:hover img {
          filter: brightness(1.05);
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.85);
          outline-offset: 3px;
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item:disabled {
          cursor: default;
          transform: none;
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item:disabled:hover img {
          filter: brightness(0.9);
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 10px 28px rgba(4, 8, 15, 0.45);
          display: block;
          filter: brightness(0.9);
        }

        .service-slider-new .rs-thumbnail .rs-thumb-item::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(to top, rgba(4, 8, 15, 0.55), transparent 60%);
          pointer-events: none;
        }

        .service-slider-new .rs-thumb-caption {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          z-index: 2;
          color: #fff;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          line-height: 1.3;
        }

        .service-slider-new.is-rtl .rs-thumb-caption {
          letter-spacing: 0.02em;
          text-transform: none;
        }

        /* number badge in the top corner of each card */
        .service-slider-new .rs-thumb-num {
          position: absolute;
          top: 10px;
          left: 12px;
          z-index: 3;
          font-size: 11px;
          letter-spacing: 0.28em;
          color: #fff;
          text-shadow: 0 1px 6px rgba(4, 8, 15, 0.6);
        }

        .service-slider-new.is-rtl .rs-thumb-num {
          left: auto;
          right: 12px;
          letter-spacing: 0.1em;
        }

        /* ---- Arrows — right end of screen, above the card row ---- */
        .service-slider-new .rs-arrows {
          position: absolute;
          top: auto;
          left: auto;
          right: 28px;
          bottom: calc(50px + 220px + 18px);
          transform: none;
          z-index: 40;
          width: auto;
          max-width: none;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }

        .service-slider-new.is-rtl .rs-arrows {
          right: auto;
          left: 28px;
          transform: none;
          flex-direction: row-reverse;
        }

        .service-slider-new .rs-arrow {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #04080f;
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.35s ease, color 0.35s ease, transform 0.35s ease;
          cursor: pointer;
        }

        .service-slider-new .rs-arrow:hover {
          background: #0e4174;
          color: #fff;
          transform: translateY(-2px);
        }

        /* accent rail on the active slide */
        .service-slider-new .rs-accent {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 2px;
          z-index: 15;
          background: linear-gradient(to bottom, transparent, #7c878e, #0e4174);
          pointer-events: none;
        }

        .service-slider-new.is-rtl .rs-accent {
          left: auto;
          right: 0;
        }

        /* ---------- Animations ---------- */
        .service-slider-new.next .rs-list .rs-item:first-child img {
          width: 150px;
          height: 220px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          border-radius: 24px;
          animation: rsShowImage 0.55s linear 1 forwards;
        }

        @keyframes rsShowImage {
          to {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }

        .service-slider-new.next .rs-thumbnail .rs-thumb-item:last-child {
          overflow: hidden;
          animation: rsShowThumbnail 0.55s linear 1 forwards;
        }

        @keyframes rsShowThumbnail {
          from {
            width: 0;
            opacity: 0;
          }
        }

        .service-slider-new.next .rs-thumbnail {
          animation: rsEffectNext 0.55s linear 1 forwards;
        }

        @keyframes rsEffectNext {
          from {
            transform: translateX(150px);
          }
        }

        .service-slider-new.prev .rs-list .rs-item:nth-child(2) {
          z-index: 2;
        }

        .service-slider-new.prev .rs-list .rs-item:nth-child(2) img {
          animation: rsOutFrame 0.55s linear 1 forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        @keyframes rsOutFrame {
          to {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 18px;
          }
        }

        .service-slider-new.prev .rs-thumbnail .rs-thumb-item:first-child {
          overflow: hidden;
          opacity: 0;
          animation: rsShowThumbnail 0.55s linear 1 forwards;
        }

        .service-slider-new.next .rs-arrow,
        .service-slider-new.prev .rs-arrow {
          pointer-events: none;
        }

        .service-slider-new.next .rs-thumbnail .rs-thumb-item,
        .service-slider-new.prev .rs-thumbnail .rs-thumb-item {
          pointer-events: none;
        }

        /* ---------- RTL animation mirroring ---------- */
        /* "next": full image morphs down into the strip from the centre-right */
        .service-slider-new.is-rtl.next .rs-list .rs-item:first-child img {
          left: auto;
          right: 50%;
          animation-name: rsShowImageRtl;
        }

        @keyframes rsShowImageRtl {
          to {
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }

        .service-slider-new.is-rtl.next .rs-thumbnail {
          animation-name: rsEffectNextRtl;
        }

        @keyframes rsEffectNextRtl {
          from {
            transform: translateX(-150px);
          }
        }

        /* "prev": incoming full image ejects out to the strip on the right */
        .service-slider-new.is-rtl.prev .rs-list .rs-item:nth-child(2) img {
          left: auto;
          right: 0;
          animation-name: rsOutFrameRtl;
        }

        @keyframes rsOutFrameRtl {
          to {
            width: 150px;
            height: 220px;
            bottom: 50px;
            right: 50%;
            left: auto;
            border-radius: 18px;
          }
        }

        @media screen and (max-width: 900px) {
          .service-slider-new .rs-thumbnail {
            left: 42%;
            gap: 14px;
          }

          .service-slider-new.is-rtl .rs-thumbnail {
            left: auto;
            right: 42%;
          }

          .service-slider-new .rs-thumbnail .rs-thumb-item {
            width: 112px;
            height: 168px;
          }

          .service-slider-new .rs-arrows {
            top: auto;
            left: auto;
            right: 24px;
            bottom: calc(50px + 168px + 14px);
            transform: none;
            max-width: none;
          }

          .service-slider-new.is-rtl .rs-arrows {
            right: auto;
            left: 24px;
            transform: none;
          }

          .service-slider-new .rs-content {
            left: max(24px, 6%);
            bottom: 50px;
            width: min(38%, 360px);
          }

          .service-slider-new.is-rtl .rs-content {
            left: auto;
            right: max(24px, 6%);
          }

          .service-slider-new.next .rs-list .rs-item:first-child img,
          .service-slider-new.prev .rs-list .rs-item:nth-child(2) img {
            width: 112px;
            height: 168px;
            bottom: 50px;
            left: 42%;
          }

          .service-slider-new.is-rtl.next .rs-list .rs-item:first-child img,
          .service-slider-new.is-rtl.prev .rs-list .rs-item:nth-child(2) img {
            left: auto;
            right: 42%;
          }

          @keyframes rsOutFrame {
            to {
              width: 112px;
              height: 168px;
              bottom: 50px;
              left: 42%;
              border-radius: 18px;
            }
          }

          @keyframes rsOutFrameRtl {
            to {
              width: 112px;
              height: 168px;
              bottom: 50px;
              right: 42%;
              left: auto;
              border-radius: 18px;
            }
          }
        }

        @media screen and (max-width: 640px) {
          .service-slider-new {
            height: 88vh;
            min-height: 600px;
          }

          .service-slider-new .rs-index {
            top: 24px;
            left: 24px;
          }

          .service-slider-new.is-rtl .rs-index {
            left: auto;
            right: 24px;
          }

          .service-slider-new .rs-content {
            left: 24px;
            right: 24px;
            top: auto;
            transform: none;
            bottom: 150px;
            width: auto;
            max-width: none;
          }

          .service-slider-new .rs-content-panel {
            padding: 12px 14px;
          }

          .service-slider-new.is-rtl .rs-content {
            left: 24px;
            right: 24px;
          }

          .service-slider-new .rs-thumbnail {
            left: 24px;
            bottom: 24px;
            gap: 10px;
          }

          .service-slider-new.is-rtl .rs-thumbnail {
            left: auto;
            right: 24px;
          }

          .service-slider-new .rs-thumbnail .rs-thumb-item {
            width: 74px;
            height: 104px;
          }

          .service-slider-new .rs-thumb-caption {
            display: none;
          }

          .service-slider-new .rs-arrows {
            left: auto;
            right: 16px;
            bottom: calc(24px + 104px + 12px);
            transform: none;
            width: auto;
          }

          .service-slider-new.is-rtl .rs-arrows {
            left: 16px;
            right: auto;
            transform: none;
          }

          .service-slider-new .rs-main-button {
            min-width: 148px;
            height: 44px;
            font-size: 10px;
          }

          .service-slider-new .rs-arrow {
            width: 40px;
            height: 40px;
          }

          .service-slider-new.next .rs-list .rs-item:first-child img,
          .service-slider-new.prev .rs-list .rs-item:nth-child(2) img {
            width: 74px;
            height: 104px;
            bottom: 24px;
            left: 24px;
          }

          .service-slider-new.is-rtl.next .rs-list .rs-item:first-child img,
          .service-slider-new.is-rtl.prev .rs-list .rs-item:nth-child(2) img {
            left: auto;
            right: 24px;
          }

          @keyframes rsOutFrame {
            to {
              width: 74px;
              height: 104px;
              bottom: 24px;
              left: 24px;
              border-radius: 14px;
            }
          }

          @keyframes rsOutFrameRtl {
            to {
              width: 74px;
              height: 104px;
              bottom: 24px;
              right: 24px;
              left: auto;
              border-radius: 14px;
            }
          }
        }
      `}</style>

      <div className="rs-list" aria-live="polite">
        {slides.map((slide) => (
          <div className="rs-item" key={slide.id}>
            <img src={slide.image} alt={slide.label} draggable="false" />
          </div>
        ))}
      </div>

      <span className="rs-accent" aria-hidden="true" />

      <div className="rs-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            className="rs-content-panel"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3
              className={`rs-label font-headline ${
                isRTL
                  ? "text-[24px] md:text-[30px] lg:text-[34px]"
                  : "text-2xl uppercase tracking-[-0.01em] md:text-3xl lg:text-4xl"
              }`}
            >
              {active?.label}
            </h3>

            {/* <p
          className={`rs-intro font-subtext ${
            isRTL
              ? "text-[15px] leading-[1.85] md:text-[16px]"
              : "text-[13px] leading-[1.75] md:text-[14px] [hyphens:auto]"
          }`}
        >
          {active?.intro}
        </p> */}
            <p
              className={`rs-intro font-subtext ${
                isRTL
                  ? "text-[15px] leading-[1.85] md:max-w-[520px] md:text-[16px] lg:max-w-[460px] xl:max-w-[620px]"
                  : "text-[13px] leading-[1.75] md:max-w-[500px] md:text-[14px] lg:max-w-[540px] xl:max-w-[430px] [hyphens:auto]"
              }`}
            >
              {active?.intro}
            </p>

            {/* Service number below the content */}
            <div className="rs-index" aria-hidden="true">
              <span className="rs-rule" />
              <span className="rs-num font-headline">{active?.num}</span>
            </div>

            {/* <button type="button" className="rs-main-button font-headline">
          {t("serviceGrid.eyebrow")}
        </button> */}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="rs-thumbnail" role="tablist" aria-label="Service slides">
        {thumbnails.map((slide) => {
          const isCurrent = slide.id === active?.id;
          return (
            <button
              type="button"
              className="rs-thumb-item"
              key={`thumb-${slide.id}`}
              onClick={() => goToSlide(slide.id)}
              disabled={locked || isCurrent}
              aria-label={`Show ${slide.label}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              <img src={slide.image} alt="" draggable="false" />
              <span className="rs-thumb-num font-headline">{slide.num}</span>
              <span className="rs-thumb-caption font-headline">
                {slide.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rs-arrows" aria-label="Slider controls">
        <button
          type="button"
          className="rs-arrow"
          onClick={() => moveSlider("prev")}
          aria-label="Previous slide"
          disabled={locked}
        >
          ‹
        </button>
        <button
          type="button"
          className="rs-arrow"
          onClick={() => moveSlider("next")}
          aria-label="Next slide"
          disabled={locked}
        >
          ›
        </button>
      </div>
    </section>
  );
}
