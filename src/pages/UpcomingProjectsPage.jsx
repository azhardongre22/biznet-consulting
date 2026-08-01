import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import bgImage from "../assets/images/optimized/upcoming-projects.webp";
import { useLanguage } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export default function UpcomingProjectsPage() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <main className="min-h-screen overflow-x-clip bg-[#020812] text-white">
      <Navbar />

      <section className="relative flex min-h-screen w-full items-start justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-[#06111d]/10" />

        <div className="relative z-10 mx-auto w-full max-w-[980px] px-6 pb-16 pt-[100px] md:px-10 md:pt-[110px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            dir={isRTL ? "rtl" : "ltr"}
            className="flex flex-col items-center text-center"
          >
            <motion.h1
              variants={fadeUp}
              className="font-headline text-[36px] font-light leading-[1] tracking-[-0.025em] text-[#164e87] md:text-[48px] lg:text-[56px]"
            >
              {t("upcomingProjects.titleLead")}{" "}
              <span className="text-[#164e87]">
                {t("upcomingProjects.titleEm")}
              </span>
            </motion.h1>

            <div className="mt-[22vh] flex flex-col items-center md:mt-[28vh]">
              <motion.p
                variants={fadeUp}
                className="w-fit max-w-[480px] rounded-lg bg-[#06111d]/20 px-4 py-3 font-bold whitespace-pre-line text-[14.5px] leading-[1.8] text-white backdrop-blur-[1px] md:text-[15px]"
              >
                {t("upcomingProjects.p2")}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-5 h-px w-[54px] bg-[#7C878E]"
              />

              <motion.p
                variants={fadeUp}
                className="mt-6 font-headline text-[22px] font-light leading-[1.35] text-white md:text-[26px]"
              >
                {t("upcomingProjects.closing")}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
