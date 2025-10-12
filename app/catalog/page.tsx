export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import CatalogClient from "./CatalogClient";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="card">...جارِ التحميل</div>}>
      <CatalogClient />
    </Suspense>
  );
}
