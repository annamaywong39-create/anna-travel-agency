-- Anna Travel Agency: safe content reset
-- This clears only event/ticket content. It does not drop tables.
-- Do not run until Anna confirms there is no real event/ticket order to keep.

begin;

-- Remove ticket rows before event rows so event references remain valid.
delete from public.event_tickets;
delete from public.events;
delete from public.matches;

-- Add the fields needed for verified seating inventory.
alter table public.event_tickets
  add column if not exists section text,
  add column if not exists row text,
  add column if not exists seat_details text,
  add column if not exists delivery_method text,
  add column if not exists delivery_timing text,
  add column if not exists status text default 'available';

-- Store the event-specific seating map URL.
alter table public.events
  add column if not exists seat_map_url text;

commit;

-- We intentionally do not delete:
-- profiles
-- bookings
-- reviews
-- listings
-- ticket_orders
-- auth users
