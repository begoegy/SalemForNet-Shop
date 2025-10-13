import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount ?? 0);
    const name = String(body?.name ?? "");
    const phone = String(body?.phone ?? "");
    const merchantOrderId = String(body?.merchantOrderId ?? "");

    if (!amount || amount <= 0) {
      return NextResponse.json({ ok: false, reason: "amount must be > 0" }, { status: 400 });
    }
    if (!name || !phone) {
      return NextResponse.json({ ok: false, reason: "missing name/phone" }, { status: 400 });
    }

    // محاكاة نجاح الدفع
    return NextResponse.json({
      ok: true,
      order: {
        id: merchantOrderId || `MOCK-${Date.now()}`,
        amount,
        status: "paid",
        method: "mock",
      },
      returnUrl: `/pay/return?success=true&order=${encodeURIComponent(
        merchantOrderId || `MOCK-${Date.now()}`
      )}`,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: e?.message ?? "mock failed" }, { status: 500 });
  }
}
