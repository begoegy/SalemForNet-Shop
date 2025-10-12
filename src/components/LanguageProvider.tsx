"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, type Lang } from "@/utils/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: typeof dictionary["ar"] };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>((typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "ar");
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      localStorage.setItem("lang", lang);
    }
  }, [lang]);
  const t = useMemo(() => dictionary[lang], [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
