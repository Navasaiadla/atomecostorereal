Supabase Edge Functions — Payments Setup (Razorpay)

What we added
- supabase/config.toml — minimal config
- supabase/functions/payments-create-order — creates DB order + Razorpay order
- supabase/functions/payments-verify — verifies Checkout signature server-side
- supabase/functions/payments-webhook — reconciles webhook events

What you must do (CLI + secrets)
1) Install the Supabase CLI (Windows options):
   - With Scoop: `scoop install supabase`
   - Or with npm: `npm i -g supabase`

2) Link this folder to your Supabase project:
   - Find your project ref in the Supabase dashboard URL (e.g., abcdefghij). Then:
   ```bash
   supabase link --project-ref <YOUR_PROJECT_REF>
   ```

3) Set all required secrets:
```bash
supabase secrets set \
  RAZORPAY_KEY_ID=... \
  RAZORPAY_KEY_SECRET=... \
  RAZORPAY_WEBHOOK_SECRET=... \
  SUPABASE_URL=https://<PROJECT_REF>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=... \
  APP_BASE_URL=https://yourdomain.com \
  EDGE_FUNCTIONS_SHARED_SECRET=replace-with-strong-random \
  CURRENCY=INR \
  ENV=development
```

4) Run locally (two terminals):
```bash
supabase start
supabase functions serve --no-verify-jwt --env-file <(supabase secrets list --include-values | awk '{print $1"="$2}') | cat
```
If `<(...)>` is not available on Windows shells, just rely on project secrets already set in step 3.

5) Deploy functions:
```bash
supabase functions deploy payments-create-order
supabase functions deploy payments-verify
supabase functions deploy payments-webhook
```

6) Set Razorpay Webhook URL in dashboard:
- Use the deployed `payments-webhook` URL from the CLI output.
- Select events: payment.authorized, payment.captured, payment.failed, refund.processed.

Next.js integration
- From server actions, call the `payments-create-order` and `payments-verify` functions using fetch with the `X-Internal-Secret` header. The client should only render Checkout with public data.
- Remove or return 410 from `app/api/razorpay-webhook` to avoid duplicate webhook handling.




