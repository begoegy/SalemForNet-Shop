"use client";
import data from "@/data/products.json";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { egp } from "@/utils/currency";

export default function CartPageClient() {
  const { items, remove, setQty, clear } = useCart();
  const products = data as any[];
  const rows = items.map(i => ({...i, p: products.find(x=>x.id===i.id)})).filter(r=>r.p);
  const total = rows.reduce((a,r)=> a + r.qty * r.p.price_egp, 0);

  if (rows.length===0) return <div className="card">
    السلة فارغة — <Link className="text-accent" href="/catalog">اذهب للكتالوج</Link>
  </div>;

  return (
    <div className="space-y-6">
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>المنتج</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-3">{r.p.name_ar}</td>
                <td>{egp(r.p.price_egp)}</td>
                <td>
                  <input type="number" min={1} value={r.qty} onChange={e=>setQty(r.id, parseInt(e.target.value||"1"))} className="border rounded px-2 py-1 w-20"/>
                </td>
                <td>{egp(r.qty * r.p.price_egp)}</td>
                <td><button onClick={()=>remove(r.id)} className="text-red-600">حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card flex items-center justify-between">
        <div className="font-semibold">المجموع: {egp(total)}</div>
        <div className="flex gap-3">
          <button onClick={clear} className="border px-4 py-2 rounded-xl">تفريغ السلة</button>
          <Link href="/checkout" className="bg-accent text-white px-4 py-2 rounded-xl">إتمام الطلب</Link>
        </div>
      </div>
    </div>
  );
}
