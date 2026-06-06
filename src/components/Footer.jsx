import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { useState } from "react";
import BNLogo from "../assets/images/BN_Logo.png";
import BiznetSecondaryLogo from "../assets/images/biznet-sec-white.png";
import BiznetTagline from "../assets/images/biznet-tagline.png";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

// Submit button with a two-layer slide reveal on hover. The visible label
// slides up and out while a duplicate slides in from below with a skewed
// white wash. Same DOM pattern as the user-provided design, adapted to
// the site palette.
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
      className={`inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#7C878E] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#06101c] transition-all duration-300 hover:bg-white hover:text-[#06101c] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px] sm:w-fit ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <span>{content}</span>
        <span>→</span>
      </span>
    </button>
  );
}
function Footer() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const startText = isRTL ? "sm:text-right" : "sm:text-left";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHp, setNewsletterHp] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [newsletterState, setNewsletterState] = useState({
    loading: false,
    ok: false,
    message: "",
    error: "",
  });

  const [footerContact, setFooterContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [footerContactState, setFooterContactState] = useState({
    loading: false,
    ok: false,
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
          source: "footer",
          page:
            typeof window !== "undefined" ? window.location.href : undefined,
          website: newsletterHp,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || "Failed to subscribe.");
      const message =
        data?.message ||
        (data?.status === "already_subscribed"
          ? "This email is already subscribed."
          : data?.status === "pending"
            ? "Almost there — check your inbox to confirm your subscription."
            : "You're subscribed — a welcome email is on its way.");
      setNewsletterState({ loading: false, ok: true, message, error: "" });
      setNewsletterEmail("");
      setNewsletterHp("");
    } catch (err) {
      setNewsletterState({
        loading: false,
        ok: false,
        message: "",
        error: err?.message || "Failed to subscribe.",
      });
    }
  };

  const submitFooterContact = async (e) => {
    e.preventDefault();
    setFooterContactState({ loading: true, ok: false, error: "" });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...footerContact, source: "footer" }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || "Failed to send.");
      setFooterContactState({ loading: false, ok: true, error: "" });
      setFooterContact({ name: "", email: "", message: "" });
    } catch (err) {
      setFooterContactState({
        loading: false,
        ok: false,
        error: err?.message || "Failed to send.",
      });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020812] text-white">
      {/* Subtle grid + atmospheric layers */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/2 via-transparent to-black/40" />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/2 via-transparent to-black/40" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 max-w-[100vw] select-none translate-x-[-50%] translate-y-[18%] overflow-hidden text-center font-['Cormorant_Garamond',Georgia,serif] text-[clamp(3.25rem,12vw,5.375rem)] font-light leading-none tracking-[-0.04em] text-white/5 sm:translate-y-[20%] md:text-[150px] lg:text-[180px]">
        BIZNET
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-12 sm:px-6 sm:pb-28 sm:pt-14 md:px-10 md:pb-32 md:pt-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left: logo */}
          <div className="min-w-0 lg:col-span-6">
            <div className="flex min-w-0 flex-col px-0 text-center sm:px-2 lg:px-8 lg:pl-16 lg:text-left">
              <div className="flex w-full max-w-[360px] flex-col items-center self-center lg:self-start">
                <img
                  src={BNLogo}
                  alt="Biznet logo"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-[120px] object-contain opacity-95 sm:w-[140px] md:w-[160px]"
                />

                <img
                  src={BiznetSecondaryLogo}
                  alt="Biznet secondary logo"
                  loading="lazy"
                  decoding="async"
                  className="mt-3 h-auto w-[min(100%,180px)] max-w-[180px] object-contain opacity-95 sm:mt-4 sm:max-w-none sm:w-[180px] md:w-[210px]"
                />

                <img
                  src={BiznetTagline}
                  alt="Biznet tagline"
                  loading="lazy"
                  decoding="async"
                  className="mt-2 h-auto w-[min(100%,210px)] max-w-[210px] object-contain opacity-90 sm:mt-3 sm:max-w-none sm:w-[210px] md:w-[250px]"
                />
              </div>
            </div>
          </div>

          {/* Right: partnership text + contact */}
          <div className="min-w-0 lg:col-span-6">
            <p className="max-w-[520px] text-left text-[15px] leading-relaxed text-white/78 md:mx-auto md:text-center lg:mx-0 lg:text-left">
              {t("footer.partnership")}
            </p>
            <div className="mt-6 flex w-full min-w-0 flex-col items-start gap-4 text-[15px] leading-relaxed text-white/80 sm:mt-7 md:items-center lg:items-start lg:text-[16px]">
              <a
                href="mailto:hello@biznetconsulting.com"
                className="flex w-full max-w-[420px] items-start justify-start gap-3 transition hover:text-white md:justify-center lg:justify-start"
              >
                <span className="inline-flex h-[1.25em] w-[18px] shrink-0 items-center justify-center pt-0.5">
                  <FaEnvelope
                    className="text-[13px] text-[#7C878E]"
                    aria-hidden
                  />
                </span>
                <span
                  dir="ltr"
                  className="min-w-0 break-words text-left md:text-center lg:text-left"
                >
                  hello@biznetconsulting.com
                </span>
              </a>

              <a
                href="https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full max-w-[420px] items-start justify-start gap-3 transition hover:text-white md:justify-center lg:justify-start"
              >
                <span className="inline-flex h-[1.25em] w-[18px] shrink-0 items-center justify-center pt-0.5">
                  <FaMapMarkerAlt
                    className="text-[14px] text-[#7C878E]"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 text-left md:text-center lg:text-left">
                  {t("footer.address")}
                </span>
              </a>
              <div className="flex w-full max-w-[420px] flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:gap-x-6 md:justify-center lg:justify-start">
                <a
                  href="tel:+971527488855"
                  className="flex items-center justify-start gap-3 transition hover:text-white"
                >
                  <span className="inline-flex h-[1.25em] w-[18px] shrink-0 items-center justify-center">
                    <FaMobileAlt
                      className="text-[14px] text-[#7C878E]"
                      aria-hidden
                    />
                  </span>
                  <span dir="ltr">+971 52 748 8855</span>
                </a>

                <a
                  href="tel:+97143433334"
                  className="flex items-center justify-start gap-3 transition hover:text-white"
                >
                  <span className="inline-flex h-[1.25em] w-[18px] shrink-0 items-center justify-center">
                    <FaPhoneAlt
                      className="text-[13px] text-[#7C878E]"
                      aria-hidden
                    />
                  </span>
                  <span dir="ltr">04 343 3334</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter + contact form on same line */}
        <div className="mt-8 flex w-full min-w-0 flex-col gap-5 md:flex-row md:items-stretch">
          {/* Newsletter subscribe */}
          <div
            className="flex w-full min-w-0 flex-col rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-md sm:p-5 md:w-1/2 md:p-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className={`text-center ${startText}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                {t("footer.newsletterEyebrow")}
              </p>

              <p
                className={`mx-auto mt-3 max-w-[420px] break-words text-justify text-[13px] leading-relaxed text-white/72 [hyphens:auto] [word-spacing:-0.04em] sm:mx-0`}
              >
                {t("footer.newsletterCopy")}
              </p>
            </div>

            <form
              className="mt-5 flex min-w-0 flex-1 flex-col gap-3 sm:mt-6"
              onSubmit={submitNewsletter}
            >
              {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
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
                className={`h-11 min-h-[44px] w-full min-w-0 rounded-lg border border-white/10 bg-[#0a1420]/70 px-3 text-[13px] text-white placeholder:text-white/35 outline-none transition focus:border-[#7C878E]/55 focus:ring-2 focus:ring-[#7C878E]/20 sm:px-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("footer.emailPlaceholder")}
                type="email"
                autoComplete="email"
                required
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterState((s) =>
                    s.ok || s.error
                      ? {
                          loading: false,
                          ok: false,
                          message: "",
                          error: "",
                        }
                      : s,
                  );
                }}
              />
              <label
                className={`mt-4 flex cursor-pointer items-start gap-2.5 text-[11px] leading-[1.55] text-white/55 ${
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
                        ? {
                            loading: false,
                            ok: false,
                            message: "",
                            error: "",
                          }
                        : s,
                    );
                  }}
                  className="mt-[2px] h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#7C878E]"
                />
                <span>
                  {t("footer.consentPrefix")}
                  <Link
                    to="/privacy-policy"
                    className="text-white/80 underline decoration-white/30 underline-offset-2 transition hover:text-[#7C878E]"
                  >
                    {t("footer.consentLink")}
                  </Link>
                  {t("footer.consentSuffix")}
                </span>
              </label>

              <div className="mt-auto flex justify-end pt-2">
                <SlideButton
                  loading={newsletterState.loading}
                  loadingChildren={t("footer.subscribing")}
                  className="w-fit max-w-full"
                >
                  {t("footer.subscribeCta")}
                </SlideButton>
              </div>
            </form>

            {newsletterState.ok ? (
              <p
                className={`mt-3 text-center text-[12px] text-emerald-200/90 ${startText}`}
              >
                {newsletterState.message || t("footer.subscribedDefault")}
              </p>
            ) : null}
            {newsletterState.error ? (
              <p
                className={`mt-3 text-center text-[12px] text-red-200/90 ${startText}`}
              >
                {newsletterState.error}
              </p>
            ) : null}
          </div>

          {/* Contact form */}
          <div
            className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-md sm:p-5 md:w-1/2 md:p-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className={`text-center ${startText}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                {t("footer.contactEyebrow")}
              </p>
              <p className="mx-auto mt-3 max-w-[420px] break-words text-justify text-[13px] leading-relaxed text-white/72 [hyphens:auto] [word-spacing:-0.04em] sm:mx-0">
                {t("footer.contactCopy")}
              </p>
            </div>

            <form
              className="mt-5 grid min-w-0 gap-3 sm:mt-6"
              onSubmit={submitFooterContact}
            >
              {/* Single column so Name → Email → Message stacks in the
                  requested order; on sm+ we still stack to keep the form
                  reading top-to-bottom regardless of language. */}
              <input
                className={`h-11 min-h-[44px] w-full min-w-0 rounded-lg border border-white/10 bg-[#0a1420]/70 px-3 text-[13px] text-white placeholder:text-white/35 outline-none transition focus:border-[#7C878E]/55 focus:ring-2 focus:ring-[#7C878E]/20 sm:px-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("footer.nameRequired")}
                type="text"
                autoComplete="name"
                required
                value={footerContact.name}
                onChange={(e) => {
                  setFooterContact((p) => ({
                    ...p,
                    name: e.target.value,
                  }));
                  setFooterContactState((s) =>
                    s.ok || s.error
                      ? { loading: false, ok: false, error: "" }
                      : s,
                  );
                }}
              />

              <input
                className={`h-11 min-h-[44px] w-full min-w-0 rounded-lg border border-white/10 bg-[#0a1420]/70 px-3 text-[13px] text-white placeholder:text-white/35 outline-none transition focus:border-[#7C878E]/55 focus:ring-2 focus:ring-[#7C878E]/20 sm:px-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("footer.emailRequired")}
                type="email"
                autoComplete="email"
                required
                value={footerContact.email}
                onChange={(e) => {
                  setFooterContact((p) => ({
                    ...p,
                    email: e.target.value,
                  }));
                  setFooterContactState((s) =>
                    s.ok || s.error
                      ? { loading: false, ok: false, error: "" }
                      : s,
                  );
                }}
              />

              <textarea
                className={`min-h-[100px] w-full min-w-0 resize-none rounded-lg border border-white/10 bg-[#0a1420]/70 px-3 py-3 text-[13px] text-white placeholder:text-white/35 outline-none transition focus:border-[#7C878E]/55 focus:ring-2 focus:ring-[#7C878E]/20 sm:px-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("footer.messagePlaceholder")}
                required
                value={footerContact.message}
                onChange={(e) => {
                  setFooterContact((p) => ({
                    ...p,
                    message: e.target.value,
                  }));
                  setFooterContactState((s) =>
                    s.ok || s.error
                      ? { loading: false, ok: false, error: "" }
                      : s,
                  );
                }}
              />

              <div className="mt-2 flex justify-center sm:justify-end">
                <SlideButton
                  loading={footerContactState.loading}
                  loadingChildren={t("footer.sendingState")}
                  className="w-fit max-w-full"
                >
                  {t("footer.sendCta")}
                </SlideButton>
              </div>
            </form>
            {footerContactState.ok ? (
              <p
                className={`mt-3 text-center text-[12px] text-emerald-200/90 ${startText}`}
              >
                {t("footer.contactOk")}
              </p>
            ) : null}
            {footerContactState.error ? (
              <p
                className={`mt-3 text-center text-[12px] text-red-200/90 ${startText}`}
              >
                {footerContactState.error}
              </p>
            ) : null}
          </div>
        </div>

        {/* Center copyright + legal links above BIZNET text */}
        <div className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col items-center gap-2 px-2 text-center text-[10px] leading-snug tracking-[0.08em] text-white/40 sm:bottom-12 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:px-0 sm:text-[11px] sm:tracking-[0.12em] md:bottom-16">
          <span>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </span>
          <span
            className="hidden h-2 w-px bg-white/20 sm:inline-block"
            aria-hidden
          />
          <Link
            to="/privacy-policy"
            className="transition-colors hover:text-[#7C878E]"
          >
            {t("footer.privacyPolicy")}
          </Link>
          <span
            className="hidden h-2 w-px bg-white/20 sm:inline-block"
            aria-hidden
          />
          <Link
            to="/terms-and-conditions"
            className="transition-colors hover:text-[#7C878E]"
          >
            {t("footer.termsConditions")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
