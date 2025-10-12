"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import data from "@/data/products.json";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { egp } from "@/utils/currency";

export default function CartPage() {
  const { items, remove, setQty, clear } = useCart();
  const products = data as any[];

  const rows = items
    .map(i => ({ ...i, p: products.find(x => x.id === i.id) }))
    .filter(r => r.p);

  const total = rows.reduce((a, r) => a + r.qty * (r.p.price_egp ?? 0), 0);

  if (rows.length === 0)
    return (
      <div className="card">
        السلة فارغة —{" "}
        <Link className="text-accent" href="/catalog">
          اذهب للكتالوج
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2 pr-2">المنتج</th>
              <th className="py-2 pr-2">الكمية</th>
              <th className="py-2 pr-2">السعر</th>
              <th className="py-2 pr-2">الإجمالي</th>
              <th className="py-2 pr-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.p.image || "/assets/img/placeholder-330x330.jpg"}
                      alt={r.p.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="font-medium">{r.p.title}</div>
                  </div>
                </td>
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => setQty(r.id, Math.max(1, r.qty - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="w-14 border rounded px-2 py-1"
                      value={r.qty}
                      min={1}
                      onChange={e => setQty(r.id, Math.max(1, Number(e.target.value) || 1))}
                    />
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => setQty(r.id, r.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3 pr-2">{egp(r.p.price_egp ?? 0)}</td>
                <td className="py-3 pr-2">{egp((r.p.price_egp ?? 0) * r.qty)}</td>
                <td className="py-3 pr-2">
                  <button className="px-3 py-1 border rounded" onClick={() => remove(r.id)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card flex items-center justify-between">
        <div className="font-semibold">المجموع: {egp(total)}</div>
        <div className="flex gap-3">
          <button onClick={clear} className="border px-4 py-2 rounded-xl">
            تفريغ السلة
          </button>
          <Link href="/checkout" className="bg-accent text-white px-4 py-2 rounded-xl">
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
