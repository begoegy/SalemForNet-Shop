import { Suspense } from "react";
import CartPageClient from "./CartPageClient";

export const dynamic = "force-dynamic";

export default function PageWrapper() {
  return (
    <Suspense fallback={null}>
      <CartPageClient />
    </Suspense>
  );
}
