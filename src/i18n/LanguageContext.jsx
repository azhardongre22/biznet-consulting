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
