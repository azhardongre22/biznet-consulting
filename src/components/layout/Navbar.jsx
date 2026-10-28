import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import BrandIcon from "../../assets/images/brand/biznet-mark.svg";
import BrandWordmark from "../../assets/images/brand/biznet-wordmark.svg";
import { serviceForPath } from "../../data/seoData";

// Light, premium top navigation for the redesigned site.
// Desktop: brand mark at the left edge · links + CTA at the right edge.
// Mobile: brand mark left · burger right, opening a full-screen editorial menu.
// Typography follows the home-v2 system: Inter uppercase labels for the bar,
// Ivy Presto (SemiBold) for the large mobile menu items, navy on white with
// hairline rules. Fonts are set here explicitly so the bar looks the same on
// pages that sit outside the `.home-v2` scope.

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "News & Insights", to: "/news-and-insights" },
  { label: "Contact", to: "/contact" },
];

const BODY_FONT = { fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif' };
const DISPLAY_FONT = {
  fontFamily: '"Ivy Presto", "Times New Roman", Georgia, serif',
  fontWeight: 600,
  letterSpacing: "-0.005em",
};

function isActivePath(pathname, to) {
  if (to === "/") return pathname === "/";
  if (to === "/news-and-insights")
    return pathname.startsWith("/news-and-insights");
  if (to === "/services") return pathname.startsWith("/services") || Boolean(serviceForPath(pathname));
  return pathname === to;
}

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => {
    setOpen(false);
    document.body.style.overflow = "";
    window.lenis?.start?.();
  };

  const toggleMenu = () => {
    setOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      if (next) window.lenis?.stop?.();
      else window.lenis?.start?.();
      return next;
    });
  };

  const go = (to) => {
    closeMenu();
    navigate(to);
  };

  // Track scroll only to toggle the subtle shadow — the bar never hides.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <header
        style={BODY_FONT}
        className={`fixed inset-x-0 top-0 z-[300] border-b bg-white antialiased transition-[box-shadow,border-color] duration-300 ${
          scrolled || open
            ? "border-[#E6EBF0] shadow-[0_10px_30px_-24px_rgba(9,45,84,0.45)]"
            : "border-[#EEF1F4]"
        }`}
      >
        <nav className="flex h-[76px] w-full items-center justify-between gap-6 px-5 md:px-8 lg:px-10 2xl:px-14">
          {/* Brand — official logo lockup (mark + wordmark) */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Biznet Consulting — Home"
            className="flex shrink-0 items-center gap-2.5 md:gap-3"
          >
            <img
              src={BrandIcon}
              alt="Biznet Consulting logo mark"
              className="h-7 w-auto shrink-0 md:h-9"
              draggable="false"
            />
            <img
              src={BrandWordmark}
              alt="Biznet Consulting"
              className="h-[15px] w-auto shrink-0 md:h-[18px]"
              draggable="false"
            />
          </Link>

          {/* Links (desktop) — grouped at the right edge beside the CTA */}
          <ul className="ml-auto hidden items-center gap-7 xl:flex 2xl:gap-9">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block whitespace-nowrap py-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                      active ? "text-[#0E4174]" : "text-[#52606E] hover:text-[#0E4174]"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-px w-full origin-left bg-[#0E4174] transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-2.5 xl:ml-3">
            <Link
              to="/contact"
              className="hidden h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#0E4174] px-7 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#092D54] md:inline-flex"
            >
              Get a Quote
              <ArrowUpRight size={15} />
            </Link>

            {/* Burger (mobile/tablet) */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E6EC] text-[#0E4174] transition-colors hover:bg-[#0E4174]/[0.04] xl:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu — editorial index with hairline rules */}
      <div
        style={BODY_FONT}
        className={`fixed inset-0 z-[290] overflow-y-auto bg-white antialiased transition-[opacity,transform] duration-500 ease-[cubic-bezier(.4,0,.2,1)] xl:hidden ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-full w-full max-w-[560px] flex-col px-5 pb-10 pt-[112px] md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A95A0]">
            Menu
          </p>

          <nav className="mt-6 border-b border-[#E6EBF0]">
            {NAV_LINKS.map((link, i) => {
              const active = isActivePath(pathname, link.to);
              return (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => go(link.to)}
                  aria-current={active ? "page" : undefined}
                  className="group flex w-full items-center justify-between gap-4 border-t border-[#E6EBF0] py-4 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      style={DISPLAY_FONT}
                      className={`text-[13px] ${active ? "text-[#0E4174]" : "text-[#AEB8C2]"}`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={DISPLAY_FONT}
                      className={`text-[26px] leading-[1.15] transition-colors ${
                        active ? "text-[#0E4174]" : "text-[#092D54] group-hover:text-[#0E4174]"
                      }`}
                    >
                      {link.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className={active ? "text-[#0E4174]" : "text-[#AEB8C2] group-hover:text-[#0E4174]"}
                  />
                </button>
              );
            })}
          </nav>

          <Link
            to="/contact"
            onClick={closeMenu}
            className="mt-10 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0E4174] text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#092D54]"
          >
            Book a Consultation
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
