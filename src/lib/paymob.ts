// src/lib/paymob.ts
const BASE = "https://accept.paymob.com/api";

function needEnv(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
}

export async function paymobAuth() {
  const apiKey = needEnv("PAYMOB_API_KEY");
  const res = await fetch(`${BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Paymob auth failed: ${res.status} ${txt}`);
  }
  return (await res.json()) as { token: string };
}

export async function createPaymobOrder(auth: { token: string }, amountCents: number, merchantOrderId?: string) {
  const res = await fetch(`${BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      auth_token: auth.token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId ?? undefined,
      items: [],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create order failed: ${res.status} ${txt}`);
  }
  return (await res.json()) as { id: number };
}

type BillingData = {
  email: string;
  phone_number: string;
  first_name: string;
  last_name?: string;
};

export async function createPaymentKey(auth: { token: string }, amountCents: number, orderId: number, billing: BillingData) {
  const integrationId = process.env.PAYMOB_CARD_MIGS_INTEGRATION_ID || process.env.PAYMOB_INTEGRATION_ID;
  if (!integrationId) throw new Error("No Integration ID configured");
  const iframeId = needEnv("PAYMOB_IFRAME_ID");

  const res = await fetch(`${BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      auth_token: auth.token,
      amount_cents: amountCents,
      currency: "EGP",
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        email: billing.email,
        phone_number: billing.phone_number,
        first_name: billing.first_name,
        last_name: billing.last_name ?? "",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Giza",
        country: "EG",
        state: "Giza",
      },
      integration_id: Number(integrationId),
      lock_order_when_paid: true,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create payment key failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return { token: data.token as string, iframeId };
}

export function paymentIframeUrl(paymentToken: string) {
  const iframeId = needEnv("PAYMOB_IFRAME_ID");
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
}

export type { BillingData };
