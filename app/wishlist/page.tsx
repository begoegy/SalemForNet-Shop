"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Wish = { id: string };

export default function WishlistPage() {
  const [items, setItems] = useState<Wish[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("wishlist");
      setItems(raw ? JSON.parse(raw) : []);
    }
  }, []);

  if (!items.length) return <div className="card">المفضلة فارغة — <Link className="text-accent" href="/catalog">تسوق الآن</Link></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((w, idx) => (
        <div key={idx} className="card flex items-center justify-between">
          <div className="text-sm">{w.id}</div>
          <Link href={`/product/${w.id}`} className="text-accent">عرض المنتج</Link>
        </div>
      ))}
    </div>
  );
}
