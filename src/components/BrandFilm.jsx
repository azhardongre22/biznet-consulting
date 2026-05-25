import SocialMediaIcons from "./SocialMediaIcons";

const BrandFilm = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#04080f]">
      <iframe
        className="absolute inset-0 h-full w-full object-cover"
        src="https://www.youtube.com/embed/pTP7lXPhnsA?&playsinline=1&loop=1&playlist=pTP7lXPhnsA&controls=0&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <div className="pointer-events-none absolute inset-0 bg-[#04080f]/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04080f] to-transparent" />

      <nav
        className="pointer-events-none absolute bottom-0 left-0 z-30 flex justify-start pb-[max(1rem,env(safe-area-inset-bottom))] pl-4 pt-2 md:bottom-6 md:left-6 md:pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pl-6 md:pt-0 lg:bottom-8 lg:left-8"
        aria-label="Biznet on social media"
      >
        <div className="pointer-events-auto rounded-2xl border border-white/15 bg-[#020812]/85 px-3 py-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <SocialMediaIcons floating />
        </div>
      </nav>
    </section>
  );
};

export default BrandFilm;
