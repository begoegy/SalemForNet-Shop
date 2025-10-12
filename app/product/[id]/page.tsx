import { Suspense } from "react";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

export default function PageWrapper() {
  return (
    <Suspense fallback={null}>
      <ProductPageClient />
    </Suspense>
  );
}
