-- BTS WORLD TOUR 'ARIRANG' — Chicago, IL
-- Thursday, August 27, 2026 at 8:00 PM
-- Soldier Field, Chicago, IL
-- Safe import: creates the dated event if missing and skips duplicate event/category/row/price rows.

do $$
declare v_event_id uuid;
begin
  select id into v_event_id from public.events where lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Chicago — August 27') limit 1;
  if v_event_id is null then
    insert into public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    values ('BTS WORLD TOUR ''ARIRANG'' — Chicago — August 27', 'Request access for BTS WORLD TOUR ARIRANG at Soldier Field. Inventory is subject to supplier verification and final confirmation.', '2026-08-27T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', '/images/events/bts/bts-giveaway-light.png', '/images/seatmaps/bts-chicago-2026-08-27.png', 'upcoming', 'Music') returning id into v_event_id;
  end if;

  insert into public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  select v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile entry', 'Expected before event', '/images/seatmaps/bts-chicago-2026-08-27.png', v.price, v.quantity_available, 'available'
  from (values
    ('Gold Elite','Gold Elite','Package','1 to 4 packages; fees included',3064,1,70),
    ('D Suites','D Suites','10','1 ticket; zone seating; open zone seating disclaimer; fees included',3121,1,66),
    ('PREMIUM HOT SEAT','PREMIUM HOT SEAT','Package','1 to 10 or 12 packages; fees included',3121,1,70),
    ('Deluxe Hotel','Deluxe Hotel','Package','2 or 4 packages; fees included',3179,2,66),
    ('B Suites','B Suites','15','2 or 4 tickets; fees included',3842,2,62),
    ('D Suites','D Suites','4','1 ticket; fees included',4003,1,66),
    ('SILVER VIP FLOOR','SILVER VIP FLOOR','Package','1 to 10 or 12 packages; fees included',4044,1,70),
    ('VIP SOUNDCHECK','VIP SOUNDCHECK','Package','1 to 6 or 8 packages; fees included',4159,1,70),
    ('A Suites','A Suites','3','1 ticket; fees included',4310,1,60),
    ('GOLD VIP FLOOR','GOLD VIP FLOOR','Package','1 to 6 or 8 packages; fees included',5197,1,70),
    ('Lower 107','Lower 107','16','1 to 4 tickets; fees included',5337,1,70),
    ('B Suites','B Suites','9','1 to 6 or 8 tickets; fees included',5737,1,62),
    ('DIAMOND VIP FLOOR','DIAMOND VIP FLOOR','Package','2 or 4 packages; fees included',6351,2,70),
    ('B Suites','B Suites','2','1 to 3 tickets; fees included',8104,1,62),
    ('A Suites','A Suites','SUITE','1 ticket; fees included',8105,1,60),
    ('FRONT ROW VIP FLOOR','FRONT ROW VIP FLOOR','Package','2 or 4 packages; fees included',9812,2,70),
    ('A Suites','A Suites','SUITE','1 ticket; fees included',12465,1,60),
    ('Life Goes On VIP Experience','Life Goes On VIP Experience','VIP','2 tickets; fees included',4395,2,70),
    ('Dynamite VIP Experience','Dynamite VIP Experience','VIP','2 or 4 tickets; fees included',4772,2,70),
    ('SUITE','SUITE','B LEVEL','1 ticket; fees included',6236,1,67),
    ('SUITE','SUITE','PREMIIUM','1 ticket; fees included',11469,1,67)
  ) as v(category_name, section, row, seat_details, price, quantity_available, discount_percent)
  where not exists (select 1 from public.event_tickets existing where existing.event_id = v_event_id and existing.category_name = v.category_name and coalesce(existing.row, '') = v.row and existing.price = v.price);
end $$;
