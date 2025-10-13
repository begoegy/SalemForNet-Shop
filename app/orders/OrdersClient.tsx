"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, firebaseEnabled } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { egp } from "@/utils/currency";

type OrderItem = { product_id: string; sku?: string; qty: number; unit_price: number };
type OrderDoc = {
  userId: string;
  items: OrderItem[];
  total: number;
  status: "placed" | "awaiting_payment" | "paid" | "cancelled" | "refunded";
  customer?: { name?: string; email?: string; phone?: string; address?: string };
  payment?: { method?: string; status?: string; txnId?: string };
  created_at?: any;
};

export default function OrdersClient() {
  const params = useSearchParams();
  const id = params.get("id");

  const { user, loading } = useAuth();

  const [note, setNote] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState(true);

  // حالة "قائمة" الطلبات
  const [orders, setOrders] = useState<{ id: string; data: OrderDoc }[] | null>(null);

  // حالة "تفاصيل" الطلب
  const [order, setOrder] = useState<{ id: string; data: OrderDoc } | null>(null);

  useEffect(() => {
    const run = async () => {
      if (loading) return;

      if (!firebaseEnabled) {
        setNote("Firestore غير مفعّل في هذه البيئة.");
        setOrders([]);
        setLoadingState(false);
        return;
      }

      if (!user || !db) {
        setOrders([]);
        setLoadingState(false);
        return;
      }

      try {
        if (id) {
          // تفاصيل طلب واحد
          const ref = doc(db, "orders", id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data() as OrderDoc;
            if (data.userId !== user.uid) {
              setOrder(null);
            } else {
              setOrder({ id: snap.id, data });
            }
          } else {
            setOrder(null);
          }
          setLoadingState(false);
          return;
        }

        // قائمة الطلبات: where + orderBy (محتاج فهرس مركّب)
        const q1 = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("created_at", "desc"),
          limit(20)
        );
        const snap1 = await getDocs(q1);
        const rows1: { id: string; data: OrderDoc }[] = [];
        snap1.forEach((d) => rows1.push({ id: d.id, data: d.data() as OrderDoc }));
        setOrders(rows1);
        setLoadingState(false);
      } catch (e: any) {
        // Fallback لو الفهرس ناقص
        console.warn("Fallback orders list (index likely missing):", e?.message || e);
        try {
          const q2 = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            limit(20)
          );
          const snap2 = await getDocs(q2);
          const rows2: { id: string; data: OrderDoc }[] = [];
          snap2.forEach((d) => rows2.push({ id: d.id, data: d.data() as OrderDoc }));
          // ترتيب يدوي حسب created_at إن وُجد
          rows2.sort((a, b) => {
            const ta = (a.data.created_at?.toMillis?.() ?? 0);
            const tb = (b.data.created_at?.toMillis?.() ?? 0);
            return tb - ta;
          });
          setOrders(rows2);
          setNote(
            "ملاحظة: تم استخدام استعلام بديل بدون ترتيب. يُفضّل إنشاء فهرس Firestore لـ userId + created_at."
          );
        } catch (e2) {
          console.error("Orders simple query failed:", e2);
          setOrders([]);
          setNote("تعذّر تحميل الطلبات. تأكد من تفعيل Firestore ووجود صلاحيات القراءة.");
        } finally {
          setLoadingState(false);
        }
      }
    };

    run();
  }, [id, user, loading]);

  // ====== عرض التفاصيل ======
  if (id) {
    return (
      <div className="card">
        {loadingState ? (
          <div className="text-sm opacity-70">...جارٍ تحميل تفاصيل الطلب</div>
        ) : order ? (
          <>
            <h2 className="font-semibold mb-2">تفاصيل الطلب #{order.id}</h2>
            <div className="text-sm mb-3">
              الحالة: {order.data.status} — الدفع: {order.data.payment?.method || "غير محدد"} / {order.data.payment?.status || "—"}
            </div>
            <ul className="divide-y">
              {order.data.items?.map((it, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span>
                    {it.product_id} {it.sku ? `(${it.sku})` : ""} × {it.qty}
                  </span>
                  <span>{egp(it.unit_price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t pt-3 font-semibold">الإجمالي: {egp(order.data.total)}</div>

            <div className="flex gap-2 mt-4">
              <Link href="/catalog" className="btn">متابعة التسوق</Link>
              <Link href="/orders" className="btn-outline">الرجوع لقائمة الطلبات</Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-600">تعذّر العثور على هذا الطلب أو ليس لديك صلاحية لعرضه.</p>
        )}
      </div>
    );
  }

  // ====== عرض القائمة ======
  return (
    <div className="card">
      <h2 className="font-semibold mb-2">طلباتي</h2>

      {loadingState ? (
        <div className="text-sm opacity-70">...جارٍ تحميل الطلبات</div>
      ) : orders && orders.length > 0 ? (
        <ul className="divide-y">
          {orders.map((o) => (
            <li key={o.id} className="py-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">طلب #{o.id}</div>
                <div className="text-xs opacity-70">
                  الحالة: {o.data.status} — الدفع: {o.data.payment?.method || "غير محدد"} / {o.data.payment?.status || "—"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold">{egp(o.data.total)}</div>
                <Link href={`/orders?id=${o.id}`} className="btn text-sm">
                  التفاصيل
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border p-4 text-sm text-gray-600">
          لا توجد طلبات حتى الآن.
        </div>
      )}

      {note && <div className="mt-3 text-xs text-amber-700">{note}</div>}
    </div>
  );
}
