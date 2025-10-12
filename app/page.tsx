"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import data from "@/data/products.json";
import Search from "@/components/Search";
import Testimonials from "@/components/testimonials/Testimonials";
import Categories from "@/components/Categories";

function Banner() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-dark to-primary text-white p-6 md:p-10 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          SalemForNet <span className="text-accent">Shop</span>
        </h1>
        <p className="text-white/80">
          إكسسوارات الشبكات — راوترات، Access Point، سويتشات، كابلات، SFP والمزيد.
        </p>
      </div>
      <Search />
    </section>
  );
}

export default function Page() {
  const items = (data as any[]);
  const featured = items.filter((p) => p.featured).slice(0, 5);

  return (
    <div className="space-y-10">
      <Banner />

      {/* فئات احترافية */}
      <section>
        <h2 className="text-xl font-semibold mb-4">تصفح بالفئة</h2>
        <Categories />
      </section>

      {/* منتجات مميّزة */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">منتجات مميّزة</h2>
          <Link href="/catalog" className="text-accent">كل المنتجات</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {featured.map((p) => (<ProductCard key={p.id} p={p as any} />))}
        </div>
      </section>

      {/* مزايا */}
      <section className="grid md:grid-cols-3 gap-4">
        {["ضمان معتمد", "شحن سريع", "دعم فني محترف"].map((f) => (
          <div key={f} className="card">{f}</div>
        ))}
      </section>

      {/* آراء العملاء */}
      <section>
        <h2 className="text-xl font-semibold mb-4">آراء عملائنا</h2>
        <Testimonials />
      </section>
    </div>
  );
}
