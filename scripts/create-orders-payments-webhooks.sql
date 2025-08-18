-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'pending', -- draft, pending, paid, failed, refunded, canceled
  amount integer not null,
  currency text not null default 'INR',
  razorpay_order_id text unique,
  idempotency_key text unique not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PAYMENTS
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_payment_id text unique,
  status text not null, -- authorized, captured, refunded, failed
  amount integer,
  method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- WEBHOOK EVENTS (idempotency)
create table if not exists public.webhook_events (
  id text primary key, -- provider event id
  provider text not null,
  type text not null,
  payload_hash text,
  processed_at timestamptz,
  status text not null default 'processed',
  error_message text
);

-- RLS
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;

-- Policies
do $$ begin
  -- Orders: users can read their own; writes via service role only
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'orders' and policyname = 'orders_select_own'
  ) then
    create policy orders_select_own on public.orders for select using (auth.uid() is not null and user_id = auth.uid());
  end if;

  -- Payments: users can read those belonging to their orders
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_select_by_owner'
  ) then
    create policy payments_select_by_owner on public.payments for select using (
      exists (
        select 1 from public.orders o where o.id = payments.order_id and o.user_id = auth.uid()
      )
    );
  end if;

  -- Webhook events: no public access
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'webhook_events' and policyname = 'webhook_events_no_public'
  ) then
    create policy webhook_events_no_public on public.webhook_events for all to public using (false) with check (false);
  end if;
end $$;

-- Triggers to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'orders_set_updated_at'
  ) then
    create trigger orders_set_updated_at before update on public.orders
    for each row execute function public.set_updated_at();
  end if;
  if not exists (
    select 1 from pg_trigger where tgname = 'payments_set_updated_at'
  ) then
    create trigger payments_set_updated_at before update on public.payments
    for each row execute function public.set_updated_at();
  end if;
end $$;




