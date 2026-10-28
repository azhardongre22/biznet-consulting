import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { FAQS } from "./content";

export default function HomeFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="hv2-section border-t border-[#EEF1F4]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Heading */}
          <div className="lg:col-span-4">
            <p data-reveal className="hv2-eyebrow">FAQ</p>
            <h2 data-reveal className="hv2-display mt-5 text-[30px] leading-[1.1] text-[#092D54] sm:text-[34px] md:text-[46px]">
              Frequently Asked Questions
            </h2>
            <p data-reveal className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-[#596573]">
              A few of the questions clients most often ask about how we work.
            </p>
            <Link
              to="/faqs"
              data-reveal
              className="group mt-7 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0E4174]"
            >
              <span className="border-b border-[#0E4174]/40 pb-0.5">View all FAQs</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-8">
            {FAQS.map((faq, index) => {
              const isOpen = index === open;
              const panelId = `faq-v2-${index}`;
              return (
                <div key={faq.q} className="border-b border-[#E5EAF0] first:border-t">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="flex w-full items-start gap-5 py-6 text-left"
                  >
                    <span className="hv2-display mt-1 text-[14px] text-[#AEB8C2]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="hv2-display flex-1 text-[20px] leading-[1.3] text-[#1D2A3A] md:text-[23px]">
                      {faq.q}
                    </span>
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0E4174]/30 text-[#0E4174]">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>

                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[560px] pb-7 pl-[36px] text-[14.5px] leading-[1.8] text-[#596573]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
