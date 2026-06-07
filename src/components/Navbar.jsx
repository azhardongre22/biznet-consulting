import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import FavIconLogo from "../assets/images/BN_Logo.png";
import LogoText from "../assets/images/biznet-sec-white.png";
import TagLine from "../assets/images/biznet-tagline.png";
import { useLanguage } from "../i18n/LanguageContext";

const HOMEPAGE_SECTION_KEYS = new Set([
  "home",
  "about",
  "services",
  "projects",
  "insights",
  "contact",
]);

function navKeyFromPathAndHash(pathname, hash) {
  if (pathname === "/services") return "services";
  if (pathname === "/about") return "about";
  if (pathname === "/contact") return "contact";
  if (pathname === "/") {
    const raw = hash.startsWith("#") ? hash.slice(1) : "";
    return raw && HOMEPAGE_SECTION_KEYS.has(raw) ? raw : "home";
  }
  return "home";
}

function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const isRTL = language === "ar";

  const menuItems = [
    {
      key: "home",
      num: "01",
      label: t("navbar.home"),
      tag: t("navbar.tagStart"),
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=90",
    },
    {
      key: "about",
      num: "02",
      label: t("navbar.about"),
      tag: t("navbar.tagWhoWeAre"),
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90",
    },
    {
      key: "services",
      num: "03",
      label: t("navbar.services"),
      tag: t("navbar.tagWhatWeDo"),
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=90",
    },
    {
      key: "contact",
      num: "04",
      label: t("navbar.contact"),
      tag: t("navbar.tagGetInTouch"),
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=90",
    },
  ];

  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState(() =>
    navKeyFromPathAndHash(
      typeof window !== "undefined" ? window.location.pathname : "/",
      typeof window !== "undefined" ? window.location.hash : "",
    ),
  );
  const [previewPage, setPreviewPage] = useState(() =>
    navKeyFromPathAndHash(
      typeof window !== "undefined" ? window.location.pathname : "/",
      typeof window !== "undefined" ? window.location.hash : "",
    ),
  );
  const [showNavbar, setShowNavbar] = useState(true);
  const navigateRouter = useNavigate();
  const location = useLocation();

  const previewImage =
    menuItems.find((item) => item.key === previewPage)?.image ||
    menuItems[0].image;

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

  const navigate = (page) => {
    setActivePage(page);
    setPreviewPage(page);
    closeMenu();
  
    if (page === "home") {
      navigateRouter("/");
      return;
    }
  
    if (page === "services") {
      navigateRouter("/services");
      return;
    } else if (page === "contact") {
      navigateRouter("/contact");
      return;
    } else if (page === "about") {
      navigateRouter("/about");
      return;
    }
  
    // These map to sections on the homepage (hash navigation).
    if (location.pathname !== "/") {
      navigateRouter(`/#${page}`);
      return;
    }
  
    navigateRouter({ pathname: "/", hash: `#${page}` });
    requestAnimationFrame(() => {
      const el = document.getElementById(page);
      if (el) window.lenis?.scrollTo?.(el, { offset: -68 });
    });
  };

  useEffect(() => {
    const key = navKeyFromPathAndHash(location.pathname, location.hash);
    setActivePage(key);
    setPreviewPage(key);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (open) setPreviewPage(activePage);
  }, [open, activePage]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (currentScrollY <= 10) {
        setShowNavbar(true);
      } else if (scrollDelta > 5) {
        setShowNavbar(false);
      } else if (scrollDelta < -5) {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const nextLangLabel = language === "en" ? "العربية" : "English";
  const nextLangShort = language === "en" ? "AR" : "EN";
  const langAria =
    language === "en"
      ? t("common.switchToArabic")
      : t("common.switchToEnglish");

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        dir="ltr"
        className={`fixed left-0 right-0 top-0 z-[300] flex h-[68px] items-center justify-between px-4 transition-[transform,background-color,border-color,backdrop-filter] duration-500 sm:px-6 md:px-10 ${
          open
            ? "border-b border-transparent bg-transparent"
            : "border-b border-white/10 bg-[#0e4174]/55"
        } ${showNavbar || open ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          backdropFilter: open ? "none" : "blur(22px) saturate(1.5)",
          WebkitBackdropFilter: open ? "none" : "blur(22px) saturate(1.5)",
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
          {/* Burger / Close Button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={open ? t("navbar.menuClose") : t("navbar.menuOpen")}
            className="group cursor-pointer relative flex h-10 w-10 items-center justify-center"
          >
            <span
              className={`absolute h-px bg-white transition-all duration-300 ${
                open
                  ? "w-[25px] rotate-45"
                  : "top-[12px] w-[27px] group-hover:bg-[#7C878E]"
              }`}
            />

            <span
              className={`absolute h-px bg-white/80 transition-all duration-300 ${
                open
                  ? "w-0 opacity-0"
                  : "top-[20px] w-[18px] -translate-x-[4px] group-hover:w-[27px] group-hover:translate-x-0 group-hover:bg-[#7C878E]"
              }`}
            />

            <span
              className={`absolute h-px bg-white transition-all duration-300 ${
                open
                  ? "w-[25px] -rotate-45"
                  : "top-[28px] w-[27px] group-hover:bg-[#7C878E]"
              }`}
            />
          </button>

          {/* Logo — hidden while the menu is open */}
          <button
            type="button"
            onClick={() => navigate("home")}
            aria-label="Biznet Consulting — Home"
            aria-hidden={open}
            tabIndex={open ? -1 : 0}
            className={`flex cursor-pointer items-center gap-2.5 transition-opacity duration-500 ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={FavIconLogo}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-9 w-auto object-contain sm:h-10"
            />
            <img
              src={LogoText}
              alt="Biznet Consulting"
              loading="lazy"
              decoding="async"
              className="hidden h-5 w-auto object-contain sm:block md:h-[22px]"
            />
          </button>
        </div>

        {/* Language Toggle Button — top right */}
        <button
  type="button"
  onClick={toggleLanguage}
  aria-label={langAria}
  title={langAria}
  aria-pressed={language === "ar"}
  className="
    group relative inline-flex h-9 w-[92px] shrink-0 cursor-pointer
    items-center rounded-full border border-white/15
    bg-white/[0.04] p-1 backdrop-blur-md
    transition-all duration-300 ease-out
    hover:border-[#7C878E]/70 hover:bg-white/[0.08]
    focus:outline-none focus:ring-2 focus:ring-[#9FB4D4]/40
    sm:h-10 sm:w-[104px]
  "
>
  <span
    aria-hidden
    className={`
      absolute left-1 top-1 flex h-7 w-10 items-center justify-center
      rounded-full bg-white/[0.14] shadow-[0_6px_20px_rgba(0,0,0,0.18)]
      transition-transform duration-300 ease-out
      sm:h-8 sm:w-12
      ${language === "ar" ? "translate-x-[42px] sm:translate-x-[48px]" : "translate-x-0"}
    `}
  />

  <span
    className="
      relative z-10 grid w-full grid-cols-2 items-center
      text-center text-[10px] font-semibold uppercase tracking-[0.14em]
      sm:text-[11px]
    "
  >
    <span
      className={`
        flex items-center justify-center gap-1 transition-colors duration-300
        ${language === "en" ? "text-white" : "text-white/45"}
      `}
    >
      <Globe
        aria-hidden
        className="
          hidden h-3.5 w-3.5 text-[#9FB4D4] transition
          group-hover:text-white sm:block
        "
      />
      EN
    </span>

    <span
      className={`
        transition-colors duration-300
        ${language === "ar" ? "text-white" : "text-white/45"}
      `}
    >
      AR
    </span>
  </span>
</button>
      </nav>

      {/* MENU OVERLAY */}
      <div
        dir="ltr"
        className={`fixed inset-0 z-[290] transition duration-700 ease-[cubic-bezier(.4,0,.2,1)] ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Desktop Layout */}
        <div className="hidden h-full w-full md:flex">
          {/* LEFT FROSTED PANEL - 25% width */}
          <div
            className={`relative h-full w-1/4 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: `url(${previewImage})`,
                transform: open ? "scale(1.08)" : "scale(1.14)",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(26px)",
                WebkitBackdropFilter: "blur(26px)",
              }}
            />

            <div className="absolute inset-0 bg-[#0b2a46]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061a2e]/55 via-[#0d3556]/38 to-[#123f63]/22" />
            <div className="absolute right-0 top-0 h-full w-px bg-white/18" />

            <div className="relative z-10 flex h-full flex-col items-center px-7 pt-[96px] pb-10 text-center">
              <button
                type="button"
                onClick={() => navigate("home")}
                className="mb-6 flex flex-col items-center"
              >
                <img
                  src={FavIconLogo}
                  alt="Biznet favicon"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-[40px] object-contain sm:w-[46px] md:w-[52px]"
                />
                <img
                  src={LogoText}
                  alt="Biznet logo"
                  loading="lazy"
                  decoding="async"
                  className="mt-3 h-auto w-[128px] object-contain sm:w-[150px] md:w-[172px]"
                />
                <img
                  src={TagLine}
                  alt="Biznet tagline"
                  loading="lazy"
                  decoding="async"
                  className="mt-2 h-auto w-[142px] object-contain sm:w-[165px] md:w-[188px]"
                />
              </button>

              <div className="mb-8 h-px w-[74px] bg-white/65" />

              <nav className="flex cursor-pointer w-full max-w-[230px] flex-col items-center gap-3">
                {menuItems.map((item) => {
                  const isActive = activePage === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => navigate(item.key)}
                      className={`cursor-pointer group relative w-full rounded-full border px-7 py-[13px] text-center text-[12px] font-medium uppercase tracking-[0.14em] transition duration-300 ${
                        isActive
                          ? "border-[#7C878E]/55 bg-white/[0.03] text-white"
                          : "border-transparent text-white/75 hover:border-[#7C878E]/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>

                      <span
                        className={`absolute top-1/2 -translate-y-1/2 text-[8px] tracking-[0.1em] transition ${
                          isRTL ? "right-4" : "left-4"
                        } ${
                          isActive
                            ? "text-[#7C878E]"
                            : "text-white/25 group-hover:text-[#7C878E]"
                        }`}
                      >
                        {item.num}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-9 h-px w-[74px] bg-white/65" />

              <div className="mt-auto flex w-full max-w-[230px] items-center justify-center pt-8 text-[8px] uppercase tracking-[0.16em] text-white/40">
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SCREEN BLUR AREA */}
          <button
            type="button"
            aria-label={t("leadModal.close")}
            onClick={closeMenu}
            className={`relative h-full flex-1 overflow-hidden bg-black/20 backdrop-blur-[5px] transition-opacity duration-700 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Mobile Layout - full width */}
        <div
          className={`relative h-full w-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] md:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${previewImage})`,
              transform: open ? "scale(1.06)" : "scale(1.12)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          />

          <div className="absolute inset-0 bg-[#06111d]/68" />

          <div className="relative z-10 flex h-full flex-col items-center px-8 pt-[96px] pb-10 text-center">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="mb-10 flex flex-col items-center"
            >
              <img
                src={FavIconLogo}
                alt="Biznet favicon"
                loading="lazy"
                decoding="async"
                className="h-auto w-[46px] object-contain sm:w-[55px]"
              />

              <img
                src={LogoText}
                alt="Biznet logo"
                loading="lazy"
                decoding="async"
                className="mt-3 h-auto w-[144px] object-contain sm:w-[178px]"
              />

              <img
                src={TagLine}
                alt="Biznet tagline"
                loading="lazy"
                decoding="async"
                className="mt-2 h-auto w-[158px] object-contain sm:w-[192px]"
              />
            </button>

            <nav className="flex w-full max-w-[280px] flex-col items-center gap-3">
              {menuItems.map((item) => {
                const isActive = activePage === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.key)}
                    className={`relative w-full rounded-full border px-7 py-[13px] text-center text-[12px] font-medium uppercase tracking-[0.14em] transition duration-300 ${
                      isActive
                        ? "border-[#7C878E] bg-white/5 text-white"
                        : "border-transparent text-white/75 hover:border-[#7C878E]/80 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>

                    <span
                      className={`absolute top-1/2 -translate-y-1/2 text-[8px] text-[#7C878E] ${
                        isRTL ? "right-4" : "left-4"
                      }`}
                    >
                      {item.num}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
