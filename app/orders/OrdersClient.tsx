"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { egp } from "@/utils/currency";

type OrderDoc = {
  userId: string;
  items: { product_id: string; sku?: string; qty: number; unit_price: number }[];
  total: number;
  status: "placed" | "awaiting_payment" | "paid" | "cancelled" | "refunded";
  customer?: { name?: string; email?: string; phone?: string; address?: string };
  payment?: { method?: string; status?: string; txnId?: string };
  created_at?: any;
};

export default function OrdersClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const id = sp.get("id") || "";

  const [order, setOrder] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "orders", id));
        if (snap.exists()) setOrder(snap.data() as OrderDoc);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!id) {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">تفاصيل الطلب</h1>
        <p className="text-sm text-gray-600">لا يوجد رقم طلب في الرابط.</p>
        <div className="flex gap-2">
          <Link href="/catalog" className="btn">العودة للمنتجات</Link>
          <button onClick={() => router.back()} className="btn-outline">رجوع</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <h1 className="text-xl font-bold">تفاصيل الطلب</h1>
      <p className="text-sm text-gray-700">رقم الطلب: <span className="font-mono">{id}</span></p>

      {loading ? (
        <p className="text-sm text-gray-600">جارٍ التحميل…</p>
      ) : order ? (
        <>
          <div className="text-sm">
            <div>الحالة: <span className="font-semibold">{order.status}</span></div>
            {order.customer?.name && <div>الاسم: {order.customer.name}</div>}
            {order.customer?.phone && <div>الهاتف: {order.customer.phone}</div>}
            {order.customer?.email && <div>الإيميل: {order.customer.email}</div>}
          </div>

          <div>
            <h2 className="font-semibold mb-2">العناصر</h2>
            <ul className="space-y-1 text-sm">
              {order.items?.map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>#{it.product_id} × {it.qty}</span>
                  <span>{egp(it.unit_price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t pt-2 font-semibold">
              الإجمالي: {egp(order.total)}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Link href="/catalog" className="btn">متابعة التسوق</Link>
            <Link href="/" className="btn-outline">الصفحة الرئيسية</Link>
          </div>
        </>
      ) : (
        <p className="text-sm text-red-600">تعذّر العثور على هذا الطلب أو ليس لديك صلاحية لعرضه.</p>
      )}
    </div>
  );
}
