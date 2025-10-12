"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en";

// ✅ نوع عام للترجمات: كل المفاتيح قيمها string (مش literal types)
type Translations = {
  startShopping: string;
  addToCart: string;
  outOfStock: string;
  search: string;
  categories: string;
  cart: string;
  wishlist: string;
  checkout: string;
  orders: string;
  help: string;
  account: string;
};

// ✅ القاموس مطابق لـ Record<Lang, Translations>
const dictionary: Record<Lang, Translations> = {
  ar: {
    startShopping: "ابدأ التسوّق",
    addToCart: "أضف للسلة",
    outOfStock: "غير متاح",
    search: "بحث",
    categories: "الفئات",
    cart: "السلة",
    wishlist: "المفضلة",
    checkout: "اتمام الشراء",
    orders: "طلباتي",
    help: "المساعدة",
    account: "حسابي",
  },
  en: {
    startShopping: "Start shopping",
    addToCart: "Add to cart",
    outOfStock: "Unavailable",
    search: "Search",
    categories: "Categories",
    cart: "Cart",
    wishlist: "Wishlist",
    checkout: "Checkout",
    orders: "Orders",
    help: "Help",
    account: "My Account",
  },
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LangCtx = createContext<LangContextType>({
  lang: "ar",
  setLang: () => {},
  t: dictionary.ar,
});

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  // استرجاع اللغة من localStorage إن وجدت
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  // حفظ اللغة عند التغيير
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
      // ضبط اتجاه الصفحة لو حبيت
      if (typeof document !== "undefined") {
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
      }
    } catch {}
  }, [lang]);

  const t = useMemo<Translations>(() => dictionary[lang], [lang]);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
