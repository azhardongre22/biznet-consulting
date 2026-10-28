import { Suspense, lazy, useEffect, useRef } from "react";

import "../styles/site.css";
import useScrollMotion from "../hooks/useScrollMotion";
import Navbar from "../components/layout/Navbar";
import HomeHero from "../components/home/HomeHero";
import HomeAbout from "../components/home/HomeAbout";
import HomeProcess from "../components/home/HomeProcess";
import HomeServices from "../components/home/HomeServices";
import HomeProjects from "../components/home/HomeProjects";
import StoryInNumbers from "../components/common/StoryInNumbers";
import HomeAudience from "../components/home/HomeAudience";
import HomeClients from "../components/home/HomeClients";
import HomeInsights from "../components/home/HomeInsights";
import HomeFaq from "../components/home/HomeFaq";
import HomeSocialContact from "../components/home/HomeSocialContact";
import { CampaignLeadModalOnLoad } from "../components/forms/CampaignLeadModal";
import usePageSeo from "../hooks/usePageSeo";
import { SERVICE_SECTIONS, servicePath } from "../data/seoData";
import { itemListSchema } from "../seo/schema";

const Footer = lazy(() => import("../components/layout/Footer"));


/**
 * Homepage — Compass-reference reconstruction (v2).
 *
 * A fresh, isolated `home-v2` component tree that completely replaces the
 * previous homepage design. Routes, data integrations, the campaign modal and
 * the shared light footer are preserved; the visual language is rebuilt from
 * the Compass template (white canvas, navy accents, layered outline/solid
 * typography, slate insets, genuine scroll parallax).
 */
export default function HomePage() {
  const rootRef = useRef(null);
  useScrollMotion(rootRef);
  usePageSeo({
    path: "/",
    jsonLd: itemListSchema(
      "Biznet Consulting services",
      SERVICE_SECTIONS.map((s) => ({ name: s.title, path: servicePath(s.id), description: s.summary })),
    ),
  });

  // Paint the document white while mounted (global body is dark for the
  // not-yet-redesigned pages) and set homepage SEO title/description.
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
      <HomeHero />
      <HomeAbout />
      <HomeProcess />
      <HomeServices />
      <HomeProjects />
      {/* Portfolio figures right after the project types — proof for the claim. */}
      <StoryInNumbers intro={null} />
      <HomeAudience />
      <HomeClients />
      <HomeInsights />
      <HomeFaq />
      <HomeSocialContact />

      <div id="contact">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      <CampaignLeadModalOnLoad />
    </main>
  );
}
