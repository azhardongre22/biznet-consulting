import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes";

function dismissBootLoader() {
  const html = document.documentElement;
  if (!html.classList.contains("biz-booting")) return;

  const loader = document.getElementById("biz-boot-loader");
  html.classList.remove("biz-booting");
  if (!loader) return;

  const remove = () => loader.remove();
  loader.addEventListener("transitionend", remove, { once: true });
  window.setTimeout(remove, 500);
}

const App = () => {
  useLayoutEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) dismissBootLoader();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

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
    // BASE_URL is "/" in production; the GitHub Pages demo builds under a sub-path.
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;