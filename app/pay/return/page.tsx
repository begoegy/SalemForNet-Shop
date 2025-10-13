"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PayReturnPage() {
  const params = useSearchParams();
  const ok = params.get("success") === "true";
  const order = params.get("order") || "";

  return (
    <div className="sf-container py-12">
      <div className="card max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {ok ? "تم الدفع بنجاح ✅" : "فشل الدفع ❌"}
        </h1>

        {order ? (
          <p className="text-sm opacity-80">
            رقم الطلب: <span className="font-mono">{order}</span>
          </p>
        ) : null}

        <div className="flex items-center gap-3 justify-center">
          <Link href="/orders" className="btn">عرض الطلبات</Link>
          <Link href="/catalog" className="btn-outline">متابعة التسوق</Link>
        </div>
      </div>
    </div>
  );
}
