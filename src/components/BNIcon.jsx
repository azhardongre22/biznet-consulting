import React, { useState } from "react";
import BnLogo from "../assets/images/FAVICON BLUE.png";
import LeadModal from "./LeadModal";

const BNIcon = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <>
      {/* Floating BN Icon */}
      <button
        type="button"
        onClick={() => setIsLeadModalOpen(true)}
        aria-label="Open enquiry form"
        className="
    group fixed bottom-4 right-4 z-[9999]
    flex h-10 w-10 items-center justify-center
    rounded-full
    border border-white/20 bg-white p-1.5
    shadow-[0_8px_24px_rgba(0,0,0,0.28)]
    transition-all duration-300 ease-out
    hover:-translate-y-0.5
    hover:border-[#0d5094]/30
    hover:shadow-[0_10px_28px_rgba(13,80,148,0.22)]
    active:translate-y-0 active:scale-95
    sm:bottom-5 sm:right-5 sm:h-11 sm:w-11 sm:p-2
    md:h-12 md:w-12
    lg:h-14 lg:w-14 cursor-pointer
  "
      >
        {/* Soft subtle ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#0d5094]/20 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
        />

        <img
          src={BnLogo}
          alt="Biznet"
          className="relative h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </button>
      {/* Lead Modal */}
      {isLeadModalOpen && (
        <LeadModal
          open={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
        />
      )}
    </>
  );
};

export default BNIcon;
