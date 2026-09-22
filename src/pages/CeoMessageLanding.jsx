import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import aktivGroteskRegular from "../assets/fonts/aktiv-grotesk-regular/aktiv-grotesk-regular.otf";
import ivyPrestoHeadline from "../assets/fonts/ivy-presto-headline/ivy-presto-headline.otf";
import ivyPrestoText from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-.otf";
import ivyPrestoTextLight from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-Light.otf";
import ivyPrestoTextThin from "../assets/fonts/ivy-presto-headline/Ivy-Presto-Text-Thin.otf";

import HeroBg from "../assets/images/optimized/HeroBg.webp";
import ceoLogoBlack from "../assets/images/optimized/CEO LOGO PANTONE BLUE.webp";
import FavIconLogo from "../assets/images/optimized/BN_Logo.webp";
import LogoText from "../assets/images/optimized/biznet-sec-white.webp";

import PhoneField, { DEFAULT_COUNTRY } from "../components/light/PhoneField";
import { SOCIAL_LINKS } from "../components/FloatingSocials";

const EASE = [0.22, 1, 0.36, 1];

// The Navbar logo assets are pure white (built for its dark bar). This filter
// recolours them to the brand navy (~#0E4174) so they read on the light page.
const NAVY_TINT =
  "brightness(0) saturate(100%) invert(19%) sepia(56%) saturate(1120%) hue-rotate(184deg) brightness(94%) contrast(96%)";

// This page is intentionally English-only (it's the post-QR-scan landing).
// Do not wire it up to the language context.
const CEO_LANDING_COPY = {
  quote:
    "\"At Biznet, we don't chase growth, we create it. Our focus is simple: build with purpose, scale with precision, and lead with impact. The future isn't something we wait for; it's something we shape.\"",
  ceoName: "Ismail Al Hammadi",
  ceoTitle: "Chief Executive Officer",
};

const DESCRIBES = [
  "Developer",
  "Landowner",
  "Investor",
  "New business",
  "Other",
];

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

