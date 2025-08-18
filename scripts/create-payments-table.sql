-- Run this in your Supabase SQL editor to create the payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  transaction_id text,
  payment_status text not null,
  payment_method text not null,
  created_at timestamptz not null default now(),
  raw_payload text
);

alter table public.payments enable row level security;

-- Allow authenticated users to insert/select their own payment rows as needed (adjust to your model)
create policy if not exists "allow all read payments" on public.payments
  for select using (true);

create policy if not exists "allow all insert payments" on public.payments
  for insert with check (true);

