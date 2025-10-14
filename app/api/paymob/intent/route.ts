// app/api/paymob/intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { paymobAuth, createPaymobOrder, createPaymentKey, paymentIframeUrl } from "@/lib/paymob";

export const dynamic = "force-dynamic";

function isTest() {
  return (process.env.PAYMOB_MODE || "").toLowerCase() === "test";
}

function normalizeAmount(amount: any): number {
  const n = Number(amount);
  if (Number.isFinite(n) && n > 0) return Math.round(n * 100); // to cents
  if (isTest()) return 10 * 100; // fallback in test
  return 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { amount, email, phone, firstName, lastName, merchantOrderId } = body || {};

    const amountCents = normalizeAmount(amount);
    if (!amountCents) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // Provide safe defaults in TEST; and ensure lastName never blank for Paymob
    if (isTest()) {
      email = email || "customer@example.com";
      phone = phone || "01000000000";
      firstName = firstName || "Customer";
    }
    lastName = (lastName && String(lastName).trim()) || "Customer"; // <-- IMPORTANT

    if (!email || !phone || !firstName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Auth
    const auth = await paymobAuth();

    // Order + Key
    const order = await createPaymobOrder(auth, amountCents, merchantOrderId);
    const payKey = await createPaymentKey(auth, amountCents, order.id, {
      email,
      phone_number: phone,
      first_name: firstName,
      last_name: lastName,
    });

    const iframeUrl = paymentIframeUrl(payKey.token);
    return NextResponse.json({ iframeUrl, orderId: order.id, paymentToken: payKey.token });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}
