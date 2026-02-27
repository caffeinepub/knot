import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  type LangCode,
  TRANSLATIONS,
  type Translations,
} from "../utils/translations";

const STORAGE_KEY = "knot_lang";

function getStoredLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && stored in TRANSLATIONS) return stored;
  } catch {
    // ignore
  }
  return "en";
}

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(getStoredLang);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: keyof Translations): string => {
      return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
