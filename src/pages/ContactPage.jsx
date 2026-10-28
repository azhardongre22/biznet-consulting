import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import "../styles/site.css";
import Navbar from "../components/layout/Navbar";
import { CONTACT_COPY as COPY } from "../data/siteCopy";
import usePageSeo from "../hooks/usePageSeo";
import { PATHS } from "../data/seoData";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";

const FIELD =
  "h-12 w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#1D2733] outline-none transition placeholder:text-[#9AA5AF] focus:ring-2 focus:ring-[#0E4174]/10";

function Field({ label, name, type = "text", value, onChange, onBlur, error }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#52606E]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`mt-2 ${FIELD} ${error ? "border-red-400 focus:border-red-500" : "border-[#E1E6EC] focus:border-[#0E4174]"}`}
      />
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}

function SelectField({ label, name, value, onChange, onBlur, error, options }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#52606E]">
        {label}
      </span>
      <div className="relative mt-2">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`${FIELD} cursor-pointer appearance-none pr-10 ${error ? "border-red-400 focus:border-red-500" : "border-[#E1E6EC] focus:border-[#0E4174]"} ${!value ? "text-[#9AA5AF]" : "text-[#1D2733]"}`}
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-[#1D2733]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={18} aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A95A0]" />
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}

function validateContactForm(form) {
  const next = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const consultationType = form.consultationType.trim();
  const message = form.message.trim();
  if (!name) next.name = COPY.errors.nameRequired;
  if (!email) next.email = COPY.errors.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = COPY.errors.emailInvalid;
  if (!phone) next.phone = COPY.errors.phoneRequired;
  if (!consultationType) next.consultationType = COPY.errors.consultationTypeRequired;
  if (!message) next.message = COPY.errors.messageRequired;
  else if (message.length < 10) next.message = COPY.errors.messageShort;
  return next;
}

