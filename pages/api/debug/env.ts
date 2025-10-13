// pages/api/debug/env.ts  (Pages Router fallback)
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const keys = [
    "PAYMOB_API_KEY",
    "PAYMOB_INTEGRATION_ID",
    "PAYMOB_IFRAME_ID",
    "PAYMOB_HMAC_SECRET",
    "NEXT_PUBLIC_PAYMENT_PROVIDER",
    "APP_BASE_URL"
  ];
  const present = Object.fromEntries(
    keys.map(k => [k, !!process.env[k] && String(process.env[k]).trim().length > 0])
  );
  res.status(200).json({ present });
}
