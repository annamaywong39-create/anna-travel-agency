-- Anna Travel Agency: order foundation
-- Safe migration: creates the central order table and adds nullable links.
-- It does not delete or modify existing booking/ticket data.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default (
    'ANA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  user_id uuid not null references auth.users(id) on delete restrict,
  order_type text not null default 'mixed',
  status text not null default 'pending',
  payment_status text not null default 'pending',
  supplier_status text not null default 'checking_availability',
  paypal_request_id text,
  supplier_confirmation_number text,
  room_number text,
  customer_notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings
  add column if not exists order_id uuid references public.orders(id) on delete set null;

alter table public.ticket_orders
  add column if not exists order_id uuid references public.orders(id) on delete set null;

alter table public.orders enable row level security;

-- Customers can read only their own orders.
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
on public.orders for select
to authenticated
using (user_id = auth.uid());

-- Admins can manage all business orders.
drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Keep updated_at current when an order changes.
create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_orders_updated_at();
