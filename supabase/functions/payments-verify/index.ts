import { serve, ok, error, preflight, createSupabaseAdminClient, getEnvOrThrow, requireInternalSecret, hmacSHA256Hex } from "../_shared/mod.ts";
import { z } from "https://esm.sh/zod@3.22.4";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

serve(async (request: Request) => {
  const pre = preflight(request);
  if (pre) return pre;

  const origin = request.headers.get("Origin");
  if (request.method !== "POST") return error(origin, 405, "method_not_allowed", "Use POST");

  // Strictly require internal secret for server-only verification
  if (!requireInternalSecret(request)) return error(origin, 401, "unauthorized", "Missing or invalid internal secret");

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch (e) {
    return error(origin, 400, "invalid_body", (e as Error).message);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed;

  const secret = getEnvOrThrow("RAZORPAY_KEY_SECRET");
  const expected = await hmacSHA256Hex(secret, `${razorpay_order_id}|${razorpay_payment_id}`);
  if (expected !== razorpay_signature) {
    // Best effort mark failed
    const admin = createSupabaseAdminClient();
    const order = await admin.from("orders").select("id").eq("razorpay_order_id", razorpay_order_id).maybeSingle();
    if (order.data?.id) await admin.from("orders").update({ status: "failed" }).eq("id", order.data.id);
    return error(origin, 400, "invalid_signature", "Signature verification failed");
  }

  const admin = createSupabaseAdminClient();
  // Find corresponding order by provider id (also fetch user_id so we can denormalize to payments)
  const orderRes = await admin
    .from("orders")
    .select("id, amount, currency, user_id")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (orderRes.error) {
    console.error("orders.select error", orderRes.error);
    return error(origin, 404, "order_not_found", "Order not found");
  }

  const orderId = orderRes.data.id as string;

  // Upsert payment and mark order paid (final truth still via webhook)
  // Prefer to include user_id if the column exists (compatible with both schemas)
  let upsertPayment = await admin
    .from("payments")
    .upsert({
      order_id: orderId,
      // @ts-ignore - optional column depending on schema
      user_id: (orderRes.data as any).user_id ?? null,
      razorpay_payment_id,
      status: "captured",
      amount: orderRes.data.amount,
      method: null,
    } as any, { onConflict: "razorpay_payment_id" })
    .select("id")
    .maybeSingle();

  // If schema doesn't have user_id, retry without it
  if (upsertPayment.error && /column\s+user_id|user_id\s+does not exist|42703/i.test((upsertPayment.error as any)?.message || '')) {
    upsertPayment = await admin
      .from("payments")
      .upsert({
        order_id: orderId,
        razorpay_payment_id,
        status: "captured",
        amount: orderRes.data.amount,
        method: null,
      }, { onConflict: "razorpay_payment_id" })
      .select("id")
      .maybeSingle();
  }

  if (upsertPayment.error) {
    console.error("payments.upsert error", upsertPayment.error);
    return error(origin, 500, "db_upsert_failed", "Could not record payment");
  }

  const updOrder = await admin.from("orders").update({ status: "paid" }).eq("id", orderId);
  if (updOrder.error) console.error("orders.update status error", updOrder.error);

  return ok({ status: "verified", orderId, razorpay_payment_id }, origin);
});




