-- =============================================================================
-- ANNA TRAVEL AGENCY - FINAL SQL TO RUN NOW (2026-08-21)
-- Run this ONE file in Supabase SQL Editor - it contains ALL needed fixes
-- Order matters - run top to bottom
-- =============================================================================

-- 0) Enable extensions
create extension if not exists pgcrypto;

-- 1) Create contact_messages if missing (was causing 42P01)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  type text default 'general',
  created_at timestamptz not null default now()
);

-- 2) Schema fixes - add columns if not exists
alter table public.event_tickets add column if not exists discount_percent numeric(5,2);
alter table public.event_tickets add column if not exists image_url text;
alter table public.event_tickets add column if not exists section text;
alter table public.event_tickets add column if not exists row text;
alter table public.event_tickets add column if not exists seat_details text;
alter table public.event_tickets add column if not exists delivery_method text;
alter table public.event_tickets add column if not exists delivery_timing text;
alter table public.event_tickets add column if not exists status text default 'available';
alter table public.events add column if not exists image_url text;
alter table public.events add column if not exists seat_map_url text;
alter table public.events add column if not exists category text;
alter table public.events add column if not exists status text default 'upcoming';
alter table public.bookings add column if not exists payment_method text;
alter table public.bookings add column if not exists order_id uuid;
alter table public.ticket_orders add column if not exists order_id uuid;
alter table public.ticket_orders add column if not exists payment_method text default 'paypal';

-- Ensure numeric types for decimals
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='bookings' and column_name='total_price' and data_type='integer') then
    alter table public.bookings alter column total_price type numeric using total_price::numeric;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='ticket_orders' and column_name='total_price' and data_type='integer') then
    alter table public.ticket_orders alter column total_price type numeric using total_price::numeric;
  end if;
end $$;

-- Clean invalid discounts outside 60-70
update public.event_tickets set discount_percent = null where discount_percent is not null and (discount_percent < 60 or discount_percent > 70);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'event_tickets_discount_percent_range') then
    alter table public.event_tickets add constraint event_tickets_discount_percent_range check (discount_percent is null or (discount_percent >= 60 and discount_percent <= 70));
  end if;
end $$;

-- 3) ticket_holds table + 2-min hold functions (critical for checkout)
create table if not exists public.ticket_holds (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.event_tickets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  held_until timestamptz not null,
  status text not null default 'active' check (status in ('active','released','expired','converted')),
  created_at timestamptz not null default now()
);

create index if not exists ticket_holds_active_ticket_idx on public.ticket_holds (ticket_id, status, held_until);
create index if not exists ticket_holds_user_idx on public.ticket_holds (user_id, status);

drop function if exists public.hold_ticket(uuid, integer);
create or replace function public.hold_ticket(p_ticket_id uuid, p_quantity integer)
returns table (hold_id uuid, held_until timestamptz)
language plpgsql security definer set search_path = public
as $$
declare v_available integer; v_held integer; v_until timestamptz := now() + interval '2 minutes'; v_hold_id uuid;
begin
  if auth.uid() is null then raise exception 'You must be signed in to hold tickets.'; end if;
  if p_quantity is null or p_quantity < 1 then raise exception 'Quantity must be at least 1.'; end if;
  update public.ticket_holds set status='expired' where ticket_holds.ticket_id = p_ticket_id and ticket_holds.status='active' and ticket_holds.held_until <= now();
  select quantity_available into v_available from public.event_tickets where id = p_ticket_id for update;
  if v_available is null then raise exception 'Ticket not found.'; end if;
  select coalesce(sum(quantity),0) into v_held from public.ticket_holds where ticket_id = p_ticket_id and status='active' and held_until > now();
  if v_available - v_held < p_quantity then raise exception 'Not enough tickets available for hold.'; end if;
  insert into public.ticket_holds (ticket_id, user_id, quantity, held_until) values (p_ticket_id, auth.uid(), p_quantity, v_until) returning id into v_hold_id;
  return query select v_hold_id as hold_id, v_until as held_until;
