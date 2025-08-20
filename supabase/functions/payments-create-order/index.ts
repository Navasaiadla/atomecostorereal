import { serve, ok, error, preflight, createSupabaseAdminClient, getEnvOrThrow, requireInternalSecret, getSupabaseUserFromRequest } from "../_shared/mod.ts";
import { z } from "https://esm.sh/zod@3.22.4";

const bodySchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default(Deno.env.get("CURRENCY") ?? "INR"),
  idempotency_key: z.string().uuid(),
  // Optional contact/shipping fields
  name: z.string().max(200).optional(),
  first_name: z.string().max(120).optional(),
  last_name: z.string().max(120).optional(),
  product_id: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  pincode: z.string().max(20).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  metadata: z.record(z.any()).optional(),
});

serve(async (request: Request) => {
  const pre = preflight(request);
  if (pre) return pre;

  const origin = request.headers.get("Origin");
  if (request.method !== "POST") return error(origin, 405, "method_not_allowed", "Use POST");

  // Auth: either internal secret or authenticated user
  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (e) {
    console.error("createSupabaseAdminClient error", e);
    return error(origin, 500, "missing_env", (e as Error)?.message || "Missing required environment variables");
  }
  const internalSecretOk = !!requireInternalSecret(request);
  const user = await getSupabaseUserFromRequest(admin, request);
  if (!internalSecretOk && !user) return error(origin, 401, "unauthorized", "Missing or invalid credentials");

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch (e) {
    return error(origin, 400, "invalid_body", (e as Error).message);
  }

  const { amount, currency, idempotency_key, metadata, name, first_name, last_name, product_id, address, city, state, pincode, email, phone } = parsed;
  const derivedName = (name && name.trim().length > 0)
    ? name
    : [first_name, last_name].filter((s) => !!(s && s.trim().length > 0)).join(" ");

  // Resolve seller_id from product_id if available (used to populate orders.seller_id / orders.sellers_id and metadata)
  let sellerId: string | null = null;
  try {
    if (product_id) {
      const prod = await admin.from('products').select('seller_id').eq('id', product_id).single();
      if (!prod.error) sellerId = (prod.data as any)?.seller_id ?? null;
    }
  } catch {}

  // Idempotency: if an order exists for the same key, reuse it.
  // If it already has a provider order id, return immediately.
  // If not, continue below to create the provider order for this existing row.
  let localOrderId: string | null = null;
  const existing = await admin
    .from("orders")
    .select("id, status, amount, currency, razorpay_order_id")
    .eq("idempotency_key", idempotency_key)
    .maybeSingle();

  if (existing.data) {
    // Best-effort: persist seller id on the order row if we can
    try {
      if (sellerId) await admin.from('orders').update({ seller_id: sellerId as any }).eq('id', existing.data.id as string);
    } catch (_) {}
    try {
      if (sellerId) await admin.from('orders').update({ sellers_id: sellerId as any }).eq('id', existing.data.id as string);
    } catch (_) {}
    if (existing.data.razorpay_order_id) {
      return ok({
        orderId: existing.data.id,
        razorpayOrderId: existing.data.razorpay_order_id,
        amount: existing.data.amount,
        currency: existing.data.currency,
        razorpayKeyId: getEnvOrThrow("RAZORPAY_KEY_ID"),
        status: existing.data.status,
        idempotent: true,
      }, origin);
    }
    // No provider order yet: reuse this row and proceed to create provider order
    localOrderId = existing.data.id as string;
    // Ensure status is pending
    await admin.from("orders").update({ status: "pending" }).eq("id", localOrderId);
  }

  if (!localOrderId) {
    // 1) Insert draft order (status=pending)

    let insertRes = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        status: "pending",
        amount,
        currency,
        idempotency_key,
        // Best effort persist seller id into a dedicated column for reporting if schema provides it
        seller_id: sellerId as any,
        sellers_id: sellerId as any,
        metadata: {
          ...(metadata ?? {}),
          seller_id: sellerId,
          shipping: {
            name: derivedName,
            first_name: first_name ?? null,
            last_name: last_name ?? null,
            address,
            city,
            state,
            pincode,
            email,
            phone,
          },
        },
        // Only set address at top-level if schema has NOT NULL constraint
        address: address as unknown as never,
      })
      .select("id")
      .single();

    // If NOT NULL violation mentions total_amount, retry including total_amount: amount
    if (insertRes.error) {
      const errMessage = (insertRes.error as any)?.message ?? "";
      const errCode = (insertRes.error as any)?.code ?? "";
      const mentionsTotalAmount = /total_amount/i.test(errMessage);
      const isNotNullViolation = errCode === "23502" || /not[- ]null/i.test(errMessage);
      if (mentionsTotalAmount && isNotNullViolation) {
        insertRes = await admin
          .from("orders")
          .insert({
            user_id: user?.id ?? null,
            status: "pending",
            amount,
            currency,
            idempotency_key,
            seller_id: sellerId as any,
            sellers_id: sellerId as any,
            metadata: {
              ...(metadata ?? {}),
              seller_id: sellerId,
              shipping: {
                name: derivedName,
                first_name: first_name ?? null,
                last_name: last_name ?? null,
                address,
                city,
                state,
                pincode,
                email,
                phone,
              },
            },
            // For custom schemas that require total_amount, mirror amount
            // This field is ignored by databases without such a column
            total_amount: amount as unknown as never,
            address: address as unknown as never,
          })
          .select("id")
          .single();
      }
    }

    if (insertRes.error) {
      // Handle unique violation race condition: select and reuse the existing row
      const isUniqueViolation = (insertRes.error as any)?.code === "23505" ||
        /duplicate key value/i.test((insertRes.error as any)?.message ?? "");
      if (isUniqueViolation) {
        const fallback = await admin
          .from("orders")
          .select("id, status, amount, currency, razorpay_order_id")
          .eq("idempotency_key", idempotency_key)
          .maybeSingle();
        if (fallback.data) {
          if (fallback.data.razorpay_order_id) {
            return ok({
              orderId: fallback.data.id,
              razorpayOrderId: fallback.data.razorpay_order_id,
              amount: fallback.data.amount,
              currency: fallback.data.currency,
              razorpayKeyId: getEnvOrThrow("RAZORPAY_KEY_ID"),
              status: fallback.data.status,
              idempotent: true,
            }, origin);
          }
          localOrderId = fallback.data.id as string;
        }
      }

      if (!localOrderId) {
        console.error("orders.insert error", insertRes.error);
        const pgCode = (insertRes.error as any)?.code;
        if (pgCode === "42P01") {
          return error(origin, 500, "schema_missing", "Orders table is missing. Run scripts/create-orders-payments-webhooks.sql in Supabase.");
        }
        if (pgCode === "42501") {
          return error(origin, 500, "db_permission_denied", "Permission denied inserting into orders. Check SUPABASE_SERVICE_ROLE_KEY and RLS.");
        }
        return error(origin, 500, "db_insert_failed", (insertRes.error as any)?.message || "Could not create draft order");
      }
    } else {
      localOrderId = insertRes.data.id as string;
    }
  }

  // Best-effort: persist seller id on the order row (support either seller_id or sellers_id)
  try {
    if (sellerId && localOrderId) await admin.from('orders').update({ seller_id: sellerId as any }).eq('id', localOrderId);
  } catch (_) {}
  try {
    if (sellerId && localOrderId) await admin.from('orders').update({ sellers_id: sellerId as any }).eq('id', localOrderId);
  } catch (_) {}

  // 2) Create Razorpay order
  const keyId = getEnvOrThrow("RAZORPAY_KEY_ID");
  const keySecret = getEnvOrThrow("RAZORPAY_KEY_SECRET");
  const authToken = btoa(`${keyId}:${keySecret}`);

  const rpResp = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt: localOrderId,
      payment_capture: 1,
      notes: metadata ?? {},
    }),
  });

  if (!rpResp.ok) {
    const errText = await rpResp.text();
    console.error("razorpay.create_order error", errText);
    // Mark order failed
    await admin.from("orders").update({ status: "failed" }).eq("id", localOrderId);
    return error(origin, 502, "provider_error", "Failed to create provider order");
  }

  const rpData = await rpResp.json();
  const razorpayOrderId = rpData.id as string;

  // 3) Persist provider order id
  const upd = await admin
    .from("orders")
    .update({ razorpay_order_id: razorpayOrderId })
    .eq("id", localOrderId)
    .select("id, amount, currency")
    .single();

  if (upd.error) {
    console.error("orders.update error", upd.error);
    return error(origin, 500, "db_update_failed", "Could not persist provider order id");
  }

  return ok({
    orderId: localOrderId,
    razorpayOrderId,
    amount: upd.data.amount,
    currency: upd.data.currency,
    razorpayKeyId: keyId,
    idempotent: false,
  }, origin);
});




