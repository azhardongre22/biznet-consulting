import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Images, MapPin, X } from "lucide-react";

import "../styles/site.css";
import useScrollMotion from "../hooks/useScrollMotion";
import Navbar from "../components/layout/Navbar";
import { CampaignLeadModalOnLoad } from "../components/forms/CampaignLeadModal";
import { PROJECT_CATEGORIES, PROJECTS } from "../data/projectsData";
import usePageSeo from "../hooks/usePageSeo";
import { PATHS } from "../data/seoData";
import { itemListSchema } from "../seo/schema";
import heroImage from "../assets/images/projects/hero-img3.png";

const Footer = lazy(() => import("../components/layout/Footer"));

const SHELL = "mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10";


const NAV_H = 76; // Navbar height
const TABS_H = 56;

const byCategory = (id) => PROJECTS.filter((p) => p.category === id);

const scrollToId = (id, immediate = false) => {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -(NAV_H + TABS_H - 1);
  // The on-load lead modal pauses Lenis, so jump natively then.
  if (window.lenis && !window.lenis.isStopped) window.lenis.scrollTo(el, { offset, immediate });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? "auto" : "smooth" });
};

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
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06182c]/60 via-[#06182c]/35 to-[#06182c]/50" />

      <div className={`relative z-10 ${SHELL} pb-14 md:pb-20`}>
        <h1 className="hv2-display mt-5 text-white">
          <span className="hv2-line-mask text-[40px] sm:text-[56px] md:text-[70px]">
            <span data-hero-line className="block leading-[1.06]">
              Our Projects Portfolio
            </span>
          </span>
        </h1>
        <span data-hero-rule aria-hidden="true" className="mt-6 block h-[2px] w-[110px] origin-left bg-white/80" />
        <p data-hero-copy className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-white/85 md:text-[17px]">
          Explore our portfolio of residential buildings, commercial assets and private
          villas across the UAE.
        </p>
      </div>
    </section>
  );
}

