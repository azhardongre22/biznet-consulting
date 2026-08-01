import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Service1 from "../assets/images/optimized/project-development.webp";
import Service2 from "../assets/images/optimized/project-management.webp";
import Service3 from "../assets/images/optimized/branding3.webp";
import Service4 from "../assets/images/optimized/hospitality.webp";
import Service5 from "../assets/images/optimized/business-formation.webp";
import { useLanguage } from "../i18n/LanguageContext";

// Same image order used in ServiceSliderNew.jsx.
const serviceImages = [Service1, Service2, Service5, Service4, Service3];

const loremSlides = [
  {
    heading: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae tortor nec magna facilisis gravida in sed massa. Praesent vitae sem non urna viverra pretium, sed malesuada lectus. Donec posuere, augue at finibus feugiat, lorem neque cursus erat, in pulvinar arcu mi vitae velit.",
  },
  {
    heading: "Pellentesque Habitant",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean commodo, justo vitae pretium posuere, lectus risus viverra magna, sed placerat lorem arcu sed nibh. Integer facilisis tortor at nibh gravida, vitae posuere libero tincidunt.",
  },
  {
    heading: "Sed Ut Perspiciatis",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Quisque feugiat, sapien vel blandit consequat, ipsum lorem pulvinar elit, nec fermentum justo neque vitae quam. Morbi suscipit magna sit amet lectus tempor, in cursus enim pretium.",
  },
  {
    heading: "Nunc Dignissim Augue",
    description:
      "Nunc dignissim, augue sed laoreet luctus, justo velit pretium arcu, vitae facilisis lorem neque sed mi. Suspendisse potenti, curabitur aliquet magna at tortor vulputate, sit amet tincidunt elit luctus. Maecenas tempor sem vitae magna convallis, vel porttitor lorem dignissim.",
  },
  {
    heading: "Curabitur At Sapien",
    description:
      "Curabitur at sapien vitae arcu fermentum facilisis. Donec tempor, lorem non luctus blandit, nibh lacus posuere sem, vitae gravida lectus massa vel neque. Vivamus tincidunt justo sit amet sem dignissim, sed suscipit mi varius.",
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function ServiceSlider2() {
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";

  const cards = tArray("serviceGrid.cards");

  const baseSlides = useMemo(
    () =>
      cards.slice(0, serviceImages.length).map((card, i) => ({
        id: card?.num ?? `service-${i + 1}`,
        image: serviceImages[i],
        num: card?.num ?? String(i + 1).padStart(2, "0"),
        // Original service heading kept for later use:
        // label: card?.label ?? "",
        label: loremSlides[i]?.heading ?? "",
        // Original service description kept for later use:
        // intro: Array.isArray(card?.intro)
        //   ? card.intro.join(" ")
        //   : (card?.intro ?? ""),
        intro: loremSlides[i]?.description ?? "",
      })),
    [cards],
  );

  // The reference effect displays the active content on the 2nd card.
  // This order keeps Service 1 as the first visible active service on load.
  const getInitialOrder = (length) => {
    if (length <= 1) return Array.from({ length }, (_, i) => i);
    return [length - 1, ...Array.from({ length: length - 1 }, (_, i) => i)];
  };

  const [order, setOrder] = useState(() => getInitialOrder(baseSlides.length));
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setOrder(getInitialOrder(baseSlides.length));
  }, [baseSlides.length]);

  const slides = order.map((index) => baseSlides[index]).filter(Boolean);
  const active = slides[1] ?? slides[0];

  const moveSlider = (direction) => {
    if (locked || slides.length <= 1) return;

    setLocked(true);

    setOrder((current) => {
      if (direction === "next") {
        return [...current.slice(1), current[0]];
      }

      return [current[current.length - 1], ...current.slice(0, -1)];
    });

    window.setTimeout(() => setLocked(false), 900);
  };

  if (!baseSlides.length) return null;

  return (
    <section
      className={`service-slider-2 ${isRTL ? "is-rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ "--active-bg": active ? `url(${active.image})` : "none" }}
      aria-label="Services slider"
    >
      <style>{`
        .service-slider-2 {
          --slide-w: 310px;
          --slide-h: 470px;
          --slide-top: 70px;
          --slide-gap: 18px;
          --pill-l: 36px;
          --pill-t: 36px;
          --pill-w: 34px;
          --pill-h: 72px;
          --s2: 48%;
          --s3: calc(48% + 328px);
          --s4: calc(48% + 656px);
          --s5: calc(48% + 984px);
          --s6: calc(48% + 1312px);
          --content-l: 8%;
          --content-w: 430px;

          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background: #DDE5E8;
          cursor: default;
        }

        .service-slider-2 * {
          box-sizing: border-box;
        }

        .service-slider-2::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(
            50% 60% at 80% 30%,
            rgba(14, 65, 116, 0.30) 0%,
            transparent 70%
          );
          opacity: 0.5;
          pointer-events: none;
        }

        .service-slider-2::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            90deg,
            rgba(221, 229, 232, 0.96) 0%,
            rgba(221, 229, 232, 0.88) 34%,
            rgba(221, 229, 232, 0.42) 68%,
            rgba(221, 229, 232, 0.72) 100%
          );
          pointer-events: none;
        }

        .service-slider-2 .ss2-track {
          position: absolute;
          inset: 0;
          z-index: 5;
        }

        .service-slider-2 .ss2-slide {
          position: absolute;
          top: var(--slide-top);
          width: var(--slide-w);
          height: var(--slide-h);
          border-radius: 24px;
          overflow: hidden;
          background-position: center;
          background-size: cover;
          box-shadow: 0 30px 80px rgba(14, 65, 116, 0.20);
          transition:
            left 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            right 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            top 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.6s ease,
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .service-slider-2 .ss2-slide::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(4, 8, 15, 0.62), transparent 58%);
          pointer-events: none;
        }

        .service-slider-2 .ss2-slide:nth-child(1) {
          left: var(--pill-l);
          top: var(--pill-t);
          width: var(--pill-w);
          height: var(--pill-h);
          border-radius: 999px;
          opacity: 0.58;
          box-shadow: none;
        }

        .service-slider-2 .ss2-slide:nth-child(2) {
          left: var(--s2);
          z-index: 7;
          transform: scale(1);
        }

        .service-slider-2 .ss2-slide:nth-child(3) {
          left: var(--s3);
          z-index: 6;
          transform: scale(0.96);
          opacity: 0.9;
        }

        .service-slider-2 .ss2-slide:nth-child(4) {
          left: var(--s4);
          z-index: 5;
          transform: scale(0.92);
          opacity: 0.72;
        }

        .service-slider-2 .ss2-slide:nth-child(5) {
          left: var(--s5);
          z-index: 4;
          transform: scale(0.88);
          opacity: 0.45;
        }

        .service-slider-2 .ss2-slide:nth-child(n + 6) {
          left: var(--s6);
          opacity: 0;
        }

        .service-slider-2 .ss2-card-caption {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #fff;
        }

        .service-slider-2 .ss2-card-num {
          font-size: 12px;
          letter-spacing: 0.36em;
          color: rgba(255, 255, 255, 0.78);
        }

        .service-slider-2 .ss2-card-title {
          font-size: 15px;
          line-height: 1.25;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .service-slider-2 .ss2-copy {
          position: absolute;
          left: var(--content-l);
          top: 50%;
          z-index: 15;
          width: var(--content-w);
          max-width: min(42vw, var(--content-w));
          transform: translateY(-50%);
          color: #384967;
          text-align: left;
        }

        .service-slider-2.is-rtl .ss2-copy {
          left: var(--content-l);
          right: auto;
          text-align: right;
        }

        .service-slider-2 .ss2-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: #384967;
        }

        .service-slider-2 .ss2-eyebrow::before {
          content: "";
          display: block;
          width: 42px;
          height: 1px;
          background: #384967;
        }

        .service-slider-2.is-rtl .ss2-eyebrow {
          letter-spacing: 0.06em;
          text-transform: none;
        }

        .service-slider-2 .ss2-title {
          margin: 0;
          color: #384967;
          font-weight: 300;
          line-height: 1.15;
        }

        .service-slider-2 .ss2-description {
          margin: 20px 0 0;
          max-width: 430px;
          color: #5F6F7A;
          font-weight: 300;
          text-align: justify;
          word-spacing: -0.04em;
        }

        .service-slider-2.is-rtl .ss2-description {
          white-space: pre-line;
        }

        .service-slider-2 .ss2-cta-row {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
        }

        .service-slider-2.is-rtl .ss2-cta-row {
          justify-content: flex-end;
        }

        .service-slider-2 .ss2-main-button {
          position: relative;
          width: 168px;
          height: 42px;
          border: 1px solid rgba(14, 65, 116, 0.35);
          border-radius: 999px;
          background: #fff;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
        }

        .service-slider-2 .ss2-main-button::before,
        .service-slider-2 .ss2-main-button::after {
          content: "";
          position: absolute;
          inset: 0;
          transition: transform 0.6s ease, border-radius 0.6s ease;
        }

        .service-slider-2 .ss2-main-button::before {
          z-index: 0;
          background: #fff;
          border-radius: 50% 50% 0 0;
          transform: translateY(100%) scaleY(0.5);
        }

        .service-slider-2 .ss2-main-button::after {
          z-index: 0;
          background: #0e4174;
        }

        .service-slider-2 .ss2-button-mask {
          position: relative;
          z-index: 1;
          display: block;
          height: 18px;
          overflow: hidden;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          line-height: 18px;
          text-transform: uppercase;
        }

        .service-slider-2.is-rtl .ss2-button-mask {
          letter-spacing: 0.05em;
          text-transform: none;
        }

        .service-slider-2 .ss2-button-mask span {
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          transition: transform 0.5s ease;
        }

        .service-slider-2 .ss2-button-mask span:first-child {
          color: #0e4174;
          transform: translateY(22px);
        }

        .service-slider-2 .ss2-button-mask span:last-child {
          color: #fff;
          transform: translateY(0);
        }

        .service-slider-2 .ss2-main-button:hover::after {
          border-radius: 0 0 50% 50%;
          transform: translateY(-100%) scaleY(0.5);
        }

        .service-slider-2 .ss2-main-button:hover::before {
          border-radius: 0;
          transform: translateY(0) scaleY(1);
        }

        .service-slider-2 .ss2-main-button:hover .ss2-button-mask span:first-child {
          transform: translateY(0);
        }

        .service-slider-2 .ss2-main-button:hover .ss2-button-mask span:last-child {
          transform: translateY(-22px);
        }

        .service-slider-2 .ss2-arrows {
          position: absolute;
          left: var(--content-l);
          bottom: 52px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .service-slider-2.is-rtl .ss2-arrows {
          left: var(--content-l);
          right: auto;
          flex-direction: row-reverse;
        }

        .service-slider-2 .ss2-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(14, 65, 116, 0.35);
          border-radius: 999px;
          background: rgba(245, 248, 252, 0.55);
          color: #0E4174;
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: background 0.4s ease, transform 0.4s ease, border-color 0.4s ease, color 0.4s ease;
        }

        .service-slider-2 .ss2-arrow:hover {
          background: rgba(14, 65, 116, 0.92);
          border-color: rgba(14, 65, 116, 0.92);
          color: #fff;
        }

        .service-slider-2 .ss2-arrow:first-child:hover {
          transform: translateX(-4px);
        }

        .service-slider-2 .ss2-arrow:last-child:hover {
          transform: translateX(4px);
        }

        .service-slider-2 .ss2-arrow svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
        }

        .service-slider-2 .ss2-arrow:disabled {
          pointer-events: none;
          opacity: 0.55;
        }

        @media (max-width: 1180px) {
          .service-slider-2 {
            --slide-w: 260px;
            --slide-h: 420px;
            --slide-top: 88px;
            --s2: 50%;
            --s3: calc(50% + 278px);
            --s4: calc(50% + 556px);
            --s5: calc(50% + 834px);
            --s6: calc(50% + 1112px);
            --content-w: 390px;
          }
        }

        @media (max-width: 900px) {
          .service-slider-2 {
            --slide-w: 190px;
            --slide-h: 250px;
            --slide-top: 315px;
            --s2: 8%;
            --s3: calc(8% + 208px);
            --s4: calc(8% + 416px);
            --s5: calc(8% + 624px);
            --s6: calc(8% + 832px);
            --content-w: 580px;
            height: 650px;
          }

          .service-slider-2::after {
            background: linear-gradient(
              to bottom,
              rgba(221, 229, 232, 0.96) 0%,
              rgba(221, 229, 232, 0.88) 45%,
              rgba(221, 229, 232, 0.58) 100%
            );
          }

          .service-slider-2 .ss2-copy {
            top: 70px;
            transform: none;
            max-width: calc(100% - 16%);
          }

          .service-slider-2 .ss2-arrows {
            left: auto;
            right: 8%;
            bottom: 44px;
          }

          .service-slider-2.is-rtl .ss2-arrows {
            left: 8%;
            right: auto;
          }
        }

        @media (max-width: 640px) {
          .service-slider-2 {
            --slide-w: 146px;
            --slide-h: 196px;
            --slide-top: 330px;
            --s2: 24px;
            --s3: 180px;
            --s4: 336px;
            --s5: 492px;
            --s6: 648px;
            --content-l: 24px;
            --content-w: calc(100vw - 48px);
            --pill-l: 18px;
            --pill-t: 18px;
            --pill-w: 28px;
            --pill-h: 58px;
            height: 620px;
          }

          .service-slider-2 .ss2-copy {
            top: 82px;
            left: 24px;
            width: calc(100% - 48px);
            max-width: calc(100% - 48px);
          }

          .service-slider-2.is-rtl .ss2-copy {
            left: 24px;
            right: auto;
          }

          .service-slider-2 .ss2-description {
            margin-top: 14px;
          }

          .service-slider-2 .ss2-cta-row {
            margin-top: 22px;
          }

          .service-slider-2 .ss2-main-button {
            width: 150px;
            height: 40px;
          }

          .service-slider-2 .ss2-card-caption {
            left: 14px;
            right: 14px;
            bottom: 14px;
          }

          .service-slider-2 .ss2-card-title {
            font-size: 11px;
          }

          .service-slider-2 .ss2-card-num {
            font-size: 10px;
          }

          .service-slider-2 .ss2-arrows {
            right: 24px;
            bottom: 42px;
          }

          .service-slider-2.is-rtl .ss2-arrows {
            left: 24px;
            right: auto;
          }

          .service-slider-2 .ss2-arrow {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      <div className="ss2-track" aria-live="polite">
        {slides.map((slide) => (
          <article
            className="ss2-slide"
            key={slide.id}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="ss2-card-caption" aria-hidden="true">
              <span className="ss2-card-num font-headline">{slide.num}</span>
              <span className="ss2-card-title font-headline">
                {slide.label}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="ss2-copy">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={{ opacity: 0, x: 72, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
            transition={{ duration: 0.72, ease: EASE }}
          >
            <div className="ss2-eyebrow font-headline" aria-hidden="true">
              {active?.num}
            </div>

            <h3
              className={`ss2-title font-headline ${
                isRTL
                  ? "text-[25px] md:text-[32px] lg:text-[38px]"
                  : "text-[28px] uppercase tracking-[-0.01em] md:text-[38px] lg:text-[48px]"
              }`}
            >
              {active?.label}
            </h3>

            <p
              className={`ss2-description font-subtext ${
                isRTL
                  ? "text-[15px] leading-[1.85] md:text-[16px]"
                  : "text-[13px] leading-[1.75] md:text-[14px] [hyphens:auto]"
              }`}
            >
              {active?.intro}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ss2-arrows" aria-label="Slider controls">
        <button
          type="button"
          className="ss2-arrow"
          onClick={() => moveSlider("prev")}
          aria-label="Previous service"
          disabled={locked}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path d="M20 25c-.3838 0-.7676-.1465-1.0605-.4395l-5.5-5.5c-.5859-.5854-.5859-1.5356 0-2.1211l5.5-5.5c.5859-.5859 1.5352-.5859 2.1211 0 .5859.5854.5859 1.5356 0 2.1211L16.6211 18l4.4395 4.4395c.5859.5854.5859 1.5356 0 2.1211-.293.293-.6768.4395-1.0605.4395z" />
          </svg>
        </button>
        <button
          type="button"
          className="ss2-arrow"
          onClick={() => moveSlider("next")}
          aria-label="Next service"
          disabled={locked}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path d="m22.5597 16.9375-5.5076-5.5c-.5854-.5854-1.5323-.5825-2.1157.0039-.5835.5869-.5815 1.5366.0039 2.1211l4.4438 4.4375-4.4438 4.4375c-.5854.5845-.5874 1.5342-.0039 2.1211.2922.2944.676.4414 1.0598.4414.3818 0 .7637-.1455 1.0559-.4375l5.5076-5.5c.2815-.2812.4403-.6636.4403-1.0625s-.1588-.7812-.4403-1.0625z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
