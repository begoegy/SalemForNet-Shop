// src/components/PaymobPayButton.tsx
"use client";
import { useState } from "react";

type Props = {
  amount: number;
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  merchantOrderId: string; // خليه = رقم/معرف الطلب عندك
};

export default function PaymobPayButton(props: Props) {
  const [loading, setLoading] = useState(false);

  const onPay = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/paymob/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      window.location.href = data.iframeUrl; // تحويل مباشر لـ Iframe Page
    } catch (e: any) {
      alert(e.message ?? "خطأ في إنشاء عملية الدفع");
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
      {loading ? "جاري التحويل..." : "ادفع الآن (Paymob)"}
    </button>
  );
}
