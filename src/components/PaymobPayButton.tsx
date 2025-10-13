// src/components/PaymobPayButton.tsx
"use client";
import { useState } from "react";

type Props = {
  amount: number;
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  merchantOrderId: string; // رقم/معرف الطلب
  label?: string; // نص الزرار (اختياري)
};

export default function PaymobPayButton(props: Props) {
  const [loading, setLoading] = useState(false);

  const onPay = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/paymob/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: props.amount,
          email: props.email,
          phone: props.phone,
          firstName: props.firstName,
          lastName: props.lastName ?? "",
          merchantOrderId: props.merchantOrderId,
        }),
      });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        console.error("Paymob intent failed:", { status: res.status, data });
        alert(`فشل إنشاء عملية الدفع: ${data?.error || res.statusText || "غير معروف"}`);
        return;
      }
      window.location.href = data.iframeUrl;
    } catch (err: any) {
      console.error("payWithPaymob fatal:", err);
      alert(`حصل خطأ أثناء تهيئة الدفع: ${err?.message || "غير معروف"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onPay}
      disabled={loading}
      className="w-full rounded-xl bg-black text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "جاري التحويل..." : (props.label ?? "دفع أونلاين")}
    </button>
  );
}
