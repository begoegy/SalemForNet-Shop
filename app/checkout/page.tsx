"use client";

export const dynamic = "force-dynamic";

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
    .map((i) => ({ ...i, p: products.find((x) => x.id === i.id) }))
    .filter((r) => r.p);
  const total = rows.reduce((a, r) => a + r.qty * (r.p.price_egp ?? 0), 0);

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "fail">("idle");
  const [orderRef, setOrderRef] = useState<string | undefined>(undefined);

  if (rows.length === 0) {
    return (
      <div className="card">
        <p className="text-center">
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

      if (!user) {
        setStatus("fail");
        alert("سجّل الدخول أولاً لإتمام الطلب.");
        return;
      }

      if (firebaseEnabled) {
        // ✅ Payload مطابق للقواعد المقترحة
        const payload = {
          userId: user.uid, // مهم جدًا
          items: rows.map((r) => ({
            product_id: r.p.id,
            sku: r.p.sku,
            qty: r.qty,
            unit_price: r.p.price_egp ?? 0,
          })),
          total,
          status: "placed", // قيمة مسموحة بالقواعد
          customer: {
            name: name || user.displayName || "",
            email: user.email || "",
            phone,
          },
          payment: {
            method: "cod",
            status: "pending",
          },
          created_at: serverTimestamp(), // اسم الحقل snake_case
          // لو عايز تحتفظ بالعنوان كحقل منفصل:
          // address,
        };

        const docRef = await addDoc(collection(db, "orders"), payload);
        setOrderRef(docRef.id);
      } else {
        // وضع بدون فايرستور (تجريبي)
        setOrderRef("SFN-" + Date.now());
      }

      setStatus("ok");
      clear();
    } catch (e) {
      console.error(e);
      setStatus("fail");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <h2 className="font-semibold mb-1">بيانات العميل</h2>

        <div className="grid gap-3">
          <input
            className="border rounded p-2"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <textarea
            className="border rounded p-2"
            placeholder="العنوان (اختياري)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={placeOrder}
            disabled={status === "saving"}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            {status === "saving" ? "جارٍ الإرسال..." : "تأكيد الطلب"}
          </button>

          {status === "ok" && (
            <span className="text-green-700 text-sm">
              تم إنشاء الطلب بنجاح {orderRef ? `(رقم: ${orderRef})` : ""}.
            </span>
          )}
          {status === "fail" && (
            <span className="text-red-600 text-sm">حدث خطأ أثناء إنشاء الطلب.</span>
          )}
          {!firebaseEnabled && (
            <span className="text-xs text-gray-500">ⓘ وضع تجريبي (بدون Firestore)</span>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">ملخص الطلب</h2>
        <ul className="space-y-2 text-sm">
          {rows.map((r) => (
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
