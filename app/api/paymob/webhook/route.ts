// app/api/paymob/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyHmac } from "@/lib/paymob";
import { getDbOrNull } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Order of keys per Paymob transaction HMAC docs
function buildOrderedForHmac(obj: any) {
  const tx = obj.obj ?? obj;
  const orderId = tx?.order?.id ?? tx?.order_id;
  const source = tx?.source_data ?? {};
  const arr: string[] = [
    String(tx.amount_cents ?? ""),
    String(tx.created_at ?? ""),
    String(tx.currency ?? ""),
    String(tx.error_occured ?? ""),
    String(tx.has_parent_transaction ?? ""),
    String(tx.id ?? ""),
    String(tx.integration_id ?? ""),
    String(tx.is_3d_secure ?? ""),
    String(tx.is_auth ?? ""),
    String(tx.is_capture ?? ""),
    String(tx.is_refunded ?? ""),
    String(tx.is_standalone_payment ?? ""),
    String(tx.is_voided ?? ""),
    String(tx.order?.id ?? orderId ?? ""),
    String(tx.owner ?? ""),
    String(tx.pending ?? ""),
    String(tx.source_data?.pan ?? source.pan ?? ""),
    String(tx.source_data?.sub_type ?? source.sub_type ?? ""),
    String(tx.source_data?.type ?? source.type ?? ""),
    String(tx.success ?? ""),
  ];
  return arr;
}

export async function POST(req: NextRequest) {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET || "";
    if (!hmacSecret) {
      return NextResponse.json({ ok: false, error: "Missing PAYMOB_HMAC_SECRET" }, { status: 500 });
    }

    const body = await req.json();
    const givenHmac = (body?.hmac || body?.obj?.hmac || "").toLowerCase();
    const ordered = buildOrderedForHmac(body);
    const ok = verifyHmac(hmacSecret, ordered, givenHmac);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "HMAC verification failed" }, { status: 400 });
    }

    // Update Firestore (best-effort)
    try {
      const db = await getDbOrNull();
      if (db) {
        const txId = String(body?.obj?.id ?? body?.id ?? "");
        const orderId = String(body?.obj?.order?.id ?? body?.order?.id ?? "");
        await db.collection("payments").doc(txId).set(
          {
            tx: body?.obj ?? body,
            orderId,
            ok: true,
            success: !!(body?.obj?.success ?? body?.success),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Firestore update skipped/failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "webhook failed" }, { status: 500 });
  }
}
