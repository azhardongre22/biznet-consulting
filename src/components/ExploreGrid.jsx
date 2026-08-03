import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import recentProjectsImage from "../assets/images/optimized/recent-project.webp";
import servicesImage from "../assets/images/optimized/services.webp";
import legacyInProgressImage from "../assets/images/optimized/legacy-in-progress.webp";
import pressReleaseImage from "../assets/images/optimized/press-release.webp";
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
  "/news-and-insights",
];

export default function ExploreGrid() {
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";
  const cardContent = tArray("exploreGrid.cards");
  const discoverLabel = t("exploreGrid.discover");

  const baseSlides = useMemo(
    () =>
      cardContent.map((card, i) => ({
        id: card?.num ?? i,
        image: cardImages[i],
        href: cardHrefs[i],
        num: card?.num ?? String(i + 1).padStart(2, "0"),
        label: card?.label ?? "",
        intro: card?.desc ?? "",
      })),
    [cardContent],
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
      className={`explore-slider ${animation} ${isRTL ? "is-rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <style>{`
        .explore-slider {
          height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: relative;
          background: #04080f;
          isolation: isolate;
        }

        .explore-slider * {
          box-sizing: border-box;
        }

        .explore-slider .eg-list .eg-item {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .explore-slider .eg-list .eg-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .explore-slider .eg-list .eg-item:first-child {
          z-index: 1;
        }

        .explore-slider .eg-index {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .explore-slider .eg-index .eg-num {
          font-size: 13px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
        }

        .explore-slider .eg-index .eg-rule {
          display: block;
          height: 1px;
          width: 40px;
          background: rgba(255, 255, 255, 0.55);
        }

        .explore-slider .eg-content {
          position: absolute;
          left: max(72px, 8%);
          top: auto;
          bottom: 50px;
          transform: none;
          z-index: 20;
          max-width: 420px;
          width: min(40%, 420px);
        }

        .explore-slider .eg-content-panel {
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

        .explore-slider.is-rtl .eg-content {
          left: auto;
          right: max(72px, 8%);
          text-align: right;
        }

        .explore-slider .eg-label {
          color: #fff;
          line-height: 1.2;
          font-weight: 300;
        }

        .explore-slider .eg-intro {
          margin-top: 10px;
          color: #fff;
          font-weight: 300;
          text-align: justify;
          word-spacing: -0.04em;
        }

        .explore-slider.is-rtl .eg-intro {
          white-space: pre-line;
        }

        .explore-slider .eg-main-button {
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.4s ease, color 0.4s ease, letter-spacing 0.4s ease, border-color 0.4s ease;
        }

        .explore-slider.is-rtl .eg-main-button {
          letter-spacing: 0.06em;
          text-transform: none;
        }

        .explore-slider .eg-main-button:hover {
          background: #0e4174;
          border-color: #0e4174;
          color: #fff;
          letter-spacing: 0.34em;
        }

        .explore-slider .eg-controls {
          position: absolute;
          bottom: 50px;
          left: 50%;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 18px;
          width: max-content;
        }

        .explore-slider.is-rtl .eg-controls {
          left: auto;
          right: 50%;
        }

        .explore-slider .eg-thumbnail {
          position: relative;
          width: max-content;
          display: flex;
          gap: 20px;
        }

        .explore-slider.is-rtl .eg-thumbnail {
          flex-direction: row;
        }

        .explore-slider .eg-thumbnail .eg-thumb-item {
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

        .explore-slider .eg-thumbnail .eg-thumb-item:hover {
          transform: translateY(-4px);
        }

        .explore-slider .eg-thumbnail .eg-thumb-item:hover img {
          filter: brightness(1.05);
        }

        .explore-slider .eg-thumbnail .eg-thumb-item:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.85);
          outline-offset: 3px;
        }

        .explore-slider .eg-thumbnail .eg-thumb-item:disabled {
          cursor: default;
          transform: none;
        }

        .explore-slider .eg-thumbnail .eg-thumb-item:disabled:hover img {
          filter: brightness(0.9);
        }

        .explore-slider .eg-thumbnail .eg-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 10px 28px rgba(4, 8, 15, 0.45);
          display: block;
          filter: brightness(0.9);
        }

        .explore-slider .eg-thumbnail .eg-thumb-item::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(to top, rgba(4, 8, 15, 0.55), transparent 60%);
          pointer-events: none;
        }

        .explore-slider .eg-thumb-caption {
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

        .explore-slider.is-rtl .eg-thumb-caption {
          letter-spacing: 0.02em;
          text-transform: none;
        }

        .explore-slider .eg-thumb-num {
          position: absolute;
          top: 10px;
          left: 12px;
          z-index: 3;
          font-size: 11px;
          letter-spacing: 0.28em;
          color: #fff;
          text-shadow: 0 1px 6px rgba(4, 8, 15, 0.6);
        }

        .explore-slider.is-rtl .eg-thumb-num {
          left: auto;
          right: 12px;
          letter-spacing: 0.1em;
        }

        .explore-slider .eg-arrows {
          position: relative;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          width: auto;
        }

        .explore-slider.is-rtl .eg-arrows {
          flex-direction: row;
        }

        .explore-slider .eg-arrow {
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

        .explore-slider .eg-arrow:hover {
          background: #0e4174;
          color: #fff;
          transform: translateY(-2px);
        }

        .explore-slider .eg-accent {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 2px;
          z-index: 15;
          background: linear-gradient(to bottom, transparent, #7c878e, #0e4174);
          pointer-events: none;
        }

        .explore-slider.is-rtl .eg-accent {
          left: auto;
          right: 0;
        }

        .explore-slider.next .eg-list .eg-item:first-child img {
          width: 150px;
          height: 220px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          border-radius: 24px;
          animation: egShowImage 0.55s linear 1 forwards;
        }

        @keyframes egShowImage {
          to {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }

        .explore-slider.next .eg-thumbnail .eg-thumb-item:last-child {
          overflow: hidden;
          animation: egShowThumbnail 0.55s linear 1 forwards;
        }

        @keyframes egShowThumbnail {
          from {
            width: 0;
            opacity: 0;
          }
        }

        .explore-slider.next .eg-thumbnail {
          animation: egEffectNext 0.55s linear 1 forwards;
        }

        @keyframes egEffectNext {
          from {
            transform: translateX(150px);
          }
        }

        .explore-slider.prev .eg-list .eg-item:nth-child(2) {
          z-index: 2;
        }

        .explore-slider.prev .eg-list .eg-item:nth-child(2) img {
          animation: egOutFrame 0.55s linear 1 forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        @keyframes egOutFrame {
          to {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 18px;
          }
        }

        .explore-slider.prev .eg-thumbnail .eg-thumb-item:first-child {
          overflow: hidden;
          opacity: 0;
          animation: egShowThumbnail 0.55s linear 1 forwards;
        }

        .explore-slider.next .eg-arrow,
        .explore-slider.prev .eg-arrow {
          pointer-events: none;
        }

        .explore-slider.next .eg-thumbnail .eg-thumb-item,
        .explore-slider.prev .eg-thumbnail .eg-thumb-item {
          pointer-events: none;
        }

        .explore-slider.is-rtl.next .eg-list .eg-item:first-child img {
          left: auto;
          right: 50%;
          animation-name: egShowImageRtl;
        }

        @keyframes egShowImageRtl {
          to {
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }

        .explore-slider.is-rtl.next .eg-thumbnail {
          animation-name: egEffectNextRtl;
        }

        @keyframes egEffectNextRtl {
          from {
            transform: translateX(-150px);
          }
        }

        .explore-slider.is-rtl.prev .eg-list .eg-item:nth-child(2) img {
          left: auto;
          right: 0;
          animation-name: egOutFrameRtl;
        }

        @keyframes egOutFrameRtl {
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
          .explore-slider .eg-controls {
            left: 42%;
          }

          .explore-slider.is-rtl .eg-controls {
            left: auto;
            right: 42%;
          }

          .explore-slider .eg-thumbnail {
            gap: 14px;
          }

          .explore-slider .eg-thumbnail .eg-thumb-item {
            width: 112px;
            height: 168px;
          }

          .explore-slider .eg-content {
            left: max(24px, 6%);
            bottom: 50px;
            width: min(38%, 360px);
          }

          .explore-slider.is-rtl .eg-content {
            left: auto;
            right: max(24px, 6%);
          }

          .explore-slider.next .eg-list .eg-item:first-child img,
          .explore-slider.prev .eg-list .eg-item:nth-child(2) img {
            width: 112px;
            height: 168px;
            bottom: 50px;
            left: 42%;
          }

          .explore-slider.is-rtl.next .eg-list .eg-item:first-child img,
          .explore-slider.is-rtl.prev .eg-list .eg-item:nth-child(2) img {
            left: auto;
            right: 42%;
          }

          @keyframes egOutFrame {
            to {
              width: 112px;
              height: 168px;
              bottom: 50px;
              left: 42%;
              border-radius: 18px;
            }
          }

          @keyframes egOutFrameRtl {
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
          .explore-slider {
            height: 88vh;
            min-height: 600px;
          }

          .explore-slider .eg-content {
            left: 24px;
            right: 24px;
            top: auto;
            transform: none;
            bottom: 150px;
            width: auto;
            max-width: none;
          }

          .explore-slider .eg-content-panel {
            padding: 12px 14px;
          }

          .explore-slider.is-rtl .eg-content {
            left: 24px;
            right: 24px;
          }

          .explore-slider .eg-controls {
            left: 24px;
            bottom: 24px;
            gap: 12px;
          }

          .explore-slider.is-rtl .eg-controls {
            left: auto;
            right: 24px;
          }

          .explore-slider .eg-thumbnail {
            gap: 10px;
          }

          .explore-slider .eg-thumbnail .eg-thumb-item {
            width: 74px;
            height: 104px;
          }

          .explore-slider .eg-thumb-caption {
            display: none;
          }

          .explore-slider .eg-main-button {
            min-width: 148px;
            height: 44px;
            font-size: 10px;
          }

          .explore-slider .eg-arrow {
            width: 40px;
            height: 40px;
          }

          .explore-slider.next .eg-list .eg-item:first-child img,
          .explore-slider.prev .eg-list .eg-item:nth-child(2) img {
            width: 74px;
            height: 104px;
            bottom: 24px;
            left: 24px;
          }

          .explore-slider.is-rtl.next .eg-list .eg-item:first-child img,
          .explore-slider.is-rtl.prev .eg-list .eg-item:nth-child(2) img {
            left: auto;
            right: 24px;
          }

          @keyframes egOutFrame {
            to {
              width: 74px;
              height: 104px;
              bottom: 24px;
              left: 24px;
              border-radius: 14px;
            }
          }

          @keyframes egOutFrameRtl {
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

      <div className="eg-list" aria-live="polite">
        {slides.map((slide) => (
          <div className="eg-item" key={slide.id}>
            <img src={slide.image} alt={slide.label} draggable="false" />
          </div>
        ))}
      </div>

      <span className="eg-accent" aria-hidden="true" />

      <div className="eg-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            className="eg-content-panel"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3
              className={`eg-label font-headline ${
                isRTL
                  ? "text-[24px] md:text-[30px] lg:text-[34px]"
                  : "text-2xl uppercase tracking-[-0.01em] md:text-3xl lg:text-4xl"
              }`}
            >
              {active?.label}
            </h3>

            <p
              className={`eg-intro font-subtext ${
                isRTL
                  ? "text-[15px] leading-[1.85] md:max-w-[520px] md:text-[16px] lg:max-w-[460px] xl:max-w-[620px]"
                  : "text-[13px] leading-[1.75] md:max-w-[500px] md:text-[14px] lg:max-w-[540px] xl:max-w-[430px] [hyphens:auto]"
              }`}
            >
              {active?.intro}
            </p>

            <div className="eg-index" aria-hidden="true">
              <span className="eg-rule" />
              <span className="eg-num font-headline">{active?.num}</span>
            </div>

            {active?.href && (
              <Link
                to={active.href}
                className="eg-main-button font-headline"
              >
                {discoverLabel}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="eg-controls">
        <div
          className="eg-arrows"
          aria-label="Slider controls"
          dir="ltr"
        >
          <button
            type="button"
            className="eg-arrow"
            onClick={() => moveSlider("prev")}
            aria-label="Previous slide"
            disabled={locked}
          >
            ‹
          </button>
          <button
            type="button"
            className="eg-arrow"
            onClick={() => moveSlider("next")}
            aria-label="Next slide"
            disabled={locked}
          >
            ›
          </button>
        </div>

        <div
          className="eg-thumbnail"
          role="tablist"
          aria-label="Explore slides"
          dir="ltr"
        >
          {thumbnails.map((slide) => {
            const isCurrent = slide.id === active?.id;
            return (
              <button
                type="button"
                className="eg-thumb-item"
                key={`thumb-${slide.id}`}
                onClick={() => goToSlide(slide.id)}
                disabled={locked || isCurrent}
                aria-label={`Show ${slide.label}`}
                aria-current={isCurrent ? "true" : undefined}
              >
                <img src={slide.image} alt="" draggable="false" />
                <span className="eg-thumb-num font-headline">{slide.num}</span>
                <span className="eg-thumb-caption font-headline">
                  {slide.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
