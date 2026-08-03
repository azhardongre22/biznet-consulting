import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Always English — never follows site language / RTL.
const COPY = {
  title: "Company & Business Formation",
  lead: "The foundation for successful businesses starts here.",
  namePlaceholder: "Name *",
  emailPlaceholder: "Email *",
  phonePlaceholder: "Phone *",
  messagePlaceholder: "Mention your business enquiry",
  submitCta: "Start Your Business",
  submittedCta: "Submitted",
  sendingState: "Submitting...",
  ok: "Thank you. Your details have been submitted successfully. Our team will be in touch shortly.",
  close: "Close",
  errors: {
    nameRequired: "Name is required.",
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    phoneRequired: "Phone number is required.",
  },
};

function validateCampaignForm(form) {
  const next = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!name) next.name = COPY.errors.nameRequired;
  if (!email) {
    next.email = COPY.errors.emailRequired;
  } else if (!EMAIL_RE.test(email)) {
    next.email = COPY.errors.emailInvalid;
  }
  if (!phone) next.phone = COPY.errors.phoneRequired;

  return next;
}

const fieldClass = (hasError) =>
  `h-11 min-h-[44px] w-full rounded-lg border bg-white px-3 text-left text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:ring-2 sm:px-4 ${
    hasError
      ? "border-red-500/70 focus:border-red-600 focus:ring-red-600/20"
      : "border-[#C7D1D8] focus:border-[#0E4174] focus:ring-[#0E4174]/20"
  }`;

export default function CampaignLeadModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [state, setState] = useState({ loading: false, ok: false, error: "" });

  const nameInputRef = useRef(null);

  const requestClose = () => {
    onClose?.(state.ok ? "submitted" : undefined);
  };

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.ok]);

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

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => nameInputRef.current?.focus?.(), 320);
    return () => window.clearTimeout(id);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateCampaignForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setState({ loading: false, ok: false, error: "" });
      return;
    }

    setState({ loading: true, ok: false, error: "" });

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        source: "campaign-lead-modal",
      };

      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send.");
      }

      setState({ loading: false, ok: true, error: "" });
      setFieldErrors({});
      setForm({ name: "", email: "", phone: "", message: "" });
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
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setState((s) => (s.error ? { loading: false, ok: false, error: "" } : s));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // lang-keep: LanguageContext / Arabic font CSS must not touch this modal.
          className="lang-keep fixed inset-0 z-[10000] overflow-y-auto overscroll-contain font-subtext"
          role="dialog"
          aria-modal="true"
          aria-labelledby="campaign-lead-modal-title"
          dir="ltr"
          lang="en"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          <button
            type="button"
            onClick={requestClose}
            aria-label={COPY.close}
            tabIndex={-1}
            className="fixed inset-0 cursor-default bg-[#020812]/90 backdrop-blur-[2px] [transform:translateZ(0)]"
          />

          <div
            className="relative flex min-h-full items-start justify-center p-3 text-left sm:p-6 lg:items-center"
            dir="ltr"
            onClick={(e) => {
              if (e.target === e.currentTarget) requestClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="relative w-full max-w-[440px] transform-gpu overflow-y-auto rounded-2xl border border-[#C7D1D8] bg-[#F5F8FC] p-5 text-left font-subtext shadow-[0_30px_90px_rgba(14,65,116,0.20)] sm:p-7"
              dir="ltr"
              lang="en"
              style={{ direction: "ltr", unicodeBidi: "isolate" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#7C878E] via-[#0E4174] to-transparent" />

              <button
                type="button"
                onClick={requestClose}
                aria-label={COPY.close}
                className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#C7D1D8] bg-white/80 text-[#5F6F7A] transition hover:border-[#0E4174] hover:text-[#0E4174]"
              >
                <X className="h-4 w-4" />
              </button>

              <h2
                id="campaign-lead-modal-title"
                className="mt-1 max-w-[28ch] pr-8 text-left font-headline text-[21px] font-light leading-[1.15] tracking-[-0.02em] text-[#384967] sm:text-[25px]"
              >
                {COPY.title}
              </h2>

              <p className="mt-3 text-left text-[13px] leading-[1.55] text-[#5F6F7A]">
                {COPY.lead}
              </p>

              <form
                className="mt-5 grid gap-2.5 text-left"
                dir="ltr"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <input
                    ref={nameInputRef}
                    className={fieldClass(Boolean(fieldErrors.name))}
                    placeholder={COPY.namePlaceholder}
                    type="text"
                    name="name"
                    autoComplete="name"
                    dir="ltr"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.name)}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  {fieldErrors.name ? (
                    <p className="mt-1 text-left text-[12px] text-red-700">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    className={fieldClass(Boolean(fieldErrors.email))}
                    placeholder={COPY.emailPlaceholder}
                    type="email"
                    name="email"
                    autoComplete="email"
                    dir="ltr"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  {fieldErrors.email ? (
                    <p className="mt-1 text-left text-[12px] text-red-700">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    className={fieldClass(Boolean(fieldErrors.phone))}
                    placeholder={COPY.phonePlaceholder}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    dir="ltr"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1 text-left text-[12px] text-red-700">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>

                <textarea
                  className="min-h-[88px] w-full resize-none rounded-lg border border-[#C7D1D8] bg-white px-3 py-3 text-left text-[13px] text-[#384967] placeholder:text-[#7C878E] outline-none transition focus:border-[#0E4174] focus:ring-2 focus:ring-[#0E4174]/20 sm:px-4"
                  placeholder={COPY.messagePlaceholder}
                  name="message"
                  dir="ltr"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                />

                <button
                  type="submit"
                  disabled={state.loading || state.ok}
                  aria-disabled={state.loading || state.ok}
                  className="mt-1 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-[#0E4174] bg-[#0E4174] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(14,65,116,0.22)] transition duration-300 hover:bg-white hover:text-[#0E4174] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[44px]"
                >
                  <span>
                    {state.loading
                      ? COPY.sendingState
                      : state.ok
                        ? COPY.submittedCta
                        : COPY.submitCta}
                  </span>
                  {!state.ok && !state.loading ? (
                    <span className="ml-1">→</span>
                  ) : null}
                </button>

                {state.ok ? (
                  <p className="flex items-start gap-1.5 text-left text-[12.5px] leading-[1.5] text-emerald-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{COPY.ok}</span>
                  </p>
                ) : null}

                {state.error ? (
                  <p className="text-left text-[13px] text-red-700">
                    {state.error}
                  </p>
                ) : null}
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Opens on every mount (page load / navigation into a host page). */
export function CampaignLeadModalOnLoad() {
  const [open, setOpen] = useState(true);

  return (
    <CampaignLeadModal open={open} onClose={() => setOpen(false)} />
  );
}
