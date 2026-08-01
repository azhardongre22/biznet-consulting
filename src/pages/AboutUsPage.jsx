import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ServiceSliderNew from "../components/ServiceSliderNew";
import HeroSlider from "../components/HeroSlider";
import Slider1Img from "../assets/images/optimized/about-slider-1-1.webp";
import Slider2Img from "../assets/images/optimized/about-slider-2-2-2.webp";
import Slider3Img from "../assets/images/optimized/about-slider-3.webp";
import SliderMobImg from "../assets/images/optimized/mobile-view-slider1.webp";

import PhilosophyImg from "../assets/images/optimized/about-core-philosophy.webp";
import { useLanguage } from "../i18n/LanguageContext";

const aboutSlideImages = [Slider1Img, Slider2Img, Slider3Img];
const aboutSlideMobileImages = [undefined, undefined, SliderMobImg];
const aboutSlideHrefs = ["/about", "/services", "/contact"];
const aboutSlideBgPositions = ["right-soft", undefined, undefined];

const Footer = lazy(() => import("../components/Footer"));

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function AboutUsPage() {
  const { t, tArray, language } = useLanguage();
  const isRTL = language === "ar";

  const slides = tArray("aboutPage.slides").map((s, i) => ({
    ...s,
    ctaHref: aboutSlideHrefs[i],
    bg: aboutSlideImages[i],
    bgMobile: aboutSlideMobileImages[i],
    bgPositionMobile: aboutSlideBgPositions[i],
    ...(i === 0 ? {} : { titleBottom: undefined }),
  }));

  const values = tArray("aboutPage.values.items");
  const approachSteps = tArray("aboutPage.approach.steps");

  return (
    <main className="min-h-screen overflow-x-clip bg-[#020812] text-white">
      <Navbar />
      <HeroSlider slides={slides} sectionId="home" autoPlay={true} />

      {/* ============ PHILOSOPHY — FIRASAH ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3F8] to-[#DDE5E8] py-[120px] md:py-[50px]">
        {/* atmospheric backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, rgba(14,65,116,0.35) 0%, transparent 60%), radial-gradient(50% 50% at 85% 80%, rgba(56,73,103,0.28) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            // backgroundImage:
            //   "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10 lg:gap-16">
          {/* Left — eyebrow + heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="md:col-span-5"
          >
            <motion.div
              variants={fadeUp}
              className={`mb-6 inline-flex items-center gap-3 font-medium text-[#384967] ${
                isRTL
                  ? "text-[13px] tracking-normal"
                  : "text-[11px] uppercase tracking-[0.42em]"
              }`}
            >
              <span className="h-px w-8 bg-[#384967]" />
              {t("aboutPage.philosophy.eyebrow")}
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className={`font-headline font-light leading-[1.1] text-[#384967] ${
                isRTL
                  ? "text-[32px] tracking-normal sm:text-[24px] md:text-[28px] lg:text-[34px] xl:text-[40px]"
                  : "text-3xl tracking-[-0.025em] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              }`}
            >
              {t("aboutPage.philosophy.titleLead")}{" "}
              <span
                className={`font-light text-[#0E4174] ${
                  isRTL ? "" : "uppercase"
                }`}
              >
                {t("aboutPage.philosophy.titleEm")}
              </span>
              <span
                className={`block text-[#384967] ${
                  isRTL
                    ? "text-[26px] sm:text-[22px] md:text-[26px] lg:text-[32px] xl:text-[38px]"
                    : "text-2xl uppercase sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                }`}
              >
                {t("aboutPage.philosophy.titleSub")}
              </span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="mt-10 h-px w-[58px] bg-[#0E4174]"
            />

            <motion.p
              variants={fadeUp}
              className={`font-subtext mt-8 max-w-[460px] wrap-break-words text-justify  text-[#5F6F7A] [word-spacing:-0.04em] ${
                isRTL
                  ? "whitespace-pre-line text-[18px] leading-[1.85]"
                  : "text-[16px] leading-[1.85] [hyphens:auto]"
              }`}
            >
              {t("aboutPage.philosophy.body")}
            </motion.p>
          </motion.div>

          {/* Right — Glass card with image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-[2px] border border-[#C7D1D8]">
              <img
                src={PhilosophyImg}
                alt="Desert architecture inspired by Emirati heritage"
                className="h-[420px] w-full object-cover md:h-[560px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020812]/85 via-[#020812]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E4174]/20 via-transparent to-transparent" />

              {/* glass quote card */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                <div className="rounded-[2px] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
                  <p
                    className={`font-headline font-light leading-[1.5] text-[#eef3f8] ${
                      isRTL
                        ? "text-[24px] md:text-[28px]"
                        : "text-[22px] italic md:text-[26px]"
                    }`}
                  >
                    {t("aboutPage.philosophy.quote")}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#7C878E]" />
                    <span
                      className={`font-semibold text-[#7C878E] ${
                        isRTL
                          ? "text-[12px] tracking-normal"
                          : "text-[10px] uppercase tracking-[0.42em]"
                      }`}
                    >
                      {t("aboutPage.philosophy.quoteAttr")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* floating frame accent */}
            <div className="pointer-events-none absolute -bottom-6 -right-6 hidden h-[140px] w-[140px] border-b border-r border-[#0E4174]/60 md:block" />
          </motion.div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="relative overflow-hidden bg-[#DDE5E8] py-[30px] md:py-[50px]">
        {/* ambient image backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"

        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(14,65,116,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-14 flex flex-col items-center text-center md:mb-20"
          >
            <motion.div
              variants={fadeUp}
              className={`mb-6 inline-flex items-center gap-3 font-medium text-[#384967] ${
                isRTL
                  ? "text-[13px] tracking-normal"
                  : "text-[11px] uppercase tracking-[0.42em]"
              }`}
            >
              <span className="h-px w-8 bg-[#384967]" />
              {t("aboutPage.values.eyebrow")}
              <span className="h-px w-8 bg-[#384967]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className={`font-headline font-light leading-[1.1] text-[#384967] ${
                isRTL
                  ? "text-[32px] tracking-normal sm:text-[24px] md:text-[28px] lg:text-[34px] xl:text-[40px]"
                  : "text-3xl tracking-[-0.025em] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              }`}
            >
              {t("aboutPage.values.titleLead")}{" "}
              <span className=" text-[#0E4174]">{t("aboutPage.values.titleEm")}</span>{" "}
              {t("aboutPage.values.titleSuffix")}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className={`font-subtext mt-8 max-w-[700px] wrap-break-words text-center text-[#5F6F7A] [word-spacing:-0.04em] ${
                isRTL
                  ? "text-[17.5px] leading-[1.85]"
                  : "text-[15.5px] leading-[1.85] [hyphens:auto]"
              }`}
            >
              {t("aboutPage.values.body")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full overflow-hidden rounded-[2px] border border-[#C7D1D8] bg-[#F5F8FC] p-8 shadow-[0_4px_16px_rgba(56,73,103,0.06)] transition-all duration-500 hover:border-[#0E4174] hover:shadow-[0_14px_36px_rgba(14,65,116,0.12)] md:p-10"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 0% 0%, rgba(14,65,116,0.06) 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex items-baseline gap-4">
                  <span className="font-headline text-[14px] font-light text-[#0E4174]">
                    0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-[#C7D1D8]" />
                </div>

                <h3
                  className={`relative mt-8 min-h-[62px] font-headline font-light leading-[1.2] text-[#384967] md:min-h-[70px] ${
                    isRTL
                      ? "text-[26px] md:text-[28px]"
                      : "text-[24px] md:text-[26px]"
                  }`}
                >
                  {v.title}
                </h3>

                <p
                  className={`font-subtext relative mt-5 break-words text-justify font-light text-[#5F6F7A] [word-spacing:-0.04em] ${
                    isRTL
                      ? "whitespace-pre-line text-[18px] leading-[1.85]"
                      : "text-[16px] leading-[1.78] [hyphens:auto]"
                  }`}
                >
                  {v.copy}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#DDE5E8] py-[30px] md:py-[50px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(50% 60% at 80% 30%, rgba(14,65,116,0.30) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Left — big question */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="lg:col-span-5"
            >
              <motion.div
                variants={fadeUp}
                className={`mb-6 inline-flex items-center gap-3 font-medium text-[#384967] ${
                  isRTL
                    ? "text-[13px] tracking-normal"
                    : "text-[11px] uppercase tracking-[0.42em]"
                }`}
              >
                <span className="h-px w-8 bg-[#384967]" />
                {t("aboutPage.approach.eyebrow")}
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className={`font-headline font-light leading-[1.15] text-[#384967] ${
                  isRTL
                    ? "text-[32px] tracking-normal sm:text-[24px] md:text-[28px] lg:text-[34px] xl:text-[40px]"
                    : "text-3xl tracking-[-0.02em] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                }`}
              >
                {t("aboutPage.approach.title")}
                <span
                  className={`mt-3 block text-[#0E4174] ${
                    isRTL
                      ? "text-[26px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[28px]"
                      : "text-2xl sm:text-md md:text-lg lg:text-xl xl:text-2xl"
                  }`}
                >
                  {t("aboutPage.approach.em")}
                </span>
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="relative mt-12 overflow-hidden rounded-[2px] border border-[#C7D1D8] bg-[#F5F8FC] p-7 shadow-[0_4px_16px_rgba(56,73,103,0.06)] md:p-9"
              >
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />
                <p
                  className={`font-headline font-light leading-[1.5] text-[#384967] ${
                    isRTL
                      ? "text-[26px] md:text-[28px]"
                      : "text-[24px] italic md:text-[26px]"
                  }`}
                >
                  {t("aboutPage.approach.quote")}
                </p>
                <p
                  className={`font-subtext mt-5 break-words text-justify font-light text-[#5F6F7A] [word-spacing:-0.04em] ${
                    isRTL
                      ? "whitespace-pre-line text-[16.5px] leading-[1.85]"
                      : "text-[14.5px] leading-[1.8] [hyphens:auto]"
                  }`}
                >
                  {t("aboutPage.approach.quoteCopy")}
                </p>
              </motion.div>
            </motion.div>

            {/* Right — vertical step rail */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="relative lg:col-span-6 lg:col-start-7"
            >
              <div className="absolute left-[26px] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#384967] to-transparent md:block" />

              <div className="space-y-6 md:space-y-8">
                {approachSteps.map((step) => (
                  <motion.div
                    key={step.n}
                    variants={fadeUp}
                    className="relative flex gap-6"
                  >
                    <div className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#0E4174] bg-[#0E4174] shadow-[0_6px_18px_rgba(14,65,116,0.22)]">
                      <span className="font-headline text-[16px] font-light text-white">
                        {step.n}
                      </span>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-[2px] border border-[#C7D1D8] bg-[#F5F8FC] p-6 shadow-[0_4px_16px_rgba(56,73,103,0.06)] transition-all duration-500 hover:border-[#0E4174] hover:shadow-[0_12px_30px_rgba(14,65,116,0.12)] md:p-7">
                      <div
                        className={`font-semibold text-[#0E4174] ${
                          isRTL
                            ? "text-[12px] tracking-normal"
                            : "text-[10px] uppercase tracking-[0.42em]"
                        }`}
                      >
                        {step.label}
                      </div>
                      <p
                        className={`mt-3 font-subtext mt-5 break-words text-justify font-light text-[#5F6F7A] [word-spacing:-0.04em] ${
                          isRTL
                            ? "text-[16.5px] leading-[1.85]"
                            : "text-[14.5px] leading-[1.8] [hyphens:auto]"
                        }`}
                      >
                        {step.copy}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES — PROJECT DEVELOPMENT ============ */}
      <ServiceSliderNew />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
