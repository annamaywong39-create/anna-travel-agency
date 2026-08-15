-- BTS WORLD TOUR 'ARIRANG' — Arlington, TX
-- Saturday, August 15, 2026 at 8:00 PM
-- AT&T Stadium, Arlington, TX
-- Safe import: creates the event if missing and adds ticket rows only when the same event/category/row/price is not already present.
-- Quantities use the minimum guaranteed quantity when the supplier says "2 or 4" or "1 to 5".
-- The original range is preserved in seat_details.

do $$
declare
  v_event_id uuid;
begin
  select id into v_event_id
  from public.events
  where lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Arlington')
  limit 1;

  if v_event_id is null then
    insert into public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    values (
      'BTS WORLD TOUR ''ARIRANG'' — Arlington',
      'Request access for BTS WORLD TOUR ARIRANG at AT&T Stadium. Ticket inventory is subject to supplier verification and final confirmation.',
      '2026-08-15T20:00:00-05:00',
      'AT&T Stadium',
      'Arlington, TX',
      '/images/events/bts/bts-metlife-promo.png',
      '/images/seatmaps/bts-arlington-2026-08-15.png',
      'upcoming',
      'Music'
    ) returning id into v_event_id;
  else
    update public.events
    set seat_map_url = coalesce(seat_map_url, '/images/seatmaps/bts-arlington-2026-08-15.png'),
        image_url = coalesce(image_url, '/images/events/bts/bts-metlife-promo.png')
    where id = v_event_id;
  end if;

  insert into public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  select v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile entry', 'Expected by August 14, 2026', '/images/seatmaps/bts-arlington-2026-08-15.png', v.price, v.quantity_available, 'available', v.discount_percent
  from (values
    ('Field 7','Field 7','29','2 tickets available; fees included',1134,2,70),
    ('Field 7','Field 7','25','1 ticket available; fees included',1277,1,70),
    ('Life Goes On VIP Experience','VIP','VIP','2 or 4 ticket packages; fees included',4395,2,70),
    ('100s Level 148','148','18','1 to 5 tickets available; fees included',788,1,60),
    ('400s Level 440','440','29','2 tickets available; fees included',379,2,60),
    ('300s Level C333','C333','11','2 tickets available; fees included',600,2,61),
    ('300s Level C333','C333','13','2 or 4 tickets available; fees included',690,2,61),
    ('Founders Club 210','210','4','1 to 3 or 5 tickets available; fees included',844,1,70),
    ('Founders Club 210','210','2','1 or 3 tickets available; fees included',938,1,70),
    ('Founders Club 210','210','14','1 to 3 tickets available; fees included',1085,1,70),
    ('Founders Club 210','210','1','2 tickets available; fees included',1567,2,70),
    ('400s Level 434','434','22','2 tickets available; fees included',351,2,60),
    ('400s Level 408','408','20','2 or 4 tickets available; fees included',352,2,60),
    ('400s Level 433','433','22','2 or 4 tickets available; fees included',381,2,60),
    ('400s Level 447','447','20','2 tickets available; fees included',404,2,60),
    ('400s Level 433','433','14','2 tickets; zone seating; open zone seating disclaimer; fees included',415,2,60),
    ('400s Level 436','436','16','2 or 4 tickets; zone seating; open zone seating disclaimer; fees included',415,2,60),
    ('400s Level 416','416','26','2 tickets; zone seating; open zone seating disclaimer; fees included',417,2,60),
    ('400s Level 438','438','24','2 tickets available; fees included',420,2,60),
    ('400s Level 433','433','13','2 tickets; zone seating; open zone seating disclaimer; fees included',423,2,60),
    ('400s Level 445','445','26','1 to 5 or 7 tickets available; fees included',432,1,60),
    ('400s Level 441','441','30','2 tickets available; fees included',435,2,60),
    ('400s Level 414','414','29','2 or 4 tickets available; fees included',444,2,60),
    ('400s Level 434','434','17','2 tickets; zone seating; open zone seating disclaimer; fees included',448,2,60),
    ('400s Level 447','447','1','2 tickets available; fees included',454,2,60),
    ('400s Level 434','434','13','2 or 4 tickets; zone seating; open zone seating disclaimer; fees included',457,2,60),
    ('400s Level 404','404','24','2 or 4 tickets available; fees included',459,2,60),
    ('400s Level 405','405','25','2 or 4 tickets available; fees included',459,2,60),
    ('400s Level 419','419','26','2 or 4 tickets available; fees included',459,2,60),
    ('400s Level 420','420','25','2 or 4 tickets available; fees included',459,2,60),
    ('400s Level 421','421','24','2 or 4 tickets available; fees included',459,2,60),
    ('400s Level 455','455','4','1 ticket available; fees included',475,1,60),
    ('400s Level 404','404','22','2 or 4 tickets available; fees included',483,2,60),
    ('400s Level 405','405','23','2 or 4 tickets available; fees included',483,2,60),
    ('400s Level 419','419','24','2 or 4 tickets available; fees included',483,2,60),
    ('400s Level 420','420','23','2 or 4 tickets available; fees included',483,2,60),
    ('400s Level 421','421','22','2 or 4 tickets available; fees included',483,2,60),
    ('300s Level 344','344','7','2 tickets available; fees included',490,2,65),
    ('300s Level 327','327','13','2 tickets available; fees included',491,2,67),
    ('400s Level 423','423','1','2 tickets available; fees included',494,2,60),
    ('400s Level 404','404','20','2 or 4 tickets available; fees included',508,2,60),
    ('400s Level 405','405','21','2 or 4 tickets available; fees included',508,2,60),
    ('400s Level 419','419','22','2 or 4 tickets available; fees included',508,2,60),
    ('400s Level 420','420','20','2 or 4 tickets available; fees included',508,2,60),
    ('400s Level 421','421','20','2 or 4 tickets available; fees included',508,2,60),
    ('400s Level 415','415','10','2 tickets available; fees included',512,2,60),
    ('300s Level 329','329','15','2 tickets available; fees included',515,2,60),
    ('300s Level 343','343','8','2 or 4 tickets available; fees included',520,2,63),
    ('300s Level 327','327','5','2 tickets available; fees included',522,2,67),
    ('300s Level 327','327','5','2 or 4 tickets available; fees included',546,2,67),
    ('400s Level 449','449','26','2 or 4 tickets available; fees included',534,2,60),
    ('300s Level 329','329','5','1 or 3 tickets available; fees included',537,1,60),
    ('400s Level 441','441','16','2 or 4 tickets available; fees included',541,2,60),
    ('400s Level 403','403','1','2 or 4 tickets available; fees included',544,2,60),
    ('200s Level 242','242','15','2 tickets available; fees included',548,2,65),
    ('400s Level 449','449','24','2 or 4 tickets available; fees included',558,2,60),
    ('300s Level C332','C332','11','1 or 3 tickets available; fees included',564,1,70),
    ('300s Level C339','C339','12','1 or 3 tickets available; fees included',574,1,62),
    ('300s Level 329','329','7','2 tickets available; fees included',575,2,60),
    ('400s Level 403','403','23','2 or 4 tickets available; fees included',583,2,60),
    ('HOT SEAT','HOT SEAT','Package','1 to 10 or 12 packages; reserved upper bowl seating and VIP merchandise bundle; fees included',2313,1,70),
    ('PREMIUM HOT SEAT','PREMIUM HOT SEAT','Package','1 to 10 or 12 packages; reserved lower bowl seating and VIP merchandise bundle; fees included',3121,1,70),
    ('SILVER VIP FLOOR','SILVER VIP FLOOR','Package','1 to 10 or 12 packages; premium floor first 25 rows and VIP merchandise bundle; fees included',4044,1,70),
    ('VIP SOUNDCHECK','VIP SOUNDCHECK','Package','1 to 6 or 8 packages; premium reserved seating, VIP soundcheck and VIP merchandise bundle; fees included',4159,1,70),
    ('GOLD VIP FLOOR','GOLD VIP FLOOR','Package','1 to 6 or 8 packages; premium floor first 10 rows and VIP merchandise bundle; fees included',5197,1,70),
    ('DIAMOND VIP FLOOR','DIAMOND VIP FLOOR','Package','2 or 4 packages; premium floor first 5 rows and VIP merchandise bundle; fees included',6351,2,70),
    ('FRONT ROW VIP FLOOR','FRONT ROW VIP FLOOR','Package','2 or 4 packages; premium floor front row and VIP merchandise bundle; fees included',9812,2,70)
  ) as v(category_name, section, row, seat_details, price, quantity_available, discount_percent)
  where not exists (
    select 1 from public.event_tickets existing
    where existing.event_id = v_event_id
      and existing.category_name = v.category_name
      and coalesce(existing.row, '') = v.row
      and existing.price = v.price
  );
end $$;