function CategoryTabs({ active }) {
  const navRef = useRef(null);

  // Keep the active tab visible when the strip overflows (mobile).
  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector('[aria-current="true"]');
    if (!tab || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div
      className="sticky z-[200] border-y border-[#EEF1F4] bg-white/95 backdrop-blur"
      style={{ top: NAV_H }}
    >
      <nav
        ref={navRef}
        aria-label="Project categories"
        className={`${SHELL} hide-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap md:justify-center`}
        style={{ height: TABS_H }}
      >
        {PROJECT_CATEGORIES.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(c.id);
                window.history.replaceState(window.history.state, "", `#${c.id}`);
              }}
              aria-current={isActive ? "true" : undefined}
              className={`flex h-9 shrink-0 items-center gap-2.5 rounded-full border px-4 text-[13px] transition-colors duration-300 ${
                isActive
                  ? "border-[#0E4174] bg-[#0E4174] text-white"
                  : "border-transparent text-[#3A4654] hover:border-[#D8E0E8] hover:text-[#0E4174]"
              }`}
            >
              <span className={`hv2-display text-[12px] ${isActive ? "text-white/60" : "text-[#AEB8C2]"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {c.label}
              <span className={`text-[11px] ${isActive ? "text-white/60" : "text-[#AEB8C2]"}`}>
                ({byCategory(c.id).length})
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function ProjectCard({ project, badge, index, onOpen }) {
  const meta = [project.type, project.scope].filter(Boolean).join(" · ");
  return (
    <article data-reveal-item className="group">
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`View ${project.name}`}
        className="block w-full text-left"
      >
        <div className="flex items-center justify-between gap-3 pb-3">
          <span className="truncate rounded-full border border-[#D3DBE3] px-3 py-1 text-[11px] text-[#0E4174]">
            {meta || badge}
          </span>
          <span className="hv2-display shrink-0 text-[14px] text-[#AEB8C2]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="hv2-frame relative aspect-[16/10.4] w-full">
          <img
            src={project.images[0]}
            alt={`${project.name} — ${project.type}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
            style={{ objectPosition: project.focus || "center" }}
          />
          {project.images.length > 1 ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-[#0E4174] backdrop-blur">
              <Images size={12} strokeWidth={1.75} />
              {project.images.length}
            </span>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EAF0] pb-5 pt-5">
          <div className="min-w-0">
            <h3 className="hv2-display text-[21px] leading-[1.15] text-[#092D54] md:text-[23px]">{project.name}</h3>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#8A95A0]">
              <MapPin size={13} strokeWidth={1.75} className="text-[#AEB8C2]" />
              {project.location || "UAE"}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D3DBE3] text-[#0E4174] transition-colors duration-300 group-hover:border-[#0E4174] group-hover:bg-[#0E4174] group-hover:text-white"
          >
            <ArrowUpRight size={17} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </article>
  );
}

function CategorySection({ category, index, onOpen }) {
  const items = byCategory(category.id);
  const tinted = index % 2 === 1;
  const dense = items.length > 6;
  return (
    <section
      id={category.id}
      data-category
      className={`border-t border-[#EEF1F4] ${tinted ? "bg-[#F7F9FC]" : "hv2-section"}`}
    >
      <div className={`${SHELL} py-16 md:py-24`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="hv2-eyebrow">
              {String(index + 1).padStart(2, "0")} — {category.title} · {items.length} projects
            </p>
            <h2 data-reveal className="hv2-display mt-5 max-w-[640px] text-[32px] leading-[1.08] text-[#092D54] md:text-[46px]">
              {category.headline}
            </h2>
          </div>
          <p data-reveal className="max-w-[440px] text-[14.5px] leading-[1.7] text-[#596573] md:text-right">
            {category.intro}
          </p>
        </div>

        <div
          data-reveal-stagger
          className={`mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-12 sm:grid-cols-2 ${dense ? "xl:grid-cols-3 xl:gap-x-8" : ""}`}
        >
          {items.map((p, i) => (
            <ProjectCard key={p.slug} project={p} badge={category.badge} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectLightbox({ project, onClose }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const closeRef = useRef(null);
  const count = project.images.length;
  const go = useCallback((d) => setI((v) => (v + d + count) % count), [count]);

  // Fade/slide out before unmounting.
  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.lenis?.stop();
    const raf = window.requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.lenis?.start();
    };
  }, [go, close]);

  const category = PROJECT_CATEGORIES.find((c) => c.id === project.category);
  const pad = (n) => String(n).padStart(2, "0");
  const number = pad(byCategory(project.category).indexOf(project) + 1);
  const details = [
    ["Type", project.type],
    ["Scope", project.scope],
    ["Portfolio", category?.label],
  ].filter(([, v]) => v);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      data-lenis-prevent
      className={`fixed inset-0 z-[10001] flex overflow-y-auto bg-[#06182c]/80 p-3 backdrop-blur-md transition-opacity duration-300 sm:p-6 md:p-10 ${shown ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className={`relative m-auto grid w-full max-w-[1240px] grid-cols-1 rounded-[4px] bg-white shadow-[0_40px_120px_-30px_rgba(6,24,44,0.6)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:grid-cols-[minmax(0,1fr)_380px] ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        {/* Gallery, matted inside the white sheet like a framed print */}
        <div className="flex flex-col p-3 sm:p-4 lg:p-5 lg:pr-0">
          <div className="hv2-frame relative aspect-[16/10.4] w-full lg:aspect-auto lg:min-h-[520px] lg:flex-1">
            {project.images.map((src, n) => (
              <img
                key={src}
                src={src}
                alt={`${project.name} — image ${n + 1} of ${count}`}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${n === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
                style={{ objectPosition: project.focus || "center" }}
              />
            ))}
            {count > 1 ? (
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#06182c]/70 via-[#06182c]/20 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
                <span className="hv2-display text-white">
                  <span className="text-[26px] leading-none">{pad(i + 1)}</span>
                  <span className="ml-1.5 text-[14px] text-white/60">/ {pad(count)}</span>
                </span>
                <div className="flex gap-2">
                  {[[-1, "Previous image"], [1, "Next image"]].map(([d, label]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => go(d)}
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0E4174]"
                    >
                      {d < 0 ? <ChevronLeft size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="mt-3 flex gap-3">
              {project.images.map((src, n) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setI(n)}
                  aria-label={`Show image ${n + 1}`}
                  aria-current={n === i}
                  className={`relative aspect-[16/10.4] w-20 overflow-hidden rounded-[3px] transition-opacity duration-300 sm:w-24 ${n === i ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <span className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#0E4174] transition-transform duration-300 ${n === i ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Project sheet */}
        <div className="flex flex-col px-6 pb-7 pt-4 sm:px-8 lg:px-10 lg:pb-10 lg:pt-10">
          <div className="flex items-center gap-4">
            <span className="hv2-display text-[15px] text-[#AEB8C2]">{number}</span>
            <span className="h-px w-8 bg-[#D3DBE3]" />
            <p className="hv2-eyebrow">{category?.badge}</p>
          </div>

          <h3 className="hv2-display hv2-display--light mt-6 pr-12 text-[34px] leading-[1.05] text-[#092D54] sm:text-[40px]">
            {project.name}
          </h3>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[#8A95A0]">
            <MapPin size={13} strokeWidth={1.75} className="text-[#AEB8C2]" />
            {project.location ? `${project.location}, UAE` : "United Arab Emirates"}
          </p>

          <dl className="mt-8 border-t border-[#E5EAF0]">
            {details.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-[#E5EAF0] py-4">
                <dt className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A95A0]">{k}</dt>
                <dd className="hv2-display text-right text-[17px] leading-[1.25] text-[#092D54]">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-[14px] leading-[1.75] text-[#596573]">{category?.intro}</p>

          <div className="mt-9 lg:mt-auto lg:pt-10">
            <Link
              to="/contact"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0E4174] px-7 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#092D54]"
            >
              Discuss a similar project
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="group absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#D3DBE3] bg-white text-[#0E4174] transition-colors duration-300 hover:border-[#0E4174] hover:bg-[#0E4174] hover:text-white sm:right-7 sm:top-7"
        >
          <X size={18} strokeWidth={1.5} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className={`${SHELL} py-24 text-center md:py-32`}>
        <p data-reveal className="hv2-eyebrow">Let's talk</p>
        <h2 data-reveal className="hv2-display mx-auto mt-5 max-w-[680px] text-[34px] leading-[1.08] text-[#092D54] sm:text-[46px] md:text-[56px]">
          Have a Project in Mind?
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[540px] text-[16px] leading-[1.75] text-[#596573]">
          From evaluating a development opportunity to overseeing construction, Biznet
          Consulting works with you to define the next steps for your project.
        </p>
        <div data-reveal className="mt-9">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0E4174] px-9 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
          >
            Discuss Your Project
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  usePageSeo({
    path: PATHS.projects,
    pageType: "CollectionPage",
    jsonLd: itemListSchema(
      "Biznet Consulting project portfolio",
      PROJECTS.map((p) => ({ name: p.name, image: p.images[0], description: [p.type, p.location].filter(Boolean).join(" — ") })),
    ),
  });
  const rootRef = useRef(null);
  useScrollMotion(rootRef);

  const [active, setActive] = useState(PROJECT_CATEGORIES[0].id);
  const [open, setOpen] = useState(null);
  const closeLightbox = useCallback(() => setOpen(null), []);
  const { hash } = useLocation();

  // Category deep links (/projects#private-villas) from the homepage. Lazy images
  // keep growing the page for ~1s, so re-align a few times — stopping as soon as
  // the visitor scrolls. On a fresh load, wait for the first-paint loader to go.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!PROJECT_CATEGORIES.some((c) => c.id === id)) return undefined;
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
  }, [hash]);

  // Scroll-spy: the active tab is the last category whose top has passed the tabs bar.
  useEffect(() => {
    const onScroll = () => {
      const line = NAV_H + TABS_H + 8;
      let current = PROJECT_CATEGORIES[0].id;
      document.querySelectorAll("[data-category]").forEach((el) => {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
  }, []);

  return (
    <main ref={rootRef} className="home-v2">
      <Navbar />
      <Hero />
      <CategoryTabs active={active} />
      {PROJECT_CATEGORIES.map((c, i) => (
        <CategorySection key={c.id} category={c} index={i} onOpen={setOpen} />
      ))}
      <Cta />

      <div id="contact">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      {open ? <ProjectLightbox project={open} onClose={closeLightbox} /> : null}
      <CampaignLeadModalOnLoad />
    </main>
  );
}
