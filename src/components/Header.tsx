"use client";
import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { useCart } from "./cart/CartContext";
import Search from "./Search";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-md bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/20 rotate-45" />
      </div>
      <div className="leading-none">
        <div className="text-2xl font-extrabold tracking-tight">
          SalemForNet <span className="text-accent">Shop</span>
        </div>
        <div className="text-[11px] text-gray-500 -mt-0.5">Networking Accessories</div>
      </div>
    </Link>
  );
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count } = useCart();
  return (
    <header className="bg-white sticky top-0 z-40 border-b">
      {/* شريط علوي */}
      <div className="bg-dark text-white text-sm">
        <div className="sf-container py-2 flex items-center justify-between">
          <div className="flex gap-4">
            <a href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE}`} className="hover:underline">📞 {process.env.NEXT_PUBLIC_SUPPORT_PHONE}</a>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} className="hover:underline">💬 {process.env.NEXT_PUBLIC_WHATSAPP}</a>
            <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="hover:underline">✉️ {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-xs border px-2 py-1 rounded">
              {lang === "ar" ? "EN" : "AR"}
            </button>
          </div>
        </div>
      </div>

      {/* شريط وسط: لوجو + سيرش + السلة */}
      <div className="sf-container py-4 flex items-center gap-4">
        <Brand />
        <div className="flex-1 flex justify-center"><Search /></div>
        <Link href="/cart" className="relative font-semibold hover:text-accent">
          🛒 السلة
          <span className="absolute -top-2 -right-3 bg-accent text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
        </Link>
      </div>

      {/* تنقل */}
      <nav className="sf-container py-2 flex gap-5 text-sm">
        <Link className="hover:text-accent" href="/catalog">{t.catalog}</Link>
        <Link className="hover:text-accent" href="/account">{t.account}</Link>
        <Link className="hover:text-accent" href="/policies/privacy">الخصوصية</Link>
        <Link className="hover:text-accent" href="/policies/terms">الشروط</Link>
        <Link className="hover:text-accent" href="/policies/shipping">الشحن</Link>
        <Link className="hover:text-accent" href="/contact">تواصل</Link>
      </nav>
    </header>
  );
}
