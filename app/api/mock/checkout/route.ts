import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // In real provider (Paymob/Fawry) we'd create an order & return redirect/payment URL.
  // Here we just simulate success with a generated order ref.
  const ok = Boolean(body?.name && body?.phone && body?.address);
  const orderRef = "SFN-" + Date.now();
  return NextResponse.json({ ok, orderRef });
}
