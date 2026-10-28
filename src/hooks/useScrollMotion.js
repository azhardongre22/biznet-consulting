import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollMotion — all scroll choreography for the Compass-reference homepage.
 *
 * Declarative: components mark elements with data-attributes and this hook
 * wires the GSAP timelines. Everything is scoped to `rootRef` via gsap.context
 * and fully reverted on unmount (SPA route change) and on resize.
 *
 * Conventions (all resolved inside .home-v2 only):
 *   [data-hero-outline] [data-hero-solid] [data-hero-rule] [data-hero-copy]
 *       → staged hero intro timeline on load
 *   [data-parallax] on a clip shell, [data-parallax-inner] on its oversized
 *       image → scrub y-parallax; strength from data-parallax (default 10)
 *   [data-reveal]       → fade + rise on enter (value sets delay group)
 *   [data-reveal-stagger] container → its [data-reveal-item] children stagger
 *   [data-clip]         → clipped window reveal (inset → full) on enter
 *   [data-rule]         → navy accent rule scaleX 0→1 on enter
 *
 * Reduced motion: the no-preference matchMedia branch never runs, so nothing
 * is ever hidden — content is fully visible and static. We only hide elements
 * from *inside* the animating branch, so JS-off / reduced-motion stay readable.
 */
export default function useScrollMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Keep ScrollTrigger in step with Lenis smooth scrolling (App.jsx owns Lenis).
    const lenis = typeof window !== "undefined" ? window.lenis : null;
    const onLenisScroll = () => ScrollTrigger.update();
    if (lenis?.on) lenis.on("scroll", onLenisScroll);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Motion branch: pointers fine OR coarse, but NOT reduced-motion ──────
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        // Hero intro — staged headline lines → rule → copy.
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        const lines = root.querySelectorAll("[data-hero-line]");
        const rule = root.querySelector("[data-hero-rule]");
        const copy = root.querySelectorAll("[data-hero-copy]");
        if (lines.length)
          heroTl.from(lines, { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.14 }, 0.1);
        if (rule)
          heroTl.from(rule, { scaleX: 0, duration: 0.7 }, 0.6);
        if (copy.length)
          heroTl.from(copy, { y: 18, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.72);

        // Scrub parallax on every clip shell's oversized inner image.
        root.querySelectorAll("[data-parallax]").forEach((shell) => {
          const inner = shell.querySelector("[data-parallax-inner]");
          if (!inner) return;
          const strength = parseFloat(shell.getAttribute("data-parallax")) || 10;
          gsap.fromTo(
            inner,
            { yPercent: -strength },
            {
              yPercent: strength,
              ease: "none",
              scrollTrigger: {
                trigger: shell,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        // Hero background: slower drift + settle while the hero leaves.
        const heroImg = root.querySelector("[data-hero-image]");
        const hero = root.querySelector("[data-hero]");
        if (heroImg && hero && isDesktop) {
          gsap.fromTo(
            heroImg,
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 12,
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }

        // Clipped window reveals (About image etc.).
        root.querySelectorAll("[data-clip]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 0% 14% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 82%" },
            },
          );
        });

        // Navy accent rules draw from the left.
        root.querySelectorAll("[data-rule]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            },
          );
        });

        // Generic single reveals.
        root.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          });
        });

        // Staggered groups (process numbers, audience matrix, gallery lanes).
        root.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
          const items = group.querySelectorAll("[data-reveal-item]");
          if (!items.length) return;
          gsap.from(items, {
            y: 52,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 84%" },
          });
        });

        // Settle triggers once fonts/images have had a beat to lay out.
        const refreshes = [120, 500, 1200].map((t) =>
          window.setTimeout(() => ScrollTrigger.refresh(), t),
        );
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
        }

        context.add(() => refreshes.forEach(window.clearTimeout));
      });
    }, rootRef);

    return () => {
      if (lenis?.off) lenis.off("scroll", onLenisScroll);
      ctx.revert();
    };
  }, [rootRef]);
}
