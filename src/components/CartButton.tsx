"use client";

import Link from "next/link";
import { useCart } from "./cart/CartContext";

export default function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:shadow-sm transition"
      aria-label="سلة المشتريات"
    >
      <span aria-hidden className="text-xl leading-none">🛒</span>
      <span className="text-sm">السلة</span>
      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 text-[12px] leading-5 text-white bg-red-600 rounded-full text-center"
          aria-label={`عدد العناصر ${count}`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
