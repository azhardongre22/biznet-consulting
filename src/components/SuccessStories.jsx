import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const imageModules = {
  ...import.meta.glob("../assets/images/success-stories*.png", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  ...import.meta.glob("../assets/images/success-stories*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  ...import.meta.glob("../assets/images/success-stories*.webp", {
    eager: true,
    query: "?url",
    import: "default",
  }),
};

const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

const EASE = [0.22, 1, 0.36, 1];

export default function SuccessStories() {
  const [marqueePaused, setMarqueePaused] = useState(false);
  const { t } = useLanguage();

  if (images.length === 0) return null;

  const duration = Math.max(20, images.length * 6);

  return (
    <section className="relative w-full overflow-hidden bg-[#020812] py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 mx-auto mb-12 max-w-4xl px-6 text-center md:mb-16"
      >
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-[#7C878E]">
          {t("successStories.eyebrow")}
        </p>

        <h2 className="font-headline text-[32px] font-light leading-[1.05] tracking-[-0.03em] text-white md:text-[46px] lg:text-[54px]">
          <span>{t("successStories.titleLead")}</span>{" "}
          <span className=" text-[#9FB4D4]">{t("successStories.titleEm")}</span>
        </h2>

        <div className="mx-auto mt-6 h-px w-16 bg-white/20" />
      </motion.div>

      <div
        dir="ltr"
        className="relative"
        onMouseEnter={() => setMarqueePaused(true)}
        onMouseLeave={() => setMarqueePaused(false)}
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#020812] to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#020812] to-transparent md:w-40" />

        <div
          className="success-stories-marquee-track flex w-max will-change-transform"
          style={{
            ["--success-marquee-duration"]: `${duration}s`,
          }}
        >
          {[0, 1].map((group) => (
            <ul
              key={group}
              aria-hidden={group === 1 ? true : undefined}
              className="m-0 flex shrink-0 list-none items-center gap-12 py-0 pr-12 pl-0 md:gap-20 md:pr-20"
            >
              {images.map((src, i) => (
                <li
                  key={`${group}-${i}`}
                  className="flex h-12 shrink-0 items-center justify-center md:h-14 lg:h-16"
                >
                  <img
                    src={src}
                    alt=""
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="pointer-events-none block h-full w-auto max-w-none object-contain select-none"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}