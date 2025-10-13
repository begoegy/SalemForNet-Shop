// src/lib/paymob.ts
import crypto from "crypto";

const BASE = "https://accept.paymob.com/api";

type BillingData = {
  apartment?: string;
  email: string;
  floor?: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  street?: string;
  building?: string;
  shipping_method?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  state?: string;
};

export async function paymobAuth(): Promise<string> {
  const apiKey = process.env.PAYMOB_API_KEY!;
  const res = await fetch(`${BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Paymob auth failed: ${res.status} - ${t}`);
  }
  const data = await res.json();
  return data.token as string;
}

export async function createPaymobOrder(authToken: string, amountCents: number, merchantOrderId: string) {
  const payload = {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: String(amountCents),
    currency: "EGP",
    merchant_order_id: merchantOrderId,
    items: [] as any[],
  };
  const res = await fetch(`${BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Create order failed: ${res.status} - ${t}`);
  }
  return res.json();
}

export async function createPaymentKey(authToken: string, amountCents: number, orderId: number, billing: BillingData) {
  const integrationId = Number(process.env.PAYMOB_INTEGRATION_ID!);
  const payload = {
    auth_token: authToken,
    amount_cents: String(amountCents),
    currency: "EGP",
    expiration: 3600,
    order_id: String(orderId),
    billing_data: {
      apartment: billing.apartment ?? "NA",
      email: billing.email,
      floor: billing.floor ?? "NA",
      first_name: billing.first_name,
      last_name: billing.last_name ?? "NA",
      phone_number: billing.phone_number,
      street: billing.street ?? "NA",
      building: billing.building ?? "NA",
      shipping_method: billing.shipping_method ?? "NA",
      postal_code: billing.postal_code ?? "NA",
      city: billing.city ?? "Giza",
      country: billing.country ?? "EG",
      state: billing.state ?? "Giza",
    },
    integration_id: integrationId,
    lock_order_when_paid: true,
  };
  const res = await fetch(`${BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Create payment key failed: ${res.status} - ${t}`);
  }
  return res.json();
}

export function paymentIframeUrl(paymentToken: string) {
  const iframeId = process.env.PAYMOB_IFRAME_ID!;
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
}

// HMAC Verify (Webhook & Return URL)
export function verifyHmac(hmacSecret: string, orderedKeyValues: string[], givenHmac: string): boolean {
  const message = orderedKeyValues.join("");
  const h = crypto.createHmac("sha512", hmacSecret).update(message).digest("hex");
  return h === givenHmac;
}
