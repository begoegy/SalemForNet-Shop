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
    if (!loading && !user) router.replace("/login");
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
          className="shrink-0 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* الشبكة الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="العناوين"
          subtitle="(لاحقًا نربط CRUD لـ addresses في Firestore)"
          actions={
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
              إضافة عنوان
            </button>
          }
        >
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            لا توجد عناوين محفوظة بعد.
          </div>
        </SectionCard>

        <SectionCard
          title="الطلبات السابقة"
          subtitle="(لاحقًا نجلب Orders حسب user.uid)"
          actions={
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
              عرض الكل
            </button>
          }
        >
          <ul className="space-y-3">
            <li className="rounded-xl border p-4 text-sm text-gray-600">
              لا توجد طلبات حتى الآن.
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
