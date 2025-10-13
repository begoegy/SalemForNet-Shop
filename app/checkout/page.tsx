﻿"use client";

export const dynamic = "force-dynamic";

import { useCart } from "@/components/cart/CartContext";
import data from "@/data/products.json";
import { egp } from "@/utils/currency";
import Link from "next/link";
import { useState } from "react";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // موحّد مع layout.tsx
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // ====== الدفع عند الاستلام (تأكيد الطلب) ======
  const placeOrder = async () => {
    try {
      setStatus("saving");
      if (loading) return;
      if (!user) {
        setStatus("fail");
        alert("سجّل الدخول أولاً لإتمام الطلب.");
        return;
      }

      if (firebaseEnabled) {
        const payload = {
          userId: user.uid,
          items: rows.map((r) => ({
            product_id: r.p.id,
            sku: r.p.sku,
            qty: r.qty,
            unit_price: r.p.price_egp ?? 0,
          })),
          total,
          status: "placed",
          payment: { method: "cod", status: "pending" },
          customer: {
            name: name || user.displayName || "",
            email: user.email || "",
            phone,
            address,
          },
          created_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "orders"), payload);
        clear(); // فقط بعد نجاح الحفظ
        router.push(`/orders?id=${docRef.id}`);
        return;
      } else {
        // وضع تجريبي بدون Firebase
        setOrderRef("SFN-" + Date.now());
      }

      setStatus("ok");
    } catch (e) {
      console.error(e);
      setStatus("fail");
    }
  };

  // ====== الدفع الأونلاين (Paymob أو Mock حسب .env.local) ======
  const payWithPaymob = async () => {
    try {
      if (loading) return;
      if (!user) {
        alert("سجّل الدخول أولاً لإتمام الدفع.");
        return;
      }
      if (!phone || !name) {
        alert("ادخل الاسم ورقم الهاتف أولاً.");
        return;
      }

      // نحدّد المزود من متغير البيئة (mock أو paymob)
      const provider =
        typeof process !== "undefined" && (process as any)?.env?.NEXT_PUBLIC_PAYMENT_PROVIDER
          ? (process as any).env.NEXT_PUBLIC_PAYMENT_PROVIDER
          : "mock";

      // إنشاء Order pending أولاً (لو Firebase مفعّل)
      let merchantOrderId = "";
      if (firebaseEnabled) {
        const payload = {
          userId: user.uid,
          items: rows.map((r) => ({
            product_id: r.p.id,
            sku: r.p.sku,
            qty: r.qty,
            unit_price: r.p.price_egp ?? 0,
          })),
          total,
          status: "pending",
          payment: { method: provider === "mock" ? "mock" : "paymob", status: "pending" },
          customer: {
            name: name || user.displayName || "",
            email: user.email || "",
            phone,
            address,
          },
          created_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "orders"), payload);
        merchantOrderId = docRef.id;
      } else {
        merchantOrderId = "SFN-" + Date.now();
      }

      if (provider === "mock") {
        // مزود دفع تجريبي محلي
        const res = await fetch("/api/mock/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            address,
            amount: total,
            merchantOrderId,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          alert("فشل الدفع التجريبي. راجع البيانات.");
          return;
        }
        // محاكاة نجاح الدفع
        window.location.href = `/pay/return?success=true&order=${encodeURIComponent(merchantOrderId)}`;
        return;
      }

      // === المزود الحقيقي (Paymob) ===
      const [firstName, ...rest] = (name || "").trim().split(" ");
      const lastName = rest.join(" ");
      const res = await fetch("/api/paymob/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          email: user.email || "",
          phone,
          firstName: firstName || "Customer",
          lastName,
          merchantOrderId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data?.error || "فشل إنشاء عملية الدفع");
        return;
      }
      // تحويل مباشر لصفحة Iframe
      window.location.href = data.iframeUrl;
    } catch (err) {
      console.error(err);
      alert("حصل خطأ أثناء تهيئة الدفع.");
    }
  };

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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* بيانات العميل */}
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
            disabled={status === "saving" || loading}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            {loading ? "جارٍ التحقق..." : status === "saving" ? "جارٍ الإرسال..." : "تأكيد الطلب"}
          </button>

          {/* زر الدفع الأونلاين — يعتمد على المزود من env */}
          <button
            onClick={payWithPaymob}
            disabled={status === "saving" || loading}
            className="px-4 py-2 rounded bg-accent text-white disabled:opacity-60"
          >
            {process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "paymob"
              ? "ادفع أونلاين (Paymob)"
              : "ادفع أونلاين (تجريبي)"}
          </button>

          {status === "ok" && (
            <span className="text-green-700 text-sm">
              {orderRef ? `تم إنشاء الطلب بنجاح (رقم: ${orderRef})` : "تم إنشاء الطلب بنجاح"}
            </span>
          )}
          {status === "fail" && <span className="text-red-600 text-sm">حدث خطأ أثناء إنشاء الطلب.</span>}
        </div>
      </div>

      {/* ملخص الطلب */}
      <div className="card">
        <h2 className="font-semibold mb-2">ملخص الطلب</h2>
        <ul className="space-y-2">
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
