import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Phone input with a searchable country-code selector. Calling codes come from
// countriesnow.space; flags from flagcdn.com. The fetched list is cached at
// module scope so it is only requested once, and a small fallback keeps the
// field usable if the request fails.

const flagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

export const DEFAULT_COUNTRY = {
  name: "United Arab Emirates",
  code: "AE",
  dial_code: "+971",
};

const FALLBACK_COUNTRIES = [
  DEFAULT_COUNTRY,
  { name: "Saudi Arabia", code: "SA", dial_code: "+966" },
  { name: "Qatar", code: "QA", dial_code: "+974" },
  { name: "Kuwait", code: "KW", dial_code: "+965" },
  { name: "Oman", code: "OM", dial_code: "+968" },
  { name: "Bahrain", code: "BH", dial_code: "+973" },
  { name: "India", code: "IN", dial_code: "+91" },
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "Egypt", code: "EG", dial_code: "+20" },
  { name: "Jordan", code: "JO", dial_code: "+962" },
  { name: "Lebanon", code: "LB", dial_code: "+961" },
  { name: "Germany", code: "DE", dial_code: "+49" },
  { name: "France", code: "FR", dial_code: "+33" },
];

let COUNTRIES_CACHE = null;

export default function PhoneField({
  country,
  onCountryChange,
  number,
  onNumberChange,
  required = true,
}) {
  const [countries, setCountries] = useState(
    COUNTRIES_CACHE || FALLBACK_COUNTRIES,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (COUNTRIES_CACHE) return;
    let alive = true;
    fetch("https://countriesnow.space/api/v0.1/countries/codes")
      .then((r) => r.json())
      .then((j) => {
        if (j?.error || !Array.isArray(j?.data)) return;
        const list = j.data
          .filter((c) => c.dial_code && c.code)
          .sort((a, b) => a.name.localeCompare(b.name));
        COUNTRIES_CACHE = list;
        if (alive && list.length) setCountries(list);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.dial_code.replace("+", "").includes(q.replace("+", "")),
      )
    : countries;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex h-12 w-full items-stretch overflow-hidden rounded-xl border border-[#E1E6EC] bg-white transition focus-within:border-[#0E4174]/50 focus-within:ring-2 focus-within:ring-[#0E4174]/10">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Select country calling code"
          className="flex shrink-0 items-center gap-1.5 border-r border-[#E1E6EC] px-3 text-[14px] text-[#1F2A37] transition-colors hover:bg-[#F5F6F8]"
        >
          <img
            src={flagUrl(country.code)}
            alt=""
            className="h-3.5 w-5 rounded-[2px] object-cover"
            draggable="false"
          />
          <span>{country.dial_code}</span>
          <ChevronDown size={14} className="text-[#7C878E]" />
        </button>
        <input
          type="tel"
          required={required}
          value={number}
          onChange={(e) =>
            onNumberChange(e.target.value.replace(/[^\d\s()-]/g, ""))
          }
          placeholder="Phone *"
          className="h-full w-full min-w-0 bg-transparent px-3 text-[14px] text-[#1F2A37] outline-none placeholder:text-[#9AA5AF]"
        />
      </div>

      {open ? (
        <div className="absolute z-30 mt-1 max-h-64 w-full min-w-[240px] overflow-auto rounded-xl border border-[#E1E6EC] bg-white shadow-[0_16px_44px_-20px_rgba(14,65,116,0.45)]">
          <div className="sticky top-0 bg-white p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country"
              className="h-9 w-full rounded-lg border border-[#E1E6EC] px-3 text-[13px] text-[#1F2A37] outline-none placeholder:text-[#9AA5AF] focus:border-[#0E4174]/50"
            />
          </div>
          <ul className="pb-1">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onCountryChange(c);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-[#F5F6F8]"
                >
                  <img
                    src={flagUrl(c.code)}
                    alt=""
                    loading="lazy"
                    className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                    draggable="false"
                  />
                  <span className="flex-1 truncate text-[#1F2A37]">
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[#7C878E]">{c.dial_code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-[13px] text-[#9AA5AF]">
                No matches
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
