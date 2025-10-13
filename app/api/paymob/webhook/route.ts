// app/api/paymob/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyHmac } from "@/lib/paymob";
import { getDbOrNull } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// ترتيب الحقول حسب Paymob لاحتساب HMAC
function buildOrderedForHmac(obj: any) {
  const tx = obj.obj ?? obj; // بعض الإصدارات ترسل داخل obj
  // لو return_url: fields مختلفة قليلًا — هنا نتعامل مع webhook الرسمي للـ transaction
  const orderId = tx?.order?.id ?? tx?.order_id;
  const source = tx?.source_data ?? {};
  const ordered = [
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
    String(orderId ?? ""),
    String(tx.owner ?? ""),
    String(tx.pending ?? ""),
    String(source.pan ?? ""),
    String(source.sub_type ?? ""),
    String(source.type ?? ""),
    String(tx.success ?? ""),
  ];
  return ordered;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const givenHmac = body?.hmac || body?.obj?.hmac;
  const secret = process.env.PAYMOB_HMAC_SECRET!;

  try {
    const ordered = buildOrderedForHmac(body);
    const ok = verifyHmac(secret, ordered, givenHmac);
    if (!ok) return NextResponse.json({ ok: false, reason: "HMAC mismatch" }, { status: 401 });

    const success = Boolean(body?.obj?.success ?? body?.success);
    const merchantOrderId = body?.obj?.merchant_order_id ?? body?.merchant_order_id;

    // ✅ تحديث حالة الطلب في Firestore (اختياري)
    try {
      const db = getDbOrNull();
      if (db && merchantOrderId) {
        await db.collection("orders").doc(String(merchantOrderId)).set(
          {
            payment: {
              provider: "paymob",
              status: success ? "paid" : "failed",
              paymobOrderId: body?.obj?.order?.id ?? null,
              transactionId: body?.obj?.id ?? null,
              updatedAt: new Date(),
            },
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
