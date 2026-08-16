-- Add or replace the three verified BTS tickets for M&T Bank Stadium.
-- Fixed: includes discount_percent 60-70% (stable, does not change on refresh)
begin;

delete from public.event_tickets
where event_id = (
  select id from public.events
  where title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE'
    and venue = 'M&T Bank Stadium'
  limit 1
);

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
  status,
  discount_percent
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
  'available',
  inventory.discount_percent
from public.events e
cross join (
  values
    ('Five Hundreds Level 532', 149, 2, '532', '16', '2 mobile tickets', 65),
    ('Field R', 973, 2, 'Field R', '13', '2 mobile tickets', 70),
    ('Hundreds Level 133', 371, 2, '133', '32', '2 mobile tickets', 60)
) as inventory(category_name, price, quantity_available, section, row_label, seat_details, discount_percent)
where e.title = 'BTS WORLD TOUR ''ARIRANG'' IN BALTIMORE'
  and e.venue = 'M&T Bank Stadium';

commit;
