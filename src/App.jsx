import { useEffect } from "react";
import Lenis from "lenis";
import Homepage from "./pages/Homepage";
import Services from "./pages/Services";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ScrollToTop from "./components/ScrollToTop";
import ComingSoon from "./pages/ComingSoon";
import RecentProjects from "./pages/RecentProjects";
import Legacy from "./pages/Legacy";
import PressRelease from "./pages/PressRelease";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CeoMessageLanding from "./pages/CeoMessageLanding";
import BNIcon from "./components/BNIcon";

const AppContent = () => {
  const location = useLocation();
  const hideBNIcon = location.pathname === "/scan";

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/recent-projects" element={<RecentProjects />} />
        <Route path="/legacy" element={<Legacy />} />
        <Route path="/press-release" element={<PressRelease />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/scan" element={<CeoMessageLanding />} />
      </Routes>

      {!hideBNIcon && <BNIcon />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    let rafId = null;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const scrollToHash = () => {
      const hash = window.location.hash || "";
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return;

      lenis.scrollTo(el, { offset: -68 });
    };

    window.addEventListener("hashchange", scrollToHash);
    queueMicrotask(scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.lenis === lenis) delete window.lenis;
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;