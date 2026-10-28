import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDown } from "lucide-react";

import "../styles/site.css";
import useScrollMotion from "../hooks/useScrollMotion";
import Navbar from "../components/layout/Navbar";
import { CampaignLeadModalOnLoad } from "../components/forms/CampaignLeadModal";
import { PATHS, SERVICE_SECTIONS, serviceForPath, servicePath } from "../data/seoData";
import usePageSeo from "../hooks/usePageSeo";
import { itemListSchema, serviceSchema } from "../seo/schema";

import heroImage from "../assets/images/photos/services-hero.png";
import devImage from "../assets/images/photos/architectural-model-planning.webp";
import pmImage from "../assets/images/photos/site-team-coordination.webp";
import villaImage from "../assets/images/photos/contemporary-villa.webp";
import feasImage from "../assets/images/photos/services-feasibility.png";
import investmentImage from "../assets/images/projects/alef-noon-1.webp";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";
const ANCHOR = "scroll-mt-[90px]";


// ── Structured content (from the approved services-content.json) ─────────────

const PHILOSOPHY = {
  heading: "Decisions Informed by the Bigger Picture.",
  paragraph:
    "Every project calls for a different combination of commercial evaluation, technical planning and execution oversight. We establish the priorities first, then define the scope of involvement around the project's needs.",
  principles: [
    { number: "01", title: "Understand", text: "Establish objectives, constraints and requirements." },
    { number: "02", title: "Evaluate", text: "Examine viability, development options and practical considerations." },
    { number: "03", title: "Direct", text: "Define priorities and establish the next steps." },
    { number: "04", title: "Monitor", text: "Track progress and maintain visibility over key decisions." },
  ],
};

// Fixed service order: Feasibility Study → Project Development → Project Management.
const INDEX = SERVICE_SECTIONS.map((s, i) => ({ number: `0${i + 1}`, id: s.id, name: s.title }));

const DEVELOPMENT = {
  number: "02",
  id: "project-development",
  name: "Project Development",
  headline: "Define the Project Before Defining the Build.",
  description:
    "Establish a clear direction for your development through opportunity assessment, concept evaluation and early-stage planning. Our work connects development potential with commercial objectives and practical requirements.",
  note: "Opportunity → Definition → Direction",
  scope: [
    "Development strategy and project positioning",
    "Land potential assessment",
    "Concept review and optimisation",
    "Early-stage design coordination",
    "Market alignment",
    "Project definition and planning priorities",
    "Development opportunity evaluation",
    "Early-stage decision support",
  ],
  cta: "Discuss Project Development",
  image: devImage,
  imageAlt: "Architectural model and planning drawings for an early-stage development",
};

const MANAGEMENT = {
  number: "03",
  id: "project-management",
  name: "Project Management",
  headline: "Keep the Plan Connected to Execution.",
  description:
    "Maintain visibility over project progress, expenditure and delivery milestones through structured project management. Our involvement is tailored to the requirements of investment-led developments and private construction projects.",
  image: pmImage,
  imageAlt: "Construction professionals coordinating work on an active site",
  tracks: [
    {
      id: "pm-investment",
      letter: "A",
      name: "Investment & Development Projects",
      description:
        "We monitor implementation, coordinate key stakeholders and report on progress to help clients maintain control over approved project objectives.",
      image: investmentImage,
      imageAlt: "Alef Noon Residence — a residential and commercial tower in Jumeirah Village Circle",
      objectPosition: "28% center",
      scope: [
        "Consultant and contractor coordination",
        "Tender review and contractor selection input",
        "Schedule and progress monitoring",
        "Cost and timeline follow-up",
        "Technical issue and risk identification",
        "Project reporting",
        "Corrective action follow-up",
        "Monitoring against approved objectives",
      ],
    },
    {
      id: "pm-villas",
      letter: "B",
      name: "Private Projects & Villas",
      description:
        "For private villas and buildings, we maintain oversight from design development and approvals through construction and handover, with progress reporting aligned to the owner's requirements.",
      image: villaImage,
      imageAlt: "Contemporary private villa",
      scope: [
        "Design development and approval follow-up",
        "Consultant and contractor coordination",
        "Contractor selection input",
        "Permit and authority approval monitoring",
        "Periodic site follow-up",
        "Construction progress reporting",
        "Execution quality and milestone monitoring",
        "Key decision follow-up",
        "Completion and handover follow-up",
      ],
    },
  ],
  cta: "Enquire About Project Management",
};

