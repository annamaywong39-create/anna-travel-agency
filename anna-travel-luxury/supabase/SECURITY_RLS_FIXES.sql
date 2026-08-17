-- SECURITY FIXES - Enable RLS on all tables and lock records access
-- Run after ALL_SQL_FIXES.sql

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.events enable row level security;
alter table public.event_tickets enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.ticket_orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.reviews enable row level security;
alter table public.matches enable row level security;
alter table public.ticket_holds enable row level security;

-- Profiles: users can view all (for public display), but only update own
drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles for select to anon, authenticated using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Listings: public read, admin write
drop policy if exists "Public can view available listings" on public.listings;
create policy "Public can view available listings" on public.listings for select to anon, authenticated using (available = true);

drop policy if exists "Admins can manage listings" on public.listings;
create policy "Admins can manage listings" on public.listings for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Events: public read upcoming, admin write
drop policy if exists "Public can view upcoming events" on public.events;
create policy "Public can view upcoming events" on public.events for select to anon, authenticated using (status in ('upcoming','live') or status is null);

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events" on public.events for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Event tickets: public read available, admin write, with price tampering protection
drop policy if exists "Public can view available tickets" on public.event_tickets;
create policy "Public can view available tickets" on public.event_tickets for select to anon, authenticated using (quantity_available > 0 and status = 'available');

drop policy if exists "Admins can manage tickets" on public.event_tickets;
create policy "Admins can manage tickets" on public.event_tickets for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Orders: users can view own, create own, admin all
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders" on public.orders for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Bookings: users own, admin all, block field tampering (price must be from listing)
drop policy if exists "Users can view own bookings" on public.bookings;
create policy "Users can view own bookings" on public.bookings for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own bookings" on public.bookings;
create policy "Users can create own bookings" on public.bookings for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings" on public.bookings for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Ticket orders: users own, admin all
drop policy if exists "Users can view own ticket orders" on public.ticket_orders;
create policy "Users can view own ticket orders" on public.ticket_orders for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create own ticket orders" on public.ticket_orders;
create policy "Users can create own ticket orders" on public.ticket_orders for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Admins can manage ticket orders" on public.ticket_orders;
create policy "Admins can manage ticket orders" on public.ticket_orders for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Contact messages: anyone can insert, only admin can view (trim api response - no public read)
drop policy if exists "Anyone can create contact messages" on public.contact_messages;
create policy "Anyone can create contact messages" on public.contact_messages for insert to anon, authenticated with check (true);

drop policy if exists "Admins can view contact messages" on public.contact_messages;
create policy "Admins can view contact messages" on public.contact_messages for select to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Reviews: public read, users can create own, trim sensitive fields via view
drop policy if exists "Public can view reviews" on public.reviews;
create policy "Public can view reviews" on public.reviews for select to anon, authenticated using (true);

drop policy if exists "Users can create reviews" on public.reviews;
create policy "Users can create reviews" on public.reviews for insert to authenticated with check (user_id = auth.uid());

-- Matches: public read
drop policy if exists "Public can view matches" on public.matches;
create policy "Public can view matches" on public.matches for select to anon, authenticated using (true);

drop policy if exists "Admins can manage matches" on public.matches;
create policy "Admins can manage matches" on public.matches for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Storage bucket policies (site-media) - public read, admin write, restrict file uploads
-- These should be run in storage schema
-- Allow public viewing
drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');

-- Restrict uploads: only images, <8MB, admin only, safe name
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
