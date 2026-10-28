import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import "../styles/site.css";
import Navbar from "../components/layout/Navbar";
import usePageSeo from "../hooks/usePageSeo";
import { NOT_FOUND_SEO, PATHS, SERVICE_SECTIONS, servicePath } from "../data/seoData";

const Footer = lazy(() => import("../components/layout/Footer"));

const LINKS = [
  { label: "Services", to: PATHS.services },
  ...SERVICE_SECTIONS.map((s) => ({ label: s.title, to: servicePath(s.id) })),
  { label: "Projects", to: PATHS.projects },
  { label: "News & Insights", to: PATHS.news },
  { label: "About Us", to: PATHS.about },
];

/** Catch-all route; prerendered to dist/404.html and served with status 404. */
export default function NotFoundPage() {
  usePageSeo({ ...NOT_FOUND_SEO, path: "/404", breadcrumbs: [] });

  return (
    <main className="home-v2 min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto flex min-h-[70vh] w-full max-w-[1280px] flex-col justify-center px-5 pt-28 pb-20 md:px-8 lg:px-10">
        <p className="hv2-eyebrow">Error 404</p>
        <h1 className="hv2-display mt-5 max-w-[720px] text-[38px] leading-[1.08] text-[#092D54] md:text-[60px]">
          This page has moved or no longer exists.
        </h1>
        <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-[#596573]">
          The link may be out of date. These pages are a good place to continue.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="inline-flex h-11 items-center rounded-full border border-[#D3DBE3] px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174] transition-colors hover:bg-[#0E4174] hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="mt-10 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#0E4174] px-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b3560]"
        >
          Back to home <ArrowUpRight size={16} />
        </Link>
      </section>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
