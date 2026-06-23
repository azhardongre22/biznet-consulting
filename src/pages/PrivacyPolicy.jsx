import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function PrivacyPolicy() {
  const { t, tArray, language } = useLanguage();
  const sections = tArray("privacyPolicy.sections");
  const isArabic = language === "ar";

  return (
    <main className="min-h-screen overflow-x-clip bg-[#020812] text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-[#020812] pt-[180px] pb-[100px] md:pt-[220px] md:pb-[140px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, rgba(14,65,116,0.35) 0%, transparent 60%), radial-gradient(50% 50% at 85% 80%, rgba(56,73,103,0.28) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative mx-auto w-full max-w-[1080px] px-6 md:px-10"
        >
          <motion.div
            variants={fadeUp}
            className={`mb-6 inline-flex items-center gap-3 font-medium text-[#7C878E] ${
              isArabic
                ? "text-[14px] tracking-normal md:text-[15px]"
                : "text-[11px] uppercase tracking-[0.42em]"
            }`}
          >
            <span className="h-px w-8 bg-[#7C878E]/70" />
            {t("privacyPolicy.eyebrow")}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`font-headline font-light leading-[1.1] text-[#eef3f8] ${
              isArabic
                ? "text-[52px] tracking-normal md:text-[80px] lg:text-[96px]"
                : "text-[44px] tracking-[-0.025em] md:text-[68px] lg:text-[80px]"
            }`}
          >
            {t("privacyPolicy.titleLead")}
            <span className="block font-light text-[#5aa9d6]">
              {t("privacyPolicy.titleEm")}
            </span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-10 h-px w-[58px] bg-[#0E4174]"
          />

          <motion.p
            variants={fadeUp}
            className={`font-subtext mt-8 max-w-[640px] break-words text-justify font-light text-[#b6c8d9] [hyphens:auto] [word-spacing:-0.04em] ${
              isArabic
                ? "whitespace-pre-line text-[20px] leading-[2] md:text-[22px]"
                : "text-[16px] leading-[1.85]"
            }`}
          >
            {t("privacyPolicy.intro")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className={`font-subtext mt-6 text-[#7C878E] ${
              isArabic
                ? "text-[15px] tracking-normal"
                : "text-[12px] uppercase tracking-[0.32em]"
            }`}
          >
            {t("privacyPolicy.lastUpdated")}
          </motion.p>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-[#04080f] py-[100px] md:py-[140px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(50% 60% at 80% 30%, rgba(14,65,116,0.20) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1080px] px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-16 overflow-hidden rounded-[2px] border border-white/15 bg-white/[0.04] p-7 backdrop-blur-xl md:mb-20 md:p-10"
          >
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />
            <p
              className={`font-headline break-words text-justify font-light text-[#eef3f8] [hyphens:auto] [word-spacing:-0.04em] ${
                isArabic
                  ? "text-[26px] leading-[1.7] md:text-[32px]"
                  : "text-[22px] italic leading-[1.45] md:text-[26px]"
              }`}
            >
              {t("privacyPolicy.quote")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#7C878E]" />
              <span
                className={`font-semibold text-[#7C878E] ${
                  isArabic
                    ? "text-[13px] tracking-normal"
                    : "text-[10px] uppercase tracking-[0.42em]"
                }`}
              >
                {t("privacyPolicy.quoteAttr")}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="space-y-12 md:space-y-16"
          >
            {sections.map((s) => (
              <motion.article
                key={s.n}
                variants={fadeUp}
                className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10"
              >
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-headline text-[14px] font-light text-[#7C878E]">
                      {s.n}
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <h2
                    className={`mt-5 font-headline font-light text-[#eef3f8] [overflow-wrap:break-word] [word-break:normal] ${
                      isArabic
                        ? "text-[30px] leading-[1.4] md:text-[36px]"
                        : "text-[26px] leading-[1.2] md:text-[30px]"
                    }`}
                  >
                    {s.title}
                  </h2>
                </div>

                <div className="space-y-5 md:col-span-8">
                  {(Array.isArray(s.body) ? s.body : [s.body]).map((p, i) =>
                    Array.isArray(p) ? (
                      <ul
                        key={i}
                        className={`font-subtext list-disc space-y-2 break-words text-justify font-light text-[#b6c8d9] [hyphens:auto] [word-spacing:-0.04em] ${
                          isArabic
                            ? "pr-5 pl-0 text-[18px] leading-[2] md:text-[19px]"
                            : "pl-5 text-[15px] leading-[1.85] md:text-[15.5px]"
                        }`}
                      >
                        {p.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={i}
                        className={`font-subtext block break-words text-justify font-light text-[#b6c8d9] [hyphens:auto] [word-spacing:-0.04em] ${
                          isArabic
                            ? "whitespace-pre-line text-[18px] leading-[2] md:text-[19px]"
                            : "text-[15px] leading-[1.85] md:text-[15.5px]"
                        }`}
                      >
                        {p}
                      </p>
                    ),
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-20 overflow-hidden rounded-[2px] border border-white/10 p-8 md:mt-28 md:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(14,65,116,0.55) 0%, rgba(56,73,103,0.35) 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0E4174]/30 via-[#384967]/10 to-transparent" />
            <div className="relative grid grid-cols-1 gap-8 text-center lg:grid-cols-12 lg:items-center lg:gap-12 lg:text-left">
              <div className="lg:col-span-7 xl:col-span-8">
                <div
                  className={`font-semibold text-[#eef3f8]/70 ${
                    isArabic
                      ? "text-[14px] tracking-normal sm:text-[15px]"
                      : "text-[11px] uppercase tracking-[0.32em] sm:tracking-[0.42em]"
                  }`}
                >
                  {t("privacyPolicy.ctaEyebrow")}
                </div>

                <p
                  className={`mx-auto mt-5 max-w-[760px] font-headline break-words font-light text-[#eef3f8] [hyphens:auto] [word-spacing:-0.04em] lg:mx-0 lg:text-justify ${
                    isArabic
                      ? "text-[30px] leading-[1.5] sm:text-[40px] md:text-[48px] lg:text-[46px] xl:text-[52px]"
                      : "text-[26px] leading-[1.25] sm:text-[34px] md:text-[42px] lg:text-[40px] xl:text-[46px]"
                  }`}
                >
                  {t("privacyPolicy.ctaTitle")}
                </p>
              </div>

              <div className="flex justify-center lg:col-span-5 lg:justify-end xl:col-span-4">
                <a
                  href="mailto:info@biznetconsulting.ae"
                  className="inline-flex w-auto max-w-full items-center justify-center gap-3 rounded-full border border-[#7C878E]/70 bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eef3f8] transition hover:bg-[#7C878E] hover:text-[#06101c] sm:px-6 sm:text-[11px] sm:tracking-[0.22em] xl:tracking-[0.28em]"
                >
                  <span>info@biznetconsulting.ae</span>
                  <span aria-hidden className="shrink-0">
                    &rarr;
                  </span>
                </a>
              </div>
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
