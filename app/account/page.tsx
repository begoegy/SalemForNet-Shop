// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import Link from "next/link";
import { db, firebaseEnabled } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { egp } from "@/utils/currency";

type OrderRow = {
  id: string;
  total: number;
  status: string;
  payment?: { method?: string; status?: string };
  created_at?: any;
};

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [note, setNote] = useState<string | null>(null);

  // لو مش مسجّل، رجّعه للّوجين
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!firebaseEnabled) {
        setNote("Firestore غير مفعّل في هذه البيئة.");
        setOrders([]);
        setLoadingOrders(false);
        return;
      }
      if (!user || !db) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      try {
        // المحاولة الأساسية: where + orderBy (محتاج index مركب)
        const q1 = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("created_at", "desc"),
          limit(20)
        );
        const snap1 = await getDocs(q1);
        const rows1: OrderRow[] = [];
        snap1.forEach((d) => {
          const data = d.data() as any;
          rows1.push({
            id: d.id,
            total: data.total ?? 0,
            status: data.status ?? "unknown",
            payment: data.payment ?? {},
            created_at: data.created_at ?? null,
          });
        });
        setOrders(rows1);
        setLoadingOrders(false);
      } catch (e: any) {
        // لو وقع بسبب الفهرس (FAILED_PRECONDITION)، نجرّب استعلام أبسط بدون orderBy
        console.warn("Fallback orders query (index likely missing):", e?.message || e);
        try {
          const q2 = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            limit(20)
          );
          const snap2 = await getDocs(q2);
          const rows2: OrderRow[] = [];
          snap2.forEach((d) => {
            const data = d.data() as any;
            rows2.push({
              id: d.id,
              total: data.total ?? 0,
              status: data.status ?? "unknown",
              payment: data.payment ?? {},
              created_at: data.created_at ?? null,
            });
          });
          // ترتيب بسيط بالوقت لو متاح، وإلا يسيبه كما هو
          rows2.sort((a, b) => {
            const ta = (a.created_at?.toMillis?.() ?? 0);
            const tb = (b.created_at?.toMillis?.() ?? 0);
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
          setLoadingOrders(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="sf-container py-8">
      <h1 className="text-2xl font-bold mb-6">حسابي</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات سريعة */}
        <SectionCard title="الملف الشخصي">
          <div className="space-y-2 text-sm">
            <div>
              <span className="opacity-70">الاسم:</span>{" "}
              {user?.displayName || "بدون اسم"}
            </div>
            <div>
              <span className="opacity-70">الإيميل:</span> {user?.email}
            </div>
          </div>
        </SectionCard>

        {/* الطلبات */}
        <SectionCard
          title="طلباتي"
          action={
            <Link href="/orders" className="btn-outline text-sm">
              عرض الكل
            </Link>
          }
          className="md:col-span-2"
        >
          {loadingOrders ? (
            <div className="text-sm opacity-70">...جارٍ تحميل الطلبات</div>
          ) : orders && orders.length > 0 ? (
            <ul className="divide-y">
              {orders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">طلب #{o.id}</div>
                    <div className="text-xs opacity-70">
                      الحالة: {o.status} — الدفع: {o.payment?.method || "غير محدد"}
                      {" / "}
                      {o.payment?.status || "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{egp(o.total)}</div>
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

          {note && (
            <div className="mt-3 text-xs text-amber-700">
              {note}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
