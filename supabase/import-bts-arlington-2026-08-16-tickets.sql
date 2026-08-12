-- BTS WORLD TOUR 'ARIRANG' — Arlington, TX
-- Sunday, August 16, 2026 at 8:00 PM
-- AT&T Stadium, Arlington, TX
-- Safe import: creates the dated event if missing and skips duplicate event/category/row/price rows.
-- For ranges such as "2 or 4", quantity_available uses the minimum guaranteed quantity and preserves the range in seat_details.

do $$
declare v_event_id uuid;
begin
  select id into v_event_id from public.events where lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Arlington — August 16') limit 1;
  if v_event_id is null then
    insert into public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    values ('BTS WORLD TOUR ''ARIRANG'' — Arlington — August 16', 'Request access for BTS WORLD TOUR ARIRANG at AT&T Stadium. Inventory is subject to supplier verification and final confirmation.', '2026-08-16T20:00:00-05:00', 'AT&T Stadium', 'Arlington, TX', '/images/events/bts/bts-metlife-promo.png', '/images/seatmaps/bts-arlington-2026-08-15.png', 'upcoming', 'Music') returning id into v_event_id;
  end if;

  insert into public.event_tickets (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status)
  select v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile entry', 'Expected by August 15, 2026', '/images/seatmaps/bts-arlington-2026-08-15.png', v.price, v.quantity_available, 'available'
  from (values
    ('Gold Deluxe','Gold Deluxe','Package','1 to 4 packages; fees included',1275,1),
    ('100s Level C132','C132','13','1 to 7 tickets; fees included',1281,1),
    ('Hall of Fame Suite 251A','251A','BAR','1 ticket; fees included',1281,1),
    ('200s Level C237','C237','1','2 or 4 tickets; fees included',1284,2),
    ('100s Level C110','C110','20','1 ticket; fees included',1285,1),
    ('100s Level 120','120','22','2 or 4 tickets; fees included',1336,2),
    ('100s Level 126','126','20','2 tickets; fees included',1336,2),
    ('100s Level C136','C136','5','2 tickets; fees included',1336,2),
    ('100s Level 150','150','18','2 tickets; fees included',1336,2),
    ('100s Level C135','C135','9','2 or 4 tickets; fees included',1340,2),
    ('Hall of Fame Suite 214','214','A','1 ticket; fees included',1351,1),
    ('Hall of Fame Suite 251A','251A','B','1 to 4 tickets; fees included',1351,1),
    ('100s Level 126','126','19','2 tickets; fees included',1361,2),
    ('100s Level 150','150','17','2 tickets; fees included',1361,2),
    ('Field 7','Field 7','20','2 tickets; fees included',1379,2),
    ('100s Level 126','126','17','2 tickets; fees included',1386,2),
    ('100s Level 150','150','15','2 tickets; fees included',1386,2),
    ('100s Level C139','C139','1','2 or 4 tickets; fees included',1445,2),
    ('Hall of Fame Suite 253','253','SUITE','1 to 16 tickets; fees included',1449,1),
    ('200s Level 230','230','1','2 tickets; fees included',1449,2),
    ('100s Level C109','C109','11','2 or 4 tickets; fees included',1451,2),
    ('100s Level C134','C134','1','2 tickets; fees included',1490,2),
    ('Diamond Fan','Diamond Fan','Package','1 to 4 packages; fees included',1506,1),
    ('300s Level C314','C314','15','1 to 4 tickets; zone seating; open zone seating disclaimer; fees included',1539,1),
    ('Hall of Fame Suite 251A','251A','A','1 to 2 tickets; fees included',1608,1),
    ('Diamond Deluxe','Diamond Deluxe','Package','1 to 4 packages; fees included',1679,1),
    ('100s Level 143','143','21','2 tickets; fees included',1680,2),
    ('Field 7','Field 7','21','2 or 4 tickets; fees included',1763,2),
    ('Field 7','Field 7','20','2 or 4 tickets; fees included',1792,2),
    ('100s Level 101','101','21','2 or 4 tickets; fees included',1815,2),
    ('100s Level 149','149','20','1 to 4 tickets; zone seating; open zone seating disclaimer; fees included',2046,1),
    ('Event Level Suite EL112','EL112','2','1 to 5 tickets; fees included',2256,1),
    ('HOT SEAT','HOT SEAT','Package','1 to 10 or 12 packages; fees included',2313,1),
    ('100s Level C111','C111','20','1 to 2 tickets; zone seating; open zone seating disclaimer; fees included',2338,1),
    ('100s Level C133','C133','18','1 to 5 or 7 tickets; fees included',2568,1),
    ('100s Level C111','C111','22','1 to 4 tickets; fees included',2884,1),
    ('Field 15','Field 15','5','2 tickets; fees included',2955,2),
    ('PREMIUM HOT SEAT','PREMIUM HOT SEAT','Package','1 to 10 or 12 packages; fees included',3121,1),
    ('SILVER VIP FLOOR','SILVER VIP FLOOR','Package','1 to 10 or 12 packages; fees included',4044,1),
    ('VIP SOUNDCHECK','VIP SOUNDCHECK','Package','1 to 6 or 8 packages; fees included',4159,1),
    ('GOLD VIP FLOOR','GOLD VIP FLOOR','Package','1 to 6 or 8 packages; fees included',5197,1),
    ('DIAMOND VIP FLOOR','DIAMOND VIP FLOOR','Package','2 or 4 packages; fees included',6351,2),
    ('FRONT ROW VIP FLOOR','FRONT ROW VIP FLOOR','Package','2 or 4 packages; fees included',9812,2),
    ('Silver Suite SV451','SV451','SUITE','1 ticket; fees included',13712,1),
    ('FIELD SUITE 24','FIELD SUITE 24','SUITE','1 to 16 or 18 tickets; zone seating; open zone seating disclaimer; fees included',1016,1),
    ('LUXURY SUITE','LUXURY SUITE','SUITE','1 to 14 tickets; fees included',1287,1),
    ('Life Goes On VIP Experience','Life Goes On VIP Experience','VIP','2 or 4 tickets; fees included',4395,2),
    ('Dynamite VIP Experience','Dynamite VIP Experience','VIP','2 or 4 tickets; fees included',4772,2),
    ('OWNERS CLUB SUITE 228','OWNERS CLUB SUITE 228','18TIX','1 ticket; fees included',13849,1)
  ) as v(category_name, section, row, seat_details, price, quantity_available)
  where not exists (select 1 from public.event_tickets existing where existing.event_id = v_event_id and existing.category_name = v.category_name and coalesce(existing.row, '') = v.row and existing.price = v.price);
end $$;
