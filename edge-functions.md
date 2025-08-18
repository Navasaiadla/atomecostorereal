### Supabase Edge Functions for Secure Payments (Razorpay) — Implementation Guide

Use this checklist to integrate secure payments using Supabase Edge Functions as the server-only surface. This document is code-free and lists exactly what to do.

### Overview
- **Goal**: Move all payment secrets, verification, and webhooks into Edge Functions, keeping Next.js client/server clean and secure.
- **Functions**: `payments-create-order`, `payments-verify`, `payments-webhook` (optional: `payments-refund`).
- **Source of truth**: Webhook events reconcile final state; client success UI is not authoritative.

### Prerequisites
1. Supabase project created; note your project ref.
2. Supabase CLI installed and logged in to the correct org/project.
3. Razorpay test account (keys + webhook secret) ready.
4. Your Next.js app can call server endpoints (server actions) and render Razorpay Checkout on the client.

### Naming and Endpoints
- Function names (edge):
  - payments-create-order → Create provider order and draft DB order
  - payments-verify → Verify post-checkout HMAC and mark paid
  - payments-webhook → Receive provider events and reconcile state
  - payments-refund (optional) → Create/manage refunds
- Decommission `app/api/razorpay-webhook` in Next.js. Use Supabase `payments-webhook` as the single external webhook URL.

### Secrets to set (Supabase → Edge Functions)
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (only inside Edge Functions)
- APP_BASE_URL (for links/redirects)
- EDGE_FUNCTIONS_SHARED_SECRET (for internal authentication between your app and functions)
- CURRENCY (e.g., INR)
- ENV (development or production)

Store these as Edge Functions secrets in Supabase. Do not expose them in your Next.js client or public env.

### Data Model (DB Tables)
Create three tables. Use these columns and constraints. Do not expose write access to clients; use RLS.
- orders
  - id (uuid, PK)
  - user_id (uuid, FK to auth.users)
  - status (text: draft, pending, paid, failed, refunded, canceled)
  - amount (integer, minor units)
  - currency (text)
  - razorpay_order_id (text, unique nullable until created)
  - idempotency_key (text, unique)
  - created_at, updated_at (timestamps)
- payments
  - id (uuid, PK)
  - order_id (uuid, FK orders.id)
  - razorpay_payment_id (text, unique)
  - status (text: authorized, captured, refunded, failed)
  - amount (integer)
  - method (text)
  - created_at, updated_at (timestamps)
- webhook_events
  - id (text, PK; provider event id)
  - provider (text: razorpay)
  - type (text)
  - payload_hash (text)
  - processed_at (timestamp nullable)
  - status (text: processed, skipped, error)
  - error_message (text nullable)

Constraints to add:
- Unique: orders.idempotency_key
- Unique: orders.razorpay_order_id (when not null)
- Unique: payments.razorpay_payment_id

### Row-Level Security (RLS) Policy Outline
- orders
  - SELECT: user_id = auth.uid()
  - INSERT/UPDATE/DELETE: only service role
- payments
  - SELECT: join through orders where orders.user_id = auth.uid()
  - INSERT/UPDATE/DELETE: only service role
- webhook_events
  - No public SELECT/INSERT/UPDATE/DELETE
  - Only service role can read/write

### Function Specifications (what each must do)

#### payments-create-order (server-only)
- Purpose: Create a draft order in DB and a Razorpay order; return data for client checkout.
- Auth: Require either a valid Supabase JWT (user) or your EDGE_FUNCTIONS_SHARED_SECRET. Do not accept anonymous.
- Inputs: amount, currency (default from secret), idempotency_key (client-generated UUID), metadata (optional).
- Steps:
  1. Validate request schema and authenticated user.
  2. If idempotency_key exists in orders, return existing order.
  3. Insert draft order with status "pending" and idempotency_key.
  4. Call Razorpay Create Order with amount/currency/receipt (use order id as receipt).
  5. Persist razorpay_order_id into the order row.
  6. Return order id, amount, currency, razorpay_order_id, and provider public key for Checkout.
- Errors: Invalid auth, invalid amount, provider failure. Return clear error messages.

#### payments-verify (server-only)
- Purpose: Validate HMAC from Razorpay Checkout return and update DB to "paid".
- Auth: Require server call (server action) plus EDGE_FUNCTIONS_SHARED_SECRET.
- Inputs: razorpay_order_id, razorpay_payment_id, razorpay_signature.
- Steps:
  1. Validate request schema.
  2. Compute expected HMAC with RAZORPAY_KEY_SECRET over order_id|payment_id and compare with razorpay_signature.
  3. On success, upsert payments row, set status captured or authorized (based on flow), and set order status paid.
  4. On failure, mark order failed and return error.
- Notes: Final reconciliation still happens via webhook.

