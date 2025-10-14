"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function PaymentSuccessClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const data = useMemo(() => {
    // بنقرأ اللي Paymob بيرجّعه (أو اللي انت بتحطه في Success URL)
    const success = sp.get("success") ?? sp.get("txn_status") ?? "";
    const code = sp.get("txn_response_code") ?? sp.get("code") ?? "";
    const order = sp.get("order") ?? sp.get("order_id") ?? "";
    const amount = sp.get("amount") ?? "";
    const message = sp.get("message") ?? "";

    // نجاح تقريبي: success=true أو txn_status=Success أو code=APPROVED
    const isOk =
      (/^true$/i.test(success) ||
        /^success$/i.test(success) ||
        /^approved$/i.test(code) ||
        /^success$/i.test(code)) ?? false;

    return { isOk, success, code, order, amount, message };
  }, [sp]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="rounded-2xl shadow bg-white p-6 border">
        <h1 className="text-2xl font-semibold mb-3">الدفع</h1>
        <p className="text-gray-700 mb-4">تم الرجوع من بوابة الدفع.</p>

        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium">الحالة:</span>{" "}
            <span className={data.isOk ? "text-green-600" : "text-red-600"}>
              {data.isOk ? "نجاح" : (data.success || "غير معروفة")}
            </span>
          </div>

          {data.code ? (
            <div>
              <span className="font-medium">الكود:</span>{" "}
              <span className="font-mono">{data.code}</span>
            </div>
          ) : null}

          {data.order ? (
            <div>
              <span className="font-medium">رقم الطلب:</span>{" "}
              <span className="font-mono">{data.order}</span>
            </div>
          ) : null}

          {data.amount ? (
            <div>
              <span className="font-medium">القيمة:</span> {data.amount}
            </div>
          ) : null}

          {data.message ? (
            <div className="text-gray-600">{data.message}</div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            الرجوع للمتجر
          </button>

          <button
            onClick={() => router.push("/account")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            حسابي / طلباتي
          </button>
        </div>

        {!data.isOk && (
          <p className="mt-4 text-sm text-gray-600">
            لو حصل خصم فعلي، التسوية بتتم تلقائياً عبر البنك/Paymob.
          </p>
        )}
      </div>
    </div>
  );
}
