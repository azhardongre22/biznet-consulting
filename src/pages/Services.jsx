import { lazy } from "react";
import Navbar from "../components/Navbar";
import ServicesGrid from "../components/ServiceGrid";
import UpcomingProjects from "../components/UpcomingProjects";
import HeroSlider from "../components/HeroSlider";
import SuccessStories from "../components/SuccessStories";
import SliderImg1 from "../assets/images/ServiceSlider1-1.png";
import SliderImg2 from "../assets/images/ServiceSlider2-1.png";
import SliderImg3 from "../assets/images/ServiceSlider2-2.png";
import { useLanguage } from "../i18n/LanguageContext";

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
      <ServicesGrid variant="light" />
      <UpcomingProjects />
      <SuccessStories />
      <Footer />
    </>
  );
};

export default Services;