const FEASIBILITY = {
  number: "01",
  id: "feasibility-study",
  name: "Feasibility Study",
  headline: "Know What the Opportunity Can Deliver.",
  description:
    "Evaluate development potential before committing to a project direction. Our feasibility studies examine market conditions, development scenarios, projected costs and potential returns.",
  scope: [
    "Highest and best use analysis",
    "Land acquisition evaluation",
    "Market assessment and positioning",
    "Design efficiency review",
    "Financial modelling and projections",
    "Cost, revenue and investment return analysis",
    "Development scenario evaluation",
    "Risk assessment",
  ],
  cta: "Enquire About a Feasibility Study",
  image: feasImage,
  imageAlt: "Aerial view of undeveloped land evaluated for development potential",
};

/** Scope lists per service, reused for the Service JSON-LD offer catalogue. */
const SERVICE_SCOPE = {
  [FEASIBILITY.id]: FEASIBILITY.scope,
  [DEVELOPMENT.id]: DEVELOPMENT.scope,
  [MANAGEMENT.id]: MANAGEMENT.tracks.flatMap((t) => t.scope),
};

const APPROACH = {
  heading: "A Scope Built Around Your Project.",
  steps: [
    { number: "01", name: "Evaluate", description: "Establish the priorities, requirements and decisions that matter most." },
    { number: "02", name: "Align", description: "Connect commercial objectives with technical and practical requirements." },
    { number: "03", name: "Monitor", description: "Maintain visibility through reporting, follow-up and execution oversight." },
  ],
  note: "Every engagement is scoped according to the project's circumstances, stage and objectives rather than a fixed, bundled process.",
};

const CONTACT = {
  heading: "What Does Your Project Need Next?",
  body: "Whether you are evaluating an opportunity, defining a development or overseeing construction, tell us about your requirements and intended outcomes.",
  audiences: ["Developers", "Investors", "Landowners", "Private Clients"],
  cta: "Speak With Biznet",
};