/* ── Thank-you modal shown after a successful enquiry submission ── */
function ThankYouModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    function onKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thank you"
      className="fixed inset-0 z-[9999] flex items-center justify-center px-5 py-8 transition-opacity duration-300"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        backgroundColor: "rgba(14, 65, 116, 0.28)",
        backdropFilter: "blur(4px)",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.97 }
        }
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] border border-[#E7EBF0] bg-white p-8 text-center shadow-[0_40px_120px_rgba(14,65,116,0.22)] sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EC] text-[#7C878E] transition hover:border-[#0E4174] hover:text-[#0E4174]"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#0E4174]/25 bg-[#0E4174]/10">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.2 4.2L19 7"
              stroke="#0E4174"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="biznet-headline mt-6 text-[1.6rem] leading-tight text-[#384967] sm:text-[1.85rem]">
          Thank you
        </h2>

        <p className="mx-auto mt-3 max-w-[320px] text-sm leading-relaxed text-[#5F6F7A]">
          We&rsquo;ve received your details. Our team will be in touch with you
          shortly.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 h-11 w-full rounded-full bg-[#0E4174] px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0b3560]"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

function CeoMessageLanding() {
  // Enquiry state — mirrors the site footer's "Contact Us" form and posts to
  // the same backend (/api/contact with source: "footer").
  const [enq, setEnq] = useState({
    name: "",
    country: DEFAULT_COUNTRY,
    phone: "",
    email: "",
    describes: "",
    message: "",
  });
  const [enqState, setEnqState] = useState({
    loading: false,
    ok: false,
    msg: "",
  });
  const [showThankYou, setShowThankYou] = useState(false);

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

  const onEnq = (field) => (e) => {
    const { value } = e.target;
    setEnq((p) => ({ ...p, [field]: value }));
    setEnqState((s) =>
      s.ok || s.msg ? { loading: false, ok: false, msg: "" } : s,
    );
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setEnqState({ loading: true, ok: false, msg: "" });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enq.name,
          email: enq.email,
          phone: `${enq.country.dial_code} ${enq.phone}`.trim(),
          describes: enq.describes,
          message: enq.message,
          source: "footer",
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || "Something went wrong.");
      setEnqState({ loading: false, ok: true, msg: "" });
      setEnq({
        name: "",
        country: DEFAULT_COUNTRY,
        phone: "",
        email: "",
        describes: "",
        message: "",
      });
      setShowThankYou(true);
    } catch (err) {
      setEnqState({
        loading: false,
        ok: false,
        msg: err?.message || "Failed to send. Please try again.",
      });
    }
  };

  const fieldCls =
    "h-12 w-full rounded-xl border border-[#E1E6EC] bg-white px-4 text-[14px] text-[#1F2A37] outline-none transition placeholder:text-[#9AA5AF] focus:border-[#0E4174]/50 focus:ring-2 focus:ring-[#0E4174]/10";

  return (
    <main
      id="top"
      className="biznet-body relative min-h-screen overflow-hidden bg-[#EEF3F8] bg-cover bg-center bg-no-repeat px-6 py-10 text-[#384967] selection:bg-[#0E4174] selection:text-[#EEF3F8] sm:px-10"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      <style>{globalStyles}</style>

      {/* Ambient light overlays (unchanged brand treatment) */}
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[#EEF3F8]/28 backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute left-[20%] -top-48 h-112 w-md rounded-full bg-[#0E4174]/16 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-[10%] h-96 w-96 rounded-full bg-[#384967]/14 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[680px] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex w-full flex-col items-center"
        >
          {/* ── Brand lockup: bn mark + wordmark (same images as the Navbar).
             The Navbar assets are white for its dark bar, so on this light
             page they're tinted to the brand navy via NAVY_TINT to stay
             legible. ── */}
          <div
            to="/scan"
            aria-label="Biznet Consulting — Home"
            className="flex items-center gap-2.5"
          >
            <img
              src={FavIconLogo}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-9 w-auto object-contain sm:h-20"
              style={{ filter: NAVY_TINT }}
            />
            <img
              src={LogoText}
              alt="Biznet Consulting"
              loading="lazy"
              decoding="async"
              className="hidden h-5 w-auto object-contain sm:block md:h-[30px]"
              style={{ filter: NAVY_TINT }}
            />
          </div>

          <div className="my-7 h-px w-24 bg-gradient-to-r from-transparent via-[#0E4174]/70 to-transparent" />

          {/* ── CEO message ── */}
          <p className="text-center text-[0.64rem] uppercase tracking-[0.32em] text-[#5F6F7A]">
            {CEO_LANDING_COPY.eyebrow}
          </p>

          <figure className="mx-auto mt-6 flex max-w-[640px] flex-col items-center gap-6 md:flex-row md:items-center md:gap-8 md:text-left">
            <img
              src={ceoLogoBlack}
              alt="CEO"
              className="h-auto w-[150px] shrink-0 object-contain sm:w-[170px] md:w-[190px]"
            />

            <div className="max-w-[560px]">
              <blockquote className="biznet-serif text-balance text-[1.05rem] leading-8 text-[#384967] sm:text-[1.22rem] sm:leading-9">
                {CEO_LANDING_COPY.quote}
              </blockquote>

              <figcaption className="mt-5 flex flex-col items-center md:items-start">
                <span className="text-2xl text-[#384967]">
                  {CEO_LANDING_COPY.ceoName}
                </span>
                <span className="mt-1 text-sm text-[#5F6F7A]">
                  {CEO_LANDING_COPY.ceoTitle}
                </span>
              </figcaption>
            </div>
          </figure>

          {/* ── Enquiry form — same fields & backend as the site footer ── */}
          <form
            onSubmit={submitEnquiry}
            className="mt-10 w-full max-w-[520px] rounded-2xl border border-[#E7EBF0] bg-white/85 p-5 text-left shadow-[0_20px_60px_-30px_rgba(14,65,116,0.35)] backdrop-blur-sm sm:p-6"
          >
            <p className="biznet-headline text-[15px] font-semibold uppercase tracking-[0.18em] text-[#0E4174]">
              Get in Touch
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#4B5661]">
              Leave your details and our team will connect with you shortly.
            </p>

            <div className="mt-5 flex w-full flex-col gap-3">
              {/* Name + describes */}
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Name *"
                  value={enq.name}
                  onChange={onEnq("name")}
                  className={fieldCls}
                />
                <div className="relative">
                  <select
                    required
                    value={enq.describes}
                    onChange={onEnq("describes")}
                    className={`${fieldCls} cursor-pointer appearance-none pr-10 ${
                      enq.describes ? "text-[#1F2A37]" : "text-[#9AA5AF]"
                    }`}
                  >
                    <option value="" disabled>
                      What best describes you? *
                    </option>
                    {DESCRIBES.map((d) => (
                      <option key={d} value={d} className="text-[#1F2A37]">
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7C878E]"
                  />
                </div>
              </div>

              {/* Phone (with country code) + email */}
              <div className="grid gap-3 sm:grid-cols-2">
                <PhoneField
                  country={enq.country}
                  onCountryChange={(c) => setEnq((p) => ({ ...p, country: c }))}
                  number={enq.phone}
                  onNumberChange={(v) => {
                    setEnq((p) => ({ ...p, phone: v }));
                    setEnqState((s) =>
                      s.ok || s.msg
                        ? { loading: false, ok: false, msg: "" }
                        : s,
                    );
                  }}
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={enq.email}
                  onChange={onEnq("email")}
                  className={fieldCls}
                />
              </div>

              <textarea
                placeholder="Your message (optional)"
                value={enq.message}
                onChange={onEnq("message")}
                className="min-h-[92px] w-full resize-none rounded-xl border border-[#E1E6EC] bg-white px-4 py-3 text-[14px] text-[#1F2A37] outline-none transition placeholder:text-[#9AA5AF] focus:border-[#0E4174]/50 focus:ring-2 focus:ring-[#0E4174]/10"
              />

              <button
                type="submit"
                disabled={enqState.loading}
                className="mt-1 inline-flex h-12 w-full items-center cursor-pointer justify-center rounded-full bg-[#0E4174] px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0b3560] disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto sm:min-w-[200px]"
              >
                {enqState.loading ? "Sending…" : "Send Enquiry"}
              </button>
            </div>

            {enqState.msg ? (
              <p
                aria-live="polite"
                className={`mt-3 text-[13px] ${
                  enqState.ok ? "text-[#0E4174]" : "text-red-500"
                }`}
              >
                {enqState.msg}
              </p>
            ) : null}
          </form>

          {/* ── Social links ── */}
          <div className="mt-10 flex flex-col items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0E4174]">
              Follow us
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_LINKS.map((item) => {
                const isTikTok = item.name === "TikTok";
                return (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      aria-label={`Follow Biznet on ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid h-11 w-11 place-items-center rounded-full border border-[#E1E6EC] bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#0E4174]/40"
                    >
                      <img
                        src={item.icon}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`h-[22px] w-[22px] object-contain ${
                          isTikTok ? "rounded-full bg-white" : ""
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* ── Copyright ── */}
        <p className="mt-12 text-center text-xs text-[#7C878E]">
          © {new Date().getFullYear()} Biznet Consulting. All rights reserved.
        </p>
      </section>

      {/* ── Thank-you modal (shown on successful submit) ── */}
      <ThankYouModal
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </main>
  );
}

export default CeoMessageLanding;
