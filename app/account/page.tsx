// app/account/page.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SectionCard from "@/components/SectionCard";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-36 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 animate-pulse" />
        <div className="h-36 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* بطاقة البروفايل */}
      <div className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-6 flex items-center gap-4">
        <img
          src={user.photoURL || "/assets/img/user-placeholder.png"}
          alt="avatar"
          className="w-16 h-16 rounded-2xl object-cover ring-1 ring-black/5"
        />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold">حسابي</h1>
          <p className="text-gray-700 font-medium">{user.displayName || "مستخدم"}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="px-3 py-2 rounded-2xl border font-semibold hover:bg-gray-50"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* عناويني */}
      <SectionCard title="عناويني" subtitle="(لاحقًا سنضيف عناوين الشحن والافتراضي منها)">
        <div className="text-gray-600 text-sm">
          لا توجد عناوين محفوظة بعد.
        </div>
      </SectionCard>

      {/* الطلبات السابقة (ملخص) */}
      <SectionCard
        title="الطلبات السابقة"
        subtitle="(لاحقًا نجلب Orders حسب user.uid)"
        actions={<button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">عرض الكل</button>}
      >
        <ul className="space-y-3">
          <li className="rounded-xl border p-4 text-sm text-gray-600">
            لا توجد طلبات حتى الآن.
          </li>
        </ul>
      </SectionCard>

      {/* طلباتي (من LocalStorage كحل مؤقت) */}
      <SectionCard title="طلباتي">
        <OrdersList />
      </SectionCard>
    </div>
  );
}

// ======= Components =======
function OrdersList() {
  if (typeof window === "undefined") return null as any;
  const raw = localStorage.getItem("orders");
  const orders = raw ? JSON.parse(raw) : [];
  if (!orders.length) {
    return <div className="text-gray-500 text-sm">لا توجد طلبات بعد.</div>;
  }
  return (
    <div className="space-y-3">
      {orders.slice(-5).reverse().map((o: any, idx: number) => (
        <div key={idx} className="border rounded-2xl p-3">
          <div className="font-semibold">الإجمالي: {o.total} ج.م</div>
          <div className="text-xs text-gray-500">{o.name} — {o.phone} — {o.city}</div>
          <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
