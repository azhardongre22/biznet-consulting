import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import whatsappIcon from "../assets/icons/icons8-whatsapp.json";
import instagramIcon from "../assets/icons/icons8-instagram.json";
import tiktokIcon from "../assets/icons/icons8-tiktok.json";
import linkedinIcon from "../assets/icons/icons8-linkedin.json";

const LottieComponent = Lottie?.default ?? Lottie;

export const defaultSocialLinks = [
  {
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VbCftkiJZg46tGLDkU3V",
    icon: whatsappIcon,
    type: "lottie",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/biznetconsulting",
    icon: instagramIcon,
    type: "lottie",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@biznet.consulting8",
    icon: tiktokIcon,
    type: "lottie",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/biznet-consulting",
    icon: linkedinIcon,
    type: "lottie",
  },
  {
    label: "X",
    href: "https://x.com/BizNetAE",
    icon: null,
    type: "text",
  },
];

/**
 * @param {'row' | 'col'} direction — manual control (hero rail uses col)
 * @param {boolean} floating — row on small screens, column from md up (homepage strip)
 * @param {string} className — wrapper classes
 * @param {string} buttonClassName — extra classes per link button
 * @param {'dark' | 'light'} variant — color theme (default dark; light is
 *   for the cream `/scan` landing). Affects border, background, and the
 *   plain-text "X" link's color.
 */
function SocialMediaIcons({
  links = defaultSocialLinks,
  direction = "col",
  floating = false,
  className = "",
  buttonClassName = "",
  variant = "dark",
}) {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const flexDir = floating
    ? "flex flex-row items-center justify-center md:flex-col"
    : direction === "row"
      ? "flex flex-row flex-wrap items-center justify-center"
      : "flex flex-col items-center";

  const variantBtn =
    variant === "light"
      ? "border border-[#5F6F7A]/55 bg-transparent hover:border-[#0E4174] hover:bg-[#0E4174]/10"
      : "border border-white/20 bg-[#06111d]/55 hover:border-[#7C878E] hover:bg-[#0b1e31]";

  const xLabelColor =
    variant === "light"
      ? "text-[#384967] group-hover:text-[#0E4174]"
      : "text-white group-hover:text-[#7C878E]";

  return (
    <div className={`${flexDir} gap-2 sm:gap-2.5 ${className}`}>
      {links.map((social) => {
        const isInstagram = social.label === "Instagram";
        const isHovered = hoveredSocial === social.label;

        return (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            onMouseEnter={() => setHoveredSocial(social.label)}
            onMouseLeave={() => setHoveredSocial(null)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.96 }}
            className={`group flex h-9 w-9 shrink-0 items-center justify-center rounded-full backdrop-blur-sm transition md:h-9 md:w-9 ${variantBtn} ${buttonClassName}`}
          >
            {social.type === "lottie" ? (
              <LottieComponent
                key={`${social.label}-${isHovered ? "play" : "idle"}`}
                animationData={social.icon}
                autoplay={isHovered}
                loop={isHovered}
                className={isInstagram ? "h-12 w-12" : "h-10 w-10"}
              />
            ) : (
              <span
                className={`text-[12px] font-semibold transition ${xLabelColor}`}
              >
                X
              </span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

export default SocialMediaIcons;
