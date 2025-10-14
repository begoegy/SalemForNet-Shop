"use client";

import React, { useCallback, useState } from "react";

type Props = {
  totalAmount?: number;
  amount?: number;

  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  merchantOrderId?: string;

  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function PaymobButton({
  totalAmount,
  amount,
  email,
  phone,
  firstName,
  lastName,
  merchantOrderId,
  className,
  style,
  children,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setErr(null);

    const total =
      Number.isFinite(totalAmount as any) && (totalAmount as any)! > 0
        ? (totalAmount as number)
        : Number(amount ?? 0);

    if (!Number.isFinite(total) || total <= 0) {
      setErr("الإجمالي غير متاح أو يساوي صفر. راجع السلة.");
      return;
    }
    if (!email || !phone || !firstName) {
      setErr("برجاء إدخال البريد ورقم الموبايل والاسم أولًا.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/paymob/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          email,
          phone,
          firstName,
          lastName: lastName ?? "",
          merchantOrderId,
        }),
      });

      // حاول نقرأ نص الخطأ أو الداتا لإظهار سبب واضح
      let text = "";
      try {
        text = await res.text();
      } catch {}

      if (!res.ok) {
        let msg = "";
        try {
          msg = (JSON.parse(text)?.error as string) ?? "";
        } catch {}
        setErr(`فشل بدء الدفع (HTTP ${res.status}) — ${msg || text || "غير معروف"}`);
        console.error("Paymob intent failed:", { status: res.status, detail: msg || text });
        return;
      }

      const data = text ? JSON.parse(text) : await res.json();
      const iframeUrl: string | undefined = data?.iframeUrl;
      if (iframeUrl && typeof window !== "undefined") {
        window.open(iframeUrl, "_blank", "noopener,noreferrer");
      } else {
        setErr("تم إنشاء الدفع لكن رابط الدفع غير متاح.");
      }
    } catch (e: any) {
      console.error("PaymobButton error:", e);
      setErr(e?.message || "حدث خطأ غير متوقع أثناء بدء الدفع.");
    } finally {
      setLoading(false);
    }
  }, [totalAmount, amount, email, phone, firstName, lastName, merchantOrderId]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
        style={style}
        aria-busy={loading ? "true" : "false"}
      >
        {loading ? "جارٍ التحويل للدفع..." : (children ?? "الدفع أونلاين")}
      </button>

      {err && (
        <div className="text-sm text-red-600" role="status" aria-live="polite">
          {err}
        </div>
      )}
    </div>
  );
}
