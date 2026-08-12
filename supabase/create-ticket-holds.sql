-- Stage 1: real two-minute ticket holds.
-- This creates server-side holds; the browser countdown alone is not trusted.

create table if not exists public.ticket_holds (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.event_tickets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  held_until timestamptz not null,
  status text not null default 'active' check (status in ('active', 'released', 'expired', 'converted')),
  created_at timestamptz not null default now()
);

create index if not exists ticket_holds_active_ticket_idx
on public.ticket_holds (ticket_id, status, held_until);

create index if not exists ticket_holds_user_idx
on public.ticket_holds (user_id, status);

alter table public.ticket_holds enable row level security;

drop policy if exists "Users can view their own ticket holds" on public.ticket_holds;
create policy "Users can view their own ticket holds"
on public.ticket_holds for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can manage ticket holds" on public.ticket_holds;
create policy "Admins can manage ticket holds"
on public.ticket_holds for all
to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create or replace function public.hold_ticket(
  p_ticket_id uuid,
  p_quantity integer
)
returns table (hold_id uuid, held_until timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_available integer;
  v_held integer;
  v_until timestamptz := now() + interval '2 minutes';
  v_hold_id uuid;
begin
  if auth.uid() is null then raise exception 'You must be signed in to hold tickets.'; end if;
  if p_quantity is null or p_quantity < 1 then raise exception 'Ticket quantity must be at least 1.'; end if;

  update public.ticket_holds
  set status = 'expired'
  where ticket_id = p_ticket_id and status = 'active' and held_until <= now();

  select quantity_available into v_available
  from public.event_tickets
  where id = p_ticket_id
  for update;

  if v_available is null then raise exception 'Ticket listing was not found.'; end if;

  select coalesce(sum(quantity), 0) into v_held
  from public.ticket_holds
  where ticket_id = p_ticket_id and status = 'active' and held_until > now();

  if v_available - v_held < p_quantity then
    raise exception 'Not enough tickets are available for a two-minute hold.';
  end if;

  insert into public.ticket_holds (ticket_id, user_id, quantity, held_until)
  values (p_ticket_id, auth.uid(), p_quantity, v_until)
  returning id into v_hold_id;

  return query select v_hold_id, v_until;
end;
$$;

grant execute on function public.hold_ticket(uuid, integer) to authenticated;

create or replace function public.release_ticket_hold(p_hold_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_changed integer;
begin
  update public.ticket_holds
  set status = 'released'
  where id = p_hold_id and status = 'active' and (user_id = auth.uid() or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  get diagnostics v_changed = row_count;
  return v_changed > 0;
end;
$$;

grant execute on function public.release_ticket_hold(uuid) to authenticated;
