// app/orders/page.tsx
import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="card">جارٍ تحميل تفاصيل الطلب…</div>}>
      <OrdersClient />
    </Suspense>
  );
}
