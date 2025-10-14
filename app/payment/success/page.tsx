export const dynamic = "force-dynamic";

import PaymentSuccessClient from "./PaymentSuccessClient";

export default function Page() {
  // Server Component بسيط بيعرض Client Component
  return <PaymentSuccessClient />;
}
