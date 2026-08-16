-- =============================================================================
-- ANNA TRAVEL AGENCY — ALL SQL FIXES — 2026-08-15
-- Run in Supabase SQL Editor in order
-- =============================================================================

-- 1) ADD discount_percent column with 60-70% CHECK (sponsor-supported BTS)
-- From set-sponsor-discount-range-60-70.txt
alter table public.event_tickets
  add column if not exists discount_percent numeric(5,2);

-- Remove invalid discounts outside 60-70 (keep NULL for non-BTS)
update public.event_tickets
set discount_percent = null
where discount_percent is not null and (discount_percent < 60 or discount_percent > 70);

-- Enforce 60-70 range where set
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'event_tickets_discount_percent_range'
  ) then
    alter table public.event_tickets
      add constraint event_tickets_discount_percent_range
      check (discount_percent is null or (discount_percent >= 60 and discount_percent <= 70));
  end if;
end $$;

-- 2) ADD ticket image column (from add-ticket-image-column.txt)
alter table public.event_tickets
  add column if not exists image_url text;

-- 3) CREATE ticket_holds + hold_ticket() + release_ticket_hold() — 2-min server holds
-- From create-ticket-holds.txt
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

alter table public.ticket_holds enable row level security;

drop policy if exists "Users can view their own ticket holds" on public.ticket_holds;
create policy "Users can view their own ticket holds"
on public.ticket_holds for select to authenticated using (user_id = auth.uid());

drop policy if exists "Admins can manage ticket holds" on public.ticket_holds;
create policy "Admins can manage ticket holds"
on public.ticket_holds for all to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create or replace function public.hold_ticket(p_ticket_id uuid, p_quantity integer)
returns table (hold_id uuid, held_until timestamptz)
language plpgsql security definer set search_path = public as $$
declare v_available integer; v_held integer; v_until timestamptz := now() + interval '2 minutes'; v_hold_id uuid;
begin
  if auth.uid() is null then raise exception 'You must be signed in to hold tickets.'; end if;
  if p_quantity is null or p_quantity < 1 then raise exception 'Ticket quantity must be at least 1.'; end if;
  update public.ticket_holds set status='expired' where ticket_id=p_ticket_id and status='active' and held_until <= now();
  select quantity_available into v_available from public.event_tickets where id=p_ticket_id for update;
  if v_available is null then raise exception 'Ticket listing was not found.'; end if;
  select coalesce(sum(quantity),0) into v_held from public.ticket_holds where ticket_id=p_ticket_id and status='active' and held_until > now();
  if v_available - v_held < p_quantity then raise exception 'Not enough tickets are available for a two-minute hold.'; end if;
  insert into public.ticket_holds (ticket_id, user_id, quantity, held_until) values (p_ticket_id, auth.uid(), p_quantity, v_until) returning id into v_hold_id;
  return query select v_hold_id, v_until;
end; $$;
grant execute on function public.hold_ticket(uuid, integer) to authenticated;

create or replace function public.release_ticket_hold(p_hold_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_changed integer;
begin
  update public.ticket_holds set status='released'
  where id=p_hold_id and status='active' and (user_id=auth.uid() or exists (select 1 from public.profiles where profiles.id=auth.uid() and profiles.role='admin'));
  get diagnostics v_changed = row_count;
  return v_changed > 0;
end; $$;
grant execute on function public.release_ticket_hold(uuid) to authenticated;

-- 4) SEED BTS Baltimore with fixed 60-70% discounts (stable, no refresh change)
begin;
delete from public.event_tickets where event_id = (
  select id from public.events where title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE' and venue = 'M&T Bank Stadium' limit 1
);
insert into public.event_tickets (event_id, category_name, price, quantity_available, section, "row", seat_details, delivery_method, delivery_timing, status, discount_percent)
select e.id, inv.category_name, inv.price, inv.quantity_available, inv.section, inv.row_label, inv.seat_details, 'Mobile transfer', 'Evening before event', 'available', inv.discount_percent
from public.events e cross join (values
  ('Five Hundreds Level 532', 149, 2, '532', '16', '2 mobile tickets', 65),
  ('Field R', 973, 2, 'Field R', '13', '2 mobile tickets', 70),
  ('Hundreds Level 133', 371, 2, '133', '32', '2 mobile tickets', 60)
) as inv(category_name, price, quantity_available, section, row_label, seat_details, discount_percent)
where e.title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE' and e.venue = 'M&T Bank Stadium';
commit;

-- 5) FIX Chicago Aug 28 NULL image / seat_map (reported bug)
update public.events
set image_url = coalesce(image_url, '/images/events/bts/bts-arirang-tour.png'),
    seat_map_url = coalesce(seat_map_url, '/images/seatmaps/bts-chicago-2026-08-27.png')
where lower(title) like '%chicago%28%' or lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Chicago — August 28');

-- 6) CLEAN Arlington near-duplicate (keep one per date, remove accidental duplicate)
-- Keeps earliest created per title+date, deletes later duplicates
with ranked as (
  select id, row_number() over (partition by lower(title), date order by created_at asc) as rn
  from public.events where lower(title) like '%arlington%'
)
delete from public.events where id in (select id from ranked where rn > 1);

-- 7) ENSURE BTS tickets have discount 60-70 (backfill any missing)
-- Deterministic: Premium/VIP/Field → 70, 400s/500s → 60, others → 65
update public.event_tickets
set discount_percent = case
  when lower(category_name || ' ' || coalesce(section,'')) ~ 'vip|founder|club|diamond|gold|silver|front row|hot seat|soundcheck|premium|field' then 70
  when section ~ '^(4|5)' or category_name ~ '400s|500s' then 60
  when section = '133' then 60
  when section = '532' then 65
  else 65
end
where discount_percent is null
  and event_id in (select id from public.events where lower(title) like '%bts%');

-- 8) Verify
select 'event_tickets with discount' as check, count(*) from public.event_tickets where discount_percent between 60 and 70;
select 'ticket_holds table' as check, count(*) from public.ticket_holds;
select 'Chicago fix' as check, title, image_url, seat_map_url from public.events where lower(title) like '%chicago%28%';
