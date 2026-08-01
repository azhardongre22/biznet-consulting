import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import Homepage from "./pages/Homepage";
import Services from "./pages/Services";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ScrollToTop from "./components/ScrollToTop";
import ComingSoon from "./pages/ComingSoon";
import RecentProjects from "./pages/RecentProjects";
import Legacy from "./pages/Legacy";
import PressRelease from "./pages/PressRelease";
import FAQ from "./pages/FAQ";
import CeoMessageLanding from "./pages/CeoMessageLanding";
import BNIcon from "./components/BNIcon";
import PressArticle from "./pages/PressArticle";
import FloatingSocials from "./components/FloatingSocials";
import UpcomingProjectsPage from "./pages/UpcomingProjectsPage";

// Lazy-loaded + renamed off "PrivacyPolicy" so ad blockers don't kill the whole app bundle.
const SitePolicy = lazy(() => import("./pages/SitePolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));

function LegacyPressRedirect() {
  const { slug } = useParams();
  return (
    <Navigate
      to={slug ? `/news-and-insights/${slug}` : "/news-and-insights"}
      replace
    />
  );
}

const AppContent = () => {
  const location = useLocation();
  const hideBNIcon = location.pathname === "/scan";
  const hideFloatingSocials = location.pathname === "/scan";

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/recent-projects" element={<RecentProjects />} />
          <Route path="/legacy" element={<Legacy />} />
          <Route path="/news-and-insights" element={<PressRelease />} />
          <Route path="/news-and-insights/:slug" element={<PressArticle />} />
          <Route
            path="/press-release"
            element={<Navigate to="/news-and-insights" replace />}
          />
          <Route path="/press-release/:slug" element={<LegacyPressRedirect />} />

          <Route path="/privacy-policy" element={<SitePolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/upcoming-projects" element={<UpcomingProjectsPage />} />
          <Route path="/scan" element={<CeoMessageLanding />} />
        </Routes>
      </Suspense>

      {!hideBNIcon && <BNIcon />}
      {!hideFloatingSocials && <FloatingSocials />}
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