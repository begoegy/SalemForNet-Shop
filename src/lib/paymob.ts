// src/lib/paymob.ts
import crypto from "crypto";

const BASE = "https://accept.paymob.com/api";

export type BillingData = {
  email: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  city?: string;
  country?: string;
  state?: string;
  shipping_method?: string;
};

/** Read env safely (throw descriptive errors in server env only) */
function needEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

/** Determine integration id: prefer PAYMOB_CARD_MIGS_INTEGRATION_ID if present */
function resolveIntegrationId(): string {
  return process.env.PAYMOB_CARD_MIGS_INTEGRATION_ID
    || process.env.PAYMOB_INTEGRATION_ID
    || "";
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
  return res.json() as Promise<{ token: string }>;
}

export async function createPaymobOrder(auth: { token: string }, amountCents: number, merchantOrderId?: string) {
  const res = await fetch(`${BASE}/ecommerce/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${auth.token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      amount_cents: amountCents,
      currency: "EGP",
      delivery_needed: false,
      merchant_order_id: merchantOrderId || `SFN-${Date.now()}`,
      items: [],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create order failed: ${res.status} ${txt}`);
  }
  return res.json() as Promise<{ id: number }>;
}

export async function createPaymentKey(
  auth: { token: string },
  amountCents: number,
  orderId: number,
  billing: BillingData
) {
  const integrationId = resolveIntegrationId();
  if (!integrationId) throw new Error("Missing PAYMOB_CARD_MIGS_INTEGRATION_ID / PAYMOB_INTEGRATION_ID");

  // Normalize minimal billing fields to satisfy Paymob
  const b: BillingData = {
    email: billing.email,
    first_name: billing.first_name,
    last_name: billing.last_name ?? "",
    phone_number: billing.phone_number,
    apartment: billing.apartment ?? "NA",
    floor: billing.floor ?? "NA",
    street: billing.street ?? "NA",
    building: billing.building ?? "NA",
    city: billing.city ?? "Giza",
    country: billing.country ?? "EG",
    state: billing.state ?? "Giza",
    shipping_method: billing.shipping_method ?? "UNK",
  };

  const res = await fetch(`${BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${auth.token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      amount_cents: amountCents,
      currency: "EGP",
      order_id: orderId,
      billing_data: b,
      integration_id: Number(integrationId),
      lock_order_when_paid: true,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Create payment key failed: ${res.status} ${txt}`);
  }
  return res.json() as Promise<{ token: string }>;
}

export function paymentIframeUrl(paymentToken: string) {
  const iframeId = needEnv("PAYMOB_IFRAME_ID");
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
}

/**
 * Verify HMAC using Paymob docs ordering.
 * @param hmacSecret PAYMOB_HMAC_SECRET
 * @param orderedKeyValues array of *strings* in exact Paymob order
 * @param givenHmac hex lowercase string from Paymob
 */
export function verifyHmac(hmacSecret: string, orderedKeyValues: string[], givenHmac: string): boolean {
  const message = orderedKeyValues.join("");
  const h = crypto.createHmac("sha512", hmacSecret).update(message).digest("hex");
  return h === givenHmac;
}
