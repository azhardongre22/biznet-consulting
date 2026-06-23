import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialMediaIcons from "../components/SocialMediaIcons";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1];

function SlideButton({
  children,
  loadingChildren,
  loading,
  disabled,
  className = "",
}) {
  const content = loading ? loadingChildren : children;

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={`inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#0E4174] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-[#06101c] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px] sm:w-fit ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <span>{content}</span>
        <span>→</span>
      </span>
    </button>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export default function ComingSoon({ ns = "comingSoon", source = "coming-soon" }) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const eyebrow = t(`${ns}.eyebrow`);
  const headlinePrefix = t(`${ns}.headlinePrefix`);
  const headlineEm = t(`${ns}.headlineEm`);
  const cardEyebrow = t(`${ns}.cardEyebrow`);
  const cardDescription = t(`${ns}.cardDescription`);
  const buttonLabel = t(`${ns}.buttonLabel`);
  const footerLabel = t(`${ns}.footerLabel`);
  const companyLabel = t("comingSoon.copyright");
  const locationLabel = t("comingSoon.location");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHp, setNewsletterHp] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [newsletterState, setNewsletterState] = useState({
    loading: false,
    ok: false,
    message: "",
    error: "",
  });

  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterConsent) {
      setNewsletterState({
        loading: false,
        ok: false,
        message: "",
        error: t("footer.consentRequired"),
      });
      return;
    }
    setNewsletterState({ loading: true, ok: false, message: "", error: "" });
    try {
      const resp = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          consent: newsletterConsent,
          source,
          page:
            typeof window !== "undefined" ? window.location.href : undefined,
          website: newsletterHp,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || t("footer.contactOk"));
      const message = data?.message || t("footer.subscribedDefault");
      setNewsletterState({ loading: false, ok: true, message, error: "" });
      setNewsletterEmail("");
      setNewsletterHp("");
    } catch (err) {
      setNewsletterState({
        loading: false,
        ok: false,
        message: "",
        error: err?.message || t("footer.contactOk"),
      });
    }
  };

  const showEyebrow = eyebrow && eyebrow !== `${ns}.eyebrow`;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#EEF3F8] to-[#DDE5E8] text-[#384967]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(45% 60% at 12% 35%, rgba(14,65,116,0.20) 0%, transparent 60%), radial-gradient(35% 45% at 22% 50%, rgba(90,169,214,0.14) 0%, transparent 60%), radial-gradient(40% 50% at 88% 70%, rgba(56,73,103,0.16) 0%, transparent 60%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(120% 60% at 18% 40%, rgba(14,65,116,0.10) 0%, transparent 45%), radial-gradient(80% 40% at 30% 55%, rgba(90,169,214,0.06) 0%, transparent 50%)",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#EEF3F8] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#DDE5E8] via-[#DDE5E8]/70 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#384967]/20 to-transparent" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-1 flex-col items-center px-6 pt-20 text-center md:px-10 md:pt-28"
          >
            {showEyebrow && (
              <motion.span
                variants={fadeUp}
                className="font-subtext text-[11px] font-medium uppercase tracking-[0.42em] text-[#0E4174]"
              >
                {eyebrow}
              </motion.span>
            )}

            <motion.h1
              variants={fadeUp}
              className="mt-7 font-headline font-light leading-[1] tracking-[-0.025em] text-[#384967] text-3xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            >
              {headlinePrefix}{" "}
              <span className="font-light text-[#0E4174]">{headlineEm}</span>
              {/* <span className="text-[#0E4174]"></span> */}
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="relative mt-10 w-full max-w-[640px] overflow-hidden rounded-[28px] border border-[#C7D1D8] bg-[#F5F8FC] shadow-[0_14px_44px_rgba(56,73,103,0.10)]"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0E4174]/30 to-transparent" />

              <div
                className={`relative px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0E4174]">
                  {cardEyebrow}
                </p>

                <p className="mt-3 max-w-[440px] whitespace-pre-line text-[13.5px] leading-relaxed text-[#5F6F7A] md:text-[14px]">
                  {cardDescription}
                </p>

                <form
                  className="mt-5 flex min-w-0 flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center"
                  onSubmit={submitNewsletter}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      top: "auto",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={newsletterHp}
                        onChange={(e) => setNewsletterHp(e.target.value)}
                      />
                    </label>
                  </div>

                  <input
                    className="h-11 min-h-[44px] min-w-0 flex-1 rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                    placeholder={t("footer.emailPlaceholder")}
                    type="email"
                    autoComplete="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterState((s) =>
                        s.ok || s.error
                          ? { loading: false, ok: false, message: "", error: "" }
                          : s,
                      );
                    }}
                  />

                  <SlideButton
                    loading={newsletterState.loading}
                    loadingChildren={t("footer.subscribing")}
                    className="w-full shrink-0 sm:w-fit"
                  >
                    {buttonLabel}
                  </SlideButton>
                </form>

                <label
                  className={`mt-4 flex cursor-pointer items-start gap-2.5 text-[11px] leading-[1.55] text-[#5F6F7A] ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={(e) => {
                      setNewsletterConsent(e.target.checked);
                      setNewsletterState((s) =>
                        s.ok || s.error
                          ? { loading: false, ok: false, message: "", error: "" }
                          : s,
                      );
                    }}
                    className="mt-[2px] h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#0E4174]"
                  />
                  <span>
                    {t("footer.consentPrefix")}
                    <Link
                      to="/privacy-policy"
                      className="text-[#384967] underline decoration-[#384967]/30 underline-offset-2 transition hover:text-[#0E4174]"
                    >
                      {t("footer.consentLink")}
                    </Link>
                    {t("footer.consentSuffix")}
                  </span>
                </label>

                {newsletterState.ok ? (
                  <p className="mt-3 text-[12px] text-emerald-700">
                    {newsletterState.message || t("footer.subscribedDefault")}
                  </p>
                ) : null}
                {newsletterState.error ? (
                  <p className="mt-3 text-[12px] text-red-700">
                    {newsletterState.error}
                  </p>
                ) : null}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <SocialMediaIcons direction="row" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-subtext relative z-10 flex items-center justify-center gap-3 px-6 pb-6 text-[10px] font-medium uppercase tracking-[0.28em] text-[#5F6F7A] md:pb-8"
          >
            <span>© {new Date().getFullYear()} {companyLabel}</span>
            <span className="h-1 w-1 rounded-full bg-[#5F6F7A]/60" />
            <span>{locationLabel}</span>
            <span className="h-1 w-1 rounded-full bg-[#5F6F7A]/60" />
            <span>{footerLabel}</span>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
