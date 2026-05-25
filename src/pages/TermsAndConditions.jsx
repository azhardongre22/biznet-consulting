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

export default function TermsAndConditions() {
  const { t, tArray } = useLanguage();
  const sections = tArray("terms.sections");

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
            className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#7C878E]"
          >
            <span className="h-px w-8 bg-[#7C878E]/70" />
            {t("terms.eyebrow")}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-headline text-[44px] font-light leading-[1] tracking-[-0.025em] text-[#eef3f8] md:text-[68px] lg:text-[80px]"
          >
            {t("terms.titleLead")}
            <span className="block  font-light text-[#5aa9d6]">
              {t("terms.titleEm")}
            </span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-10 h-px w-[58px] bg-[#0E4174]"
          />

          <motion.p
            variants={fadeUp}
            className="font-subtext mt-8 max-w-[640px] text-[16px] font-light leading-[1.85] text-[#b6c8d9]"
          >
            {t("terms.intro")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="font-subtext mt-6 text-[12px] uppercase tracking-[0.32em] text-[#7C878E]"
          >
            {t("terms.effective")}
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
            <p className="font-headline text-[22px] font-light italic leading-[1.45] text-[#eef3f8] md:text-[26px]">
              {t("terms.quote")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#7C878E]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#7C878E]">
                {t("terms.quoteAttr")}
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
                  <h2 className="mt-5 font-headline text-[26px] font-light leading-[1.2] text-[#eef3f8] md:text-[30px]">
                    {s.title}
                  </h2>
                </div>

                <div className="space-y-5 md:col-span-8">
                  {s.body.map((item, i) =>
                    Array.isArray(item) ? (
                      <ul
                        key={i}
                        className="font-subtext space-y-2 pl-1 text-[15px] font-light leading-[1.85] text-[#b6c8d9] md:text-[15.5px]"
                      >
                        {item.map((li, j) => (
                          <li
                            key={j}
                            className="relative pl-6 before:absolute before:left-0 before:top-[0.85em] before:h-px before:w-3 before:bg-[#7C878E]/70"
                          >
                            {li}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={i}
                        className="font-subtext text-[15px] font-light leading-[1.85] text-[#b6c8d9] md:text-[15.5px]"
                      >
                        {item}
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
            <div className="relative mx-auto max-w-[980px] text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#eef3f8]/70 sm:text-[11px] sm:tracking-[0.42em]">
                {t("terms.ctaEyebrow")}
              </div>

              <p className="mx-auto mt-5 max-w-[900px] font-headline text-[24px] font-light leading-[1.3] text-[#eef3f8] sm:text-[30px] md:text-[38px] lg:text-[44px] xl:text-[48px]">
                {t("terms.ctaTitle")}
              </p>

              <div className="mt-8 flex justify-center">
                <a
                  href="mailto:hello@biznetconsulting.com"
                  className="inline-flex min-h-[50px] w-full max-w-[320px] items-center justify-center gap-2 rounded-full border border-[#7C878E]/70 bg-white/[0.04] px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#eef3f8] transition hover:bg-[#7C878E] hover:text-[#06101c] sm:max-w-[380px] sm:gap-3 sm:px-6 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  <span className="whitespace-nowrap">
                    hello@biznetconsulting.com
                  </span>
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
