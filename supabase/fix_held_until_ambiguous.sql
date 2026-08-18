-- Fix: column reference "held_until" is ambiguous
-- Cause: RETURNS TABLE (hold_id uuid, held_until timestamptz) has column name same as ticket_holds.held_until
-- Inside function, unqualified held_until references are ambiguous between output column and table column
-- Solution: qualify all table references as ticket_holds.held_until and alias return

drop function if exists public.hold_ticket(uuid, integer);

create or replace function public.hold_ticket(p_ticket_id uuid, p_quantity integer)
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
  if auth.uid() is null then
    raise exception 'You must be signed in to hold tickets.';
  end if;
  if p_quantity is null or p_quantity < 1 then
    raise exception 'Ticket quantity must be at least 1.';
  end if;

  -- Expire old holds - qualify table column
  update public.ticket_holds
  set status = 'expired'
  where ticket_holds.ticket_id = p_ticket_id
    and ticket_holds.status = 'active'
    and ticket_holds.held_until <= now();

  -- Lock ticket row and check availability
  select event_tickets.quantity_available into v_available
  from public.event_tickets
  where event_tickets.id = p_ticket_id
  for update;

  if v_available is null then
    raise exception 'Ticket listing was not found.';
  end if;

  -- Sum active holds - qualify
  select coalesce(sum(ticket_holds.quantity), 0) into v_held
  from public.ticket_holds
  where ticket_holds.ticket_id = p_ticket_id
    and ticket_holds.status = 'active'
    and ticket_holds.held_until > now();

  if v_available - v_held < p_quantity then
    raise exception 'Not enough tickets are available for a two-minute hold.';
  end if;

  insert into public.ticket_holds (ticket_id, user_id, quantity, held_until)
  values (p_ticket_id, auth.uid(), p_quantity, v_until)
  returning ticket_holds.id into v_hold_id;

  -- Return with explicit alias to avoid ambiguity between output column held_until and table column
  return query select v_hold_id::uuid as hold_id, v_until::timestamptz as held_until;
end;
$$;

grant execute on function public.hold_ticket(uuid, integer) to authenticated;

-- Also fix release function to be safe (no held_until ambiguity but qualify anyway)
drop function if exists public.release_ticket_hold(uuid);

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
  where ticket_holds.id = p_hold_id
    and ticket_holds.status = 'active'
    and (ticket_holds.user_id = auth.uid() or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  get diagnostics v_changed = row_count;
  return v_changed > 0;
end;
$$;

grant execute on function public.release_ticket_hold(uuid) to authenticated;
