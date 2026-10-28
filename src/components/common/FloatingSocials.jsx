import SmartImage from "./SmartImage";

/**
 * FloatingSocials — site-wide social links.
 *
 * Visible on lg+ screens only: fixed vertical rail on the left.
 */

const socialLinks = [
  {
    name: "WhatsApp Broadcast Channel",
    icon: "https://biznetconsulting.ae/email-signature/social.png",
    url: "https://whatsapp.com/channel/0029VbCftkiJZg46tGLDkU3V",
  },
  {
    name: "LinkedIn",
    icon: "https://biznetconsulting.ae/email-signature/linkedin.png",
    url: "https://www.linkedin.com/company/biznet-consulting/",
  },
  {
    name: "Instagram",
    icon: "https://biznetconsulting.ae/email-signature/instagram.png",
    url: "https://www.instagram.com/biznetconsulting",
  },
  {
    name: "X",
    icon: "https://biznetconsulting.ae/email-signature/twitter.png",
    url: "https://x.com/BizNetAE",
  },
  {
    name: "TikTok",
    icon: "https://biznetconsulting.ae/email-signature/tiktok.png",
    url: "https://www.tiktok.com/@biznet.consulting8",
  },
  {
    name: "YouTube",
    icon: "https://biznetconsulting.ae/email-signature/youtube.png",
    url: "https://youtube.com/@biznetconsulting",
  },
  {
    name: "Snapchat",
    icon: "https://biznetconsulting.ae/email-signature/snapchat.png",
    url: "https://www.snapchat.com/add/bnconsultingae",
  },
];

export { socialLinks as SOCIAL_LINKS };

function SocialButton({ item, size = "md" }) {
  const buttonSize = size === "sm" ? "h-[25px] w-[25px]" : "h-[31px] w-[31px]";
  const isTikTok = item.name === "TikTok";

  return (
    <a
      href={item.url}
      aria-label={`Follow Biznet on ${item.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex ${buttonSize} shrink-0 cursor-pointer items-center justify-center overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:opacity-80 ${
        isTikTok ? "rounded-full bg-white p-0 m-0" : ""
      }`}
    >
      <SmartImage
        src={item.icon}
        alt={`${item.name} icon`}
        className={`h-full w-full object-contain ${isTikTok ? "m-0 p-0" : ""}`}
        skeleton={false}
      />
    </a>
  );
}

export function FooterSocials({ tone = "dark", className = "" }) {
  const isLight = tone === "light";
  return (
    <nav
      aria-label="Follow Biznet on social media"
      className={`flex flex-col gap-4 ${className}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.24em] ${
          isLight ? "text-[#0E4174]" : "text-white/55"
        }`}
      >
        Follow us
      </p>

      <ul className="flex flex-wrap items-center gap-3">
        {socialLinks.map((item) => (
          <li key={item.name}>
            <SocialButton item={item} size="sm" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialRail({ className = "" }) {
  return (
    <ul className={`pointer-events-auto flex flex-col items-start gap-1.5 ${className}`}>
      {socialLinks.map((item) => (
        <li key={item.name}>
          <SocialButton item={item} />
        </li>
      ))}
    </ul>
  );
}

export default function FloatingSocials() {
  return (
    <aside
      aria-label="Follow Biznet on social media"
      className="pointer-events-none fixed bottom-6 left-0 z-50 hidden lg:block"
    >
      {/* Flush against the left edge and anchored to the bottom corner. */}
      <div className="pl-0">
        <SocialRail />
      </div>
    </aside>
  );
}