#### payments-webhook (public endpoint, HMAC-verified)
- Purpose: Receive and reconcile provider events.
- Auth: Verify `X-Razorpay-Signature` using RAZORPAY_WEBHOOK_SECRET against raw request body. Optionally also require EDGE_FUNCTIONS_SHARED_SECRET.
- Inputs: raw event payload from Razorpay.
- Steps:
  1. Verify signature; if invalid, return 401.
  2. Read provider event id; if exists in webhook_events, return 200 (idempotent).
  3. Persist event row with payload hash; return 202 or 200 quickly.
  4. Reconcile: map event types to DB transitions:
     - payment.authorized → payments: authorized; orders: pending or paid (if auto-capture later)
     - payment.captured → payments: captured; orders: paid
     - payment.failed → payments: failed; orders: failed
     - refund.processed → payments: refunded; orders: refunded (if full)
  5. Update webhook_events.status processed/failed; store error_message on failure.
- Response: Always 2xx after safe persistence to avoid retries loops for transient failures.

#### payments-refund (optional)
- Purpose: Trigger and record refunds.
- Auth: Only privileged server callers; require EDGE_FUNCTIONS_SHARED_SECRET.
- Inputs: payment_id, amount (optional for partial), reason.
- Steps: Validate, call Razorpay Refund API, persist refund result, update payments/orders accordingly.

### Local Setup (one-time)
1. From your project root, initialize functions if not already: use Supabase CLI to init and link to your project.
2. Create function directories for the three functions (names above). Each function should have a handler and config files created by the CLI scaffolding.
3. Set secrets for all functions at once using the Supabase CLI secrets command. Include all keys listed in "Secrets to set".
4. Start local function dev server. Keep it running while developing.

### Webhook Testing Locally
1. Expose the local functions webhook URL with a tunnel (e.g., ngrok or cloudflared) and copy the public URL.
2. In Razorpay Dashboard (test mode), configure the webhook with the public URL pointing to `payments-webhook` path.
3. Select only events you will handle: payment.authorized, payment.captured, payment.failed, refund.processed.
4. Perform a test checkout; observe logs for signature verification and DB transitions.
5. Re-send the same event to confirm idempotency (should be a no-op).

### Next.js Integration (App Router)
- Creation step (server):
  - From a server action or server component, call `payments-create-order` with amount, currency, idempotency_key, and user context.
  - Store the returned order id and razorpay_order_id for the UI.
- Client checkout:
  - Render Razorpay Checkout using only the public key, amount, currency, and order id.
- Post-checkout verify (server):
  - On client success callback, send the Razorpay params to a server action.
  - The server action calls `payments-verify` to HMAC-validate and update DB.
- UI update:
  - After verify, redirect to an order status page.
  - Optionally subscribe to Supabase Realtime on `orders` to reflect webhook-driven updates.
- Decommission Next.js webhook route:
  - Remove or return 410 Gone from `app/api/razorpay-webhook`. Use Supabase `payments-webhook` exclusively.

### Idempotency Strategy
- Every client-initiated mutation must include an `idempotency_key` (UUID) stored in `orders`.
- On duplicate requests with the same key, return the existing record.
- For webhooks, use provider event id as the primary key in `webhook_events` to guarantee one-time processing.

### CORS and Transport Security
- Only allow your app origins to call `payments-create-order` and `payments-verify`.
- For webhooks, rely on HMAC verification; IP allowlisting is optional but can be brittle.
- Require and validate an `X-Internal-Secret` (EDGE_FUNCTIONS_SHARED_SECRET) header for app→function calls.

### Observability
- Log a correlation ID combining order id, razorpay_order_id, and razorpay_payment_id.
- Capture failures with messages and contexts into `webhook_events.error_message`.
- Set alerts on non-2xx rates and function failures in Supabase.

### Deployment
1. Ensure all secrets are set in the production project (do not reuse test keys).
2. Deploy each function to Supabase and note the production URLs.
3. Update Razorpay Dashboard webhook to point to the production `payments-webhook` URL.
4. Verify one live transaction end-to-end in low-risk conditions.

### Daily Reconciliation (recommended)
- Schedule a daily job (Supabase cron/queue) to list recent provider payments and reconcile against your DB, fixing any drift.

### Event Mapping Reference
- payment.authorized → payments.status = authorized; orders.status = pending (or paid if you auto-capture immediately later)
- payment.captured → payments.status = captured; orders.status = paid
- payment.failed → payments.status = failed; orders.status = failed
- refund.processed → payments.status = refunded; orders.status = refunded (full) or leave order paid for partial

### Rollout Checklist
1. Tables and RLS created; constraints added.
2. `payments-create-order`, `payments-verify`, `payments-webhook` deployed.
3. Secrets configured in Supabase.
4. CORS and internal secret enforced.
5. Next.js wired to call functions from server only; client uses only public data.
6. Razorpay webhook configured to the Supabase function URL.
7. Test transactions complete; idempotency verified.
8. Logs and alerts enabled.
9. Old Next.js webhook route decommissioned.

### Migration Note
- If you previously had `app/api/razorpay-webhook`, delete it or return 410 Gone to avoid duplicate handling. The Supabase `payments-webhook` becomes the single source of truth.


