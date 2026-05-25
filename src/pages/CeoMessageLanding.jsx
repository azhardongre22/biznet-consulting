import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Send } from "lucide-react";

import aktivGroteskRegular from "../assets/fonts/aktiv-grotesk-regular/aktiv-grotesk-regular.otf";
import ivyPrestoHeadline from "../assets/fonts/ivy-presto-headline/ivy-presto-headline.otf";
import ivyPrestoText from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-.otf";
import ivyPrestoTextLight from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-Light.otf";
import ivyPrestoTextThin from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-Thin.otf";

import HeroBg from "../assets/images/HeroBg.png";
import ceoLogoBlack from "../assets/images/CEO LOGO PANTONE BLUE.png";
import BNLogo from "../assets/images/BN_Logo.png";

import SocialMediaIcons from "../components/SocialMediaIcons";
import { useLanguage } from "../i18n/LanguageContext";

const globalStyles = `
  @font-face {
    font-family: "Ivy Presto Display";
    src: url(${ivyPrestoTextThin}) format("opentype");
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Ivy Presto Text";
    src: url(${ivyPrestoTextLight}) format("opentype");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Ivy Presto Text";
    src: url(${ivyPrestoText}) format("opentype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Ivy Presto Headline";
    src: url(${ivyPrestoHeadline}) format("opentype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Aktiv Grotesk";
    src: url(${aktivGroteskRegular}) format("opentype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  .biznet-display { font-family: "Ivy Presto Display", "Ivy Presto Text", Georgia, serif; }
  .biznet-headline { font-family: "Ivy Presto Headline", "Ivy Presto Text", Georgia, serif; }
  .biznet-serif { font-family: "Ivy Presto Text", Georgia, serif; }
  .biznet-body { font-family: "Aktiv Grotesk", Inter, ui-sans-serif, system-ui, sans-serif; }
  .text-balance { text-wrap: balance; }

  .grain::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.4;
    background-image: radial-gradient(rgba(20, 18, 16, 0.085) 0.65px, transparent 0.65px);
    background-size: 16px 16px;
  }
`;

function CeoMessageLanding() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState({
    loading: false,
    ok: false,
    message: "",
    error: "",
  });

  useEffect(() => {
    document.title = "Biznet Consulting | CEO Message";

    const metaDescription =
      document.querySelector('meta[name="description"]') ||
      document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    metaDescription.setAttribute(
      "content",
      "A short executive landing page for Biznet Consulting after scanning the business-card QR code.",
    );
    if (!metaDescription.parentNode) {
      document.head.appendChild(metaDescription);
    }
  }, []);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!consent) {
      setStatus({
        loading: false,
        ok: false,
        message: "",
        error: t("footer.consentRequired"),
      });
      return;
    }
    setStatus({ loading: true, ok: false, message: "", error: "" });
    try {
      const resp = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          source: "scan",
          page:
            typeof window !== "undefined" ? window.location.href : undefined,
          website: hp,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || t("ceoLanding.ok"));
      const message = data?.message || t("ceoLanding.ok");
      setStatus({ loading: false, ok: true, message, error: "" });
      setEmail("");
      setHp("");
    } catch (err) {
      setStatus({
        loading: false,
        ok: false,
        message: "",
        error: err?.message || t("ceoLanding.ok"),
      });
    }
  };

  const clearStatus = () => {
    setStatus((s) =>
      s.ok || s.error ? { loading: false, ok: false, message: "", error: "" } : s,
    );
  };

  return (
    <main
      id="top"
      className="biznet-body relative min-h-screen overflow-hidden bg-[#EEF3F8] bg-cover bg-center bg-no-repeat px-6 py-8 text-[#384967] selection:bg-[#0E4174] selection:text-[#EEF3F8] sm:px-10 sm:py-10"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      <style>{globalStyles}</style>

      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[#EEF3F8]/28 backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute left-[20%] -top-48 h-112 w-md rounded-full bg-[#0E4174]/16 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-[10%] h-96 w-96 rounded-full bg-[#384967]/14 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[980px] items-center justify-center lg:min-h-[calc(100vh-5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="text-center">
            <a
              href="#top"
              className="inline-flex items-center justify-center"
              aria-label="Biznet Consulting home"
            >
              <img
                src={BNLogo}
                alt="Biznet Consulting"
                className="h-auto w-[60px] object-contain sm:w-[72px]"
              />
            </a>

            <div className="mx-auto my-4 h-px w-24 bg-linear-to-r from-transparent via-[#0E4174]/70 to-transparent" />

            <div className="mx-auto mt-1 max-w-[900px]">
              <p className="text-center text-[0.64rem] uppercase tracking-[0.32em] text-[#5F6F7A]">
                {t("ceoLanding.eyebrow")}
              </p>

              <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8 md:text-left">
                <div className="shrink-0">
                  <img
                    src={ceoLogoBlack}
                    alt="CEO"
                    className="h-auto w-[140px] object-contain sm:w-[160px] md:w-[180px]"
                  />
                </div>

                <div className="max-w-[650px] text-center md:text-left">
                  <p className="biznet-serif text-balance text-[1rem] leading-7 text-[#384967] sm:text-[1.16rem] sm:leading-8">
                    {t("ceoLanding.quote")}
                  </p>

                  <div className="mt-5 text-sm text-[#5F6F7A]">
                    <span className="text-2xl text-[#384967]">
                      {t("ceoLanding.ceoName")}
                    </span>
                    <br />
                    {t("ceoLanding.ceoTitle")}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
              aria-label="Social links"
            >
              <SocialMediaIcons direction="row" variant="light" />
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-7 max-w-[520px]"
            >
              <p className="mb-3 text-[0.64rem] uppercase tracking-[0.3em] text-[#5F6F7A]">
                {t("ceoLanding.newsletter")}
              </p>

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
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("ceoLanding.emailPlaceholder")}
                </label>
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6F7A]" />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearStatus();
                    }}
                    placeholder={t("ceoLanding.emailPlaceholder")}
                    className="h-11 w-full rounded-full border border-[#5F6F7A]/45 bg-[#F5F8FC]/90 pl-11 pr-4 text-sm text-[#384967] outline-none transition placeholder:text-[#5F6F7A] focus:border-[#0E4174] focus:ring-4 focus:ring-[#0E4174]/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status.loading}
                  aria-disabled={status.loading}
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#0E4174] bg-[#0E4174] px-6 text-sm text-white transition duration-300 hover:bg-[#0a2f55] focus:outline-none focus:ring-4 focus:ring-[#0E4174]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status.loading ? t("ceoLanding.joiningState") : t("ceoLanding.joinCta")}
                  <Send className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-left text-[11px] leading-[1.55] text-[#5F6F7A]">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    clearStatus();
                  }}
                  className="mt-[2px] h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#0E4174]"
                />
                <span>{t("ceoLanding.consent")}</span>
              </label>

              {status.ok ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#0E4174]">
                  <CheckCircle2 className="h-4 w-4" />{" "}
                  {status.message || t("ceoLanding.ok")}
                </p>
              ) : null}
              {status.error ? (
                <p className="mt-3 text-sm text-red-600">{status.error}</p>
              ) : null}
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default CeoMessageLanding;
