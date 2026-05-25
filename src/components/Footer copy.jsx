import { FaMobileAlt, FaPhoneAlt } from "react-icons/fa";
import BNLogo from "../assets/images/BN_Logo.png";
import BiznetSecondaryLogo from "../assets/images/biznet-sec-white.png";
import BiznetTagline from "../assets/images/biznet-tagline.png";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020812] text-white">
      {/* Subtle grid + atmospheric layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/2 via-transparent to-black/40" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 select-none translate-x-[-50%] translate-y-[20%] font-['Cormorant_Garamond',Georgia,serif] text-[86px] font-light leading-none tracking-[-0.04em] text-white/5 md:text-[150px] lg:text-[180px]">
        BIZNET
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-6 py-14 pb-28 md:px-10 md:py-16 md:pb-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
          {/* Left: logo + partnership text + contact */}
          <div className="md:col-span-6">
            <div className="flex flex-col items-start text-left">
              <div className="flex flex-col items-center">
                <img
                  src={BNLogo}
                  alt="Biznet logo"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-[140px] object-contain opacity-95 md:w-[160px]"
                />

                <img
                  src={BiznetSecondaryLogo}
                  alt="Biznet secondary logo"
                  loading="lazy"
                  decoding="async"
                  className="mt-4 h-auto w-[180px] object-contain opacity-95 md:w-[210px]"
                />

                <img
                  src={BiznetTagline}
                  alt="Biznet tagline"
                  loading="lazy"
                  decoding="async"
                  className="mt-3 h-auto w-[210px] object-contain opacity-90 md:w-[250px]"
                />
              </div>

              <p className="mt-10 max-w-[390px] text-[15px] leading-relaxed text-white/78 md:text-[16px]">
                Partner with Biznet to unlock high-impact opportunities through
                insight, ecosystem thinking, and premium execution.
              </p>

              <div className="mt-7 space-y-4 text-[15px] leading-relaxed text-white/80 md:text-[16px]">
                <a
                  href="mailto:hello@biznetconsulting.com"
                  className="block w-fit transition hover:text-white"
                >
                  hello@biznetconsulting.com
                </a>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href="tel:+971527488855"
                    className="flex w-fit items-center gap-2 transition hover:text-white"
                  >
                    <FaMobileAlt className="text-[14px] text-[#d3ad49]" />
                    <span>+971 52 748 8855</span>
                  </a>

                  <a
                    href="tel:+97143433334"
                    className="flex w-fit items-center gap-2 transition hover:text-white"
                  >
                    <FaPhoneAlt className="text-[13px] text-[#d3ad49]" />
                    <span>04 343 3334</span>
                  </a>
                </div>
                <p className="max-w-[320px]">
                  1204, Capricorn Tower, Dubai, UAE
                </p>
              </div>
            </div>
          </div>

          {/* Right: contact form + newsletter stacked */}
          <div className="md:col-span-6 md:flex md:items-center md:justify-end">
            <div className="flex w-full max-w-[520px] flex-col gap-5">
              {/* Newsletter subscribe */}
              <div className="w-full rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-md md:p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                    Newsletter
                  </p>

                  <p className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-white/72">
                    Subscribe for project insights, releases, and announcements.
                  </p>
                </div>

                <form
                  className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <button
                    type="submit"
                    className="group inline-flex h-[44px] w-fit cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#d3ad49] px-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#06101c] transition hover:bg-[#e5c15a]"
                  >
                    Subscribe
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>

                  <input
                    className="h-[44px] flex-1 rounded-xl border border-white/10 bg-[#0a1420]/70 px-4 text-[13px] text-white placeholder:text-white/35 outline-none transition focus:border-[#d3ad49]/55 focus:ring-2 focus:ring-[#d3ad49]/20"
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </form>
              </div>

              {/* Contact form */}
              <div className="w-full rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-md md:p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/55">
                    Contact Us
                  </p>
                </div>

                <form
                  className="mt-5 grid gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="h-[42px] rounded-lg border border-white/10 bg-[#2d2d2d] px-4 text-[12px] text-white placeholder:text-white/50 outline-none transition focus:border-[#d3ad49]/55 focus:ring-2 focus:ring-[#d3ad49]/20"
                      placeholder="Name"
                      type="text"
                      autoComplete="name"
                      required
                    />

                    <input
                      className="h-[42px] rounded-lg border border-white/10 bg-[#2d2d2d] px-4 text-[12px] text-white placeholder:text-white/50 outline-none transition focus:border-[#d3ad49]/55 focus:ring-2 focus:ring-[#d3ad49]/20"
                      placeholder="Email *"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <textarea
                    className="min-h-[92px] w-full resize-none rounded-lg border border-white/10 bg-[#2d2d2d] px-4 py-3 text-[12px] text-white placeholder:text-white/50 outline-none transition focus:border-[#d3ad49]/55 focus:ring-2 focus:ring-[#d3ad49]/20"
                    placeholder="Message"
                    required
                  />

                  <div className="mt-2 flex justify-start">
                    <button
                      type="submit"
                      className="group inline-flex h-[40px] w-fit cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#d3ad49] px-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#06101c] transition hover:bg-[#e5c15a]"
                    >
                      Send Message
                      <span className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Center copyright above BIZNET text */}
        <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] tracking-[0.12em] text-white/40 md:bottom-16">
          © {new Date().getFullYear()} Biznet. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
