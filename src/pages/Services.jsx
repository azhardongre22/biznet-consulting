import { lazy } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import SuccessStories from "../components/SuccessStories";
import SliderImg1 from "../assets/images/optimized/ServiceSlider1-1.webp";
import SliderImg2 from "../assets/images/optimized/ServiceSlider2-1.webp";
import SliderImg3 from "../assets/images/optimized/ServiceSlider2-2.webp";
import { useLanguage } from "../i18n/LanguageContext";
import ServiceSliderNew from "../components/ServiceSliderNew";

const Footer = lazy(() => import("../components/Footer"));

const servicesSlideImages = [SliderImg2, SliderImg3, SliderImg1];
const servicesSlideHrefs = ["/services", "/about", "/contact"];

const Services = () => {
  const { tArray } = useLanguage();
  const serviceSlides = tArray("servicesPage.slides").map((s, i) => ({
    ...s,
    ctaHref: servicesSlideHrefs[i],
    bg: servicesSlideImages[i],
    inlineTitle: true,
  }));

  return (
    <>
      <Navbar />
      <HeroSlider slides={serviceSlides} sectionId="services-hero" autoPlay />
      <div className="bg-gradient-to-b from-[#DDE5E8] to-[#7C878E] pt-16 md:pt-24">
        <ServiceSliderNew />
      </div>
      <SuccessStories />
      <Footer />
    </>
  );
};

export default Services;
