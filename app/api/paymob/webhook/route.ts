import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyWebhook(body: any, secret: string) {
  try {
    // Paymob بيحسب HMAC على ترتيب حقول معروف لTransaction obj
    const keys = [
      "amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id",
      "is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_voided","order","owner",
      "pending","source_data.pan","source_data.sub_type","source_data.type","success"
    ];
    const flat = (k: string) => k.includes(".") ? k.split(".").reduce((o,p)=>o?.[p], body) ?? "" : body?.[k] ?? "";
    const concat = keys.map(flat).join("");
    const computed = crypto.createHmac("sha512", secret).update(concat).digest("hex");
    return (body?.hmac ?? "").toLowerCase() === computed;
  } catch { return false; }
}

export async function POST(req: Request) {
  const secret = process.env.PAYMOB_HMAC_SECRET || "";
  const data = await req.json().catch(()=> ({}));
  const ok = secret && verifyWebhook(data?.obj ?? data, secret);

  // هنا احفظ الحالة في الـ DB حسب order/merchant_order_id لو عايز
  // ...

  return NextResponse.json({ ok, isSuccess: data?.obj?.success ?? data?.success ?? null, merchantOrderId: data?.obj?.order || data?.order || null });
}
