import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SuccessStories from "../components/SuccessStories";
import { CampaignLeadModalOnLoad } from "../components/CampaignLeadModal";
import { useLanguage } from "../i18n/LanguageContext";
import heroBg from "../assets/images/optimized/business formation slider.webp";
const WhoWeAreSection = lazy(() => import("../components/WhoWeAreSection"));
const ExploreGrid = lazy(() => import("../components/ExploreGrid"));
const CEOMessage = lazy(() => import("../components/CEOMessage"));
const Footer = lazy(() => import("../components/Footer"));

// LeadModal (company-profile gate) is disabled for now in favour of
// CampaignLeadModal, which opens on every page load.

function Homepage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#020812] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#020812]"
      />

      <Navbar />

      <section
        id="home"
        className="relative h-screen w-full overflow-hidden bg-[#04080f]"
      >
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04080f] to-transparent"
        />

        {/* English copy stays; in Arabic only the block flips to the right,
            with extra inset so it clears the fixed BNIcon (bottom-right). */}
        <div
          dir="ltr"
          lang="en"
          className={`lang-keep absolute bottom-[50px] z-20 max-w-[600px] ${
            isArabic
              ? "right-[max(88px,calc(6%+3.5rem))] text-right md:right-[max(112px,calc(8%+4rem))]"
              : "left-[max(24px,6%)] text-left md:left-[max(72px,8%)]"
          }`}
        >
          <h1 className="font-headline text-2xl font-light uppercase leading-[1.2] tracking-[-0.01em] text-white md:text-3xl lg:text-4xl">
            BUSINESS &amp; COMPANY FORMATION
          </h1>
          <Link
            to="/contact"
            className={`mt-[30px] inline-flex h-12 min-w-[168px] items-center justify-center border border-white/55 bg-white/[0.08] px-[26px] font-headline text-[11px] uppercase tracking-[0.28em] text-white no-underline backdrop-blur-[12px] transition-[background,color,letter-spacing,border-color] duration-[400ms] ease-in-out hover:border-[#0e4174] hover:bg-[#0e4174] hover:tracking-[0.34em] max-[640px]:h-11 max-[640px]:min-w-[148px] max-[640px]:text-[10px] ${
              isArabic ? "ml-auto" : ""
            }`}
          >
            Slide to sucess
          </Link>
        </div>
      </section>

      <div className="relative z-10 bg-[linear-gradient(180deg,#020812_0%,#06131f_12%,#EEF3F8_28%,#E7EDF0_42%,#7C878E_56%,#384967_70%,#06131F_86%,#020812_100%)]">
        <Suspense fallback={null}>
          <div id="about" className="relative z-10">
            <WhoWeAreSection />
          </div>
          <div id="services" className="relative z-10">
            <ExploreGrid />
          </div>

          <div className="relative z-10">
            <SuccessStories />
          </div>
          <div id="projects" className="relative z-10">
            <CEOMessage />
          </div>
          <div id="contact" className="relative z-10">
            <Footer />
          </div>
        </Suspense>
      </div>

      <CampaignLeadModalOnLoad />
    </main>
  );
}

export default Homepage;