export default function ContactPage() {

  const CONSULTATION_TYPES = [
    "General Enquiry",
    "Feasibility Study",
    "Project Development",
    "Project Management",
  ];

  const [form, setForm] = useState({ name: "", email: "", phone: "", consultationType: "", message: "" });
  const [touched, setTouched] = useState({});
  const [submitState, setSubmitState] = useState({ loading: false, ok: false, error: "" });

  const errors = useMemo(() => validateContactForm(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitState((s) => (s.ok || s.error ? { loading: false, ok: false, error: "" } : s));
  };
  const touchField = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, consultationType: true, message: true });
    if (!isValid) return;
    setSubmitState({ loading: true, ok: false, error: "" });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.ok) throw new Error(data?.error || COPY.sentOk);
      setSubmitState({ loading: false, ok: true, error: "" });
      setForm({ name: "", email: "", phone: "", consultationType: "", message: "" });
      setTouched({});
    } catch (err) {
      setSubmitState({ loading: false, ok: false, error: err?.message || COPY.sentOk });
    }
  };

  usePageSeo({ path: PATHS.contact, pageType: "ContactPage" });

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const ph = html.style.background;
    const pb = body.style.background;
    html.style.background = "#ffffff";
    body.style.background = "#ffffff";
    return () => {
      html.style.background = ph;
      body.style.background = pb;
    };
  }, []);

  const CONTACT_DETAILS = [
    {
      label: COPY.contactLabel,
      items: [
        { text: "+971 52 748 8855", href: "tel:+971527488855" },
        { text: "+971 4 343 3334", href: "tel:+97143433334" },
      ],
    },
    {
      label: COPY.emailLabel,
      items: [{ text: "hello@biznetconsulting.ae", href: "mailto:hello@biznetconsulting.ae" }],
    },
    {
      label: COPY.addressLabel,
      items: [
        {
          text: COPY.address,
          href: "https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9",
          external: true,
        },
      ],
    },
  ];

  return (
    <main className="home-v2 min-h-screen">
      <Navbar />

      <section className={`${SHELL} pt-28 md:pt-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — intro + details */}
          <div className="lg:col-span-5">
            <p className={"hv2-eyebrow"}>{COPY.eyebrow}</p>
            <h1 className="hv2-display mt-5 text-[36px] leading-[1.06] text-[#092D54] md:text-[50px]">
              {COPY.title}
            </h1>
            <p className="mt-6 max-w-[460px] text-[16px] leading-[1.75] text-[#596573]">
              {COPY.lead}
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
              <a
                href="#enquiry-form"
                className="inline-flex h-12 items-center rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
              >
                {COPY.primaryCta}
              </a>
              <Link
                to={PATHS.services}
                className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
              >
                <span className="border-b border-[#0E4174]/40 pb-0.5">{COPY.secondaryCta}</span>
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <h2 className="hv2-display mt-14 text-[24px] leading-[1.15] text-[#092D54] md:text-[28px]">
              {COPY.detailsTitle}
            </h2>
            <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.7] text-[#596573]">
              {COPY.detailsLead}
            </p>

            <div className="mt-8 border-t border-[#E5EAF0]">
              {CONTACT_DETAILS.map((group) => (
                <div key={group.label} className="border-b border-[#E5EAF0] py-6">
                  <p className="hv2-eyebrow text-[#8A95A0]">{group.label}</p>
                  <div className="mt-3 space-y-1.5">
                    {group.items.map((item) => (
                      <a
                        key={item.text}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="block text-[15px] leading-[1.5] text-[#273340] transition-colors hover:text-[#0E4174]"
                      >
                        {item.text}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            <div id="enquiry-form" className="scroll-mt-[100px] rounded-[14px] border border-[#E5EAF0] bg-[#FAFBFC] p-6 sm:p-8 lg:p-10">
              <p className="hv2-eyebrow text-[#8A95A0]">Send us a message</p>
              <form className="mt-7 grid gap-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={COPY.name} name="name" value={form.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => touchField("name")} error={touched.name ? errors.name : undefined} />
                  <Field label={COPY.email} name="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => touchField("email")} error={touched.email ? errors.email : undefined} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} onBlur={() => touchField("phone")} error={touched.phone ? errors.phone : undefined} />
                  <SelectField label="Consultation Type" name="consultationType" value={form.consultationType} onChange={(e) => setField("consultationType", e.target.value)} onBlur={() => touchField("consultationType")} error={touched.consultationType ? errors.consultationType : undefined} options={CONSULTATION_TYPES} />
                </div>
                <label className="block">
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#52606E]">
                    {COPY.message}
                  </span>
                  <textarea
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    onBlur={() => touchField("message")}
                    aria-invalid={Boolean(touched.message && errors.message)}
                    placeholder={COPY.messagePlaceholder}
                    className={`mt-2 w-full resize-none rounded-[8px] border bg-white px-4 py-3 text-[14px] text-[#1D2733] outline-none transition placeholder:text-[#9AA5AF] focus:ring-2 focus:ring-[#0E4174]/10 ${touched.message && errors.message ? "border-red-400 focus:border-red-500" : "border-[#E1E6EC] focus:border-[#0E4174]"}`}
                  />
                  {touched.message && errors.message ? <p className="mt-1.5 text-xs text-red-600">{errors.message}</p> : null}
                </label>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={!isValid || submitState.loading}
                    aria-disabled={!isValid || submitState.loading}
                    className="inline-flex h-12 min-w-[190px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitState.loading ? COPY.submitting : COPY.submitCta}
                    {!submitState.loading ? <ArrowUpRight size={16} /> : null}
                  </button>
                  {submitState.ok ? <p className="mt-4 whitespace-pre-line text-sm text-emerald-700">{COPY.sentOk}</p> : null}
                  {submitState.error ? <p className="mt-4 text-sm text-red-600">{submitState.error}</p> : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={`${SHELL} py-20 md:py-28`}>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-[640px]">
            <p className={"hv2-eyebrow"}>Visit us</p>
            <h2 className="hv2-display mt-4 text-[28px] leading-[1.12] text-[#092D54] md:text-[38px]">
              Our office in Dubai.
            </h2>
          </div>
          <a
            href="https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174] transition-colors hover:text-[#0b3560]"
          >
            Open in Maps
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
        <div className="hv2-frame overflow-hidden">
          <iframe
            title="Biznet Consulting office location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.276560770467!2d55.32190959999999!3d25.227608399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d49a5927def%3A0x3fcacd8abcdf0442!2sBiznet%20Consulting!5e0!3m2!1sen!2sae!4v1779179547021!5m2!1sen!2sae"
            loading="lazy"
            className="block h-[380px] w-full grayscale-[0.3] md:h-[460px]"
          />
        </div>
      </section>

      <div id="contact">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </main>
  );
}
