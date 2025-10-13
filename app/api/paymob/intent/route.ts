import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "https://accept.paymob.com/api";

type BillingData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  city?: string;
  country?: string;
  state?: string;
};

export async function POST(req: NextRequest) {
  try {
    const {
      amount,           // رقم بالجنيه
      currency = "EGP",
      email = "",
      phone = "",
      firstName = "Customer",
      lastName = "",
      merchantOrderId = ""
    } = await req.json();

    const API_KEY = process.env.PAYMOB_API_KEY!;
    const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID!;
    const IFRAME_ID = process.env.PAYMOB_IFRAME_ID!;
    if (!API_KEY || !INTEGRATION_ID || !IFRAME_ID) {
      return NextResponse.json({ error: "Missing Paymob env: API_KEY/INTEGRATION_ID/IFRAME_ID" }, { status: 500 });
    }

    const amount_cents = Math.round(Number(amount) * 100);
    if (!amount_cents || amount_cents <= 0) {
      return NextResponse.json({ error: "amount must be > 0" }, { status: 400 });
    }

    // 1) auth
    const authRes = await fetch(`${BASE}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: API_KEY })
    });
    const authData = await authRes.json().catch(() => ({}));
    if (!authRes.ok || !authData?.token) {
      return NextResponse.json({ error: "auth_failed", details: authData }, { status: 400 });
    }
    const token = authData.token as string;

    // 2) order
    const orderRes = await fetch(`${BASE}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents,
        currency,
        merchant_order_id: merchantOrderId || undefined,
        items: []
      })
    });
    const orderData = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok || !orderData?.id) {
      return NextResponse.json({ error: "order_failed", details: orderData }, { status: 400 });
    }
    const orderId = orderData.id;

    // 3) payment key
    const billing_data: BillingData = {
      first_name: firstName || "Customer",
      last_name: lastName || "",
      email: email || "customer@example.com",
      phone_number: phone || "01000000000",
      apartment: "n/a",
      floor: "n/a",
      street: "n/a",
      building: "n/a",
      city: "Cairo",
      country: "EG",
      state: "n/a",
    };

    const payKeyRes = await fetch(`${BASE}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents,
        expiration: 3600,
        order_id: orderId,
        billing_data,
        currency,
        integration_id: Number(INTEGRATION_ID)
      })
    });
    const payKeyData = await payKeyRes.json().catch(() => ({}));
    if (!payKeyRes.ok || !payKeyData?.token) {
      return NextResponse.json({ error: "payment_key_failed", details: payKeyData }, { status: 400 });
    }
    const paymentToken = payKeyData.token as string;

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${encodeURIComponent(paymentToken)}`;
    return NextResponse.json({ ok: true, iframeUrl, orderId });
  } catch (e: any) {
    console.error("[paymob/intent] error:", e?.message || e);
    return NextResponse.json({ error: "paymob_intent_failed", details: e?.message || "unknown" }, { status: 500 });
  }
}
