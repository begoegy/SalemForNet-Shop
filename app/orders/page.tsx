"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  total: number;
  items: { id: string; qty: number; price: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("orders");
      const list: Order[] = raw ? JSON.parse(raw) : [];
      setOrders(list.slice().reverse());
    }
  }, []);

  if (!orders.length) return <div className="card">لا توجد طلبات بعد. <Link className="text-accent" href="/catalog">ابدأ التسوق</Link></div>;

  return (
    <div className="space-y-4">
      {orders.map((o, idx) => (
        <div key={idx} className="card">
          <div className="flex items-center justify-between">
            <div className="font-semibold">الطلب #{orders.length - idx}</div>
            <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-700 mt-2">{o.name} — {o.phone} — {o.city}</div>
          <div className="text-sm text-gray-700">{o.address}</div>
          {o.notes && <div className="text-xs text-gray-500 mt-1">ملاحظات: {o.notes}</div>}
          <div className="mt-3 border-t pt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-right py-1">المنتج</th>
                  <th className="py-1">الكمية</th>
                  <th className="py-1">السعر</th>
                  <th className="py-1">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1"><Link className="text-accent" href={`/product/${it.id}`}>{it.id}</Link></td>
                    <td className="text-center">{it.qty}</td>
                    <td className="text-center">{it.price} ج.م</td>
                    <td className="text-center">{it.price * it.qty} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 font-semibold text-right">الإجمالي: {o.total} ج.م</div>
          </div>
        </div>
      ))}
    </div>
  );
}
