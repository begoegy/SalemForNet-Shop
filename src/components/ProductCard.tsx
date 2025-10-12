import Link from "next/link";
import { egp } from "@/utils/currency";

type Product = {
  id: string;
  name_ar: string;
  name_en?: string;
  price_egp: number;
  image: string;        // المسار المحلي الأساسي
  image_2x?: string;    // نسخة الريتنا
  stock: number;
  sku: string;
  desc?: string;
  average_rating?: number;
  reviews_count?: number;
  category: string;
  featured?: boolean;
};

function Stars({ n = 0 }: { n?: number }) {
  const full = Math.round(n || 0);
  return (
    <div className="text-yellow-500 text-xs" aria-label={`Rating: ${n} of 5`}>
      {"★★★★★".slice(0, full)}
      <span className="text-gray-300">{"★★★★★".slice(full)}</span>
    </div>
  );
}

export default function ProductCard({ p, lang = "ar" }: { p: Product; lang?: "ar" | "en" }) {
  const inStock = p.stock > 0;
  const fallbackSrc = "/assets/img/placeholder-330x330.jpg";

  return (
    <div className="card" data-id={p.id}>
      <Link href={`/product/${p.id}`} className="block">
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative">
          <img
            id={`img-product-${p.id}`}
            src={p.image}
            srcSet={`${p.image} 330w${p.image_2x ? `, ${p.image_2x} 660w` : ""}`}
            sizes="(min-width: 768px) 330px, 50vw"
            alt={p.name_en || p.name_ar}
            width={330}
            height={330}
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackSrc;
            }}
          />
        </div>

        <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
          <span>{p.sku}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              inStock ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            {inStock ? "متاح" : "غير متاح"}
          </span>
        </div>

        <div className="font-semibold mt-0.5">
          {lang === "ar" ? p.name_ar : p.name_en || p.name_ar}
        </div>

        <div className="text-accent font-bold mt-1">{egp(p.price_egp)}</div>

        <div className="mt-1 flex items-center gap-2">
          <Stars n={p.average_rating} />
          {p.reviews_count ? (
            <span className="text-[11px] text-gray-500">({p.reviews_count})</span>
          ) : null}
        </div>

        {p.desc && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2 overflow-hidden text-ellipsis">
            {p.desc}
          </p>
        )}
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/product/${p.id}`}
          className={`px-3 py-2 rounded-2xl text-sm ${
            inStock
              ? "bg-dark text-white hover:bg-black"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {inStock
            ? lang === "ar"
              ? "أضف للسلة"
              : "Add to cart"
            : lang === "ar"
            ? "غير متاح"
            : "Unavailable"}
        </Link>
      </div>
    </div>
  );
}
