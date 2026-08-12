-- Apply Batch 1 of BTS Chicago August 28 ticket inventory.
-- Safe: creates the dated event if missing and skips exact duplicates.
do $$
declare v_event_id uuid;
begin
  select id into v_event_id from public.events where lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Chicago — August 28') limit 1;
  if v_event_id is null then
    insert into public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    values ('BTS WORLD TOUR ''ARIRANG'' — Chicago — August 28', 'Request access for BTS WORLD TOUR ARIRANG at Soldier Field. Inventory is subject to supplier verification and final confirmation.', '2026-08-28T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', '/images/events/bts/bts-giveaway-light.png', '/images/seatmaps/bts-chicago-2026-08-27.png', 'upcoming', 'Music') returning id into v_event_id;
  end if;
  insert into public.event_tickets (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status)
  select v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile entry', 'Expected before event', '/images/seatmaps/bts-chicago-2026-08-27.png', v.price, v.quantity_available, 'available'
  from (values
    ('Upper 356','356','17','2 or 4 tickets available',375,2),
    ('Upper 428','428','32','2 tickets available',377,2),
    ('Upper 443','443','25','2 tickets available',381,2),
    ('Upper 444','444','19','2 tickets available',384,2),
    ('Upper 445','445','15','2 tickets available',386,2),
    ('Upper 446','446','19','2 tickets available',386,2),
    ('Upper 442','442','34','2 tickets available',387,2),
    ('Upper 443','443','33','2 tickets available',387,2),
    ('Upper 356','356','14','2 tickets available',390,2),
    ('Upper 356','356','13','2 or 4 tickets available',390,2),
    ('Upper 430','430','19','2 tickets available',390,2),
    ('Upper 349','349','15','2 tickets available',392,2),
    ('Upper 349','349','12','2 or 4 tickets available',394,2),
    ('Upper 356','356','17','2 or 4 tickets available',395,2),
    ('Upper 354','354','18','2 tickets available',396,2),
    ('Upper 355','355','11','2 or 4 tickets available',398,2),
    ('Upper 443','443','25','2 tickets available',399,2),
    ('Upper 354','354','10','2 or 4 tickets available',401,2),
    ('Upper 355','355','10','2 or 4 tickets available',401,2),
    ('Upper 349','349','12','2 tickets available',403,2),
    ('Upper 353','353','16','2 or 4 tickets available',403,2),
    ('Upper 355','355','11','2 or 4 tickets available',404,2),
    ('Upper 354','354','9','2 or 4 tickets available',406,2),
    ('Upper 356','356','9','2 or 4 tickets available',406,2),
    ('Upper 444','444','23','2 tickets available',406,2),
    ('Upper 444','444','14','2 tickets available',406,2),
    ('Upper 352','352','17','2 tickets available',410,2),
    ('Upper 432','432','27','2 tickets available',412,2),
    ('Upper 351','351','13','2 or 4 tickets available',416,2),
    ('Upper 348','348','23','1 ticket available',422,1),
    ('Upper 428','428','18','2 tickets available',432,2),
    ('Upper 441','441','27','2 tickets available',432,2),
    ('Upper 351','351','15','2 tickets available',434,2),
    ('Upper 433','433','23','2 or 4 tickets available',434,2),
    ('Club 317','317','17','2 or 4 tickets available',493,2),
    ('Club 301','301','16','2 tickets available',511,2),
    ('Club 313','313','4','1 ticket available',526,1),
    ('Club 314','314','13','2 or 4 tickets available',527,2),
    ('Club 304','304','12','1 ticket available',562,1),
    ('Club 316','316','9','2 or 4 tickets available',574,2),
    ('Life Goes On VIP Experience','Life Goes On VIP Experience','VIP','2 tickets; fees included',4395,2),
    ('Dynamite VIP Experience','Dynamite VIP Experience','VIP','2 or 4 tickets; fees included',4772,2),
    ('Suite','Suite','B LEVEL','1 ticket; fees included',7482,1),
    ('Suite','Suite','PREMIIUM','1 ticket; fees included',11469,1)
  ) as v(category_name, section, row, seat_details, price, quantity_available)
  where not exists (select 1 from public.event_tickets existing where existing.event_id = v_event_id and existing.category_name = v.category_name and coalesce(existing.row, '') = v.row and existing.price = v.price);
end $$;
