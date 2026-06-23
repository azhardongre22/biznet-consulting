import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ceoImage from "../assets/images/ceo4.jpg";
import LightRays from "./LightRays";
import { useLanguage } from "../i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1];

const CEOMessage = () => {
  const sectionRef = useRef(null);
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.96, 1.02, 0.98],
  );
  const quote = t("ceoMessage.quote");

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-gradient-to-b from-[#06131F] to-[#020812] py-12 text-white sm:py-14 md:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 z-1 min-h-full overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.7}
          lightSpread={1}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.06}
          distortion={0}
          className="custom-rays"
          fadeDistance={2}
          saturation={0}
        />
      </div>

      {/* Section eyebrow */}
      <div className="relative z-20 mx-auto mb-8 max-w-[1540px] px-7 md:mb-10 md:px-[102px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-12 bg-[#7C878E]" />
          <span
            className={`font-subtext font-semibold text-[#7C878E] ${
              isRTL
                ? "text-[12px] tracking-normal"
                : "text-[10px] uppercase tracking-[0.42em]"
            }`}
          >
            {t("ceoMessage.eyebrow")}
          </span>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto grid max-w-[1540px] gap-10 px-7 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-center md:gap-16 md:px-[102px] lg:gap-20">
        {/* LEFT — CEO IMAGE */}
        <motion.div
          style={{ y: imageY }}
          className="relative md:flex md:min-h-0 md:h-full"
        >
          <div className="relative mx-auto flex w-full max-w-[460px] flex-col md:mx-0 md:h-full md:min-h-0 md:max-w-none">
            <span className="pointer-events-none absolute -left-3 -top-3 z-30 h-10 w-10 border-l border-t border-[#7C878E]/55 md:-left-5 md:-top-5 md:h-14 md:w-14" />
            <span className="pointer-events-none absolute -bottom-3 -right-3 z-30 h-10 w-10 border-b border-r border-[#7C878E]/55 md:-bottom-5 md:-right-5 md:h-14 md:w-14" />

            <motion.div
              style={{ scale: imageScale }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.2, ease: EASE }}
              className="group relative aspect-[4/5] w-full min-h-[260px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#06111d] shadow-[0_50px_140px_rgba(0,0,0,0.55)] md:aspect-auto md:min-h-0 md:flex-1"
            >
              <img
                src={ceoImage}
                alt="Ismail Al Hammadi, Chief Executive Officer"
                loading="lazy"
                decoding="async"
                // Brightness + slight contrast lift to address feedback
                // that the portrait was reading too dark on the page.
                style={{ filter: "brightness(1.18) contrast(1.04)" }}
                className="absolute inset-0 h-full w-full object-cover object-[center_22%] transition duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />

              {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#02060c]/0 via-[#020812]/15 to-[#020812]/85" /> */}
              {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#020812]/45 via-transparent to-[#0d2640]/25 mix-blend-multiply" /> */}
            </motion.div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-[60px] w-[78%] -translate-x-1/2 rounded-[50%] bg-[#7C878E]/[0.18] blur-[40px]" />
          </div>
        </motion.div>

        {/* RIGHT — QUOTE */}
        <div className="relative md:flex md:min-h-0 md:flex-col md:justify-center md:pt-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            className="relative overflow-visible"
          >
            <div className="relative z-10">
              <motion.blockquote
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1, ease: EASE }}
                className={`font-headline max-w-[720px] break-words text-justify font-light text-[#dce8f2] drop-shadow-[0_0_20px_rgba(232,216,168,0.18)] [word-spacing:-0.04em] ${
                  isRTL
                    ? "whitespace-pre-line text-[18px] leading-[1.85] sm:text-[20px] md:text-[24px] md:leading-[1.75] lg:text-[28px] lg:leading-[1.7]"
                    : "text-[16px] leading-[1.7] tracking-[-0.01em] [hyphens:auto] sm:text-[18px] md:text-[22px] md:leading-[1.6] lg:text-[26px] lg:leading-[1.5]"
                }`}
              >
                {isRTL ? null : (
                  <span className="text-[#7C878E]/45">&ldquo;</span>
                )}
                {quote}
                {isRTL ? null : (
                  <span className="text-[#7C878E]/45">&rdquo;</span>
                )}
              </motion.blockquote>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1, ease: EASE, delay: 0.35 }}
                className="mt-10 flex items-center gap-6 md:mt-12 lg:mt-14"
              >
                <div className="h-px w-12 shrink-0 bg-[#7C878E]" />
                <div>
                  <p
                    className={`font-headline font-light leading-none text-white ${
                      isRTL
                        ? "text-[24px] md:text-[28px]"
                        : "text-[22px] md:text-[26px]"
                    }`}
                  >
                    {t("ceoMessage.ceoName")}
                  </p>
                  <p
                    className={`font-subtext mt-2 font-semibold text-[#7C878E] ${
                      isRTL
                        ? "text-[12px] tracking-normal"
                        : "text-[10px] uppercase tracking-[0.36em]"
                    }`}
                  >
                    {t("ceoMessage.ceoTitle")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CEOMessage;
