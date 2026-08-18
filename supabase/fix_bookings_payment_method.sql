-- Fix: Could not find the 'payment_method' column of 'bookings' in the schema cache
-- Add payment_method column if not exists

alter table public.bookings add column if not exists payment_method text;

-- Also ensure total_price is numeric not integer to allow decimals like 4362.75
-- Check current type and alter if integer
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='bookings' and column_name='total_price' and data_type='integer') then
    alter table public.bookings alter column total_price type numeric using total_price::numeric;
  end if;
end $$;

-- Ensure ticket_orders total_price is numeric
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='ticket_orders' and column_name='total_price' and data_type='integer') then
    alter table public.ticket_orders alter column total_price type numeric using total_price::numeric;
  end if;
end $$;

-- Also ensure price in event_tickets is numeric (should already be)
alter table public.event_tickets add column if not exists price numeric;
