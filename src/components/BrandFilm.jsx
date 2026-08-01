const BrandFilm = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#04080f]">
      <iframe
        className="absolute inset-0 h-full w-full object-cover"
        src="https://www.youtube.com/embed/4ZJPirwYx7Y?&playsinline=1&loop=1&playlist=4ZJPirwYx7Y&controls=0&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <div className="pointer-events-none absolute inset-0 bg-[#04080f]/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04080f] to-transparent" />
    </section>
  );
};

export default BrandFilm;
