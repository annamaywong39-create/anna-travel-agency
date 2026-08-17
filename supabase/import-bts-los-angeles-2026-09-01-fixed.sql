-- BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 1, 2026
-- SoFi Stadium, Inglewood, CA
-- Generated from pasted supplier list

do $$
declare v_event_id uuid;
begin
  select id into v_event_id from public.events where lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 1') limit 1;
  if v_event_id is null then
    insert into public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    values (
      'BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 1',
      'Request access for BTS WORLD TOUR ARIRANG at SoFi Stadium. Inventory subject to supplier verification and final confirmation.',
      '2026-09-01T20:00:00-07:00',
      'SoFi Stadium',
      'Inglewood, CA',
      '/images/events/bts/bts-arirang-tour.jpg',
      '/images/seatmaps/bts-chicago-2026-08-27.png',
      'upcoming',
      'Music'
    ) returning id into v_event_id;
  end if;

  insert into public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  select v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile transfer', 'Evening before event', null, v.price, v.quantity_available, 'available', v.discount_percent
  from (values
    ('Outer 519', 'Outer 519', '16', '2 tickets; fees included', 275, 2, 60),
    ('Outer 519', 'Outer 519', '13', '2 tickets; fees included', 275, 2, 60),
    ('Outer 505', 'Outer 505', '16', '2 tickets; fees included', 282, 2, 60),
    ('Outer 509', 'Outer 509', '16', '2 tickets; fees included', 282, 2, 60),
    ('Outer 505', 'Outer 505', '15', '2 tickets; fees included', 322, 2, 60),
    ('Outer 513', 'Outer 513', '21', '2 tickets; fees included', 324, 2, 60),
    ('Outer 518', 'Outer 518', '10', '2 tickets; fees included', 325, 2, 60),
    ('Outer 520', 'Outer 520', '13', '2 tickets; fees included', 325, 2, 60),
    ('Outer 517', 'Outer 517', '14', '2 tickets; fees included', 331, 2, 60),
    ('Outer 517', 'Outer 517', '15', '2 tickets; fees included', 331, 2, 60),
    ('Outer 518', 'Outer 518', '18', '2 tickets; fees included', 331, 2, 60),
    ('Outer 528', 'Outer 528', '4', '2 tickets; fees included', 428, 1, 60),
    ('Outer 522', 'Outer 522', '5', '2 tickets; fees included', 432, 2, 60),
    ('Outer 522', 'Outer 522', '4', '2 tickets; fees included', 433, 2, 60),
    ('Outer 531', 'Outer 531', '7', '2 tickets; fees included', 433, 2, 60),
    ('Outer 545', 'Outer 545', '17', '2 tickets; fees included', 433, 2, 60),
    ('Outer 545', 'Outer 545', '2', '2 tickets; fees included', 433, 1, 60),
    ('Outer 542', 'Outer 542', '8', '2 tickets; fees included', 434, 2, 60),
    ('Outer 521', 'Outer 521', '3', '2 tickets; fees included', 443, 2, 60),
    ('Outer 530', 'Outer 530', '8', '2 tickets; fees included', 443, 2, 60),
    ('Outer 539', 'Outer 539', '6', '2 tickets; fees included', 443, 2, 60),
    ('Outer 532', 'Outer 532', '4', '2 tickets; fees included', 445, 2, 60),
    ('Floor C3', 'Floor C3', '2', '2 tickets; fees included', 7357, 1, 70),
    ('FRONT', 'FRONT', 'VIP', '2 tickets; fees included', 13210, 1, 65),
    ('Suite 5 W10', 'Suite 5 W10', '20', '2 tickets; fees included', 17610, 1, 70),
    ('Suite 2 SE7', 'Suite 2 SE7', 'SUITE', '2 tickets; fees included', 17656, 1, 70),
    ('Suite 4 E11', 'Suite 4 E11', 'SUITE', '2 tickets; fees included', 18245, 1, 70),
    ('Suite 2 W8', 'Suite 2 W8', 'SUITE', '2 tickets; fees included', 21186, 1, 70),
    ('Suite 4 W15', 'Suite 4 W15', 'SUITE', '2 tickets; fees included', 21418, 1, 70),
    ('Suite 2 NE5', 'Suite 2 NE5', '20TIXS', '2 tickets; fees included', 23078, 1, 70),
    ('Outer 531', 'Outer 531', '15', '2 tickets; fees included', 124595, 2, 60),
    ('Lower 120', 'Lower 120', '8', '2 tickets; fees included', 1646, 2, 65),
    ('Outer 522', 'Outer 522', '19', '2 tickets; fees included', 1648, 1, 60),
    ('Outer 522', 'Outer 522', '20', '2 tickets; fees included', 1649, 2, 60),
    ('Outer 522', 'Outer 522', '17', '2 tickets; fees included', 1673, 1, 60),
    ('Lower Club C107', 'Lower Club C107', '16', '2 tickets; fees included', 1674, 2, 65),
    ('Outer 522', 'Outer 522', '18', '2 tickets; fees included', 1675, 2, 60),
    ('Lower Club C135', 'Lower Club C135', '8', '2 tickets; fees included', 1702, 2, 65),
    ('Lower Club C136', 'Lower Club C136', '16', '2 tickets; fees included', 1725, 2, 65),
    ('Lower Club C127', 'Lower Club C127', '11', '2 tickets; fees included', 1733, 2, 65),
    ('Suite 2 NE5', 'Suite 2 NE5', '1', '2 tickets; fees included', 1736, 1, 70),
    ('Suite 7 E24', 'Suite 7 E24', '2', '2 tickets; fees included', 1758, 1, 70),
    ('Lower 100', 'Lower 100', '11', '2 tickets; fees included', 1773, 1, 65),
    ('Outer 521', 'Outer 521', '22', '2 tickets; fees included', 1775, 2, 60),
    ('Outer 521', 'Outer 521', '20', '2 tickets; fees included', 1787, 2, 60),
    ('Outer 521', 'Outer 521', '18', '2 tickets; fees included', 1813, 2, 60),
    ('Lower Club C107', 'Lower Club C107', '18', '2 tickets; fees included', 1820, 2, 65),
    ('Outer 528', 'Outer 528', '20', '2 tickets; fees included', 1833, 2, 60),
    ('Outer 540', 'Outer 540', '15', '2 tickets; fees included', 1852, 1, 60),
    ('Lower Club C114', 'Lower Club C114', '17', '2 tickets; fees included', 1910, 2, 65),
    ('Lower 122', 'Lower 122', '16', '2 tickets; fees included', 1925, 2, 65),
    ('Middle 328', 'Middle 328', '8', '2 tickets; fees included', 1975, 1, 65),
    ('Middle 320', 'Middle 320', '9', '2 tickets; fees included', 2003, 2, 65),
    ('Middle 325', 'Middle 325', '7', '2 tickets; fees included', 2003, 2, 65),
    ('Floor D3', 'Floor D3', '5', '2 tickets; fees included', 2057, 2, 70),
    ('Suite 7 E24', 'Suite 7 E24', '1', '2 tickets; fees included', 2103, 1, 70),
    ('Floor D4', 'Floor D4', '8', '2 tickets; fees included', 2116, 2, 70),
    ('Lower Club C117', 'Lower Club C117', '14', '2 tickets; fees included', 2239, 2, 65),
    ('Floor D4', 'Floor D4', '8', '2 tickets; fees included', 2271, 2, 70),
    ('HOT SEAT HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $2,313 each $2,313 each *Fees Included* Section Silver Fan Silver Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,429 each $2,429 each *Fees Included* Section Lower 120 Lower 120', 'HOT SEAT HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $2,313 each $2,313 each *Fees Included* Section Silver Fan Silver Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,429 each $2,429 each *Fees Included* Section Lower 120 Lower 120', '16', '2 tickets; fees included', 2436, 1, 70),
    ('Diamond Fan Diamond Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,487 each $2,487 each *Fees Included* Section Inner 205 Inner 205', 'Diamond Fan Diamond Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,487 each $2,487 each *Fees Included* Section Inner 205 Inner 205', '2', '2 tickets; fees included', 2498, 2, 70),
    ('Inner 225', 'Inner 225', '15', '2 tickets; fees included', 2508, 2, 65),
    ('Floor D3', 'Floor D3', '5', '2 tickets; fees included', 2582, 2, 70),
    ('Floor A3', 'Floor A3', '2', '2 tickets; fees included', 2612, 2, 70),
    ('Diamond Deluxe Diamond Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,631 each $2,631 each *Fees Included* Section Inner 230 Inner 230', 'Diamond Deluxe Diamond Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,631 each $2,631 each *Fees Included* Section Inner 230 Inner 230', '20', '2 tickets; fees included', 2720, 1, 70),
    ('Middle 341', 'Middle 341', '5', '2 tickets; fees included', 2840, 4, 65),
    ('Inner 210', 'Inner 210', '5', '2 tickets; fees included', 2872, 2, 65),
    ('Lower Club C106', 'Lower Club C106', '9', '2 tickets; fees included', 3121, 2, 65),
    ('PREMIUM HOT SEAT PREMIUM HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $3,121 each $3,121 each *Fees Included* Section Lower 123 Lower 123', 'PREMIUM HOT SEAT PREMIUM HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $3,121 each $3,121 each *Fees Included* Section Lower 123 Lower 123', '19', '2 tickets; fees included', 3128, 2, 70),
    ('Lower Club C129', 'Lower Club C129', '9', '2 tickets; fees included', 3292, 2, 65),
    ('Diamond Elite Diamond Elite Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,324 each $3,324 each *Fees Included* Section Lower 104 Lower 104', 'Diamond Elite Diamond Elite Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,324 each $3,324 each *Fees Included* Section Lower 104 Lower 104', '3', '2 tickets; fees included', 3441, 2, 70),
    ('Lower Club C133', 'Lower Club C133', '10', '2 tickets; fees included', 3729, 2, 65),
    ('Inner 234', 'Inner 234', '1', '2 tickets; fees included', 3813, 2, 65),
    ('Gold Fan Gold Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,871 each $3,871 each *Fees Included* Section Gold Deluxe Gold Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $4,044 each $4,044 each *Fees Included* Section SILVER VIP FLOOR SILVER VIP FLOOR Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $4,044 each $4,044 each *Fees Included* Section Lower Club C116 Lower Club C116', 'Gold Fan Gold Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,871 each $3,871 each *Fees Included* Section Gold Deluxe Gold Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $4,044 each $4,044 each *Fees Included* Section SILVER VIP FLOOR SILVER VIP FLOOR Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $4,044 each $4,044 each *Fees Included* Section Lower Club C116 Lower Club C116', '15', '2 tickets; fees included', 4124, 1, 70),
    ('VIP SOUNDCHECK VIP SOUNDCHECK Package 1 to 6 or 8 Ticket Packages available 1-6 or 8 Ticket Packages $4,159 each $4,159 each *Fees Included* Section Lower Club C128 Lower Club C128', 'VIP SOUNDCHECK VIP SOUNDCHECK Package 1 to 6 or 8 Ticket Packages available 1-6 or 8 Ticket Packages $4,159 each $4,159 each *Fees Included* Section Lower Club C128 Lower Club C128', '18', '2 tickets; fees included', 4186, 2, 70)
  ) as v(category_name, section, row, seat_details, price, quantity_available, discount_percent)
  where not exists (
    select 1 from public.event_tickets existing
    where existing.event_id = v_event_id
      and existing.category_name = v.category_name
      and coalesce(existing.row, '') = v.row
      and existing.price = v.price
  );
end $$;
