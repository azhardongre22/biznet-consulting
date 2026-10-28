import { Suspense, lazy, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import "../styles/site.css";
import useScrollMotion from "../hooks/useScrollMotion";
import Navbar from "../components/layout/Navbar";
import HomeClients from "../components/home/HomeClients";
import StoryInNumbers from "../components/common/StoryInNumbers";
import { CampaignLeadModalOnLoad } from "../components/forms/CampaignLeadModal";

import heroImage from "../assets/images/photos/site-team-coordination.webp";
import storyImage from "../assets/images/photos/about-story.webp";
import visionImage from "../assets/images/photos/dubai-urban-development.webp";
import sustainImage from "../assets/images/photos/green-building-facade.webp";
import ceoImage from "../assets/images/people/ismail-al-hammadi-ceo-biznet-consulting.jpg";
import usePageSeo from "../hooks/usePageSeo";
import { PATHS } from "../data/seoData";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";

const VALUES = [
  {
    n: "01",
    title: "Clarity",
    text: "Establishing priorities and defining the next steps.",
  },
  {
    n: "02",
    title: "Judgement",
    text: "Assessing opportunities through commercial and practical considerations.",
  },
  {
    n: "03",
    title: "Control",
    text: "Maintaining visibility over progress, costs and timelines.",
  },
  {
    n: "04",
    title: "Accountability",
    text: "Keeping client objectives central to project decisions.",
  },
  {
    n: "05",
    title: "Adaptability",
    text: "Shaping our involvement around each project's requirements.",
  },
  {
    n: "06",
    title: "Responsibility",
    text: "Considering resource efficiency and long-term value in development choices.",
  },
];

// ── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      data-hero
      className="relative flex min-h-[480px] w-full items-end overflow-hidden"
      style={{ height: "clamp(480px, 64vh, 640px)" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          data-hero-image
          src={heroImage}
          alt="A contemporary private villa in stone and timber — exterior render"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
          style={{ objectPosition: "center 60%" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#06182c]/60 via-[#06182c]/35 to-[#06182c]/50"
      />

      <div className={`relative z-10 ${SHELL} pb-14 md:pb-20`}>
        <h1 className="hv2-display mt-5 text-white">
          <span className="hv2-line-mask text-[40px] sm:text-[56px] md:text-[70px]">
            <span data-hero-line className="block leading-[1.06]">
              Shaping Developments
            </span>
          </span>
        </h1>
        <span
          data-hero-rule
          aria-hidden="true"
          className="mt-6 block h-[2px] w-[110px] origin-left bg-white/80"
        />
        <p
          data-hero-copy
          className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-white/85 md:text-[17px]"
        >
          We bring ambitious visions to life, guiding developments that make a
          meaningful impact.
        </p>
      </div>
    </section>
  );
}

// Our story — where opportunity meets direction.
function Story() {
  return (
    <section className="hv2-section">
      <div
        className={`${SHELL} grid grid-cols-1 gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}
      >
        <div className="lg:col-span-7">
          <p data-reveal className="hv2-eyebrow">
            Our Story
          </p>
          <h2
            data-reveal
            className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[52px]"
          >
            Where Opportunity Meets Direction.
          </h2>
          <span
            data-rule
            aria-hidden="true"
            className="hv2-rule mt-7 w-[90px] origin-left"
          />
          <div className="mt-8 max-w-[560px]">
            <p
              data-reveal
              className="mb-5 text-[15px] leading-[1.8] text-[#596573]"
            >
              Every development starts with an idea, but turning that idea into
              a successful project takes the right decisions, careful planning
              and a clear understanding of what is possible. Recognising the
              need to evaluate opportunities before committing to development,
              Biznet Consulting was established in Dubai with a focus on
              feasibility studies, project development and project management.
            </p>
            <p data-reveal className="text-[15px] leading-[1.8] text-[#596573]">
              We bring these elements together to help shape opportunities into
              well-planned projects, with each stage guided by the project's
              goals, potential and practical requirements.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-6">
          <div
            data-clip
            data-parallax="8"
            className="hv2-parallax hv2-frame aspect-[3/4] w-full max-w-[420px] lg:mr-0"
          >
            <div className="hv2-parallax__inner" data-parallax-inner>
              <img
                src={storyImage}
                alt="Development under construction in the UAE"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Vision + Mission — two editorial statements.
function VisionMission() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className={`${SHELL} py-24 md:py-32`}>
        {/* Vision */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p data-reveal className="hv2-eyebrow">
              Our Vision
            </p>
            <h2
              data-reveal
              className="hv2-display mt-5 text-[32px] leading-[1.1] text-[#092D54] md:text-[46px]"
            >
              To Shape the Next Chapter of Development.
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-[560px] text-[16px] leading-[1.8] text-[#596573] md:text-[17px]"
            >
              To be a trusted development consultancy in the UAE, recognised for
              practical planning and a consistent focus on project outcomes.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div
              data-reveal
              data-parallax="7"
              className="hv2-parallax hv2-frame aspect-[16/11] w-full"
            >
              <div className="hv2-parallax__inner" data-parallax-inner>
                <img
                  src={visionImage}
                  alt="Urban development in central Dubai"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-[#E5EAF0] pt-16 lg:grid-cols-12 lg:gap-16 md:mt-24 md:pt-20">
          <div className="lg:col-span-5">
            <p data-reveal className="hv2-eyebrow">
              Our Mission
            </p>
            <h2
              data-reveal
              className="hv2-display mt-5 text-[30px] leading-[1.1] text-[#092D54] md:text-[40px]"
            >
              Making Every Project Decision Count.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            <p
              data-reveal
              className="hv2-display text-[22px] leading-[1.4] text-[#1D2A3A] md:text-[28px]"
            >
              To help clients assess opportunities, define workable development
              plans and maintain visibility over execution through tailored
              consultancy services at every critical stage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className={`${SHELL} py-24 md:py-32`}>
        <div className="max-w-[620px]">
          <p data-reveal className="hv2-eyebrow">
            Core Values
          </p>
          <h2
            data-reveal
            className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[48px]"
          >
            What Guides Our Work.
          </h2>
        </div>

        <div
          data-reveal-stagger
          className="mt-14 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12"
        >
          {VALUES.map((v) => (
            <div
              key={v.n}
              data-reveal-item
              className="border-t border-[#D8E0E8] py-7"
            >
              <span className="hv2-display text-[14px] text-[#AEB8C2]">
                {v.n}
              </span>
              <h3 className="hv2-display mt-4 text-[23px] leading-[1.14] text-[#0E4174]">
                {v.title}
              </h3>
              <p className="mt-3 max-w-[300px] text-[13.5px] leading-[1.65] text-[#8A95A0]">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sustainability() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div
        className={`${SHELL} grid grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16`}
      >
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div
            data-reveal
            data-parallax="8"
            className="hv2-parallax hv2-frame aspect-[4/5] w-full max-w-[460px]"
          >
            <div className="hv2-parallax__inner" data-parallax-inner>
              <img
                src={sustainImage}
                alt="A building façade covered in greenery"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <p data-reveal className="hv2-eyebrow">
            Responsibility
          </p>
          <h2
            data-reveal
            className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[48px]"
          >
            Responsible Development.
          </h2>
          <span
            data-rule
            aria-hidden="true"
            className="hv2-rule mt-7 w-[90px] origin-left"
          />
          <p
            data-reveal
            className="mt-8 max-w-[520px] text-[15px] leading-[1.8] text-[#596573]"
          >
            We consider how planning decisions influence space efficiency,
            material selection, energy use and long-term asset value where these
            factors are relevant to the project.
          </p>
          <p
            data-reveal
            className="mt-5 max-w-[520px] text-[15px] leading-[1.8] text-[#596573]"
          >
            This reflects our commitment to responsible decision-making and the
            wider direction of development in the UAE.
          </p>
        </div>
      </div>
    </section>
  );
}

function CeoQuote() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div
        className={`${SHELL} grid grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}
      >
        <div data-reveal>
          <div className="hv2-frame mx-auto aspect-[4/5] w-full max-w-[400px] lg:mx-0">
            <img
              src={ceoImage}
              alt="Ismail Al Hammadi, Chief Executive Officer of Biznet Consulting"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[center_18%]"
              draggable="false"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p data-reveal className="hv2-eyebrow">
            Our Leadership
          </p>
          <h2
            data-reveal
            className="hv2-display mt-5 text-[30px] leading-[1.1] text-[#092D54] md:text-[42px]"
          >
            A Purpose Behind Every Decision.
          </h2>
          <blockquote
            data-reveal
            className="hv2-display mt-8 text-[20px] leading-[1.55] text-[#28394D] md:text-[25px] md:leading-[1.5]"
          >
            <span className="text-[#AEB8C2]">&ldquo;</span>
            At Biznet, we don't chase growth, we create it. Our focus is simple:
            build with purpose, scale with precision, and lead with impact. The
            future isn't something we wait for; it's something we shape.
            <span className="text-[#AEB8C2]">&rdquo;</span>
          </blockquote>
          <div data-reveal className="mt-10 flex items-center gap-5">
            <span className="h-px w-12 shrink-0 bg-[#0E4174]" />
            <div>
              <p className="hv2-display text-[22px] leading-none text-[#0E4174] md:text-[25px]">
                Ismail Al Hammadi
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A95A0]">
                Chief Executive Officer, Biznet Consulting LLC
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBlock() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className={`${SHELL} py-24 text-center md:py-32`}>
        <p data-reveal className="hv2-eyebrow">
          Let's talk
        </p>
        <h2
          data-reveal
          className="hv2-display mx-auto mt-5 max-w-[640px] text-[32px] leading-[1.08] text-[#092D54] sm:text-[44px] md:text-[56px]"
        >
          Every Opportunity Has a Next Step.
        </h2>
        <p
          data-reveal
          className="mx-auto mt-6 max-w-[520px] text-[16px] leading-[1.75] text-[#596573]"
        >
          Considering a new development, assessing a property or planning
          construction? Tell us where you stand and what you aim to achieve.
        </p>
        <div data-reveal className="mt-9">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0E4174] px-9 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
          >
            Start a Conversation
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const rootRef = useRef(null);
  useScrollMotion(rootRef);
  usePageSeo({ path: PATHS.about, pageType: "AboutPage" });

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
  }, []);

  return (
    <main ref={rootRef} className="home-v2">
      <Navbar />
      <Hero />
      <Story />
      <VisionMission />
      <Values />
      <StoryInNumbers />
      {/* <Sustainability /> */}
      <HomeClients />
      <CeoQuote />
      <CtaBlock />

      <div id="contact">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      <CampaignLeadModalOnLoad />
    </main>
  );
}
