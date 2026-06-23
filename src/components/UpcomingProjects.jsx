import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function UpcomingProjects() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full overflow-hidden bg-[#DDE5E8] py-[100px] md:py-[140px]">
      {/* Atmospheric radial palette wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 18% 18%, rgba(14,65,116,0.32) 0%, transparent 60%), radial-gradient(55% 55% at 85% 82%, rgba(56,73,103,0.26) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid lines */}
      {/* <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      /> */}

      {/* Soft top/bottom edge gradients — color-matched to the section's bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#DDE5E8] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#DDE5E8] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[980px] px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#384967]"
          >
            <span className="h-px w-8 bg-[#384967]" />
            {t("upcomingProjects.eyebrow")}
            <span className="h-px w-8 bg-[#384967]" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-8 font-headline text-[36px] font-light leading-[1] tracking-[-0.025em] text-[#384967] md:text-[48px] lg:text-[56px]"
          >
            {t("upcomingProjects.titleLead")}{" "}
            <span className="mt-8 font-headline text-[36px] font-light leading-[1] tracking-[-0.025em] md:text-[48px] lg:text-[56px] text-[#0E4174]">
              {t("upcomingProjects.titleEm")}
            </span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="mt-8 h-px w-[54px] bg-[#0E4174]"
          />

          <motion.p
            variants={fadeUp}
            className="font-subtext mt-10 max-w-[640px] text-[15px] font-light leading-[1.8] text-[#384967] md:text-[16px]"
          >
            {t("upcomingProjects.p1")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="font-subtext mt-5 max-w-[640px] text-[14.5px] font-light leading-[1.8] text-[#5F6F7A] md:text-[15px]"
          >
            {t("upcomingProjects.p2")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-headline text-[22px] font-light leading-[1.35] text-[#384967] md:text-[26px]"
          >
            {t("upcomingProjects.closing")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default UpcomingProjects;
