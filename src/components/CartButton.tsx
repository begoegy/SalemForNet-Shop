"use client";
import Link from "next/link";
import { useCart } from "./cart/CartContext";

export default function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="ml-2 px-3 py-1.5 rounded-md border text-sm font-semibold hover:bg-gray-50 transition relative">
      <span className="inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
          <path d="M7 4h-2l-1 2v2h2l3.6 7.59c.17.33.51.54.88.54h7.02a1 1 0 0 0 .96-.74l2.1-7.36A1 1 0 0 0 20.5 7h-12l-.9-2H7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 .001-4.001A2 2 0 0 0 17 20Z"/>
        </svg>
        السلة
      </span>
      <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs align-middle">
        {count}
      </span>
    </Link>
  );
}
