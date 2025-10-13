"use client";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import data from "@/data/products.json";
import { egp } from "@/utils/currency";
import Link from "next/link";
import { firebaseEnabled, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PaymobPayButton from "@/components/PaymobPayButton";
type Row = { id: string; qty: number; p: any };
function makeLocalOrderRef() {
  return `SFN-${Date.now()}`;
}
export default function CheckoutPageClient() {
  const { items } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
const products = (data as any[]) ?? [];
  const rows: Row[] = items
    .map((i) => ({ id: i.id, qty: i.qty, p: products.find((x) => x.id === i.id) }))
    .filter((r) => r.p);

  const total = rows.reduce((sum, r) => sum + (Number(r.p?.price_egp ?? 0) * r.qty), 0);

  const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");
  const [orderRef, setOrderRef] = useState<string>("");

  // بيتحدد أثناء الـ build — اتأكد في Vercel إن NEXT_PUBLIC_PAYMENT_PROVIDER=paymob
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "mock";

  async function submit() {
    try {
      if (loading) return;
      if (!user) {
        alert("سجل الدخول أولا لإتمام الطلب.");
        router.push("/account");
        return;
      }
      if (rows.length === 0) {
        alert("السلة فارغة.");
        return;
      }

      if (firebaseEnabled) {
        try {
          const payload = {
            uid: user.uid,
            email: user.email ?? "",
            items: rows.map((r) => ({ id: r.id, qty: r.qty, price_egp: r.p?.price_egp ?? 0 })),
            total_egp: total,
            provider,
            createdAt: serverTimestamp(),
            status: "pending",
          };
          const ref = await addDoc(collection(db, "orders"), payload);
          setOrderRef(ref.id);
          setStatus("success");
        } catch (err) {
          console.error("Create order failed (firestore):", err);
          const localRef = makeLocalOrderRef();
          setOrderRef(localRef);
          setStatus("success");
        }
      } else {
        const localRef = makeLocalOrderRef();
        setOrderRef(localRef);
        setStatus("success");
      }
    } catch (e) {
      console.error("Create order failed:", e);
      setStatus("fail");
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card p-4">
        <h1 className="text-xl font-bold mb-3">إتمام الطلب</h1>

        {rows.length === 0 ? (
          <div className="text-sm text-neutral-600">
            السلة فارغة — <Link href="/catalog" className="underline">اذهب للكتالوج</Link>
          </div>
        ) : (
          <>
            {/* قائمة العناصر */}
            <ul className="space-y-2 mb-3">
              {rows.map((r) => (
                <li key={r.id} className="flex justify-between">
                  <span>
                    {r.p.title} × {r.qty}
                  </span>
                  <span>{egp((r.p.price_egp ?? 0) * r.qty)}</span>
                </li>
              ))}
            </ul>

            {/* الإجمالي */}
            <div className="mt-3 border-t pt-3 font-semibold">الإجمالي: {egp(total)}</div>

            {/* أزرار الإجراء */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={submit}
                disabled={loading}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
              >
                {loading ? "جار التحقق..." : "تأكيد الطلب"}
              </button>
              <Link href="/cart" className="px-4 py-2 rounded border">
                الرجوع للسلة
              </Link>
            </div>

            {/* إشعارات الحالة */}
            <div className="mt-2">
              {status === "success" && (
                <span className="text-green-700 text-sm">
                  تم إنشاء الطلب بنجاح {orderRef ? `(رقم: ${orderRef})` : ""}.
                </span>
              )}
              {status === "fail" && (
                <span className="text-red-600 text-sm">حدث خطأ أثناء إنشاء الطلب.</span>
              )}
            </div>

            {/* زر الدفع أونلاين - داخل JSX (مكان صحيح) */}
            {provider === "paymob" && total > 0 && user && (
              <div className="mt-4">
                <PaymobPayButton
                  label="دفع أونلاين"
                  amount={total}
                  email={user.email ?? "customer@example.com"}
                  phone={"01000000000"}
                  firstName={(user.displayName?.split(" ")?.[0] ?? "Customer")}
                  lastName=""
                  merchantOrderId={orderRef && orderRef.length ? orderRef : makeLocalOrderRef()}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
