import { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";
import BrandFilm from "../components/BrandFilm";
import SuccessStories from "../components/SuccessStories";
import { CampaignLeadModalOnLoad } from "../components/CampaignLeadModal";
const WhoWeAreSection = lazy(() => import("../components/WhoWeAreSection"));
const ExploreGrid = lazy(() => import("../components/ExploreGrid"));
const CEOMessage = lazy(() => import("../components/CEOMessage"));
const Footer = lazy(() => import("../components/Footer"));

// LeadModal (company-profile gate) is disabled for now in favour of
// CampaignLeadModal, which opens on every page load.

function Homepage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020812] text-white">
      <Navbar />

      <BrandFilm />

      <Suspense fallback={null}>
        <div id="about">
          <WhoWeAreSection />
        </div>
        <div id="services">
          <ExploreGrid />
        </div>

        <div>
          <SuccessStories />
        </div>
        <div id="projects">
          <CEOMessage />
        </div>
        <div id="contact">
          <Footer />
        </div>
      </Suspense>

      <CampaignLeadModalOnLoad />
    </main>
  );
}

export default Homepage;
