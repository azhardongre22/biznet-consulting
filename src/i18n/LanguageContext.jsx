import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "./translations";

const STORAGE_KEY = "biznet-language";

const LanguageContext = createContext({
  language: "en",
  dir: "ltr",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  tArray: () => [],
});

function readInitialLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function lookup(dictionary, key) {
  if (!key) return undefined;
  const parts = key.split(".");
  let cur = dictionary;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = cur[part];
  }
  return cur;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readInitialLanguage);

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.documentElement.classList.remove("rtl", "ltr");
    document.documentElement.classList.add(dir);
  }, [language, dir]);

  const setLanguage = useCallback((next) => {
    if (next !== "ar" && next !== "en") return;
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "ar" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key, fallback) => {
      const dict = translations[language] ?? translations.en;
      const value = lookup(dict, key);
      if (value == null) {
        const enValue = lookup(translations.en, key);
        return enValue ?? fallback ?? key;
      }
      return value;
    },
    [language],
  );

  const tArray = useCallback(
    (key) => {
      const value = t(key);
      return Array.isArray(value) ? value : [];
    },
    [t],
  );

  const value = useMemo(
    () => ({ language, dir, setLanguage, toggleLanguage, t, tArray }),
    [language, dir, setLanguage, toggleLanguage, t, tArray],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Keep the document (and this subtree) in English LTR while mounted.
 * Language toggle still updates the stored preference for other pages,
 * but does not flip layout or copy on the current page.
 */
export function useLockPageToEnglish() {
  useEffect(() => {
    const html = document.documentElement;

    const lock = () => {
      if (html.getAttribute("dir") !== "ltr") html.setAttribute("dir", "ltr");
      if (html.getAttribute("lang") !== "en") html.setAttribute("lang", "en");
      if (html.classList.contains("rtl") || !html.classList.contains("ltr")) {
        html.classList.remove("rtl");
        html.classList.add("ltr");
      }
    };

    lock();
    const observer = new MutationObserver(lock);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["dir", "lang", "class"],
    });

    return () => {
      observer.disconnect();
      let lang = "en";
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "ar" || stored === "en") lang = stored;
      } catch {
        /* ignore */
      }
      const dir = lang === "ar" ? "rtl" : "ltr";
      html.dir = dir;
      html.lang = lang;
      html.classList.remove("ltr", "rtl");
      html.classList.add(dir);
    };
  }, []);
}

/** Keeps this subtree LTR + English copy; toggle still updates global preference. */
export function EnglishOnly({ children }) {
  useLockPageToEnglish();
  const parent = useContext(LanguageContext);

  const value = useMemo(() => {
    const tEn = (key, fallback) => {
      const found = lookup(translations.en, key);
      return found ?? fallback ?? key;
    };
    return {
      // Real preference so the EN/AR control still moves; dir stays LTR here.
      language: parent.language,
      dir: "ltr",
      setLanguage: parent.setLanguage,
      toggleLanguage: parent.toggleLanguage,
      t: tEn,
      tArray: (key) => {
        const found = tEn(key);
        return Array.isArray(found) ? found : [];
      },
    };
  }, [parent.language, parent.setLanguage, parent.toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      <div dir="ltr" lang="en">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}
