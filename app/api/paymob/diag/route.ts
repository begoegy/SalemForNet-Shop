// app/api/paymob/diag/route.ts
import { NextResponse } from "next/server";
import { paymobAuth } from "@/lib/paymob";

export const dynamic = "force-dynamic";

/**
 * GET /api/paymob/diag
 * - يرجّع 200 لو الـ API Key صالح
 * - يُظهر الـ mode والـ envs الضرورية الموجودة/الناقصة (بدون عرض القيم)
 */
export async function GET() {
  try {
    const token = await paymobAuth(); // لو فشلت هتثور exception
    const mode = process.env.PAYMOB_MODE?.toLowerCase() ?? "unspecified";
    const have = {
      PAYMOB_API_KEY: !!process.env.PAYMOB_API_KEY,
      PAYMOB_CARD_MIGS_INTEGRATION_ID: !!process.env.PAYMOB_CARD_MIGS_INTEGRATION_ID,
      PAYMOB_INTEGRATION_ID: !!process.env.PAYMOB_INTEGRATION_ID,
      PAYMOB_IFRAME_ID: !!process.env.PAYMOB_IFRAME_ID,
      PAYMOB_HMAC_SECRET: !!process.env.PAYMOB_HMAC_SECRET,
    };
    return NextResponse.json({ ok: true, mode, have });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "auth_failed" }, { status: 401 });
  }
}
