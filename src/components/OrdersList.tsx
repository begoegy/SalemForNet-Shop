"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Order = {
  id?: string;
  code?: string;         // كود/رقم الطلب (اختياري)
  status: "pending" | "paid" | "shipped" | "delivered" | "canceled";
  totalEgp: number;
  itemsCount?: number;
  createdAt?: any;
};

function formatDate(ts: any) {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

export default function OrdersList({ uid }: { uid: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // بنقرأ من users/{uid}/orders
  const colRef = useMemo(
    () => collection(db, "users", uid, "orders"),
    [uid]
  );

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: Order[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Order),
      }));
      setOrders(arr);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [colRef]);

  return (
    <>
      <h2 className="font-semibold mb-2">الطلبات السابقة</h2>
      {loading ? (
        <div className="text-sm text-gray-600">جار التحميل…</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-600">لا توجد طلبات بعد.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {o.code ? `طلب #${o.code}` : `طلب ${o.id?.slice(0, 6)}`}
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                  {statusLabel(o.status)}
                </span>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <div>الإجمالي: {o.totalEgp?.toLocaleString("ar-EG")} ج.م</div>
                {o.itemsCount != null && <div>العناصر: {o.itemsCount}</div>}
                <div>التاريخ: {formatDate(o.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function statusLabel(s: Order["status"]) {
  switch (s) {
    case "pending": return "قيد المراجعة";
    case "paid": return "مدفوع";
    case "shipped": return "جار الشحن";
    case "delivered": return "تم التسليم";
    case "canceled": return "ملغي";
    default: return "—";
  }
}
