import { Suspense } from "react";
import CatalogClient from "./CatalogClient";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogClient />
    </Suspense>
  );
}
