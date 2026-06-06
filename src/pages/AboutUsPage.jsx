import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ServiceGrid from "../components/ServiceGrid";
import HeroSlider from "../components/HeroSlider";
import Slider1Img from "../assets/images/about-slider-1-1.png";
import Slider2Img from "../assets/images/about-slider-2-2-2.png";
import Slider3Img from "../assets/images/about-slider-3.png";
import PhilosophyImg from "../assets/images/about-core-philosophy.png";
import { useLanguage } from "../i18n/LanguageContext";

const aboutSlideImages = [Slider1Img, Slider2Img, Slider3Img];
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
  const { t, tArray } = useLanguage();

  const slides = tArray("aboutPage.slides").map((s, i) => ({
    ...s,
    ctaHref: aboutSlideHrefs[i],
    bg: aboutSlideImages[i],
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
      <section className="relative overflow-hidden bg-[#020812] py-[120px] md:py-[160px]">
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
              className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#7C878E]"
            >
              <span className="h-px w-8 bg-[#7C878E]/70" />
              {t("aboutPage.philosophy.eyebrow")}
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl font-light leading-[0.98] tracking-[-0.025em] text-[#eef3f8] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            >
              {t("aboutPage.philosophy.titleLead")}{" "}
              <span className="font-light text-[#5aa9d6] uppercase  ">
                {t("aboutPage.philosophy.titleEm")}
              </span>
              <span className="block text-2xl text-[#7C878E] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl uppercase">
                {t("aboutPage.philosophy.titleSub")}
              </span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="mt-10 h-px w-[58px] bg-[#0E4174]"
            />

            <motion.p
              variants={fadeUp}
              className="font-subtext mt-8 max-w-[460px] break-words text-justify text-[16px] font-light leading-[1.85] text-[#b6c8d9] [hyphens:auto] [word-spacing:-0.04em]"
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
            <div className="relative overflow-hidden rounded-[2px] border border-white/10">
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
                  <p className="font-headline text-[22px] font-light italic leading-[1.4] text-[#eef3f8] md:text-[26px]">
                    {t("aboutPage.philosophy.quote")}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#7C878E]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#7C878E]">
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
      <section className="relative overflow-hidden bg-[#020812] py-[120px] md:py-[160px]">
        {/* ambient image backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020812] via-[#020812]/85 to-[#020812]" />
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
              className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#7C878E]"
            >
              <span className="h-px w-8 bg-[#7C878E]/70" />
              {t("aboutPage.values.eyebrow")}
              <span className="h-px w-8 bg-[#7C878E]/70" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl font-light leading-[0.98] tracking-[-0.025em] text-[#eef3f8] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            >
              {t("aboutPage.values.titleLead")}{" "}
              <span className=" text-[#5aa9d6]">{t("aboutPage.values.titleEm")}</span>{" "}
              {t("aboutPage.values.titleSuffix")}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="font-subtext mt-8 max-w-[700px] break-words text-center text-[15.5px] font-light leading-[1.85] text-[#b6c8d9] [hyphens:auto] [word-spacing:-0.04em]"
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
                className="group relative h-full overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.025] p-8 backdrop-blur-2xl transition-colors hover:border-[#0E4174]/70 md:p-10"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 0% 0%, rgba(14,65,116,0.25) 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex items-baseline gap-4">
                  <span className="font-headline text-[14px] font-light text-[#7C878E]">
                    0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <h3 className="relative mt-8 min-h-[62px] font-headline text-[24px] font-light leading-[1.2] text-[#eef3f8] md:min-h-[70px] md:text-[26px]">
                  {v.title}
                </h3>

                <p className="font-subtext relative mt-5 break-words text-justify text-[16px] font-light leading-[1.78] text-[#7C878E] [hyphens:auto] [word-spacing:-0.04em]">
                  {v.copy}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#04080f] py-[130px] md:py-[180px]">
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
                className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#7C878E]"
              >
                <span className="h-px w-8 bg-[#7C878E]/70" />
                {t("aboutPage.approach.eyebrow")}
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="font-headline text-3xl font-light leading-[1.05] tracking-[-0.02em] text-[#eef3f8] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              >
                {t("aboutPage.approach.title")}
                <span className="mt-3 block text-2xl  text-[#5aa9d6] sm:text-md md:text-lg lg:text-xl xl:text-2xl">
                  {t("aboutPage.approach.em")}
                </span>
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="relative mt-12 overflow-hidden rounded-[2px] border border-white/15 bg-white/[0.04] p-7 backdrop-blur-xl md:p-9"
              >
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />
                <p className="font-headline text-[24px] font-light italic leading-[1.35] text-[#eef3f8] md:text-[26px]">
                  {t("aboutPage.approach.quote")}
                </p>
                <p className="font-subtext mt-5 break-words text-justify text-[14.5px] font-light leading-[1.8] text-[#7C878E] [hyphens:auto] [word-spacing:-0.04em]">
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
              <div className="absolute left-[26px] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#384967]/60 to-transparent md:block" />

              <div className="space-y-6 md:space-y-8">
                {approachSteps.map((step) => (
                  <motion.div
                    key={step.n}
                    variants={fadeUp}
                    className="relative flex gap-6"
                  >
                    <div className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#020812]/80 backdrop-blur-md">
                      <span className="font-headline text-[16px] font-light text-[#7C878E]">
                        {step.n}
                      </span>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition-colors hover:border-[#0E4174]/60 md:p-7">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#7C878E]">
                        {step.label}
                      </div>
                      <p className="mt-3 font-subtext mt-5 break-words text-justify text-[14.5px] font-light leading-[1.8] text-[#7C878E] [hyphens:auto] [word-spacing:-0.04em]">
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
      <ServiceGrid />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
