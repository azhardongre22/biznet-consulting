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
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
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
      <main className="min-h-screen overflow-hidden bg-[#04080f] text-white">
        <section className="relative min-h-screen px-5 py-24 sm:px-8 lg:px-14 xl:px-20">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[#0E4174]/10" />

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 lg:gap-20">
            <motion.div
              variants={staggerWrap}
              initial="hidden"
              animate="visible"
              className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
            >
              <motion.div variants={fadeUp} className="max-w-xl pt-2 lg:pt-10">
                <p className="mb-7 font-['Aktiv_Grotesk'] text-xs font-normal uppercase tracking-[0.36em] text-white/80">
                  {t("contactPage.eyebrow")}
                </p>

                <h1 className="font-['Ivy_Presto'] text-2xl font-light leading-[1.02] tracking-[-0.04em] text-white sm:text-2xl lg:text-4xl xl:text-6xl">
                  {t("contactPage.title")}
                </h1>

                <p className="mt-8 max-w-lg break-words text-justify font-['Aktiv_Grotesk'] text-base leading-8 text-white/75 [hyphens:auto] [word-spacing:-0.04em] sm:text-lg">
                  {t("contactPage.lead")}
                </p>

                <div className="mt-10 grid gap-5 font-['Aktiv_Grotesk'] text-sm leading-7 text-white/80 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.22em] text-white/55">
                      {t("contactPage.contactLabel")}
                    </p>
                    <div className="space-y-1">
                      <a
                        href="tel:+971527488855"
                        className="block transition hover:text-white"
                      >
                        +971 52 748 8855
                      </a>
                      <a
                        href="tel:+97143433334"
                        className="block transition hover:text-white"
                      >
                        04 343 3334
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.22em] text-white/55">
                      {t("contactPage.addressLabel")}
                    </p>
                    <a
                      href="https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-white/75 block transition hover:text-white">
                        Oud Metha Offices Building, Office 324 - Dubai
                      </p>
                    </a>
                  </div>

                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.22em] text-white/55">
                      {t("contactPage.emailLabel")}
                    </p>
                    <a
                      href="mailto:hello@biznetconsulting.ae"
                      className="transition hover:text-white"
                    >
                      hello@biznetconsulting.ae
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="rounded-[2rem] border border-white/12 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8 lg:p-10"
              >
                <form className="grid gap-7" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <FloatingInput
                      label={t("contactPage.firstName")}
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      onBlur={() => touchField("firstName")}
                      error={touched.firstName ? errors.firstName : undefined}
                    />
                    <FloatingInput
                      label={t("contactPage.lastName")}
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      onBlur={() => touchField("lastName")}
                      error={touched.lastName ? errors.lastName : undefined}
                    />
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <FloatingInput
                      label={t("contactPage.email")}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => touchField("email")}
                      error={touched.email ? errors.email : undefined}
                    />
                    <FloatingInput
                      label={t("contactPage.phone")}
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      onBlur={() => touchField("phone")}
                      error={touched.phone ? errors.phone : undefined}
                    />
                  </div>

                  <label className="group block">
                    <span className="font-['Ivy_Presto'] text-xl font-light italic text-white/85">
                      {t("contactPage.message")}
                    </span>
                    <textarea
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => touchField("message")}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      className={`mt-3 w-full resize-none border-0 border-b bg-transparent px-0 pb-3 font-['Aktiv_Grotesk'] text-base text-white/90 outline-none transition placeholder:text-white/35 focus:ring-0 ${
                        touched.message && errors.message
                          ? "border-red-400/70 focus:border-red-400"
                          : "border-white/25 focus:border-white/70"
                      }`}
                      placeholder={t("contactPage.messagePlaceholder")}
                    />
                    {touched.message && errors.message ? (
                      <p className="mt-2 font-['Aktiv_Grotesk'] text-xs text-red-200/90">
                        {errors.message}
                      </p>
                    ) : null}
                  </label>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!isValid || submitState.loading}
                      aria-disabled={!isValid || submitState.loading}
                      className="inline-flex cursor-pointer min-w-44 items-center justify-center rounded-full border border-white/70 bg-white px-8 py-4 font-['Aktiv_Grotesk'] text-sm uppercase tracking-[0.2em] text-[#04080f] shadow-[0_18px_35px_rgba(0,0,0,0.35)] transition hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#04080f]"
                    >
                      {submitState.loading
                        ? t("contactPage.submitting")
                        : t("contactPage.submitCta")}
                    </motion.button>
                    {submitState.ok ? (
                      <p className="mt-4 font-['Aktiv_Grotesk'] text-sm text-emerald-200/90">
                        {t("contactPage.sentOk")}
                      </p>
                    ) : null}
                    {submitState.error ? (
                      <p className="mt-4 font-['Aktiv_Grotesk'] text-sm text-red-200/90">
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
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
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
}) {
  return (
    <label className="group block">
      <span className="font-['Ivy_Presto'] text-xl font-light italic text-white/85">
        {label}*
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`mt-4 w-full border-0 border-b bg-transparent px-0 pb-3 font-['Aktiv_Grotesk'] text-base text-white/90 outline-none transition placeholder:text-transparent focus:ring-0 ${
          error
            ? "border-red-400/70 focus:border-red-400"
            : "border-white/25 focus:border-white/70"
        }`}
      />
      {error ? (
        <p className="mt-2 font-['Aktiv_Grotesk'] text-xs text-red-200/90">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function validateContactForm(form, t) {
  const next = {};
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

  if (!firstName) next.firstName = t("contactPage.errors.firstName");
  if (!lastName) next.lastName = t("contactPage.errors.lastName");

  if (!email) {
    next.email = t("contactPage.errors.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    next.email = t("contactPage.errors.emailInvalid");
  }

  if (!phone) {
    next.phone = t("contactPage.errors.phoneRequired");
  } else if (!/^[+()\d\s-]{7,}$/.test(phone)) {
    next.phone = t("contactPage.errors.phoneInvalid");
  }

  if (!message) {
    next.message = t("contactPage.errors.messageRequired");
  } else if (message.length < 10) {
    next.message = t("contactPage.errors.messageShort");
  }

  return next;
}
