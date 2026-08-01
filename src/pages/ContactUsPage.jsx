import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerWrap = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export default function ContactUsPage() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
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
  const [touched, setTouched] = useState({});
  const [submitState, setSubmitState] = useState({
    loading: false,
    ok: false,
    error: "",
  });

  const errors = useMemo(() => validateContactForm(form, t), [form, t]);
  const isValid = Object.keys(errors).length === 0;

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitState((s) =>
      s.ok || s.error ? { loading: false, ok: false, error: "" } : s,
    );
  };

  const touchField = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      consultationType: true,
      message: true,
    });
    if (!isValid) return;

    setSubmitState({ loading: true, ok: false, error: "" });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || t("contactPage.sentOk"));
      }
      setSubmitState({ loading: false, ok: true, error: "" });
      setForm({
        name: "",
        email: "",
        phone: "",
        consultationType: "",
        message: "",
      });
      setTouched({});
    } catch (err) {
      setSubmitState({
        loading: false,
        ok: false,
        error: err?.message || t("contactPage.sentOk"),
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#020812]">
        <section className="relative min-h-screen bg-[linear-gradient(180deg,#EEF3F8_0%,#C7D1D8_40%,#384967_70%,#020812_100%)] px-5 py-24 text-[#384967] sm:px-8 lg:px-14 xl:px-20">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[#0E4174]/10" />

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 lg:gap-20">
            <motion.div
              variants={staggerWrap}
              initial="hidden"
              animate="visible"
              className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
            >
              <motion.div
                variants={fadeUp}
                className={`max-w-xl pt-2 lg:pt-10 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <p
                  className={`mb-7 font-['Aktiv_Grotesk'] font-normal text-[#384967] ${
                    isRTL
                      ? "text-[14px] tracking-normal"
                      : "text-xs uppercase tracking-[0.36em]"
                  }`}
                >
                  {t("contactPage.eyebrow")}
                </p>

                <h1
                  className={`font-['Ivy_Presto'] font-light leading-[1.05] text-[#384967] ${
                    isRTL
                      ? "text-[26px] tracking-normal sm:text-[26px] lg:text-[38px] xl:text-[62px]"
                      : "text-2xl tracking-[-0.04em] sm:text-2xl lg:text-4xl xl:text-6xl"
                  }`}
                >
                  {t("contactPage.title")}
                </h1>

                <p
                  className={`mt-8 max-w-xl break-words text-justify font-['Aktiv_Grotesk'] text-[#5F6F7A] [word-spacing:-0.04em] ${
                    isRTL
                      ? "whitespace-pre-line text-[18px] font-light leading-[1.85] sm:text-[20px]"
                      : "text-base leading-8 [hyphens:auto] sm:text-lg"
                  }`}
                >
                  {t("contactPage.lead")}
                </p>

                <div
                  className={`mt-10 grid gap-5 font-['Aktiv_Grotesk'] text-[#384967] sm:grid-cols-3 ${
                    isRTL ? "text-[16px] leading-[1.85]" : "text-sm leading-7"
                  }`}
                >
                  <div>
                    <p
                      className={`mb-1 text-[#5F6F7A] ${
                        isRTL
                          ? "text-[14px] tracking-normal"
                          : "text-xs uppercase tracking-[0.22em]"
                      }`}
                    >
                      {t("contactPage.contactLabel")}
                    </p>
                    <div className="space-y-1" dir="ltr">
                      <a
                        href="tel:+971527488855"
                        className="block transition hover:text-[#0E4174]"
                      >
                        +971 52 748 8855
                      </a>
                      <a
                        href="tel:+97143433334"
                        className="block transition hover:text-[#0E4174]"
                      >
                        +971 4 343 3334
                      </a>
                    </div>
                  </div>

                  <div>
                    <p
                      className={`mb-1 text-[#5F6F7A] ${
                        isRTL
                          ? "text-[14px] tracking-normal"
                          : "text-xs uppercase tracking-[0.22em]"
                      }`}
                    >
                      {t("contactPage.addressLabel")}
                    </p>
                    <a
                      href="https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-[#384967] block transition hover:text-[#0E4174]">
                        Oud Metha Offices Building, Office 324 - Dubai
                      </p>
                    </a>
                  </div>

                  <div>
                    <p
                      className={`mb-1 text-[#5F6F7A] ${
                        isRTL
                          ? "text-[14px] tracking-normal"
                          : "text-xs uppercase tracking-[0.22em]"
                      }`}
                    >
                      {t("contactPage.emailLabel")}
                    </p>
                    <a
                      href="mailto:hello@biznetconsulting.ae"
                      dir="ltr"
                      className="transition hover:text-[#0E4174]"
                    >
                      hello@biznetconsulting.ae
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="rounded-[2rem] border border-[#C7D1D8] bg-[#F5F8FC] p-5 shadow-[0_24px_70px_rgba(56,73,103,0.18)] sm:p-7 lg:p-8"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
                  {/* Row 1: Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingInput
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => touchField("name")}
                      error={touched.name ? errors.name : undefined}
                      isRTL={isRTL}
                    />
                    <FloatingInput
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => touchField("email")}
                      error={touched.email ? errors.email : undefined}
                      isRTL={isRTL}
                    />
                  </div>

                  {/* Row 2: Phone + Consultation Type */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingInput
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      onBlur={() => touchField("phone")}
                      error={touched.phone ? errors.phone : undefined}
                      isRTL={isRTL}
                    />
                    <FloatingSelect
                      label="Consultation Type"
                      name="consultationType"
                      value={form.consultationType}
                      onChange={(e) => setField("consultationType", e.target.value)}
                      onBlur={() => touchField("consultationType")}
                      error={touched.consultationType ? errors.consultationType : undefined}
                      options={CONSULTATION_TYPES}
                      isRTL={isRTL}
                    />
                  </div>

                  {/* Row 3: Message */}
                  <label className="group block">
                    <span
                      className={`block font-['Ivy_Presto'] text-lg font-light italic text-[#384967] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      Message
                    </span>
                    <textarea
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => touchField("message")}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      className={`mt-2 w-full resize-none border-0 border-b bg-transparent px-0 pb-2 font-['Aktiv_Grotesk'] text-sm text-[#384967] outline-none transition placeholder:text-[#7C878E] focus:ring-0 ${
                        isRTL ? "text-right" : "text-left"
                      } ${
                        touched.message && errors.message
                          ? "border-red-500/70 focus:border-red-600"
                          : "border-[#7C878E]/40 focus:border-[#0E4174]"
                      }`}
                      placeholder="Tell us how we may assist you"
                    />
                    {touched.message && errors.message ? (
                      <p
                        className={`mt-1.5 font-['Aktiv_Grotesk'] text-xs text-red-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.message}
                      </p>
                    ) : null}
                  </label>

                  <div className="pt-1">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!isValid || submitState.loading}
                      aria-disabled={!isValid || submitState.loading}
                      className="inline-flex cursor-pointer min-w-44 items-center justify-center rounded-full border border-[#0E4174] bg-[#0E4174] px-8 py-3.5 font-['Aktiv_Grotesk'] text-sm uppercase tracking-[0.2em] text-white shadow-[0_14px_28px_rgba(14,65,116,0.28)] transition hover:bg-[#0A2F55] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0E4174]"
                    >
                      {submitState.loading
                        ? t("contactPage.submitting")
                        : t("contactPage.submitCta")}
                    </motion.button>
                    {submitState.ok ? (
                      <p className="mt-3 whitespace-pre-line font-['Aktiv_Grotesk'] text-sm text-emerald-700">
                        {t("contactPage.sentOk")}
                      </p>
                    ) : null}
                    {submitState.error ? (
                      <p className="mt-3 font-['Aktiv_Grotesk'] text-sm text-red-700">
                        {submitState.error}
                      </p>
                    ) : null}
                  </div>
                </form>
              </motion.div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="min-h-[420px] bg-white/5 p-4 sm:p-6 lg:p-8">
                <div className="relative h-full min-h-[380px] overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.276560770467!2d55.32190959999999!3d25.227608399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d49a5927def%3A0x3fcacd8abcdf0442!2sBiznet%20Consulting!5e0!3m2!1sen!2sae!4v1779179547021!5m2!1sen!2sae"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full grayscale-35"
                  ></iframe>
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  isRTL,
}) {
  const alignClass = isRTL ? "text-right" : "text-left";
  return (
    <label className="group block">
      <span
        className={`block font-['Ivy_Presto'] text-base font-light italic text-[#384967] ${alignClass}`}
      >
        {label}*
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`mt-2 w-full border-0 border-b bg-transparent px-0 pb-2 font-['Aktiv_Grotesk'] text-sm text-[#384967] outline-none transition placeholder:text-transparent focus:ring-0 ${alignClass} ${
          error
            ? "border-red-500/70 focus:border-red-600"
            : "border-[#7C878E]/40 focus:border-[#0E4174]"
        }`}
      />
      {error ? (
        <p
          className={`mt-1.5 font-['Aktiv_Grotesk'] text-xs text-red-700 ${alignClass}`}
        >
          {error}
        </p>
      ) : null}
    </label>
  );
}

function validateContactForm(form, t) {
  const next = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const consultationType = form.consultationType.trim();
  const message = form.message.trim();

  if (!name) next.name = t("contactPage.errors.nameRequired");

  if (!email) {
    next.email = t("contactPage.errors.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    next.email = t("contactPage.errors.emailInvalid");
  }

  if (!phone) next.phone = t("contactPage.errors.phoneRequired");

  if (!consultationType) next.consultationType = t("contactPage.errors.consultationTypeRequired");

  if (!message) {
    next.message = t("contactPage.errors.messageRequired");
  } else if (message.length < 10) {
    next.message = t("contactPage.errors.messageShort");
  }

  return next;
}

function FloatingSelect({ label, name, value, onChange, onBlur, error, options, isRTL }) {
  const alignClass = isRTL ? "text-right" : "text-left";
  return (
    <label className="group block">
      <span
        className={`block font-['Ivy_Presto'] text-base font-light italic text-[#384967] ${alignClass}`}
      >
        {label}*
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`mt-2 w-full border-0 border-b bg-transparent px-0 pb-2 font-['Aktiv_Grotesk'] text-sm outline-none transition focus:ring-0 ${alignClass} ${
          error
            ? "border-red-500/70 focus:border-red-600"
            : "border-[#7C878E]/40 focus:border-[#0E4174]"
        } ${!value ? "text-[#7C878E]" : "text-[#384967]"}`}
      >
        <option value="" disabled></option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error ? (
        <p className={`mt-1.5 font-['Aktiv_Grotesk'] text-xs text-red-700 ${alignClass}`}>
          {error}
        </p>
      ) : null}
    </label>
  );
}
