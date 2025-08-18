import { serve, ok, error, preflight, createSupabaseAdminClient, getEnvOrThrow, hmacSHA256Hex } from "../_shared/mod.ts";

// Webhook verification requires the raw body. We'll compute HMAC with RAZORPAY_WEBHOOK_SECRET

serve(async (request: Request) => {
  const pre = preflight(request);
  if (pre) return pre;

  const origin = request.headers.get("Origin");
  if (request.method !== "POST") return error(origin, 405, "method_not_allowed", "Use POST");

  const signatureHeader = request.headers.get("X-Razorpay-Signature");
  if (!signatureHeader) return error(origin, 401, "missing_signature", "Missing X-Razorpay-Signature");

  const raw = await request.text();
  const secret = getEnvOrThrow("RAZORPAY_WEBHOOK_SECRET");
  const expected = await hmacSHA256Hex(secret, raw);
  if (expected !== signatureHeader) return error(origin, 401, "invalid_signature", "Invalid webhook signature");

  const admin = createSupabaseAdminClient();
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return error(origin, 400, "invalid_json", "Body is not valid JSON");
  }

  const eventId = payload?.id as string | undefined;
  const eventType = payload?.event as string | undefined;
  if (!eventId || !eventType) return error(origin, 400, "invalid_event", "Missing id or event type");

  // Idempotent insert into webhook_events
  const existing = await admin.from("webhook_events").select("id").eq("id", eventId).maybeSingle();
  if (existing.data) return ok({ status: "ok", idempotent: true }, origin);

  const payloadHash = await hmacSHA256Hex(secret, raw); // reuse as a payload fingerprint
  const insertEvent = await admin
    .from("webhook_events")
    .insert({ id: eventId, provider: "razorpay", type: eventType, payload_hash: payloadHash, status: "processed" })
    .select("id")
    .single();
  if (insertEvent.error) {
    console.error("webhook_events.insert error", insertEvent.error);
    return ok({ status: "accepted" }, origin); // Avoid retries storm
  }

  try {
    // Reconciliation
    if (eventType === "payment.authorized" || eventType === "payment.captured" || eventType === "payment.failed") {
      const payment = payload?.payload?.payment?.entity ?? {};
      const razorpay_payment_id = payment?.id as string | undefined;
      const status = payment?.status as string | undefined; // authorized, captured, failed
      const method = payment?.method ?? null; // card, upi, netbanking, wallet, emi, etc.
      const amount = payment?.amount ?? null;
      const razorpay_order_id = payment?.order_id as string | undefined;

      if (!razorpay_order_id || !razorpay_payment_id || !status) throw new Error("Missing payment fields");

      const orderRes = await admin.from("orders").select("id").eq("razorpay_order_id", razorpay_order_id).single();
      if (orderRes.error) throw new Error("Order not found for received payment");
      const orderId = orderRes.data.id as string;

      // Upsert payment row
      const upsert = await admin
        .from("payments")
        .upsert({
          order_id: orderId,
          razorpay_payment_id,
          status,
          amount,
          method,
        }, { onConflict: "razorpay_payment_id" });
      // Mirror method and status onto the order row for quick reporting if the schema supports it
      try {
        await admin.from('orders').update({ payment_method: method as any, payment_status: (status === 'captured' ? 'paid' : status) as any }).eq('id', orderId)
      } catch (_) {}
      if (upsert.error) throw upsert.error;

      // Update order status
      const desiredOrderStatus = status === "captured" ? "paid" : status === "failed" ? "failed" : "pending";
      const upd = await admin.from("orders").update({ status: desiredOrderStatus }).eq("id", orderId);
      if (upd.error) throw upd.error;
    }

    if (eventType === "refund.processed") {
      const refund = payload?.payload?.refund?.entity ?? {};
      const paymentId = refund?.payment_id as string | undefined;
      const amount = refund?.amount ?? null;
      if (paymentId) {
        await admin.from("payments").update({ status: "refunded" }).eq("razorpay_payment_id", paymentId);
      }
      // Order status update policy: set to refunded only for full refunds. Skipped here for brevity.
    }
  } catch (reconErr) {
    console.error("reconcile error", reconErr);
    await admin.from("webhook_events").update({ status: "error", error_message: String(reconErr) }).eq("id", eventId);
  }

  return ok({ status: "ok" }, origin);
});



