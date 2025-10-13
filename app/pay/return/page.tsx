// app/pay/return/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

export default function PayReturnPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  // لو حبيت تعمل تحقق HMAC على السيرفر، حولها إلى route.ts
  // هنا بنقرأ success كإشارة أولية فقط (عرضي)
  const success = useMemo(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search);
    return p.get("success") === "true";
  }, []);

  useEffect(() => {
    setStatus(success ? "success" : "failed");
  }, [success]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      {status === "verifying" && <h1 className="text-xl">جاري التحقق من الدفع...</h1>}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-green-600">تم الدفع بنجاح ✅</h1>
          <p className="mt-2">هتوصلك رسالة بتأكيد الطلب.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-2xl font-bold text-red-600">فشل الدفع ❌</h1>
          <p className="mt-2">جرّب تاني أو استخدم وسيلة مختلفة.</p>
        </>
      )}
    </div>
  );
}
