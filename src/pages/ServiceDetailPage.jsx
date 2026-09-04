import { Suspense, lazy, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { CampaignLeadModalOnLoad } from "../components/CampaignLeadModal";
import { servicesData, getServiceBySlug } from "../data/servicesData";
import { useLanguage } from "../i18n/LanguageContext";

const Footer = lazy(() => import("../components/Footer"));

/* ---------------------------------------------------------------- motion */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

/* ----------------------------------------------------- editorial helpers */
// Renders a heading with its last word set in a colour accent (no italics).
function Accented({ text, className = "" }) {
  const parts = text.trim().split(" ");
  if (parts.length < 2) return <span>{text}</span>;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className={className}>{last}</span>
    </>
  );
}

// A clean uppercase section kicker (no bullet) set in the secondary font.
function Kicker({ children, tone = "blue" }) {
  const color =
    tone === "light" ? "text-white/70" : tone === "blue" ? "text-[#0E4174]" : "text-[#7C878E]";
  return (
    <span className={`font-subtext text-[12px] font-semibold uppercase tracking-[0.24em] ${color}`}>
      {children}
    </span>
  );
}

// Primary CTA button — matches the Homepage hero button: a glass / outline
// rectangle whose letter-spacing widens and fills with #0e4174 on hover.
// `tone` picks the palette for the background it sits on.
function ActionButton({ to, children, tone = "dark", className = "" }) {
  const base =
    "inline-flex h-12 min-w-[168px] items-center justify-center border px-[26px] font-headline text-[11px] uppercase tracking-[0.28em] no-underline backdrop-blur-[12px] transition-[background,color,letter-spacing,border-color] duration-[400ms] ease-in-out hover:tracking-[0.34em] max-[640px]:h-11 max-[640px]:min-w-[148px] max-[640px]:text-[10px]";
  const tones = {
    // On dark / image backgrounds (identical to the Homepage hero button).
    dark: "border-white/55 bg-white/[0.08] text-white hover:border-[#0e4174] hover:bg-[#0e4174]",
    // On light backgrounds.
    light:
      "border-[#0e4174]/50 bg-[#0e4174]/[0.04] text-[#0e4174] hover:border-[#0e4174] hover:bg-[#0e4174] hover:text-white",
  };
  return (
    <Link to={to} className={`${base} ${tones[tone]} ${className}`}>
      {children}
    </Link>
  );
}

/* ------------------------------------------ inline line-icons for tiles */
const CAP_ICONS = [
  // compass — direction / discovery
  <g key="c" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8" />
  </g>,
  // layers — structure
  <g key="l" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13.5 12 18l9-4.5" />
  </g>,
  // users — teams / people
  <g key="u" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c.5-3.2 3-5 5.5-5s5 1.8 5.5 5" />
    <path d="M16 5.5a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 15c2 .6 3.2 2.2 3.5 4.4" />
  </g>,
  // chart — analysis / financials
  <g key="h" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V11" />
    <path d="M10 20V5" />
    <path d="M16 20v-6" />
    <path d="M21 20H3" />
  </g>,
  // clipboard-check — management / quality
  <g key="p" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4.5" width="12" height="15.5" rx="2.2" />
    <path d="M9.5 4.5V3.5h5v1" />
    <path d="m9.5 13 1.9 1.9 3.6-3.8" />
  </g>,
  // sparkle — brand / experience
  <g key="s" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.5c.6 3.7 1.8 4.9 5.5 5.5-3.7.6-4.9 1.8-5.5 5.5-.6-3.7-1.8-4.9-5.5-5.5 3.7-.6 4.9-1.8 5.5-5.5Z" />
    <path d="M18.5 15.5c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5Z" />
  </g>,
];

function CapTile({ i }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E4174]/8 text-[#0E4174]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        {CAP_ICONS[i % CAP_ICONS.length]}
      </svg>
    </span>
  );
}

