-- SECURITY FIXES - Fixed for missing tables (contact_messages error 42P01)
-- Run after ALL_SQL_FIXES.sql
-- Uses IF EXISTS to avoid errors if table doesn't exist

-- 0) Create contact_messages if it doesn't exist (was missing)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  type text default 'general',
  created_at timestamptz not null default now()
);

-- Enable RLS with IF EXISTS - won't error if table missing
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

-- Helper function to create policies only if table exists
do $$
begin
  -- Profiles
  if exists (select 1 from pg_tables where schemaname='public' and tablename='profiles') then
    drop policy if exists "Public can view profiles" on public.profiles;
    create policy "Public can view profiles" on public.profiles for select to anon, authenticated using (true);

    drop policy if exists "Users can update own profile" on public.profiles;
    create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

    drop policy if exists "Users can insert own profile" on public.profiles;
    create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
  end if;

  -- Listings
  if exists (select 1 from pg_tables where schemaname='public' and tablename='listings') then
    drop policy if exists "Public can view available listings" on public.listings;
    create policy "Public can view available listings" on public.listings for select to anon, authenticated using (available = true);

    drop policy if exists "Admins can manage listings" on public.listings;
    create policy "Admins can manage listings" on public.listings for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Events
  if exists (select 1 from pg_tables where schemaname='public' and tablename='events') then
    drop policy if exists "Public can view upcoming events" on public.events;
    create policy "Public can view upcoming events" on public.events for select to anon, authenticated using (status in ('upcoming','live') or status is null);

    drop policy if exists "Admins can manage events" on public.events;
    create policy "Admins can manage events" on public.events for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Event tickets
  if exists (select 1 from pg_tables where schemaname='public' and tablename='event_tickets') then
    drop policy if exists "Public can view available tickets" on public.event_tickets;
    create policy "Public can view available tickets" on public.event_tickets for select to anon, authenticated using (quantity_available > 0 and status = 'available');

    drop policy if exists "Admins can manage tickets" on public.event_tickets;
    create policy "Admins can manage tickets" on public.event_tickets for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Orders
  if exists (select 1 from pg_tables where schemaname='public' and tablename='orders') then
    drop policy if exists "Users can view own orders" on public.orders;
    create policy "Users can view own orders" on public.orders for select to authenticated using (user_id = auth.uid());

    drop policy if exists "Users can create own orders" on public.orders;
    create policy "Users can create own orders" on public.orders for insert to authenticated with check (user_id = auth.uid());

    drop policy if exists "Admins can manage orders" on public.orders;
    create policy "Admins can manage orders" on public.orders for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Bookings
  if exists (select 1 from pg_tables where schemaname='public' and tablename='bookings') then
    drop policy if exists "Users can view own bookings" on public.bookings;
    create policy "Users can view own bookings" on public.bookings for select to authenticated using (user_id = auth.uid());

    drop policy if exists "Users can create own bookings" on public.bookings;
    create policy "Users can create own bookings" on public.bookings for insert to authenticated with check (user_id = auth.uid());

    drop policy if exists "Admins can manage bookings" on public.bookings;
    create policy "Admins can manage bookings" on public.bookings for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Ticket orders
  if exists (select 1 from pg_tables where schemaname='public' and tablename='ticket_orders') then
    drop policy if exists "Users can view own ticket orders" on public.ticket_orders;
    create policy "Users can view own ticket orders" on public.ticket_orders for select to authenticated using (user_id = auth.uid());

    drop policy if exists "Users can create own ticket orders" on public.ticket_orders;
    create policy "Users can create own ticket orders" on public.ticket_orders for insert to authenticated with check (user_id = auth.uid());

    drop policy if exists "Admins can manage ticket orders" on public.ticket_orders;
    create policy "Admins can manage ticket orders" on public.ticket_orders for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Contact messages (now exists because we created it above)
  if exists (select 1 from pg_tables where schemaname='public' and tablename='contact_messages') then
    drop policy if exists "Anyone can create contact messages" on public.contact_messages;
    create policy "Anyone can create contact messages" on public.contact_messages for insert to anon, authenticated with check (true);

    drop policy if exists "Admins can view contact messages" on public.contact_messages;
    create policy "Admins can view contact messages" on public.contact_messages for select to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;

  -- Reviews
  if exists (select 1 from pg_tables where schemaname='public' and tablename='reviews') then
    drop policy if exists "Public can view reviews" on public.reviews;
    create policy "Public can view reviews" on public.reviews for select to anon, authenticated using (true);

    drop policy if exists "Users can create reviews" on public.reviews;
    create policy "Users can create reviews" on public.reviews for insert to authenticated with check (user_id = auth.uid());
  end if;

  -- Matches
  if exists (select 1 from pg_tables where schemaname='public' and tablename='matches') then
    drop policy if exists "Public can view matches" on public.matches;
    create policy "Public can view matches" on public.matches for select to anon, authenticated using (true);

    drop policy if exists "Admins can manage matches" on public.matches;
    create policy "Admins can manage matches" on public.matches for all to authenticated
    using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;
end $$;

-- Storage bucket policies (site-media)
do $$
begin
  if exists (select 1 from pg_tables where schemaname='storage' and tablename='objects') then
    drop policy if exists "Public can view site media" on storage.objects;
    create policy "Public can view site media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');

    drop policy if exists "Admins can upload site media" on storage.objects;
    create policy "Admins can upload site media" on storage.objects for insert to authenticated
    with check (
      bucket_id = 'site-media' and
      (storage.foldername(name))[1] in ('listings','events','tickets') and
      exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );

    drop policy if exists "Admins can update site media" on storage.objects;
    create policy "Admins can update site media" on storage.objects for update to authenticated
    using (bucket_id = 'site-media' and exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

    drop policy if exists "Admins can delete site media" on storage.objects;
    create policy "Admins can delete site media" on storage.objects for delete to authenticated
    using (bucket_id = 'site-media' and exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;
end $$;