// Smooth, reduced-motion-aware in-page navigation that respects the fixed nav.
function scrollToId(id, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = immediate || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  // Sections carry scroll-margin-top (ANCHOR) for the fixed nav; Lenis and
  // scrollIntoView already honour it, so only the native jump subtracts it.
  // The on-load lead modal pauses Lenis, so jump natively then (Lenis re-reads
  // the scroll position when it restarts).
  if (window.lenis?.isStopped) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
  else if (window.lenis) window.lenis.scrollTo(el, { immediate: !!reduce });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// ── Reusable bits ────────────────────────────────────────────────────────────

function ServiceOverline({ number, name }) {
  return (
    <p className="hv2-eyebrow text-[#8A95A0]">
      <span className="text-[#0E4174]">{number}</span>
      <span className="mx-2 text-[#C4CFDB]">/</span>
      {name}
    </p>
  );
}

function ScopeList({ items, columns = true, labelId }) {
  return (
    <ul aria-labelledby={labelId} className={`mt-6 grid grid-cols-1 gap-x-10 ${columns ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 border-t border-[#E6EBF0] py-3.5 text-[14px] leading-[1.55] text-[#3C4753]">
          <span aria-hidden="true" className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#0E4174]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FramedPhoto({ src, alt, ratio = "aspect-[4/5]", strength = "8", objectPosition }) {
  return (
    <div className={`hv2-parallax hv2-frame ${ratio} w-full`} data-parallax={strength}>
      <div className="hv2-parallax__inner" data-parallax-inner>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={objectPosition ? { objectPosition } : undefined} />
      </div>
    </div>
  );
}

function ChapterCta({ label }) {
  return (
    <button
      type="button"
      onClick={() => scrollToId("lets-talk")}
      className="group mt-9 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
    >
      <span className="border-b border-[#0E4174]/40 pb-0.5">{label}</span>
      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </button>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="top" className={`hv2-section ${ANCHOR}`}>
      <div className={`${SHELL} grid grid-cols-1 items-center gap-12 pb-20 pt-28 md:pb-28 md:pt-32 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-7">
          <p data-hero-copy className="hv2-eyebrow text-[#0E4174]">Our Services</p>
          <h1 className="hv2-display mt-6 text-[#092D54]" style={{ fontSize: "clamp(2.4rem, 4.4vw, 4.4rem)", lineHeight: 1.06 }}>
            The Right Expertise for Every Stage of Development.
          </h1>
          <p data-hero-copy className="mt-7 max-w-[590px] text-[16px] leading-[1.75] text-[#3C4753] md:text-[17px]">
            From evaluating an opportunity to defining project direction and overseeing
            execution, Biznet Consulting offers practical support tailored to your
            project's requirements.
          </p>
          <div data-hero-copy className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
            >
              Discuss Your Project
            </Link>
            <button
              type="button"
              onClick={() => scrollToId("service-index")}
              className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
            >
              <span className="border-b border-[#0E4174]/40 pb-0.5">Explore Our Services</span>
              <ArrowDown size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A95A0]">
            {INDEX.map((svc, i) => (
              <span key={svc.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-[#C4CFDB]">•</span>}
                {svc.name}
              </span>
            ))}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div data-reveal>
            <FramedPhoto
              src={heroImage}
              alt="Professionals reviewing architectural plans at a table"
              ratio="aspect-[4/5]"
              strength="6"
              objectPosition="center 58%"
            />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A95A0]">
              From evaluation to execution
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section id="our-approach" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-20 md:py-28`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p data-reveal className="hv2-eyebrow">How We Work</p>
            <h2 data-reveal className="hv2-display mt-5 text-[30px] leading-[1.12] text-[#092D54] md:text-[42px]">
              {PHILOSOPHY.heading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p data-reveal className="max-w-[640px] text-[16px] leading-[1.8] text-[#3C4753] md:text-[17px]">
              {PHILOSOPHY.paragraph}
            </p>
          </div>
        </div>

        <div data-reveal-stagger className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {PHILOSOPHY.principles.map((p) => (
            <div key={p.title} data-reveal-item className="border-t border-[#E6EBF0] py-8">
              <span className="hv2-display text-[14px] text-[#AEB8C2]">{p.number}</span>
              <h3 className="hv2-display mt-3 text-[20px] leading-[1.2] text-[#0E4174]">{p.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#7C878E]">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceIndex({ activeId }) {
  return (
    <section id="service-index" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-14 md:py-16`}>
        <nav aria-label="Services on this page">
          <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-3">
            {INDEX.map((s) => {
              const active = activeId === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={servicePath(s.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(s.id);
                      // Reflect the clean service URL without a router navigation
                      // (which would reset the scroll to the top).
                      window.history.replaceState(window.history.state, "", servicePath(s.id));
                    }}
                    aria-current={active ? "true" : undefined}
                    className="group flex items-center justify-between gap-4 border-t-2 py-6 pr-2 transition-colors lg:pr-6"
                    style={{ borderTopColor: active ? "#0E4174" : "#E6EBF0" }}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className={`hv2-display text-[14px] ${active ? "text-[#0E4174]" : "text-[#AEB8C2]"}`}>{s.number}</span>
                      <span className={`hv2-display text-[19px] leading-[1.15] transition-colors md:text-[21px] ${active ? "text-[#0E4174]" : "text-[#52606E] group-hover:text-[#0E4174]"}`}>
                        {s.name}
                      </span>
                    </span>
                    <ArrowDown size={16} className={active ? "text-[#0E4174]" : "text-[#AEB8C2] group-hover:text-[#0E4174]"} />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function ChapterDevelopment() {
  return (
    <section id="project-development" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} grid grid-cols-1 gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5 lg:pt-2">
          <div data-reveal>
            <FramedPhoto src={DEVELOPMENT.image} alt={DEVELOPMENT.imageAlt} ratio="aspect-[4/5]" strength="9" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A95A0]">{DEVELOPMENT.note}</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ServiceOverline number={DEVELOPMENT.number} name={DEVELOPMENT.name.toUpperCase()} />
          <h2 data-reveal id="dev-h" className="hv2-display mt-5 text-[32px] leading-[1.1] text-[#092D54] md:text-[46px]">
            {DEVELOPMENT.headline}
          </h2>
          <p data-reveal className="mt-6 max-w-[620px] text-[15.5px] leading-[1.8] text-[#3C4753]">
            {DEVELOPMENT.description}
          </p>
          <p className="mt-10 hv2-eyebrow">What We Cover</p>
          <ScopeList items={DEVELOPMENT.scope} labelId="dev-h" />
          <ChapterCta label={DEVELOPMENT.cta} />
        </div>
      </div>
    </section>
  );
}

function PmTrack({ track, imageSide }) {
  return (
    <div id={track.id} className={`scroll-mt-[90px] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14`}>
      <div className={`lg:col-span-7 ${imageSide === "left" ? "lg:order-2" : ""}`}>
        <p className="hv2-eyebrow text-[#8A95A0]">Track {track.letter}</p>
        <h3 className="hv2-display mt-3 text-[24px] leading-[1.14] text-[#0E4174] md:text-[30px]">{track.name}</h3>
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.75] text-[#3C4753]">{track.description}</p>
        <p className="mt-8 hv2-eyebrow" id={`${track.id}-scope`}>Scope of Services</p>
        <ScopeList items={track.scope} labelId={`${track.id}-scope`} />
      </div>
      <div className={`lg:col-span-5 ${imageSide === "left" ? "lg:order-1" : ""}`}>
        <div data-reveal className="lg:sticky lg:top-28">
          <FramedPhoto
            src={track.image}
            alt={track.imageAlt}
            ratio="aspect-[4/5]"
            strength="7"
            objectPosition={track.objectPosition}
          />
        </div>
      </div>
    </div>
  );
}

function ChapterManagement() {
  return (
    <section id="project-management" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-24 md:py-32`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ServiceOverline number={MANAGEMENT.number} name={MANAGEMENT.name.toUpperCase()} />
            <h2 data-reveal className="hv2-display mt-5 text-[32px] leading-[1.1] text-[#092D54] md:text-[46px]">
              {MANAGEMENT.headline}
            </h2>
            <p data-reveal className="mt-6 max-w-[620px] text-[15.5px] leading-[1.8] text-[#3C4753]">
              {MANAGEMENT.description}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div data-reveal>
              <FramedPhoto src={MANAGEMENT.image} alt={MANAGEMENT.imageAlt} ratio="aspect-[16/11]" strength="6" />
            </div>
          </div>
        </div>

        {/* Two distinct audience tracks */}
        <div className="mt-16 flex flex-col gap-16 border-t border-[#E6EBF0] pt-16 md:mt-20 md:gap-20">
          <PmTrack track={MANAGEMENT.tracks[0]} imageSide="right" />
          <div className="border-t border-[#E6EBF0]" />
          <PmTrack track={MANAGEMENT.tracks[1]} imageSide="left" />
        </div>

        <ChapterCta label={MANAGEMENT.cta} />
      </div>
    </section>
  );
}

function ChapterFeasibility() {
  return (
    <section id="feasibility-study" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-24 md:py-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ServiceOverline number={FEASIBILITY.number} name={FEASIBILITY.name.toUpperCase()} />
            <h2 data-reveal className="hv2-display mt-5 text-[32px] leading-[1.1] text-[#092D54] md:text-[46px]">
              {FEASIBILITY.headline}
            </h2>
            <p data-reveal className="mt-6 max-w-[600px] text-[15.5px] leading-[1.8] text-[#3C4753]">
              {FEASIBILITY.description}
            </p>

            <p className="mt-10 hv2-eyebrow" id="feas-scope-h">What We Cover</p>
            <ScopeList items={FEASIBILITY.scope} labelId="feas-scope-h" />
            <ChapterCta label={FEASIBILITY.cta} />
          </div>

          <div className="lg:col-span-5">
            <div data-reveal>
              <FramedPhoto src={FEASIBILITY.image} alt={FEASIBILITY.imageAlt} ratio="aspect-[4/5]" strength="9" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function ApproachRail() {
  return (
    <section id="how-we-work" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-24 md:py-32`}>
        <p data-reveal className="hv2-eyebrow">Our Working Principles</p>
        <h2 data-reveal className="hv2-display mt-5 max-w-[760px] text-[30px] leading-[1.12] text-[#092D54] md:text-[46px]">
          {APPROACH.heading}
        </h2>
        <div data-reveal-stagger className="mt-14 grid grid-cols-1 border-t border-[#E6EBF0] md:grid-cols-3">
          {APPROACH.steps.map((s, i) => (
            <div
              key={s.number}
              data-reveal-item
              className={`py-9 md:pr-10 ${i > 0 ? "border-t border-[#E6EBF0] md:border-l md:border-t-0 md:pl-10" : ""}`}
            >
              <p className="hv2-eyebrow text-[#0E4174]">{s.number} / {s.name}</p>
              <p className="mt-4 max-w-[300px] text-[15px] leading-[1.7] text-[#3C4753]">{s.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[640px] text-[15px] leading-[1.7] text-[#596573]">
          {APPROACH.note}
        </p>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section id="lets-talk" className={`hv2-section border-t border-[#EEF1F4] ${ANCHOR}`}>
      <div className={`${SHELL} py-24 md:py-32`}>
        <div className="border-l-2 border-[#0E4174] pl-6 md:pl-10">
          <p data-reveal className="hv2-eyebrow">Let's talk</p>
          <h2 data-reveal className="hv2-display mt-5 max-w-[760px] text-[34px] leading-[1.08] text-[#092D54] md:text-[56px]">
            {CONTACT.heading}
          </h2>
          <p data-reveal className="mt-6 max-w-[560px] text-[16px] leading-[1.75] text-[#3C4753]">
            {CONTACT.body}
          </p>
          <div data-reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            {CONTACT.audiences.map((a) => (
              <span key={a} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#52606E]">{a}</span>
            ))}
          </div>
          <div data-reveal className="mt-10">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0E4174] px-9 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
            >
              {CONTACT.cta}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const rootRef = useRef(null);
  useScrollMotion(rootRef);
  const [activeId, setActiveId] = useState(INDEX[0].id);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const service = serviceForPath(pathname);
  usePageSeo({
    path: service ? servicePath(service.id) : PATHS.services,
    jsonLd: service
      ? serviceSchema({
          name: service.title,
          description: service.seoDescription,
          path: servicePath(service.id),
          offers: SERVICE_SCOPE[service.id],
        })
      : [
          itemListSchema(
            "Biznet Consulting services",
            SERVICE_SECTIONS.map((s) => ({ name: s.title, path: servicePath(s.id), description: s.summary })),
          ),
          ...SERVICE_SECTIONS.map((s) =>
            serviceSchema({ name: s.title, description: s.seoDescription, path: servicePath(s.id), offers: SERVICE_SCOPE[s.id] }),
          ),
        ],
  });

  // Old anchor links (/services#feasibility-study) → the clean service URL.
  useEffect(() => {
    const legacy = SERVICE_SECTIONS.find((s) => `#${s.id}` === hash);
    if (pathname === "/services" && legacy) navigate(servicePath(legacy.id), { replace: true });
  }, [pathname, hash, navigate]);

  // Clean service URLs (/feasibility-study, …) open the page at that section;
  // other in-page anchors (#lets-talk) still work.
  useEffect(() => {
    const id = service?.id || hash.replace(/^#/, "");
    if (!id) return undefined;
    // Lazy images and ScrollTrigger refreshes keep growing the page for ~1s, so
    // re-align a few times — but stop as soon as the visitor scrolls themselves.
    // On a fresh load the first-paint loader (html.biz-booting) hides the page
    // with zero scroll height, so wait for it to be dismissed before starting.
    const html = document.documentElement;
    let timers = [];
    const start = () => {
      timers = [150, 700, 1400].map((delay) => window.setTimeout(() => scrollToId(id, true), delay));
    };
    const boot = new MutationObserver(() => {
      if (html.classList.contains("biz-booting")) return;
      boot.disconnect();
      start();
    });
    if (html.classList.contains("biz-booting")) boot.observe(html, { attributes: true, attributeFilter: ["class"] });
    else start();

    const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
    const cancel = () => {
      boot.disconnect();
      timers.forEach(window.clearTimeout);
      userEvents.forEach((e) => window.removeEventListener(e, cancel));
    };
    userEvents.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    return cancel;
  }, [service, hash]);

  // Scroll-spy: highlight the service index item for the chapter in view.
  useEffect(() => {
    const ids = INDEX.map((s) => s.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    html.style.background = "#ffffff";
    body.style.background = "#ffffff";

    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, [service]);

  return (
    <main ref={rootRef} className="home-v2">
      <Navbar />
      <Hero />
      <Philosophy />
      <ServiceIndex activeId={activeId} />
      <ChapterFeasibility />
      <ChapterDevelopment />
      <ChapterManagement />
      <ApproachRail />
      <ContactCta />

      <div id="contact">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      <CampaignLeadModalOnLoad />
    </main>
  );
}
