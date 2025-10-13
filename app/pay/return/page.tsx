"use client";

import { Suspense } from "react";
import ReturnPageClient from "./ReturnPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  // لازم نغلف أي استخدام لـ useSearchParams داخل Suspense
  return (
    <Suspense fallback={null}>
      <ReturnPageClient />
    </Suspense>
  );
}
