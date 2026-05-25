import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on route navigation and full refresh.
 * Skips when landing on `/` with a hash so anchor scrolling (App/Lenis) still works.
 */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const { pathname, hash } = location;
    if (pathname === "/" && hash) return;

    const run = () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search, location.key]);

  return null;
}

export default ScrollToTop;