/* ============================================================== page */
export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const service = getServiceBySlug(slug);

  useEffect(() => {
    if (!service) return undefined;
    const prevTitle = document.title;
    document.title = `${service.title} — Biznet Consulting`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content");
    if (metaDesc) metaDesc.setAttribute("content", service.overview);
    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc != null) metaDesc.setAttribute("content", prevDesc);
    };
  }, [service]);

  if (!service) return <Navigate to="/services" replace />;

  const others = servicesData.filter((s) => s.slug !== service.slug);
  const stageText = service.stage.replace(/^[^:]*:\s*/, "");

  return (
    <main
      className="min-h-screen overflow-x-clip bg-[#F4F6FA] text-[#0d1b2a]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      {/* ================= HERO (editorial: stacked title + wide image band) ================= */}
      <section className="relative overflow-hidden bg-[#F4F6FA] pb-12 pt-[124px] md:pb-16 md:pt-[146px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 font-subtext text-[12px] font-semibold uppercase tracking-[0.24em] text-[#7C878E]"
            >
              <span className="text-[#0E4174]">Services</span>
              <span className="h-px w-8 bg-[#0E4174]/25" />
              <span className="tracking-[0.35em]">{service.num}</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`mt-6 max-w-[16ch] font-headline font-light leading-[1.03] text-[#28394d] ${
                isRTL ? "text-[42px] md:text-[62px]" : "text-[30px] md:text-[50px]"
              }`}
            >
              <Accented text={service.title} className="text-[#0E4174]" />
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-7 border-t border-[#D3DEEF] pt-8 md:flex-row md:items-end md:justify-between"
            >
              <p className="max-w-[560px] font-subtext text-[16px] leading-[1.7] text-[#5F6F7A] md:text-[18px]">
                {service.tagline}
              </p>
              <div className="flex shrink-0 flex-wrap items-center gap-4">
                <ActionButton to="/contact" tone="light">
                  Enquire Now
                </ActionButton>
                <ActionButton to="/services" tone="light">
                  All Services
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-11 overflow-hidden rounded-[28px] shadow-[0_40px_80px_-46px_rgba(14,65,116,0.5)]"
          >
            <img
              src={service.image}
              alt={service.title}
              className="h-[300px] w-full object-cover sm:h-[380px] md:h-[500px]"
            />
          </motion.div>
        </div>
      </section>

      {/* ============ CHALLENGE · SOLUTION · RESULT (uniform 3-up grid) ============ */}
      <section className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
        >
          {[
            { n: "01", title: "The Challenge", body: service.problem },
            { n: "02", title: "The Solution", body: service.solution },
            { n: "03", title: "The Result", body: service.outcome },
          ].map((card) => (
            <motion.div
              key={card.n}
              variants={fadeUp}
              className="flex h-full flex-col rounded-[20px] border border-[#E1E7F0] bg-white p-8 md:p-9"
            >
              <span className="font-headline text-[40px] font-light leading-none text-[#0E4174]/25">
                {card.n}
              </span>
              <h3 className="mt-6 font-headline text-[23px] font-light leading-[1.2] text-[#28394d]">
                {card.title}
              </h3>
              <p className="mt-3 font-subtext text-[14.5px] leading-[1.7] text-[#5F6F7A]">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= OVERVIEW (editorial) ================= */}
      <section className="relative overflow-hidden py-[52px] md:py-[72px]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 md:px-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="lg:col-span-4"
          >
            <motion.div variants={fadeUp}>
              <Kicker>Overview</Kicker>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="mt-8 rounded-2xl border border-[#D3DEEF] bg-[#EAF0FA] p-6"
            >
              <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7C878E]">
                Where it fits
              </p>
              <p className="mt-2 font-subtext text-[16px] leading-[1.5] text-[#0E4174]">
                {stageText}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="lg:col-span-8"
          >
            <motion.p
              variants={fadeUp}
              className="font-subtext text-[19px] leading-[1.7] text-[#28394d] md:text-[24px] md:leading-[1.6]"
            >
              {service.overview}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 h-px w-full bg-[#D3DEEF]" />
          </motion.div>
        </div>
      </section>

      {/* ================= CAPABILITIES (why-choose cards) ================= */}
      <section className="relative overflow-hidden bg-white py-[52px] md:py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-[600px]">
             
              <motion.h2
                variants={fadeUp}
                className="mt-5 font-headline text-[32px] font-light leading-[1.1] text-[#28394d] md:text-[44px]"
              >
                <Accented text={`Capabilities we bring`} className="text-[#0E4174]" />
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 font-subtext text-[15.5px] leading-[1.75] text-[#5F6F7A]"
              >
                Everything within {service.title.toLowerCase()}, delivered as one
                accountable relationship on the owner's side of the table.
              </motion.p>
            </div>
            <motion.div variants={fadeUp}>
              <ActionButton to="/contact" tone="light">
                Enquire
              </ActionButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {service.offerings.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full flex-col rounded-[22px] border border-[#E1E7F0] bg-[#F7F9FC] p-7 transition-shadow duration-500 hover:border-[#0E4174]/35 hover:shadow-[0_20px_44px_-26px_rgba(14,65,116,0.45)]"
              >
                <CapTile i={i} />
                <h3 className="mt-6 font-headline text-[21px] font-light leading-[1.25] text-[#28394d]">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 font-subtext text-[14.5px] leading-[1.7] text-[#5F6F7A]">
                  {item.text}
                </p>
                {/* <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E4174] transition-colors hover:text-[#0b3560]"
                >
                  Enquire
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link> */}
              </motion.div>
            ))}
          </motion.div>

          {/* Long enumerations (licence routes / project types) as chips. */}
          {service.sectors ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-12 border-t border-[#E1E7F0] pt-10"
            >
              <motion.div variants={fadeUp}>
                <Kicker>{service.sectorsLabel}</Kicker>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                {service.sectors.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#D3DEEF] bg-[#EAF0FA] px-5 py-2.5 font-subtext text-[13.5px] text-[#28394d]"
                  >
                    {s}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* ================= PROCESS (light editorial timeline) ================= */}
      <section className="relative overflow-hidden bg-[#EAF0FA] py-[52px] md:py-[72px]">
        <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-12 max-w-[640px]"
          >
            <motion.div variants={fadeUp}>
              <Kicker>How we work</Kicker>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 font-headline text-[32px] font-light leading-[1.1] text-[#28394d] md:text-[44px]"
            >
              <Accented text="A clear path to delivery" className="text-[#0E4174]" />
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5"
          >
            {service.process.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} className="relative">
                <span className="font-headline text-[38px] font-light text-[#0E4174]/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-4 mb-5 h-px w-full bg-[#0E4174]/15" />
                <h3 className="font-headline text-[19px] font-light leading-[1.25] text-[#28394d]">
                  {step.title}
                </h3>
                <p className="mt-2.5 font-subtext text-[13.5px] leading-[1.65] text-[#5F6F7A]">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      

      {/* ================= FEATURE CTA (image band) ================= */}
      <section className="relative overflow-hidden py-[52px] md:py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <div className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-[#EAF0FA] lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="flex flex-col justify-center p-9 md:p-14"
            >
              <motion.div variants={fadeUp}>
                <Kicker>Let's build together</Kicker>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="mt-5 font-headline text-[30px] font-light leading-[1.15] text-[#28394d] md:text-[42px]"
              >
                <Accented text="Let's shape your next development" className="text-[#0E4174]" />
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-[460px] font-subtext text-[15.5px] leading-[1.75] text-[#5F6F7A]"
              >
                Talk to our team about {service.title.toLowerCase()} and where it
                fits in your project journey — from first feasibility to final
                handover.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9">
                <ActionButton to="/contact" tone="light">
                  Get in touch
                </ActionButton>
              </motion.div>
            </motion.div>

            <div className="relative min-h-[280px] lg:min-h-full">
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= OTHER SERVICES ================= */}
      <section className="relative overflow-hidden bg-white py-[52px] md:py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <h2 className="mt-4 font-headline text-[30px] font-light leading-[1.1] text-[#28394d] md:text-[40px]">
                <Accented text="Other services" className="text-[#0E4174]" />
              </h2>
            </div>
            <Link
              to="/services"
              className="group hidden shrink-0 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0E4174] transition hover:text-[#0b3560] sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group flex flex-col"
              >
                <div className="relative overflow-hidden rounded-[20px]">
                  <div className="relative h-[210px] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 font-headline text-[12px] tracking-[0.28em] text-[#0E4174] backdrop-blur-sm">
                      {s.num}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-headline text-[18px] font-light leading-[1.2] text-[#28394d]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 font-subtext text-[12.5px] leading-[1.5] text-[#7C878E]">
                      {s.tagline}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-[#0E4174] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <CampaignLeadModalOnLoad />
    </main>
  );
}
