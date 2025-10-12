"use client";
import data from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const categories = ["راوترات","Access Point","سويتشات","كابلات","أدوات","طاقة","SFP","CPE"];

export default function CatalogPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string|undefined>();
  const items = data as any[];

  useEffect(() => {
    const qParam = sp.get("q") || "";
    const catParam = sp.get("cat") || "";
    setQ(qParam);
    setCat(catParam || undefined);
  }, [sp]);

  const filtered = useMemo(() => {
    return items.filter(p => {
      const hay = [p.name_ar, p.name_en, p.sku, p.category].join(" ").toLowerCase();
      const matchQ = !q || hay.includes(q.toLowerCase());
      const matchC = !cat || p.category === cat;
      return matchQ && matchC;
    });
  }, [q, cat, items]);

  const onChangeCat = (v: string) => {
    const next = v ? `/catalog?cat=${encodeURIComponent(v)}${q?`&q=${encodeURIComponent(q)}`:""}` : `/catalog${q?`?q=${encodeURIComponent(q)}`:""}`;
    router.push(next);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          value={q}
          onChange={e=>{
            const val = e.target.value;
            setQ(val);
            const next = `${window.location.pathname}?${[
              val?`q=${encodeURIComponent(val)}`:"",
              cat?`cat=${encodeURIComponent(cat)}`:""
            ].filter(Boolean).join("&")}`;
            router.replace(next);
          }}
          placeholder="بحث بالاسم/الفئة/الـSKU…"
          className="border rounded-2xl px-4 py-2 w-full md:max-w-md"
        />
        <select value={cat||""} onChange={e=>onChangeCat(e.target.value || "")} className="border rounded-2xl px-4 py-2">
          <option value="">كل الفئات</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(p => <ProductCard key={p.id} p={p as any} />)}
        {filtered.length===0 && (
          <div className="col-span-full card">لا نتائج مطابقة. جرّب كلمة أقصر أو فئة مختلفة.</div>
        )}
      </div>
    </div>
  );
}
