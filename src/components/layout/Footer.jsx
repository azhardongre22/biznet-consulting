import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import BrandIcon from "../../assets/images/brand/biznet-mark.svg";
import BrandWordmark from "../../assets/images/brand/biznet-wordmark.svg";
import { SERVICE_SECTIONS, servicePath } from "../../data/seoData";
import { SOCIAL_LINKS } from "../common/FloatingSocials";

// Site-wide navy footer: brand line, explore/services/contact columns, socials, legal bar.

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "News & Insights", to: "/news-and-insights" },
  { label: "Contact", to: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "FAQs", to: "/faqs" },
];

const SOCIAL_LABELS = { "WhatsApp Broadcast Channel": "WhatsApp" };

const SANS = { fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif' };
const SERIF = {
  fontFamily: '"Ivy Presto", "Times New Roman", Georgia, serif',
  fontWeight: 600,
  letterSpacing: "-0.005em",
};

const HEADING = "text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45";
const LINK = "text-[14px] leading-relaxed text-white/70 transition-colors duration-300 hover:text-white";

export default function Footer() {
  return (
    <footer style={SANS} className="bg-[#092D54] text-white antialiased">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-12 md:gap-x-10 md:py-20">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" aria-label="Biznet Consulting — Home" className="inline-flex items-center gap-2.5">
              <img src={BrandIcon} alt="Biznet Consulting logo mark" className="h-8 w-auto shrink-0 brightness-0 invert" draggable="false" />
              <img
                src={BrandWordmark}
                alt="Biznet Consulting"
                className="h-[16px] w-auto shrink-0 brightness-0 invert"
                draggable="false"
              />
            </Link>
            <p style={SERIF} className="mt-8 max-w-[380px] text-[24px] leading-[1.25] text-white md:text-[28px]">
              Where Insights Meet Execution
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white"
            >
              <span className="border-b border-white/40 pb-0.5 transition-colors group-hover:border-white">
                Start a conversation
              </span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <h3 style={SANS} className={HEADING}>Explore</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={LINK}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h3 style={SANS} className={HEADING}>Services</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {SERVICE_SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link to={servicePath(s.id)} className={LINK}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="col-span-2 not-italic md:col-span-3">
            <h3 style={SANS} className={HEADING}>Contact</h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              <li>
                <a href="mailto:hello@biznetconsulting.ae" className={LINK}>hello@biznetconsulting.ae</a>
              </li>
              <li>
                <a href="tel:+971527488855" className={LINK}>+971 52 748 8855</a>
              </li>
              <li>
                <a href="tel:+97143433334" className={LINK}>+971 4 343 3334</a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/Hrgn1qE9zHFvmt8r9" target="_blank" rel="noopener noreferrer" className={LINK}>
                  Oud Metha Offices Building, Office 324, Dubai
                </a>
              </li>
            </ul>
          </address>
        </div>

        <ul className="flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 py-6">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow Biznet on ${s.name}`}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-white"
              >
                {SOCIAL_LABELS[s.name] || s.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 pr-16 text-[12px] sm:pr-0 text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Biznet Consulting. All rights reserved.</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors duration-300 hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
