"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useCart } from "@/components/cart/CartContext";
import data from "@/data/products.json";
import { egp } from "@/utils/currency";
import Link from "next/link";
import { useState } from "react";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const products = data as any[];

  const rows = items
    .map(i => ({ ...i, p: products.find(x => x.id === i.id) }))
    .filter(r => r.p);

  const total = rows.reduce((a, r) => a + r.qty * (r.p.price_egp ?? 0), 0);

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "fail">("idle");

  if (rows.length === 0) {
    return (
      <div className="card">
        <h1 className="text-xl font-bold mb-2">إتمام الشراء</h1>
        <p>
          السلة فارغة —{" "}
          <Link className="text-accent" href="/catalog">
            اذهب للكتالوج
          </Link>
        </p>
      </div>
    );
  }

  const placeOrder = async () => {
    try {
      setStatus("saving");
      if (firebaseEnabled) {
        const payload = {
          user: user ? { uid: user.uid, email: user.email } : null,
          name,
          phone,
          address,
          items: rows.map(r => ({ id: r.id, qty: r.qty, price: r.p.price_egp ?? 0 })),
          total,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "orders"), payload);
      }
      setStatus("ok");
      clear();
    } catch (e) {
      console.error(e);
      setStatus("fail");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <div className="card">
          <h1 className="text-xl font-bold mb-3">إتمام الشراء</h1>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">الاسم</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="اسم المستلم"
              />
            </div>
            <div>
              <label className="text-sm">رقم الهاتف</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">العنوان</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="الشارع، المدينة، المحافظة"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              className="bg-accent text-white px-4 py-2 rounded-xl disabled:opacity-60"
              onClick={placeOrder}
              disabled={status === "saving"}
            >
              {status === "saving" ? "جارٍ إنشاء الطلب..." : "تنفيذ الطلب"}
            </button>
            <Link className="underline" href="/cart">
              الرجوع للسلة
            </Link>
          </div>

          <div className="mt-3 text-sm">
            {status === "ok" && <div className="text-green-600">تم إنشاء الطلب بنجاح ✅</div>}
            {status === "fail" && <div className="text-red-600">حدث خطأ أثناء إنشاء الطلب.</div>}
            {!firebaseEnabled && (
              <div className="text-xs text-gray-500">ⓘ وضع تجريبي (بدون Firestore)</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">ملخص الطلب</h2>
        <ul className="space-y-2 text-sm">
          {rows.map(r => (
            <li key={r.id} className="flex justify-between">
              <span>
                {r.p.title} × {r.qty}
              </span>
              <span>{egp((r.p.price_egp ?? 0) * r.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t pt-3 font-semibold">الإجمالي: {egp(total)}</div>
      </div>
    </div>
  );
}
