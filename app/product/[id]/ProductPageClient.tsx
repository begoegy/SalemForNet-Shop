"use client";

import data from "@/data/products.json";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { egp } from "@/utils/currency";
import Link from "next/link";

type Product = {
  id: string;
  name_ar: string;
  name_en?: string;
  category: string;
  sku: string;
  price_egp: number;
  image: string;       // /assets/img/<id>.webp
  image_2x?: string;   // /assets/img/<id>@2x.webp (اختياري)
  desc?: string;
  stock: number;
  average_rating?: number;
  reviews_count?: number;
};

function Stars({ n = 0 }: { n?: number }) {
  const full = Math.round(n || 0);
  return (
    <div className="text-yellow-500" aria-label={`Rating: ${n} of 5`}>
      {"★★★★★".slice(0, full)}
      <span className="text-gray-300">{"★★★★★".slice(full)}</span>
    </div>
  );
}

const catFallback: Record<string, string> = {
  "راوترات": "/assets/img/placeholders/router.svg",
  "Access Point": "/assets/img/placeholders/ap.svg",
  "سويتشات": "/assets/img/placeholders/switch.svg",
  "كابلات": "/assets/img/placeholders/cable.svg",
  "أدوات": "/assets/img/placeholders/tools.svg",
  "طاقة": "/assets/img/placeholders/power.svg",
  "SFP": "/assets/img/placeholders/sfp.svg",
  "CPE": "/assets/img/placeholders/cpe.svg",
};

export default function ProductPageClient() {
  const { id } = useParams<{ id: string }>();
  const p = (data as Product[]).find((x) => x.id === id);
  const { add } = useCart();
  const router = useRouter();

  if (!p) return <div className="card">المنتج غير موجود.</div>;

  const inStock = p.stock > 0;
  const fallbackSrc = catFallback[p.category] || "/assets/img/placeholder-330x330.jpg";

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* صورة كبيرة تملى الإطار */}
      <div className="card" data-id={p.id}>
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative">
          <img
            id={`img-product-${p.id}`}
            src={p.image}
            srcSet={`${p.image} 660w${p.image_2x ? `, ${p.image_2x} 1320w` : ""}`}
            sizes="(min-width: 1024px) 660px, 90vw"
            alt={p.name_en || p.name_ar}
            width={660}
            height={660}
            className="absolute inset-0 object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackSrc;
            }}
          />
        </div>
      </div>

      {/* البيانات والتفاصيل */}
      <div className="card">
        <div className="text-sm text-gray-500 flex items-center justify-between">
          <span>{p.sku}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              inStock ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            {inStock ? "متاح في المخزون" : "غير متاح"}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {p.name_ar} {p.name_en ? `/ ${p.name_en}` : ""}
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-accent font-bold text-xl">{egp(p.price_egp)}</div>
          <div className="flex items-center gap-2">
            <Stars n={p.average_rating} />
            {p.reviews_count ? (
              <span className="text-xs text-gray-500">({p.reviews_count})</span>
            ) : null}
          </div>
        </div>

        {p.desc && <p className="text-gray-700 mt-4 leading-7">{p.desc}</p>}

        <div className="flex gap-3 mt-5">
          <button
            disabled={!inStock}
            onClick={() => {
              add(p.id, 1);
              router.push("/cart");
            }}
            className={`px-4 py-2 rounded-2xl ${
              inStock ? "bg-dark text-white hover:bg-black" : "bg-gray-200 text-gray-500"
            }`}
          >
            {inStock ? "أضف للسلة" : "غير متاح"}
          </button>
          <Link href="/catalog" className="px-4 py-2 rounded-2xl border">
            رجوع للكتالوج
          </Link>
        </div>
      </div>

      {/* منتجات مشابهة */}
      <div className="md:col-span-2 card">
        <h2 className="font-semibold mb-2">منتجات مشابهة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(data as Product[])
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
            .map((sp) => (
              <Link href={`/product/${sp.id}`} key={sp.id} className="border rounded-2xl p-3">
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 relative">
                  <img
                    src={sp.image}
                    srcSet={`${sp.image} 330w${(sp as any).image_2x ? `, ${(sp as any).image_2x} 660w` : ""}`}
                    sizes="(min-width: 768px) 330px, 50vw"
                    alt={sp.name_en || sp.name_ar}
                    width={330}
                    height={330}
                    className="absolute inset-0 object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      const fb =
                        catFallback[sp.category] || "/assets/img/placeholder-330x330.jpg";
                      e.currentTarget.src = fb;
                    }}
                  />
                </div>
                <div className="mt-2 text-sm">{sp.name_ar}</div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
