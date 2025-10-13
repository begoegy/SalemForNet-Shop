// app/api/paymob/intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { paymobAuth, createPaymobOrder, createPaymentKey, paymentIframeUrl } from "@/src/lib/paymob";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // body المتوقع ييجي من الشيك أوت
    const { amount, email, phone, firstName, lastName, merchantOrderId } = await req.json();

    if (!amount || !email || !phone || !firstName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const amountCents = Math.round(Number(amount) * 100);
    const auth = await paymobAuth();
    const order = await createPaymobOrder(auth, amountCents, merchantOrderId);
    const payKey = await createPaymentKey(auth, amountCents, order.id, {
      email,
      phone_number: phone,
      first_name: firstName,
      last_name: lastName ?? "",
    });

    const iframeUrl = paymentIframeUrl(payKey.token);
    return NextResponse.json({ iframeUrl, orderId: order.id, paymentToken: payKey.token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "failed" }, { status: 500 });
  }
}
