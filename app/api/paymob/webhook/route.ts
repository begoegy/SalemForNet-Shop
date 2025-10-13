import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import admin from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const db = admin.firestore();

function get(path: string, obj: any) {
  try {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) ?? "";
  } catch {
    return "";
  }
}

function buildConcatenatedString(obj: any) {
  const fields = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order.id",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success",
  ];
  return fields.map((f) => String(get(f, obj))).join("");
}

export async function POST(req: NextRequest) {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET!;
    if (!hmacSecret) return NextResponse.json({ ok: false, reason: "missing hmac secret" }, { status: 200 });

    const body = await req.json();
    const sentHmac = req.nextUrl.searchParams.get("hmac") || body?.hmac || "";
    const concatenated = buildConcatenatedString(body?.obj || body);

    const computed = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenated)
      .digest("hex");

    const valid = sentHmac?.toLowerCase() === computed?.toLowerCase();

    console.log("[webhook] valid:", valid, "order:", get("order.id", body?.obj || body), "tx:", get("id", body?.obj || body));

    if (valid) {
      const success = String(get("success", body?.obj || body)) === "true";
      const merchantOrderId = String(get("order.merchant_order_id", body?.obj || body) || "");

      if (merchantOrderId) {
        try {
          await db.collection("orders").doc(merchantOrderId).set(
            {
              status: success ? "paid" : "failed",
              payment: { method: "paymob", status: success ? "paid" : "failed", tx: get("id", body?.obj || body) },
              paymob: body?.obj || body,
              updated_at: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.error("[webhook] firestore update error:", e);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[paymob/webhook] error:", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
