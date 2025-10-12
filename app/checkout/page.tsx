import { Suspense } from "react";
import CheckoutPageClient from "./CheckoutPageClient";

export const dynamic = "force-dynamic";

export default function PageWrapper() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageClient />
    </Suspense>
  );
}
