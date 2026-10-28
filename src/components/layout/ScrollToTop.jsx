import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on route navigation and full refresh.
 * Skips when the URL has a hash so anchor scrolling (App/Lenis, page deep links) still works.
 */
function ScrollToTop() {
  const location = useLocation();

  // Disable the browser's native scroll restoration so a hard refresh always
  // starts from the top instead of restoring the previous scroll position.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previous = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = previous;
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const { hash } = location;
    if (hash) return;

    const run = () => {
      // `force: true` is essential: an on-load modal (CampaignLeadModal) pauses
      // Lenis via `lenis.stop()` as the destination page mounts, and a stopped
      // Lenis ignores `scrollTo` unless forced — which otherwise leaves the new
      // page pinned at the previous scroll offset (the footer).
      window.lenis?.scrollTo?.(0, { immediate: true, force: true });
      // Native fallback: covers pages without Lenis and any overflow-locked state.
      window.scrollTo(0, 0);
    };

    // Reset now (before paint) and again next frame, so the reset wins even if a
    // sibling effect toggles Lenis's stopped state during the same commit.
    run();
    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search, location.key]);

  return null;
}

export default ScrollToTop;
