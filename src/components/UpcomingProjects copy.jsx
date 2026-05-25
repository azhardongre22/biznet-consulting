import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const projects = [
  {
    title: "Residential Hospitality",
    desc: "Upcoming environments shaped around comfort, service, wellness, and long-term residential experience.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90",
    tags: ["Residences", "Hospitality"],
  },
  {
    title: "Wellness-Led Spaces",
    desc: "Projects designed around recovery, sleep, longevity, oxygen spaces, and human-centered living.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=90",
    tags: ["Wellness", "Experience"],
  },
  {
    title: "Commercial Concepts",
    desc: "Market-aware commercial spaces built with clear positioning, functional planning, and brand value.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90",
    tags: ["Commercial", "Strategy"],
  },
  {
    title: "Branded Developments",
    desc: "Real estate concepts prepared for market with identity, narrative, feasibility, and audience clarity.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=90",
    tags: ["Branding", "Development"],
  },
  {
    title: "Private Living Concepts",
    desc: "Personalised private spaces designed around lifestyle, privacy, comfort, and meaningful daily experience.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90",
    tags: ["Private", "Lifestyle"],
  },
];

function UpcomingProjects() {
  const [active, setActive] = useState(1);
  const [direction, setDirection] = useState(1);

  const visibleProjects = useMemo(() => {
    const total = projects.length;

    return [-1, 0, 1].map((offset) => {
      const index = (active + offset + total) % total;
      return {
        ...projects[index],
        index,
        position: offset,
      };
    });
  }, [active]);

  const handleNext = () => {
    setDirection(1);
    setActive((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 1, ease: EASE }}
        className="relative mx-auto max-w-[1540px] overflow-hidden rounded-[18px] border border-white/10 bg-[#020812] shadow-2xl sm:rounded-[24px]"
      >
        {/* Atmospheric radial palette wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 18% 18%, rgba(14,65,116,0.32) 0%, transparent 60%), radial-gradient(55% 55% at 85% 82%, rgba(56,73,103,0.26) 0%, transparent 60%)",
          }}
        />

        {/* Subtle grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Faint dotted texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.65px,transparent_0.65px)] [background-size:6px_6px]" />

        {/* Watermark BIZNET behind */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 select-none translate-x-[-50%] translate-y-[18%] font-['Cormorant_Garamond',Georgia,serif] text-[100px] font-light leading-none tracking-[-0.04em] text-white/[0.04] md:text-[180px] lg:text-[220px]">
          BIZNET
        </div>

        <div className="relative z-10 flex min-h-[760px] flex-col px-5 pb-6 pt-5 sm:min-h-[820px] sm:px-8 sm:pb-8 sm:pt-8 lg:min-h-[900px] lg:px-12 lg:pb-10 lg:pt-10">
          <div className="relative flex flex-1 flex-col">
            <div className="mx-auto mt-10 max-w-[760px] text-center sm:mt-16 lg:mt-20">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-[#7C878E]"
              >
                <span className="h-px w-8 bg-[#7C878E]/70" />
                Coming Soon
                <span className="h-px w-8 bg-[#7C878E]/70" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.16 }}
                className="font-['Cormorant_Garamond',Georgia,serif] text-[46px] font-light leading-[0.98] tracking-[-0.025em] text-[#eef3f8] sm:text-[68px] lg:text-[84px]"
              >
                Upcoming{" "}
                <em className=" font-light text-[#5aa9d6]">Projects</em>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
                className="mx-auto mt-7 h-px w-[58px] bg-[#0E4174]"
              />

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
                className="mx-auto mt-6 max-w-[470px] text-[14px] font-light leading-[1.78] text-[#b6c8d9] sm:text-[15px]"
              >
                A preview of future developments shaped through BizNet's
                approach to strategy, management, market positioning, and
                experience-led environments.
              </motion.p>
            </div>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project"
              className="absolute left-2 top-[250px] z-20 hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[28px] font-light leading-none text-[#eef3f8] backdrop-blur-xl transition hover:border-[#0E4174] hover:bg-[#0E4174]/30 hover:text-white md:flex lg:left-16 lg:top-[300px]"
            >
              ←
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project"
              className="absolute right-2 top-[250px] z-20 hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[28px] font-light leading-none text-[#eef3f8] backdrop-blur-xl transition hover:border-[#0E4174] hover:bg-[#0E4174]/30 hover:text-white md:flex lg:right-16 lg:top-[300px]"
            >
              →
            </button>

            <div className="relative mt-auto flex min-h-[470px] items-end justify-center overflow-hidden pt-16 sm:min-h-[540px] lg:min-h-[620px]">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ x: direction > 0 ? 120 : -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -120 : 120, opacity: 0 }}
                  transition={{ duration: 0.75, ease: EASE }}
                  className="flex w-full items-end justify-center gap-4 sm:gap-5 lg:gap-6"
                >
                  {visibleProjects.map((project) => {
                    const isFeatured = project.position === 0;

                    return (
                      <motion.article
                        key={`${project.title}-${project.position}`}
                        layout
                        className={[
                          "group relative shrink-0 overflow-hidden border border-white/10 bg-[#04080f]",
                          "rounded-[34px] sm:rounded-[42px]",
                          isFeatured
                            ? "h-[430px] w-[280px] shadow-[0_30px_80px_-30px_rgba(14,65,116,0.6)] sm:h-[500px] sm:w-[360px] lg:h-[575px] lg:w-[390px]"
                            : "hidden h-[390px] w-[240px] opacity-65 sm:block sm:h-[455px] sm:w-[315px] lg:h-[525px] lg:w-[355px]",
                        ].join(" ")}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                        />

                        <div
                          className={[
                            "absolute inset-0 transition duration-700",
                            isFeatured
                              ? "bg-gradient-to-t from-[#020812]/95 via-[#020812]/55 to-[#020812]/15"
                              : "bg-gradient-to-t from-[#020812]/70 via-[#020812]/25 to-transparent",
                          ].join(" ")}
                        />

                        {/* subtle palette tint */}
                        <div className="absolute inset-0 bg-[#0E4174]/15 mix-blend-overlay" />

                        {isFeatured ? (
                          <>
                            <div className="absolute inset-x-0 top-0 p-7 sm:p-9">
                              <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-light leading-[1.05] tracking-[-0.02em] text-[#eef3f8] sm:text-[32px]">
                                {project.title}
                              </h3>

                              <div className="mt-5 h-px w-[36px] bg-[#d3ad49]" />

                              <p className="mt-5 max-w-[290px] text-[13px] font-light leading-[1.65] text-[#b6c8d9] sm:text-[14px]">
                                {project.desc}
                              </p>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#eef3f8] backdrop-blur-xl"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[18px] font-light leading-none text-[#d3ad49] backdrop-blur-xl transition group-hover:border-[#d3ad49] group-hover:bg-[#d3ad49]/15">
                                ↘
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-light leading-[1.05] tracking-[-0.02em] text-[#eef3f8]">
                              {project.title}
                            </h3>
                          </div>
                        )}
                      </motion.article>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-7 flex items-center justify-between gap-5 md:hidden">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[22px] leading-none text-[#eef3f8] backdrop-blur-xl transition hover:border-[#0E4174] hover:bg-[#0E4174]/30"
              >
                ←
              </button>

              <div className="flex items-center gap-2">
                {projects.map((project, index) => (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => {
                      setDirection(index > active ? 1 : -1);
                      setActive(index);
                    }}
                    aria-label={`Go to ${project.title}`}
                    className={[
                      "h-1.5 rounded-full transition-all duration-300",
                      active === index
                        ? "w-8 bg-[#d3ad49]"
                        : "w-1.5 bg-white/25",
                    ].join(" ")}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[22px] leading-none text-[#eef3f8] backdrop-blur-xl transition hover:border-[#0E4174] hover:bg-[#0E4174]/30"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default UpcomingProjects;
