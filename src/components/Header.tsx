"use client";
import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { useCart } from "./cart/CartContext";
import Search from "./Search";
import CartButton from "./CartButton";
import AccountActions from "./AccountActions";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-md bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/20 rotate-45" />
      </div>
      <div className="leading-none">
        <div className="text-2xl font-extrabold tracking-tight">
          SalemForNet
        </div>
        <div className="text-[10px] opacity-70 -mt-1">شبكتي</div>
      </div>
    </Link>
  );
}

export default function Header() {
  const { t } = useLang();
  const { count } = useCart();

  return (
    <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      {/* الشريط العلوي */}
      <div className="sf-container py-3 flex items-center justify-between gap-4">
        <Brand />

        <div className="flex-1 max-w-2xl">
          <Search />
        </div>

        <div className="flex items-center gap-3">
          <CartButton />
          <AccountActions />
        </div>
      </div>

      {/* تنقل */}
      <nav className="sf-container py-2 flex gap-5 text-sm">
        <Link className="hover:text-accent" href="/catalog">{t.catalog}</Link>
        <Link className="hover:text-accent" href="/account">{t.account}</Link>
        <Link className="hover:text-accent" href="/policies/privacy">الخصوصية</Link>
        <Link className="hover:text-accent" href="/policies/terms">الشروط</Link>
        <Link className="hover:text-accent" href="/policies/shipping">الشحن</Link>
        <Link className="hover:text-accent" href="/contact">تواصل</Link>
        <Link className="hover:text-accent" href="/catalog?offer=1">العروض</Link>
      </nav>
    </header>
  );
}
