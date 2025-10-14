"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function FailedClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const code = sp.get("code") ?? sp.get("txn_response_code") ?? "";
  const reason = sp.get("message") ?? sp.get("reason") ?? sp.get("error") ?? "";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="rounded-2xl shadow bg-white p-6 border">
        <h1 className="text-2xl font-semibold mb-3">فشل الدفع</h1>
        <p className="text-gray-700 mb-4">
          لم نتمكن من إتمام عملية الدفع. يمكنك المحاولة مرة أخرى.
        </p>

        <div className="space-y-1 text-sm">
          {code ? (
            <div>
              <span className="font-medium">الكود:</span>{" "}
              <span className="font-mono">{code}</span>
            </div>
          ) : null}

          {reason ? (
            <div className="text-gray-600">التفاصيل: {reason}</div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/checkout")}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            المحاولة مرة أخرى
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            الرجوع للمتجر
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          لو ظهر خصم عندك، التسوية بتتم تلقائياً من البنك/Paymob خلال فترة قصيرة.
        </p>
      </div>
    </div>
  );
}
