import { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BrandFilm from "../components/BrandFilm";
import HeroSlider from "../components/HeroSlider";
import SuccessStories from "../components/SuccessStories";
import LeadModal from "../components/LeadModal";
const WhoWeAreSection = lazy(() => import("../components/WhoWeAreSection"));
const ExploreGrid = lazy(() => import("../components/ExploreGrid"));
const CEOMessage = lazy(() => import("../components/CEOMessage"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const Footer = lazy(() => import("../components/Footer"));

// ─── Lead modal frequency policy ────────────────────────────────────────────
// First exposure: trigger when "Who We Are" scrolls into view.
// After it's been seen: 7-day cooldown (respectful B2B re-engagement).
// After successful submission: 30-day cooldown (don't pester converted leads).
// Cooldown is written the *moment* the modal opens — so users who refresh
// mid-modal or close the tab without clicking still get the cooldown.
const LEAD_MODAL_TARGET_ID = "about"; // <div id="about"> wraps WhoWeAreSection
const LEAD_MODAL_ATTACH_INTERVAL_MS = 120;
const LEAD_MODAL_ATTACH_MAX_RETRIES = 100; // ~12s of polling
const LEAD_MODAL_STORAGE_KEY = "biznet_lead_modal_state";
const LEAD_MODAL_COOLDOWN_MS = {
  dismissed: 7 * 24 * 60 * 60 * 1000, // 7 days after first exposure
  submitted: 30 * 24 * 60 * 60 * 1000, // 30 days after conversion
};

function readLeadModalState() {
  try {
    const raw = localStorage.getItem(LEAD_MODAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.at || !parsed?.kind) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLeadModalState(kind) {
  try {
    localStorage.setItem(
      LEAD_MODAL_STORAGE_KEY,
      JSON.stringify({ kind, at: Date.now() }),
    );
  } catch {
    /* private mode / blocked storage — silently ignore */
  }
}

function isInLeadModalCooldown() {
  const state = readLeadModalState();
  if (!state) return false;
  const window = LEAD_MODAL_COOLDOWN_MS[state.kind];
  if (!window) return false;
  return Date.now() - state.at < window;
}

function Homepage() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;
    // Frequency cap: skip the trigger entirely if we're inside a cooldown.
    if (isInLeadModalCooldown()) return undefined;

    let triggered = false;
    let observer = null;
    let retryTimer = null;
    let retries = 0;

    const tryAttach = () => {
      // The Who We Are section is lazy-loaded behind <Suspense>, so the
      // wrapper div doesn't exist on first mount. Poll briefly until it does.
      const section = document.getElementById(LEAD_MODAL_TARGET_ID);
      if (!section) {
        if (retries++ > LEAD_MODAL_ATTACH_MAX_RETRIES) return;
        retryTimer = setTimeout(tryAttach, LEAD_MODAL_ATTACH_INTERVAL_MS);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            setShowLeadModal(true);
            // Persist now (not on close) so a refresh mid-modal or a
            // ghost-dismissal (closing the tab) still counts as "seen".
            writeLeadModalState("dismissed");
            observer.disconnect();
          }
        },
        // The section has to scroll ~30% past the bottom of the viewport
        // before we count it as "reached". This prevents the modal from
        // arming on landing — without this, a short hero, a tall screen,
        // or a Suspense layout race can leave the section's top edge
        // touching the viewport on first paint and fire instantly.
        { threshold: 0, rootMargin: "0px 0px -30% 0px" },
      );
      observer.observe(section);
    };

    tryAttach();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (observer) observer.disconnect();
    };
  }, []);

  const closeLeadModal = (reason) => {
    setShowLeadModal(false);
    if (reason === "submitted") {
      // Upgrade the 7-day cooldown (already written when the modal opened)
      // to the 30-day post-conversion cooldown.
      writeLeadModalState("submitted");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020812] text-white">
      <Navbar />

      <BrandFilm />
      {/* <HeroSlider slides={slides} sectionId="home" autoPlay /> */}

      <Suspense fallback={null}>
        <div id="about">
          <WhoWeAreSection />
        </div>
        <div id="services">
          <ExploreGrid />
        </div>
        <div id="projects">
          <CEOMessage />
        </div>
        {/* <div id="insights">
          <Testimonials />
        </div> */}
        <div>
          <SuccessStories />
        </div>
        <div id="contact">
          <Footer />
        </div>
      </Suspense>

      <LeadModal open={showLeadModal} onClose={closeLeadModal} />
    </main>
  );
}

export default Homepage;