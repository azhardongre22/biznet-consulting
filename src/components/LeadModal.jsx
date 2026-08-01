import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Download, Maximize2, Minimize2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

// Company profile assets live in src/assets so Vite bundles and fingerprints
// them. The 6-page preview already has its later pages blurred, so it can be
// shown in full inside the modal. The complete profile is only downloaded
// after the form is submitted.
import previewPdf from "../assets/company-profile/optimized/WEBSITE BIZNET PDF 6 PAGES .pdf";
import fullProfilePdf from "../assets/company-profile/optimized/Biznet-Consultancy-Company-Profile.pdf";

const EASE = [0.22, 1, 0.36, 1];

// Hide the native PDF toolbar/sidebar so the only control we offer on the
// preview is our own full-screen button. The PDF itself stays scrollable.
const PREVIEW_HASH = "#toolbar=0&navpanes=0&view=FitH";
const PROFILE_FILENAME = "Biznet-Consultancy-Company-Profile.pdf";

export default function LeadModal({ open, onClose }) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [state, setState] = useState({ loading: false, ok: false, error: "" });
  const [fullscreen, setFullscreen] = useState(false);

  // Defer mounting the (heavy) PDF iframe until the open animation has
  // settled. Rendering it during the entry transition forces the browser to
  // repaint the PDF every frame, which is what makes the modal feel laggy on
  // mobile/tablet. A skeleton holds the space so there's no layout shift.
  const [previewReady, setPreviewReady] = useState(false);

  const nameInputRef = useRef(null);

  // Close handler that preserves the parent's post-conversion cooldown:
  // once a submission succeeded we report "submitted" so the 30-day
  // cooldown is applied instead of the default one.
  const requestClose = () => {
    onClose(state.ok ? "submitted" : undefined);
  };

  // ESC closes the full-screen preview first, then the modal.
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (fullscreen) setFullscreen(false);
      else requestClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.ok, fullscreen]);

  // Lock body scroll (and Lenis) while open.
  useEffect(() => {
    if (!open) return undefined;

    window.lenis?.stop?.();

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
      window.lenis?.start?.();
    };
  }, [open]);

  // Reset the full-screen preview whenever the modal is closed.
  useEffect(() => {
    if (!open) setFullscreen(false);
  }, [open]);

  // Mount the PDF preview a beat after opening, once the entry animation is
  // done, and tear it down again on close.
  useEffect(() => {
    if (!open) {
      setPreviewReady(false);
      return undefined;
    }

    const id = window.setTimeout(() => setPreviewReady(true), 480);
    return () => window.clearTimeout(id);
  }, [open]);

  // Programmatically download the full profile. Only ever called after a
  // successful submission, so the file is never exposed beforehand.
  const triggerDownload = () => {
    const a = document.createElement("a");
    a.href = fullProfilePdf;
    a.download = PROFILE_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ loading: true, ok: false, error: "" });

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // source: "lead-modal" lets admin tell these leads apart from the
        // footer form / contact page in the inbox, and lets the backend
        // skip the consultation-type requirement for this form.
        body: JSON.stringify({ ...form, source: "lead-modal" }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send.");
      }

      // Keep the modal open on success and start the download automatically.
      // The cooldown upgrade happens when the user closes the modal.
      setState({ loading: false, ok: true, error: "" });
      setForm({ name: "", email: "", phone: "", message: "" });
      triggerDownload();
    } catch (err) {
      setState({
        loading: false,
        ok: false,
        error: err?.message || "Failed to send.",
      });
    }
  };

  const updateField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));

    setState((s) => (s.error ? { loading: false, ok: false, error: "" } : s));
  };

  const unlocked = state.ok;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          {/* Backdrop — click closes the modal */}
          <button
            type="button"
            onClick={requestClose}
            aria-label={t("leadModal.close")}
            tabIndex={-1}
            className="fixed inset-0 cursor-default bg-[#020812]/90 backdrop-blur-[2px] [transform:translateZ(0)]"
          />

          {/* Centering wrapper: on mobile/tablet align to the top so a tall
              panel stays fully reachable and scrolls; center only on lg+.
              Clicking the dimmed area (not the panel) closes the modal. */}
          <div
            className="relative flex min-h-full items-start justify-center p-3 sm:p-6 lg:items-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) requestClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="relative max-h-[calc(100svh-24px)] w-full max-w-[800px] transform-gpu overflow-y-auto rounded-2xl border border-[#C7D1D8] bg-[#F5F8FC] p-5 shadow-[0_30px_90px_rgba(14,65,116,0.20)] sm:max-h-[calc(100svh-48px)] sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Brand accent edge */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={requestClose}
              aria-label={t("leadModal.close")}
              className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#C7D1D8] bg-white/80 text-[#5F6F7A] transition hover:border-[#0E4174] hover:text-[#0E4174]"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#0E4174]">
              {t("leadModal.eyebrow")}
            </p>

            <h2
              id="lead-modal-title"
              className="mt-2 max-w-[28ch] font-headline text-[21px] font-light leading-[1.15] tracking-[-0.02em] text-[#384967] sm:text-[25px]"
            >
              {t("leadModal.title")}
            </h2>

         

            {/* Mobile/tablet only: no preview here — explain that the profile
                arrives on submit as an automatic download. */}
            <p className="mt-4 rounded-lg border border-[#C7D1D8] bg-white/60 px-4 py-3 text-[12px] leading-[1.55] text-[#5F6F7A] lg:hidden">
              {t("leadModal.mobileInfo")}
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
              {/* Document preview column — desktop (lg+) only. */}
              <div className="hidden flex-col lg:flex">
                <div className="relative h-[320px] overflow-hidden rounded-xl border border-[#C7D1D8] bg-white shadow-[0_8px_24px_rgba(14,65,116,0.12)]">
                  {previewReady ? (
                    <iframe
                      title={t("leadModal.title")}
                      src={`${previewPdf}${PREVIEW_HASH}`}
                      className="h-full w-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-gradient-to-b from-[#EEF3F8] to-[#DDE6EF]" />
                  )}

                  <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-[#0E4174] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                    {t("leadModal.previewBadge")}
                  </span>

                  {/* Desktop: full-screen control on the interactive preview */}
                  <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    aria-label={t("leadModal.fullscreen")}
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#C7D1D8] bg-white/95 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#0E4174] shadow-sm transition hover:border-[#0E4174] hover:bg-[#0E4174] hover:text-white"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    {t("leadModal.fullscreen")}
                  </button>
                </div>

                <p className="mt-2.5 text-[11px] leading-[1.55] text-[#7C878E]">
                  {t("leadModal.previewNote")}
                </p>
              </div>

              {/* Form column */}
              <form className="grid content-start gap-2.5" onSubmit={handleSubmit}>
                <input
                  ref={nameInputRef}
                  className="h-11 min-h-[44px] w-full rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={t("leadModal.namePlaceholder")}
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <input
                  className="h-11 min-h-[44px] w-full rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={t("leadModal.emailPlaceholder")}
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />

                <input
                  className="h-11 min-h-[44px] w-full rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={t("leadModal.phonePlaceholder")}
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />

                <textarea
                  className="min-h-[88px] w-full resize-none rounded-lg border border-[#C7D1D8] bg-white px-3 py-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={t("leadModal.messagePlaceholder")}
                  required
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                />

                {unlocked ? (
                  <a
                    href={fullProfilePdf}
                    download={PROFILE_FILENAME}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#0E4174] bg-[#0E4174] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(14,65,116,0.22)] transition duration-300 hover:bg-white hover:text-[#0E4174] sm:h-[44px]"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t("leadModal.downloadUnlockedCta")}</span>
                  </a>
                ) : (
                  <button
                    type="submit"
                    disabled={state.loading}
                    aria-disabled={state.loading}
                    className="mt-1 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-[#0E4174] bg-[#0E4174] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(14,65,116,0.22)] transition duration-300 hover:bg-white hover:text-[#0E4174] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px]"
                  >
                    <span>
                      {state.loading
                        ? t("leadModal.sendingState")
                        : t("leadModal.submitCta")}
                    </span>
                    <span className="ml-1">→</span>
                  </button>
                )}

                {state.ok ? (
                  <p className="flex items-start gap-1.5 text-[12.5px] leading-[1.5] text-emerald-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{t("leadModal.ok")}</span>
                  </p>
                ) : null}

                {state.error ? (
                  <p className="text-[13px] text-red-700">{state.error}</p>
                ) : null}
              </form>
              </div>
            </motion.div>
          </div>

          {/* Full-screen preview overlay — desktop (lg+) only; the trigger
              doesn't exist on mobile/tablet and the overlay is hidden there. */}
          <AnimatePresence>
            {fullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[10001] hidden flex-col bg-[#020812]/95 p-3 sm:p-5 lg:flex"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/80">
                    {t("leadModal.previewBadge")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    aria-label={t("leadModal.exitFullscreen")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#0E4174]"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                    {t("leadModal.exitFullscreen")}
                  </button>
                </div>
                <iframe
                  title={t("leadModal.title")}
                  src={`${previewPdf}#toolbar=0&navpanes=0&view=FitH`}
                  className="min-h-0 w-full flex-1 rounded-lg bg-white"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
