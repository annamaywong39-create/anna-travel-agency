-- Change the sponsor-funded offer to 60–70% per eligible ticket.
-- This file also creates the column, so it can be run safely on a fresh database.
alter table public.event_tickets
  add column if not exists discount_percent numeric(5,2);

-- Existing values outside the new range are cleared rather than silently kept.
update public.event_tickets
set discount_percent = null
where discount_percent is not null
  and (discount_percent < 60 or discount_percent > 70);

alter table public.event_tickets
  drop constraint if exists event_tickets_discount_percent_check;

alter table public.event_tickets
  add constraint event_tickets_discount_percent_check
  check (discount_percent is null or (discount_percent >= 60 and discount_percent <= 70));
