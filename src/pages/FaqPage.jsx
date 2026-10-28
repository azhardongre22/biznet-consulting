import { Suspense, lazy, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import usePageSeo from "../hooks/usePageSeo";
import { PATHS } from "../data/seoData";
import { faqSchema } from "../seo/schema";

const Footer = lazy(() => import("../components/layout/Footer"));

const EASE = [0.22, 1, 0.36, 1];

const faqs = [
  {
    q: "What is Biznet Consulting?",
    a: "Biznet Consulting is a UAE-based integrated consultancy specializing in project development, feasibility studies, project management, brand positioning, business planning, and execution-led development direction.",
  },
  {
    q: "What makes Biznet Consulting a trusted company in the UAE?",
    a: "Biznet is trusted for its UAE market understanding, clear planning, feasibility intelligence, execution involvement, and disciplined project delivery across key development stages.",
  },
  {
    q: "What services does Biznet offer in Dubai and across the UAE?",
    a: "Biznet offers feasibility studies, project development, project management, investment planning, business formation, brand positioning, market strategy, and interior improvement planning.",
  },
  {
    q: "What is the Firasah approach in Biznet's process?",
    a: "Firasah is Biznet's insight-led approach. It brings foresight, market understanding, and sound judgment into every stage of planning, development, and execution.",
  },
  {
    q: "How does Biznet approach sustainability and social responsibility?",
    a: "Biznet places responsible development at the core of its planning process, aligned with the UAE's green development vision. This is reflected through thoughtful material direction, energy-conscious decisions, efficient space planning, and development choices that respect people, resources, and the environment.",
  },
  {
    q: "What types of projects does Biznet work on?",
    a: "Biznet works across residential developments, commercial spaces, hospitality projects, hotel apartments, private villas, educational institutions, malls, adventure parks, business projects, asset development, and community-focused developments across the UAE.",
  },
  {
    q: "Does Biznet provide feasibility studies and viability reports?",
    a: "Yes. Biznet provides feasibility studies and viability reports covering market demand, project cost, risk review, ROI, investment potential, and commercial viability.",
  },
  {
    q: "Can Biznet manage interiors, renovations, and improvement planning for existing projects?",
    a: "Yes. Biznet manages interior planning, renovation direction, space improvement, functional upgrades, and value-focused enhancement for existing residential, commercial, and hospitality projects.",
  },
  {
    q: "Does Biznet work with investors on investment planning and funding strategy?",
    a: "Yes. Biznet works with investors on investment planning, project planning, feasibility assessment, funding strategy, financial direction, and investor-ready project presentation.",
  },
  {
    q: "How does Biznet create informed investment decisions?",
    a: "Biznet uses market research, feasibility analysis, risk review, ROI assessment, financial planning, and development evaluation to shape stronger investment and project decisions.",
  },
  {
    q: "How does Biznet's insight-driven approach benefit clients?",
    a: "Biznet's insight-driven approach strengthens planning, defines project direction, reduces development risk, and moves ideas toward execution with clarity, purpose, and commercial relevance.",
  },
  {
    q: "What can clients expect when working with Biznet Consulting?",
    a: "Clients can expect focused consultancy, practical project planning, feasibility intelligence, market understanding, execution involvement, and disciplined project management from concept to delivery.",
  },
  {
    q: "Can Biznet position a project in the market?",
    a: "Yes. Biznet develops project positioning through brand strategy, naming, identity direction, market narrative, communication planning, digital presence, and launch direction.",
  },
  {
    q: "Does Biznet manage project timelines, contracting, management, and execution?",
    a: "Yes. Biznet manages project timelines, contractor engagement, stakeholder alignment, execution tracking, quality control, and delivery progress across every key stage.",
  },
  {
    q: "What experience does Biznet Consulting have in project development and management?",
    a: "Biznet has experience across residential, commercial, hospitality, private villa, community, and planned development projects in the UAE.",
  },
  {
    q: "How does Biznet manage projects from concept to execution?",
    a: "Biznet manages projects through vision definition, feasibility, market study, planning, stakeholder coordination, development strategy, execution control, and outcome-focused delivery.",
  },
  {
    q: "Can Biznet improve the value and direction of an existing project?",
    a: "Yes. Biznet improves existing projects through feasibility review, repositioning, planning direction, interior improvement, market alignment, and value enhancement.",
  },
  {
    q: "How does Biznet work with developers, investors, and entrepreneurs in the UAE?",
    a: "Biznet works with developers, investors, and entrepreneurs across feasibility, project development, investment planning, business setup, project management, brand positioning, and execution.",
  },
  {
    q: "Can Biznet create a clear strategy before a project begins?",
    a: "Yes. Biznet creates pre-development strategy through feasibility studies, market research, project planning, investment analysis, business planning, and development direction.",
  },
  {
    q: "Why should clients work with Biznet at the early stage of a project?",
    a: "Early-stage engagement allows Biznet to define feasibility, strengthen planning, assess risk, shape project strategy, improve ROI potential, and prepare the project for confident execution.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.025, 0.3) }}
      className="overflow-hidden rounded-[4px] border border-[#C7D1D8] bg-[#F5F8FC] shadow-[0_4px_16px_rgba(14,65,116,0.08)] transition-shadow duration-500 hover:shadow-[0_10px_28px_rgba(14,65,116,0.12)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-start justify-between gap-5 px-6 py-5 text-left transition-colors duration-300 hover:bg-[#EEF3F8] md:px-8 md:py-6"
      >
        <span className="flex flex-1 items-baseline gap-4 md:gap-6">
          <span className="font-headline text-[14px] font-normal tabular-nums text-[#0E4174] md:text-[15px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-headline text-[16px] font-normal leading-[1.4] text-[#1A2B4A] md:text-[19px]">
            {faq.q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0E4174]/30 text-[18px] font-light leading-none text-[#0E4174] md:h-8 md:w-8"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[58px] md:px-8 md:pb-7 md:pl-[82px]">
              <div className="mb-5 h-px w-10 bg-[#0E4174]/35" />
              <p className="font-subtext text-[14.5px] font-normal leading-[1.8] text-[#3A4A5C] md:text-[15.5px]">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  usePageSeo({ path: PATHS.faqs, jsonLd: faqSchema(faqs) });
  const [openIndex, setOpenIndex] = useState(0);


  return (
    <div>
      <Navbar />
      <main className="min-h-screen overflow-x-clip bg-[#EEF3F8]">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3F8] to-[#DDE5E8] px-5 pb-16 pt-32 sm:px-8 lg:px-14 lg:pb-20 lg:pt-40 xl:px-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 20% 20%, rgba(14,65,116,0.20) 0%, transparent 60%), radial-gradient(50% 50% at 85% 80%, rgba(56,73,103,0.18) 0%, transparent 60%)",
            }}
          />

          <div className="relative mx-auto w-full max-w-[1100px] text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#0E4174]"
            >
              <span className="h-px w-8 bg-[#0E4174]" />
              How can we help
              <span className="h-px w-8 bg-[#0E4174]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="font-headline text-[36px] font-light leading-[1.08] tracking-[-0.025em] text-[#0E4174] md:text-[52px] lg:text-[64px]"
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
              style={{ transformOrigin: "center" }}
              className="mx-auto mt-8 h-px w-[58px] bg-[#0E4174]"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mx-auto mt-8 max-w-[680px] font-subtext text-[15px] font-normal leading-[1.85] text-[#3A4A5C] md:text-[16px]"
            >
              Answers to the questions clients most often ask about our
              approach, services, and how we work alongside developers and
              investors across the UAE.
            </motion.p>
          </div>
        </section>

        {/* ============ FAQ LIST ============ */}
        <section className="bg-[#DDE5E8] px-5 py-16 sm:px-8 md:py-24 lg:px-14 lg:py-28 xl:px-20">
          <div className="mx-auto w-full max-w-[920px] space-y-3 md:space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* CTA footer inside the FAQ section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto mt-16 max-w-[920px] rounded-[4px] border border-[#C7D1D8] bg-[#F5F8FC] p-8 text-center shadow-[0_6px_22px_rgba(14,65,116,0.08)] md:mt-20 md:p-10"
          >
            <p className="font-headline text-[20px] font-light leading-[1.4] text-[#0E4174] md:text-[24px]">
              Still have a question we haven't answered?
            </p>
            <p className="mx-auto mt-3 max-w-[520px] font-subtext text-[14.5px] font-normal leading-[1.75] text-[#3A4A5C]">
              Reach out and our team will respond with focused guidance based on
              your project.
            </p>
            <a
              href="/contact"
              className="mt-7 inline-flex items-center justify-center rounded-full border border-[#0E4174] bg-[#0E4174] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(14,65,116,0.22)] transition hover:bg-[#0A2F55]"
            >
              Contact us
            </a>
          </motion.div>
        </section>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
