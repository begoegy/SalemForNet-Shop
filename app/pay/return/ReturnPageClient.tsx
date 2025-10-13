"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ReturnPageClient() {
  const sp = useSearchParams();
  const success = sp.get("success") ?? sp.get("Success") ?? "";
  const txId = sp.get("id") ?? sp.get("trx") ?? sp.get("transaction_id") ?? "";
  const orderId = sp.get("order") ?? sp.get("order_id") ?? "";
  const message = sp.get("message") ?? "";

  const ok = String(success).toLowerCase() === "true" || success === "1";

  return (
    <div className="container mx-auto p-4">
      <div className="card p-6">
        <h1 className="text-xl font-bold mb-2">{ok ? "تم الدفع بنجاح" : "فشل الدفع"}</h1>
        {txId ? <p className="mb-1">رقم العملية: {txId}</p> : null}
        {orderId ? <p className="mb-1">رقم الطلب: {orderId}</p> : null}
        {message ? <p className="mb-1">{message}</p> : null}
        <div className="mt-4">
          <Link href="/orders" className="underline">الرجوع إلى الطلبات</Link>
        </div>
      </div>
    </div>
  );
}
