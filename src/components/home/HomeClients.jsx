// Client / partner logos, presented as a quiet static logo wall in the
// homepage's editorial language (hairline grid, monochrome → colour on hover).
// Deliberately NOT the About page's scrolling marquee.

import dmcc from "../../assets/images/clients/dmcc.webp";
import innovateLiving from "../../assets/images/clients/innovate-living.svg";
import oro24 from "../../assets/images/clients/oro24-developments.webp";
import reviRealty from "../../assets/images/clients/revi-realty.svg";
import samana from "../../assets/images/clients/samana-developers.webp";
import vision from "../../assets/images/clients/vision-developments.webp";
import mainRealty from "../../assets/images/clients/main-realty.webp";
import { CLIENTS } from "./content";

const CLIENT_LOGOS = [
  { name: "DMCC", src: dmcc },
  { name: "Innovate Living", src: innovateLiving },
  { name: "ORO24 Developments", src: oro24 },
  { name: "REVI Realty", src: reviRealty },
  { name: "Samana Developers", src: samana },
  { name: "Vision Developments", src: vision },
  { name: "Main Realty", src: mainRealty },
];

export default function HomeClients() {
  if (!CLIENT_LOGOS.length) return null;

  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-28 lg:px-10">
        <div className="max-w-[630px]">
          <p data-reveal className="hv2-eyebrow">
            {CLIENTS.eyebrow}
          </p>
          <h2
            data-reveal
            className="hv2-display mt-5 text-[34px] leading-[1.1] text-[#092D54] md:text-[48px]"
          >
            {CLIENTS.heading}
          </h2>
          <p
            data-reveal
            className="mt-5 text-[15px] leading-relaxed text-[#596573]"
          >
            {CLIENTS.body}
          </p>
        </div>

        {/* Hairline logo wall */}
        <div
          data-reveal-stagger
          className="mt-12 grid grid-cols-2 border-l border-t border-[#E5EAF0] sm:grid-cols-3 lg:grid-cols-4"
        >
          {CLIENT_LOGOS.map((client) => (
            <div
              key={client.name}
              data-reveal-item
              className="flex min-h-[120px] items-center justify-center border-b border-r border-[#E5EAF0] p-8 md:min-h-[150px]"
            >
              <img
                src={client.src}
                alt={`${client.name} logo`}
                title={client.name}
                loading="lazy"
                decoding="async"
                draggable="false"
                className="max-h-[46px] max-w-[150px] object-contain opacity-55 brightness-0 transition duration-300 md:max-h-[52px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
