import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import BNIcon from "./components/common/BNIcon";
import FloatingWhatsApp from "./components/common/FloatingWhatsApp";
import { LEGACY_REDIRECTS, PATHS, SERVICE_SECTIONS, servicePath } from "./data/seoData";

// Route-level code splitting: only the home page ships in the entry chunk.
// (The policy page is named off "PrivacyPolicy" so ad blockers don't block it.)
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const CeoMessagePage = lazy(() => import("./pages/CeoMessagePage"));
const SitePolicyPage = lazy(() => import("./pages/SitePolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

/** Client-side mirror of the nginx 301s; carries `:slug` across. */
function LegacyRedirect({ to }) {
  const { slug } = useParams();
  return <Navigate to={slug ? to.replace(":slug", slug) : to} replace />;
}

/** Route table shared by the browser app and the build-time prerender. */
export default function AppRoutes() {
  const { pathname } = useLocation();
  const isScan = pathname === PATHS.scan;

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.about} element={<AboutPage />} />
          <Route path={PATHS.services} element={<ServicesPage />} />
          {SERVICE_SECTIONS.map((s) => (
            <Route key={s.id} path={servicePath(s.id)} element={<ServicesPage />} />
          ))}
          <Route path={PATHS.projects} element={<ProjectsPage />} />
          <Route path={PATHS.news} element={<NewsPage />} />
          <Route path={`${PATHS.news}/:slug`} element={<ArticlePage />} />
          <Route path={PATHS.contact} element={<ContactPage />} />
          <Route path={PATHS.faqs} element={<FaqPage />} />
          <Route path={PATHS.privacy} element={<SitePolicyPage />} />
          <Route path={PATHS.terms} element={<TermsPage />} />
          <Route path={PATHS.scan} element={<CeoMessagePage />} />
          {LEGACY_REDIRECTS.map((r) => (
            <Route key={r.from} path={r.from} element={<LegacyRedirect to={r.to} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {!isScan && <BNIcon />}
      {!isScan && <FloatingWhatsApp />}
    </>
  );
}
