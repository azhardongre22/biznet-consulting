import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import HeroBg from "@/assets/images/HeroBg.png";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I've worked with different consultants before, but with Biznet, things simply felt organised from day one. There was always follow-up, always communication, and they genuinely cared about getting the details right. It made the entire process far less stressful than I expected.",
      name: "Private Villa Owner",
      designation: "",
      src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    },
    {
      quote:
        "For a long time, I wasn't sure what to do with the land. Everyone had different opinions. Biznet took the time to understand what I truly wanted and guided me through each decision step by step. I never felt pushed into anything, which I really appreciated.",
      name: "Private Land Owner",
      designation: "",
      src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-16 text-[#384967] md:px-8"
      style={{
        backgroundImage: `url(${HeroBg})`,
      }}
    >
      {/* Glassmorphism overlay — frosted, tinted, layered */}
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150" />
      <div className="absolute inset-0 bg-white/35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 45%, rgba(124,135,142,0.18) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(55% 55% at 18% 22%, rgba(14,65,116,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 82% 78%, rgba(56,73,103,0.22) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.p
          variants={textVariants}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#0E4174]"
        >
          Testimonials
        </motion.p>

        <motion.h2
          variants={textVariants}
          className="mx-auto max-w-3xl font-headline text-[32px] font-light leading-[1.05] tracking-[-0.03em] text-[#384967] md:text-[46px] lg:text-[54px]"
        >
          <span className="italic text-[#0E4174]">Trusted</span>{" "}
          <span>by ambitious</span>
          <br />
          <span className="italic text-[#7C878E]">companies</span>{" "}
          <span>worldwide</span>
        </motion.h2>

        <motion.div
          variants={textVariants}
          className="mx-auto mt-6 h-px w-20 bg-[#0E4174]/30"
        />
      </motion.div>

      <div className="relative z-10 mx-auto mt-4 w-full max-w-5xl">
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}
