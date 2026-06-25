import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1];

// Submit button with the same two-layer slide-reveal pattern Footer uses,
// duplicated locally so the modal stays self-contained.
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
      className={`group relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#0E4174] bg-[#0E4174] font-medium shadow-[0_10px_24px_rgba(14,65,116,0.22)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px] ${className}`}
    >
      <span className="relative inline-flex h-11 translate-y-0 items-center justify-center gap-1 px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition duration-500 group-hover:-translate-y-[150%] sm:h-[44px]">
        <span>{content}</span>
        <span>→</span>
      </span>

      <span
        aria-hidden="true"
        className="absolute inline-flex h-11 w-full translate-y-[100%] items-center justify-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0E4174] transition duration-500 group-hover:translate-y-0 sm:h-[44px]"
      >
        <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-white transition duration-500 group-hover:translate-y-0 group-hover:scale-150" />
        <span className="relative z-10 inline-flex items-center gap-1 px-5">
          <span>{content}</span>
          <span>→</span>
        </span>
      </span>
    </button>
  );
}

export default function LeadModal({ open, onClose }) {
  const { t } = useLanguage();
  const CONSULTATION_TYPES = [
    "General Enquiry",
    "Branding and Market Positioning",
    "Business Formation & Feasibility",
    "Hospitality & Experience Construction",
    "Project Development",
    "Project Management",
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "",
    message: "",
  });
  const [state, setState] = useState({ loading: false, ok: false, error: "" });

  // ESC closes the modal.
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ loading: true, ok: false, error: "" });

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // source: "lead-modal" lets admin tell these leads apart from the
        // footer form / contact page in the inbox.
        body: JSON.stringify({ ...form, source: "lead-modal" }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send.");
      }

      setState({ loading: false, ok: true, error: "" });
      setForm({
        name: "",
        email: "",
        phone: "",
        consultationType: "",
        message: "",
      });

      // Auto-dismiss after success so the success state is felt but not sticky.
      // Pass "submitted" so the parent can apply the longer post-conversion
      // cooldown instead of the default "seen-but-didn't-engage" one.
      setTimeout(() => {
        onClose("submitted");
      }, 2400);
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

    setState((s) =>
      s.ok || s.error ? { loading: false, ok: false, error: "" } : s,
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          {/* Backdrop — click closes the modal */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("leadModal.close")}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-[#020812]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-[#C7D1D8] bg-[#F5F8FC] p-6 shadow-[0_30px_90px_rgba(14,65,116,0.20)] sm:p-8"
          >
            {/* Brand accent edge */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("leadModal.close")}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#C7D1D8] text-[#5F6F7A] transition hover:border-[#0E4174] hover:text-[#0E4174]"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#0E4174]">
              {t("leadModal.eyebrow")}
            </p>

            <h2
              id="lead-modal-title"
              className="mt-3 font-headline text-[26px] font-light leading-[1.15] tracking-[-0.02em] text-[#384967] sm:text-[30px]"
            >
              {t("leadModal.title")}
            </h2>

            <p className="mt-3 text-[13px] leading-[1.7] text-[#5F6F7A] sm:text-[14px]">
              {t("leadModal.lead")}
            </p>

            <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
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
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-11 min-h-[44px] w-full rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={t("leadModal.phonePlaceholder")}
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />

                <select
                  className="h-11 min-h-[44px] w-full rounded-lg border border-[#C7D1D8] bg-white px-3 text-[13px] text-[#384967] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  required
                  value={form.consultationType}
                  onChange={(e) =>
                    updateField("consultationType", e.target.value)
                  }
                >
                  <option value="" disabled>
                    {t("leadModal.consultationTypePlaceholder")}
                  </option>
                  {CONSULTATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                className="min-h-[110px] w-full resize-none rounded-lg border border-[#C7D1D8] bg-white px-3 py-3 text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                placeholder={t("leadModal.messagePlaceholder")}
                required
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={state.loading}
                  aria-disabled={state.loading}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-[#0E4174] bg-[#0E4174] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(14,65,116,0.22)] transition duration-300 hover:bg-white hover:text-[#0E4174] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px] sm:w-fit"
                >
                  <span>
                    {state.loading
                      ? t("leadModal.sendingState")
                      : t("leadModal.submitCta")}
                  </span>
                  <span className="ml-1">→</span>
                </button>
              </div>
            </form>

            {state.ok ? (
              <p className="mt-4 text-[13px] text-emerald-700">
                {t("leadModal.ok")}
              </p>
            ) : null}

            {state.error ? (
              <p className="mt-4 text-[13px] text-red-700">{state.error}</p>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
