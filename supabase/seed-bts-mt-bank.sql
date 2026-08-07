-- Add or replace the three verified BTS tickets for M&T Bank Stadium.
-- This changes only event_tickets for the BTS Baltimore event.

begin;

-- Remove any previous test inventory for this one event.
delete from public.event_tickets
where event_id = (
  select id
  from public.events
  where title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE'
    and venue = 'M&T Bank Stadium'
  limit 1
);

-- Add Anna's verified inventory.
insert into public.event_tickets (
  event_id,
  category_name,
  price,
  quantity_available,
  section,
  "row",
  seat_details,
  delivery_method,
  delivery_timing,
  status
)
select
  e.id,
  inventory.category_name,
  inventory.price,
  inventory.quantity_available,
  inventory.section,
  inventory.row_label,
  inventory.seat_details,
  'Mobile transfer',
  'Evening before event',
  'available'
from public.events e
cross join (
  values
    ('Five Hundreds Level 532', 149, 2, '532', '16', '2 mobile tickets'),
    ('Field R', 973, 2, 'Field R', '13', '2 mobile tickets'),
    ('Hundreds Level 133', 371, 2, '133', '32', '2 mobile tickets')
) as inventory(category_name, price, quantity_available, section, row_label, seat_details)
where e.title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE'
  and e.venue = 'M&T Bank Stadium'
;

commit;
