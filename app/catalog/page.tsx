import { Suspense } from "react";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">جارٍ تحميل المنتجات...</div>}>
      <CatalogClient />
    </Suspense>
  );
}
