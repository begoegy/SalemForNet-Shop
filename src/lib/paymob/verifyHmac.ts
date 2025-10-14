import crypto from "crypto";
export function verifyHmac(params: URLSearchParams, secret: string) {
  const concat =
    (params.get("amount_cents") ?? "") +
    (params.get("created_at") ?? "") +
    (params.get("currency") ?? "") +
    (params.get("error_occured") ?? "") +
    (params.get("has_parent_transaction") ?? "") +
    (params.get("id") ?? "") +
    (params.get("integration_id") ?? "") +
    (params.get("is_3d_secure") ?? "") +
    (params.get("is_auth") ?? "") +
    (params.get("is_capture") ?? "") +
    (params.get("is_refunded") ?? "") +
    (params.get("is_standalone_payment") ?? "") +
    (params.get("is_voided") ?? "") +
    (params.get("order") ?? "") +
    (params.get("owner") ?? "") +
    (params.get("pending") ?? "") +
    (params.get("source_data.pan") ?? "") +
    (params.get("source_data.sub_type") ?? "") +
    (params.get("source_data.type") ?? "") +
    (params.get("success") ?? "");
  const computed = crypto.createHmac("sha512", secret).update(concat).digest("hex");
  return computed === (params.get("hmac") ?? "").toLowerCase();
}
