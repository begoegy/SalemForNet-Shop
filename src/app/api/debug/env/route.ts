// src/app/api/debug/env/route.ts  (App Router داخل src/)
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
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
  return NextResponse.json({ present });
}