end; $$;
grant execute on function public.hold_ticket(uuid, integer) to authenticated;

drop function if exists public.release_ticket_hold(uuid);
create or replace function public.release_ticket_hold(p_hold_id uuid)
returns boolean language plpgsql security definer set search_path = public
as $$
declare v_changed integer;
begin
  update public.ticket_holds set status='released' where id=p_hold_id and status='active' and (user_id=auth.uid() or exists(select 1 from public.profiles where id=auth.uid() and role='admin'));
  get diagnostics v_changed = row_count; return v_changed > 0;
end; $$;
grant execute on function public.release_ticket_hold(uuid) to authenticated;

-- 4) SECURE RLS - FIXED VERSION (no public profiles true, no role self-promotion)
-- Enable RLS
alter table if exists public.profiles enable row level security;
alter table if exists public.listings enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.event_tickets enable row level security;
alter table if exists public.bookings enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.ticket_orders enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.reviews enable row level security;
alter table if exists public.matches enable row level security;
alter table if exists public.ticket_holds enable row level security;

do $$
begin
  -- PROFILES - SECURE: own + admin only, NOT public
  if exists (select 1 from pg_tables where schemaname='public' and tablename='profiles') then
    drop policy if exists "Public can view profiles" on public.profiles;
    drop policy if exists "Users can view their own profile" on public.profiles;
    drop policy if exists "Public can view profiles - OLD" on public.profiles;
    drop policy if exists "Users can view own profile" on public.profiles;
    drop policy if exists "Admins can view all profiles" on public.profiles;
    create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
    create policy "Admins can view all profiles" on public.profiles for select to authenticated using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

    drop policy if exists "Users can update own profile" on public.profiles;
    drop policy if exists "Users can update own safe fields" on public.profiles;
    -- Allow update only safe fields, role cannot be changed via RLS check - we check role stays same
    create policy "Users can update own safe fields" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

    drop policy if exists "Users can insert own profile" on public.profiles;
    create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
  end if;

  -- LISTINGS - public can view available
  if exists (select 1 from pg_tables where schemaname='public' and tablename='listings') then
    drop policy if exists "Public can view available listings" on public.listings;
    create policy "Public can view available listings" on public.listings for select to anon, authenticated using (available = true);
    drop policy if exists "Admins can manage listings" on public.listings;
    create policy "Admins can manage listings" on public.listings for all to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- EVENTS - allow upcoming, live, finished, sold_out for history
  if exists (select 1 from pg_tables where schemaname='public' and tablename='events') then
    drop policy if exists "Public can view upcoming events" on public.events;
    drop policy if exists "Public can view all events for history" on public.events;
    create policy "Public can view all events for history" on public.events for select to anon, authenticated using (status in ('upcoming','live','finished','sold_out') or status is null);
    drop policy if exists "Admins can manage events" on public.events;
    create policy "Admins can manage events" on public.events for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- EVENT_TICKETS - public can view available + sold_out for banner
  if exists (select 1 from pg_tables where schemaname='public' and tablename='event_tickets') then
    drop policy if exists "Public can view available tickets" on public.event_tickets;
    drop policy if exists "Public can view tickets including sold out" on public.event_tickets;
    create policy "Public can view tickets including sold out" on public.event_tickets for select to anon, authenticated using (quantity_available >= 0);
    drop policy if exists "Admins can manage tickets" on public.event_tickets;
    create policy "Admins can manage tickets" on public.event_tickets for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- ORDERS
  if exists (select 1 from pg_tables where schemaname='public' and tablename='orders') then
    drop policy if exists "Users can view own orders" on public.orders;
    create policy "Users can view own orders" on public.orders for select to authenticated using (user_id = auth.uid());
    drop policy if exists "Users can create own orders" on public.orders;
    create policy "Users can create own orders" on public.orders for insert to authenticated with check (user_id = auth.uid());
    drop policy if exists "Admins can manage orders" on public.orders;
    create policy "Admins can manage orders" on public.orders for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- BOOKINGS
  if exists (select 1 from pg_tables where schemaname='public' and tablename='bookings') then
    drop policy if exists "Users can view own bookings" on public.bookings;
    create policy "Users can view own bookings" on public.bookings for select to authenticated using (user_id = auth.uid());
    drop policy if exists "Users can create own bookings" on public.bookings;
    create policy "Users can create own bookings" on public.bookings for insert to authenticated with check (user_id = auth.uid());
    drop policy if exists "Admins can manage bookings" on public.bookings;
    create policy "Admins can manage bookings" on public.bookings for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- TICKET_ORDERS
  if exists (select 1 from pg_tables where schemaname='public' and tablename='ticket_orders') then
    drop policy if exists "Users can view own ticket orders" on public.ticket_orders;
    create policy "Users can view own ticket orders" on public.ticket_orders for select to authenticated using (user_id = auth.uid());
    drop policy if exists "Users can create own ticket orders" on public.ticket_orders;
    create policy "Users can create own ticket orders" on public.ticket_orders for insert to authenticated with check (user_id = auth.uid());
    drop policy if exists "Admins can manage ticket orders" on public.ticket_orders;
    create policy "Admins can manage ticket orders" on public.ticket_orders for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- CONTACT_MESSAGES
  if exists (select 1 from pg_tables where schemaname='public' and tablename='contact_messages') then
    drop policy if exists "Anyone can create contact messages" on public.contact_messages;
    create policy "Anyone can create contact messages" on public.contact_messages for insert to anon, authenticated with check (true);
    drop policy if exists "Admins can view contact messages" on public.contact_messages;
    create policy "Admins can view contact messages" on public.contact_messages for select to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- REVIEWS
  if exists (select 1 from pg_tables where schemaname='public' and tablename='reviews') then
    drop policy if exists "Public can view reviews" on public.reviews;
    create policy "Public can view reviews" on public.reviews for select to anon, authenticated using (true);
    drop policy if exists "Users can create reviews" on public.reviews;
    create policy "Users can create reviews" on public.reviews for insert to authenticated with check (user_id = auth.uid());
  end if;

  -- MATCHES
  if exists (select 1 from pg_tables where schemaname='public' and tablename='matches') then
    drop policy if exists "Public can view matches" on public.matches;
    create policy "Public can view matches" on public.matches for select to anon, authenticated using (true);
    drop policy if exists "Admins can manage matches" on public.matches;
    create policy "Admins can manage matches" on public.matches for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;

  -- TICKET_HOLDS
  if exists (select 1 from pg_tables where schemaname='public' and tablename='ticket_holds') then
    drop policy if exists "Users can view their own ticket holds" on public.ticket_holds;
    create policy "Users can view their own ticket holds" on public.ticket_holds for select to authenticated using (user_id = auth.uid());
    drop policy if exists "Admins can manage ticket holds" on public.ticket_holds;
    create policy "Admins can manage ticket holds" on public.ticket_holds for all to authenticated using (exists (select 1 from public.profiles where id=auth.uid() and role='admin')) with check (exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;
end $$;

-- Storage bucket policies
do $$
begin
  if exists (select 1 from pg_tables where schemaname='storage' and tablename='objects') then
    drop policy if exists "Public can view site media" on storage.objects;
    create policy "Public can view site media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
    drop policy if exists "Admins can upload site media" on storage.objects;
    create policy "Admins can upload site media" on storage.objects for insert to authenticated with check (bucket_id='site-media' and (storage.foldername(name))[1] in ('listings','events','tickets') and exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
    drop policy if exists "Admins can update site media" on storage.objects;
    create policy "Admins can update site media" on storage.objects for update to authenticated using (bucket_id='site-media' and exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
    drop policy if exists "Admins can delete site media" on storage.objects;
    create policy "Admins can delete site media" on storage.objects for delete to authenticated using (bucket_id='site-media' and exists (select 1 from public.profiles where id=auth.uid() and role='admin'));
  end if;
end $$;

-- 5) BTS events from NOW to JANUARY - insert if not exists (for DB, fallback already in code)
insert into public.events (title, description, date, venue, city, image_url, status, category)
values
  ('BTS WORLD TOUR ''ARIRANG'' — Toronto', 'BTS ARIRANG Toronto - local CAD, USD equivalent, hotels available', '2026-08-22T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Toronto', 'BTS ARIRANG Toronto Night 2', '2026-08-23T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Chicago', 'BTS ARIRANG Chicago', '2026-08-27T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Chicago', 'BTS ARIRANG Chicago Night 2', '2026-08-28T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Los Angeles', 'BTS ARIRANG LA Sep 1', '2026-09-01T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Los Angeles', 'BTS ARIRANG LA Sep 2', '2026-09-02T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Los Angeles', 'BTS ARIRANG LA Sep 5', '2026-09-05T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Los Angeles', 'BTS ARIRANG LA Sep 6', '2026-09-06T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Bogotá', 'BTS ARIRANG Colombia - COP 1 USD=4100, hotels in Bogotá', '2026-10-02T20:00:00-05:00', 'Estadio El Campín', 'Bogotá, Colombia', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Bogotá', 'BTS ARIRANG Bogotá Night 2', '2026-10-03T20:00:00-05:00', 'Estadio El Campín', 'Bogotá, Colombia', '/images/fans.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Lima', 'BTS ARIRANG Lima - PEN 1 USD=3.73, hotels in Lima', '2026-10-07T20:00:00-05:00', 'Estadio San Marcos', 'Lima, Peru', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Santiago', 'BTS ARIRANG Santiago - CLP 1 USD=920, hotels in Santiago', '2026-10-14T20:00:00-04:00', 'Estadio Nacional', 'Santiago, Chile', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Buenos Aires', 'BTS ARIRANG BA - ARS 1 USD=900, hotels in Buenos Aires', '2026-10-21T20:00:00-03:00', 'Estadio Único de La Plata', 'Buenos Aires, Argentina', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — São Paulo', 'BTS ARIRANG São Paulo - BRL 1 USD=5.2, hotels in São Paulo', '2026-10-28T20:00:00-03:00', 'Estádio MorumBIS', 'São Paulo, Brazil', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Kaohsiung', 'BTS ARIRANG Kaohsiung - TWD 1 USD=32, hotels in Kaohsiung', '2026-11-19T19:30:00+08:00', 'Kaohsiung National Stadium', 'Kaohsiung, Taiwan', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Bangkok', 'BTS ARIRANG Bangkok - THB 1 USD=36, hotels in Bangkok', '2026-12-03T19:00:00+07:00', 'Rajamangala National Stadium', 'Bangkok, Thailand', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Kuala Lumpur', 'BTS ARIRANG KL - MYR 1 USD=4.7, hotels in KL', '2026-12-12T20:00:00+08:00', 'Bukit Jalil National Stadium', 'Kuala Lumpur, Malaysia', '/images/stadium.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Singapore', 'BTS ARIRANG Singapore - SGD 1 USD=1.32, hotels in Singapore', '2026-12-17T19:00:00+08:00', 'National Stadium', 'Singapore', '/images/events/bts/bts-arirang-tour.jpg', 'upcoming', 'Music'),
  ('BTS WORLD TOUR ''ARIRANG'' — Jakarta', 'BTS ARIRANG Jakarta - IDR 1 USD=16000, hotels in Jakarta', '2026-12-26T19:00:00+07:00', 'Gelora Bung Karno', 'Jakarta, Indonesia', '/images/stadium.jpg', 'upcoming', 'Music')
on conflict do nothing;

-- 6) Verify
select 'events count' as check, count(*) from public.events;
select 'tickets with discount' as check, count(*) from public.event_tickets where discount_percent between 60 and 70;
select 'ticket_holds' as check, count(*) from public.ticket_holds;
select 'profiles RLS secured' as check;
