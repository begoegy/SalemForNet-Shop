export const dynamic = "force-dynamic";

import { Suspense } from "react";
import FailedClient from "./render";

export default function Page() {
  return (
    <Suspense>
      <FailedClient />
    </Suspense>
  );
}
