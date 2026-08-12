-- Sponsor-funded, per-ticket discounts.
-- The percentage is capped at 70 and can be different for every ticket listing.
alter table public.event_tickets
  add column if not exists discount_percent numeric(5,2);

alter table public.event_tickets
  drop constraint if exists event_tickets_discount_percent_check;

alter table public.event_tickets
  add constraint event_tickets_discount_percent_check
  check (discount_percent is null or (discount_percent >= 0 and discount_percent <= 70));
