import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function computeHmac(query: URLSearchParams, secret: string) {
  const hmac = (query.get("hmac") || "").toLowerCase();
  const sorted = Array.from(query.entries())
    .filter(([k]) => k !== "hmac")
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([k,v]) => `${k}=${v}`)
    .join("&");
  const calc = crypto.createHmac("sha512", secret).update(sorted).digest("hex");
  return { ok: hmac && calc === hmac, provided: hmac, computed: calc };
}

function verdictFromParams(q: URLSearchParams) {
  const success = (q.get("success") || "").toLowerCase();
  const code = (q.get("txn_response_code") || q.get("response_code") || "").toUpperCase();

  // أكواد اعتبارها موافقة (بتختلف حسب الإندجريشن)
  const APPROVED_CODES = new Set(["APPROVED", "00", "10000"]);

  if (success === "true" && APPROVED_CODES.has(code)) return { verdict: "paid", reason: "approved" };
  if (success === "false") return { verdict: "failed", reason: "gateway_reported_false" };
  if (code && !APPROVED_CODES.has(code)) return { verdict: "failed", reason: `code_${code}` };
  return { verdict: "unknown", reason: "missing_or_incomplete_params" };
}

export async function GET(req: NextRequest) {
  const secret = process.env.PAYMOB_HMAC_SECRET || "";
  const q = req.nextUrl.searchParams;

  const h = computeHmac(q, secret);
  const v = verdictFromParams(q);

  // لو HMAC بايظ نعتبرها failed حتى لو success=true
  const finalVerdict = h.ok ? v.verdict : "failed";
  const finalReason  = h.ok ? v.reason  : "hmac_invalid";

  return NextResponse.json({
    ok: true,
    hmac_ok: h.ok,
    verdict: finalVerdict,     // "paid" | "failed" | "unknown"
    reason: finalReason,
    params: Object.fromEntries(q),
  });
}
