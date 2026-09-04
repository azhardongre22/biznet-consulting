import { trackWhatsAppClick } from "../lib/tracking";

/**
 * FloatingWhatsApp — dedicated WhatsApp chat entry point.
 *
 * This is NOT part of FloatingSocials (that rail is plain social redirects).
 * This button exists specifically so every WhatsApp click is measured: it
 * fires the `whatsapp_click` event onto the dataLayer before opening the chat.
 *
 * Positioning: bottom-right, stacked ABOVE the floating BN enquiry icon
 * (see BNIcon.jsx) so the two never overlap on any breakpoint.
 */

// Business WhatsApp line — same number as the site footer (tel:+971527488855).
const WHATSAPP_NUMBER = "971527488855";
const PREFILLED_MESSAGE =
  "Hello Biznet Consulting, I'd like to know more about your services.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  PREFILLED_MESSAGE,
)}`;

export default function FloatingWhatsApp() {
  const handleClick = () => {
    // Synchronous push — completes before the browser follows the link.
    trackWhatsAppClick({
      location: "floating-button",
      link_url: WHATSAPP_URL,
    });
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat with Biznet Consulting on WhatsApp"
      className="
        group fixed right-4 z-[9998]
        bottom-[70px] sm:bottom-[78px] md:bottom-[84px] lg:bottom-[92px]
        sm:right-5
        flex h-10 w-10 items-center justify-center
        rounded-full bg-[#25D366]
        border border-white/25 p-2
        shadow-[0_8px_24px_rgba(37,211,102,0.40)]
        transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:bg-[#1ebe5b]
        hover:shadow-[0_10px_28px_rgba(37,211,102,0.55)]
        active:translate-y-0 active:scale-95
        sm:h-11 sm:w-11
        md:h-12 md:w-12
        lg:h-14 lg:w-14 cursor-pointer
      "
    >
      {/* Soft attention pulse */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping [animation-duration:2.4s]"
      />

      {/* Desktop hover tooltip */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap
          rounded-md bg-[#0E4174] px-3 py-1.5 text-[11px] font-medium text-white
          opacity-0 shadow-lg transition-opacity duration-300
          group-hover:opacity-100 lg:block
        "
      >
        Chat on WhatsApp
      </span>

      {/* WhatsApp glyph (inline SVG — no external asset dependency) */}
      <svg
        viewBox="0 0 32 32"
        className="relative h-full w-full text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.463 1.712 6.41L3.2 28.8l6.57-1.72a12.74 12.74 0 0 0 6.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.752-9.056A12.72 12.72 0 0 0 16.004 3.2Zm0 23.36h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.003 1.05 1.068-3.9-.252-.4a10.56 10.56 0 0 1-1.62-5.6c0-5.867 4.774-10.64 10.646-10.64 2.842 0 5.513 1.108 7.523 3.12a10.57 10.57 0 0 1 3.117 7.526c0 5.867-4.774 10.64-10.64 10.64Zm5.834-7.968c-.32-.16-1.892-.933-2.185-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.572-1.587-.95-.847-1.592-1.893-1.779-2.213-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.374-.26-.623-.523-.538-.72-.548l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.253 3.44 5.46 4.824.763.33 1.358.526 1.822.674.766.243 1.463.209 2.014.127.614-.092 1.892-.774 2.159-1.521.266-.747.266-1.387.186-1.521-.08-.134-.293-.214-.613-.374Z" />
      </svg>
    </a>
  );
}
