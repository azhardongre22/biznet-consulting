import React, { useState } from "react";
import BnLogo from "../assets/images/optimized/BN_Logo.webp";
import LeadModal from "./LeadModal";

const BNIcon = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <>
      {/* Floating BN Icon — brand fill keeps the white logo visible on light pages */}
      <button
        type="button"
        onClick={() => setIsLeadModalOpen(true)}
        aria-label="Open enquiry form"
        className="
          group fixed bottom-4 right-4 z-[9999]
          flex h-10 w-10 items-center justify-center
          rounded-full bg-[#0E4174]
          border border-white/20 p-1.5
          shadow-[0_8px_24px_rgba(14,65,116,0.35)]
          transition-all duration-300 ease-out
          hover:-translate-y-0.5
          hover:bg-[#163d6a]
          hover:shadow-[0_10px_28px_rgba(14,65,116,0.45)]
          active:translate-y-0 active:scale-95
          sm:bottom-5 sm:right-5 sm:h-11 sm:w-11 sm:p-2
          md:h-12 md:w-12
          lg:h-14 lg:w-14 cursor-pointer
        "
      >
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
