
-- BTS WORLD TOUR 'ARIRANG' — Los Angeles — September 1
DO $$
DECLARE v_event_id uuid;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 1') LIMIT 1;
  IF v_event_id IS NULL THEN
    INSERT INTO public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    VALUES (
      'BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 1',
      'Request access for BTS WORLD TOUR ARIRANG at SoFi Stadium. Inventory subject to verification.',
      '2026-09-01T20:00:00-07:00',
      'SoFi Stadium',
      'Inglewood, CA',
      '/images/events/bts/bts-arirang-tour.jpg',
      '/images/seatmaps/bts-chicago-2026-08-27.png',
      'upcoming',
      'Music'
    ) RETURNING id INTO v_event_id;
  ELSE
    UPDATE public.events SET date = '2026-09-01T20:00:00-07:00', venue='SoFi Stadium', city='Inglewood, CA', image_url='/images/events/bts/bts-arirang-tour.jpg' WHERE id = v_event_id;
  END IF;

  DELETE FROM public.event_tickets WHERE event_id = v_event_id;

  INSERT INTO public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  SELECT v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile transfer', 'Evening before event', null, v.price, v.quantity_available, 'available', v.discount_percent
  FROM (VALUES
    ('Upper 546', 'Upper 546', '16', '2 tickets; fees included', 256, 2, 65),
    ('Upper 547', 'Upper 547', '12', '2 tickets; fees included', 267, 2, 65),
    ('Outer 519', 'Outer 519', '16', '2 tickets; fees included', 275, 2, 60),
    ('Outer 519', 'Outer 519', '13', '2 tickets; fees included', 275, 2, 60),
    ('Outer 505', 'Outer 505', '16', '2 tickets; fees included', 282, 2, 60),
    ('Outer 509', 'Outer 509', '16', '2 tickets; fees included', 282, 2, 60),
    ('Upper 538', 'Upper 538', '14', '2 tickets; fees included', 298, 2, 65),
    ('Upper 551', 'Upper 551', '13', '2 tickets; fees included', 298, 2, 65),
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
    ('Outer 539', 'Outer 539', '6', '2 tickets; fees included', 443, 2, 60)
  ) AS v(category_name, section, row, seat_details, price, quantity_available, discount_percent);
END $$;


-- BTS WORLD TOUR 'ARIRANG' — Los Angeles — September 2
DO $$
DECLARE v_event_id uuid;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 2') LIMIT 1;
  IF v_event_id IS NULL THEN
    INSERT INTO public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    VALUES (
      'BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 2',
      'Request access for BTS WORLD TOUR ARIRANG at SoFi Stadium. Inventory subject to verification.',
      '2026-09-02T20:00:00-07:00',
      'SoFi Stadium',
      'Inglewood, CA',
      '/images/events/bts/bts-arirang-tour.jpg',
      '/images/seatmaps/bts-chicago-2026-08-27.png',
      'upcoming',
      'Music'
    ) RETURNING id INTO v_event_id;
  ELSE
    UPDATE public.events SET date = '2026-09-02T20:00:00-07:00', venue='SoFi Stadium', city='Inglewood, CA', image_url='/images/events/bts/bts-arirang-tour.jpg' WHERE id = v_event_id;
  END IF;

  DELETE FROM public.event_tickets WHERE event_id = v_event_id;

  INSERT INTO public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  SELECT v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile transfer', 'Evening before event', null, v.price, v.quantity_available, 'available', v.discount_percent
  FROM (VALUES
    ('Outer 532', 'Outer 532', '4', '2 tickets; fees included', 445, 2, 60),
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
    ('Floor D3', 'Floor D3', '5', '2 tickets; fees included', 2057, 2, 70)
  ) AS v(category_name, section, row, seat_details, price, quantity_available, discount_percent);
END $$;


-- BTS WORLD TOUR 'ARIRANG' — Los Angeles — September 5
DO $$
DECLARE v_event_id uuid;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 5') LIMIT 1;
  IF v_event_id IS NULL THEN
    INSERT INTO public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    VALUES (
      'BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 5',
      'Request access for BTS WORLD TOUR ARIRANG at SoFi Stadium. Inventory subject to verification.',
      '2026-09-05T20:00:00-07:00',
      'SoFi Stadium',
      'Inglewood, CA',
      '/images/events/bts/bts-arirang-tour.jpg',
      '/images/seatmaps/bts-chicago-2026-08-27.png',
      'upcoming',
      'Music'
    ) RETURNING id INTO v_event_id;
  ELSE
    UPDATE public.events SET date = '2026-09-05T20:00:00-07:00', venue='SoFi Stadium', city='Inglewood, CA', image_url='/images/events/bts/bts-arirang-tour.jpg' WHERE id = v_event_id;
  END IF;

  DELETE FROM public.event_tickets WHERE event_id = v_event_id;

  INSERT INTO public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  SELECT v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile transfer', 'Evening before event', null, v.price, v.quantity_available, 'available', v.discount_percent
  FROM (VALUES
    ('Suite 7 E24', 'Suite 7 E24', '1', '2 tickets; fees included', 2103, 1, 70),
    ('Floor D4', 'Floor D4', '8', '2 tickets; fees included', 2116, 2, 70),
    ('Lower Club C117', 'Lower Club C117', '14', '2 tickets; fees included', 2239, 2, 65),
    ('Floor D4', 'Floor D4', '8', '2 tickets; fees included', 2271, 2, 70),
    ('Lower 120 Lower 120 Row 8 2 Tickets available 2 Tickets $1,646 each $1,646 each *Fees Included* Section Outer 522 Outer 522 Row 19 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,648 each $1,648 each *Fees Included* Section Outer 522 Outer 522 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,649 each $1,649 each *Fees Included* Section Outer 522 Outer 522 Row 17 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,673 each $1,673 each *Fees Included* Section Lower Club C107 Lower Club C107 Row 16 2 or 4 Tickets available 2 or 4 Tickets $1,674 each $1,674 each *Fees Included* Section Outer 522 Outer 522 Row 18 2 or 4 Tickets available 2 or 4 Tickets $1,675 each $1,675 each *Fees Included* Section Lower Club C135 Lower Club C135 Row 8 2 Tickets available 2 Tickets $1,702 each $1,702 each *Fees Included* Section Lower Club C136 Lower Club C136 Row 16 2 Tickets available 2 Tickets $1,725 each $1,725 each *Fees Included* Section Lower Club C127 Lower Club C127 Row 11 2 Tickets available 2 Tickets $1,733 each $1,733 each *Fees Included* Section Suite 2 NE5 Suite 2 NE5 Row 1 to 8 Tickets available 1-8 Tickets $1,736 each $1,736 each *Fees Included* Section Suite 7 E24 Suite 7 E24 Row 2 1 to 8 Tickets available 1-8 Tickets $1,758 each $1,758 each *Fees Included* Section Lower 100 Lower 100 Row 11 1 Ticket available 1 Ticket $1,773 each $1,773 each *Fees Included* Section Outer 521 Outer 521 Row 22 2 or 4 Tickets available 2 or 4 Tickets $1,775 each $1,775 each *Fees Included* Section Outer 521 Outer 521 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,787 each $1,787 each *Fees Included* Section Outer 521 Outer 521 Row 18 2 or 4 Tickets available 2 or 4 Tickets $1,813 each $1,813 each *Fees Included* Section Lower Club C107 Lower Club C107 Row 18 2 Tickets available 2 Tickets $1,820 each $1,820 each *Fees Included* Section Outer 528 Outer 528 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,833 each $1,833 each *Fees Included* Section Outer 540 Outer 540 Row 15 1 to 4 Tickets available 1-4 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,852 each $1,852 each *Fees Included* Section Lower Club C114 Lower Club C114 Row 17 2 Tickets available 2 Tickets $1,910 each $1,910 each *Fees Included* Section Lower 122 Lower 122 Row 16 2 Tickets available 2 Tickets $1,925 each $1,925 each *Fees Included* Section Middle 328 Middle 328 Row 8 1 to 2 Tickets available 1-2 Tickets $1,975 each $1,975 each *Fees Included* Section Middle 320 Middle 320 Row 9 2 Tickets available 2 Tickets $2,003 each $2,003 each *Fees Included* Section Middle 325 Middle 325 Row 7 2 Tickets available 2 Tickets $2,003 each $2,003 each *Fees Included* Section Floor D3 Floor D3 Row 5 2 Tickets available 2 Tickets $2,057 each $2,057 each *Fees Included* Section Suite 7 E24 Suite 7 E24 Row 1 to 8 Tickets available 1-8 Tickets $2,103 each $2,103 each *Fees Included* Section Floor D4 Floor D4 Row 8 2 Tickets available 2 Tickets $2,116 each $2,116 each *Fees Included* Section Lower Club C117 Lower Club C117 Row 14 2 Tickets available 2 Tickets $2,239 each $2,239 each *Fees Included* Section Floor D4 Floor D4 Row 8 2 Tickets available 2 Tickets $2,271 each $2,271 each *Fees Included* Section HOT SEAT HOT SEAT', 'Lower 120 Lower 120 Row 8 2 Tickets available 2 Tickets $1,646 each $1,646 each *Fees Included* Section Outer 522 Outer 522 Row 19 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,648 each $1,648 each *Fees Included* Section Outer 522 Outer 522 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,649 each $1,649 each *Fees Included* Section Outer 522 Outer 522 Row 17 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,673 each $1,673 each *Fees Included* Section Lower Club C107 Lower Club C107 Row 16 2 or 4 Tickets available 2 or 4 Tickets $1,674 each $1,674 each *Fees Included* Section Outer 522 Outer 522 Row 18 2 or 4 Tickets available 2 or 4 Tickets $1,675 each $1,675 each *Fees Included* Section Lower Club C135 Lower Club C135 Row 8 2 Tickets available 2 Tickets $1,702 each $1,702 each *Fees Included* Section Lower Club C136 Lower Club C136 Row 16 2 Tickets available 2 Tickets $1,725 each $1,725 each *Fees Included* Section Lower Club C127 Lower Club C127 Row 11 2 Tickets available 2 Tickets $1,733 each $1,733 each *Fees Included* Section Suite 2 NE5 Suite 2 NE5 Row 1 to 8 Tickets available 1-8 Tickets $1,736 each $1,736 each *Fees Included* Section Suite 7 E24 Suite 7 E24 Row 2 1 to 8 Tickets available 1-8 Tickets $1,758 each $1,758 each *Fees Included* Section Lower 100 Lower 100 Row 11 1 Ticket available 1 Ticket $1,773 each $1,773 each *Fees Included* Section Outer 521 Outer 521 Row 22 2 or 4 Tickets available 2 or 4 Tickets $1,775 each $1,775 each *Fees Included* Section Outer 521 Outer 521 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,787 each $1,787 each *Fees Included* Section Outer 521 Outer 521 Row 18 2 or 4 Tickets available 2 or 4 Tickets $1,813 each $1,813 each *Fees Included* Section Lower Club C107 Lower Club C107 Row 18 2 Tickets available 2 Tickets $1,820 each $1,820 each *Fees Included* Section Outer 528 Outer 528 Row 20 2 or 4 Tickets available 2 or 4 Tickets $1,833 each $1,833 each *Fees Included* Section Outer 540 Outer 540 Row 15 1 to 4 Tickets available 1-4 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $1,852 each $1,852 each *Fees Included* Section Lower Club C114 Lower Club C114 Row 17 2 Tickets available 2 Tickets $1,910 each $1,910 each *Fees Included* Section Lower 122 Lower 122 Row 16 2 Tickets available 2 Tickets $1,925 each $1,925 each *Fees Included* Section Middle 328 Middle 328 Row 8 1 to 2 Tickets available 1-2 Tickets $1,975 each $1,975 each *Fees Included* Section Middle 320 Middle 320 Row 9 2 Tickets available 2 Tickets $2,003 each $2,003 each *Fees Included* Section Middle 325 Middle 325 Row 7 2 Tickets available 2 Tickets $2,003 each $2,003 each *Fees Included* Section Floor D3 Floor D3 Row 5 2 Tickets available 2 Tickets $2,057 each $2,057 each *Fees Included* Section Suite 7 E24 Suite 7 E24 Row 1 to 8 Tickets available 1-8 Tickets $2,103 each $2,103 each *Fees Included* Section Floor D4 Floor D4 Row 8 2 Tickets available 2 Tickets $2,116 each $2,116 each *Fees Included* Section Lower Club C117 Lower Club C117 Row 14 2 Tickets available 2 Tickets $2,239 each $2,239 each *Fees Included* Section Floor D4 Floor D4 Row 8 2 Tickets available 2 Tickets $2,271 each $2,271 each *Fees Included* Section HOT SEAT HOT SEAT', 'Package', '2 tickets; fees included', 2313, 1, 70),
    ('Silver Fan', 'Silver Fan', 'Package', '2 tickets; fees included', 2429, 1, 70),
    ('HOT SEAT HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $2,313 each $2,313 each *Fees Included* Section Silver Fan Silver Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,429 each $2,429 each *Fees Included* Section Lower 120 Lower 120', 'HOT SEAT HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $2,313 each $2,313 each *Fees Included* Section Silver Fan Silver Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,429 each $2,429 each *Fees Included* Section Lower 120 Lower 120', '16', '2 tickets; fees included', 2436, 1, 70),
    ('Lower 120 Lower 120 Row 16 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $2,436 each $2,436 each *Fees Included* Section Diamond Fan Diamond Fan', 'Lower 120 Lower 120 Row 16 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $2,436 each $2,436 each *Fees Included* Section Diamond Fan Diamond Fan', 'Package', '2 tickets; fees included', 2487, 1, 70),
    ('Diamond Fan Diamond Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,487 each $2,487 each *Fees Included* Section Inner 205 Inner 205', 'Diamond Fan Diamond Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,487 each $2,487 each *Fees Included* Section Inner 205 Inner 205', '2', '2 tickets; fees included', 2498, 2, 70),
    ('Inner 225', 'Inner 225', '15', '2 tickets; fees included', 2508, 2, 65),
    ('Floor D3', 'Floor D3', '5', '2 tickets; fees included', 2582, 2, 70),
    ('Floor A3', 'Floor A3', '2', '2 tickets; fees included', 2612, 2, 70),
    ('Inner 205 Inner 205 Row 2 Tickets available 2 Tickets $2,498 each $2,498 each *Fees Included* Section Inner 225 Inner 225 Row 15 2 or 4 Tickets available 2 or 4 Tickets $2,508 each $2,508 each *Fees Included* Section Floor D3 Floor D3 Row 5 2 or 4 Tickets available 2 or 4 Tickets $2,582 each $2,582 each *Fees Included* Section Floor A3 Floor A3 Row 2 Tickets available 2 Tickets $2,612 each $2,612 each *Fees Included* Section Diamond Deluxe Diamond Deluxe', 'Inner 205 Inner 205 Row 2 Tickets available 2 Tickets $2,498 each $2,498 each *Fees Included* Section Inner 225 Inner 225 Row 15 2 or 4 Tickets available 2 or 4 Tickets $2,508 each $2,508 each *Fees Included* Section Floor D3 Floor D3 Row 5 2 or 4 Tickets available 2 or 4 Tickets $2,582 each $2,582 each *Fees Included* Section Floor A3 Floor A3 Row 2 Tickets available 2 Tickets $2,612 each $2,612 each *Fees Included* Section Diamond Deluxe Diamond Deluxe', 'Package', '2 tickets; fees included', 2631, 1, 70),
    ('Diamond Deluxe Diamond Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,631 each $2,631 each *Fees Included* Section Inner 230 Inner 230', 'Diamond Deluxe Diamond Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $2,631 each $2,631 each *Fees Included* Section Inner 230 Inner 230', '20', '2 tickets; fees included', 2720, 1, 70),
    ('Middle 341', 'Middle 341', '5', '2 tickets; fees included', 2840, 4, 65),
    ('Inner 210', 'Inner 210', '5', '2 tickets; fees included', 2872, 2, 65),
    ('Lower Club C106', 'Lower Club C106', '9', '2 tickets; fees included', 3121, 2, 65),
    ('Inner 230 Inner 230 Row 20 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $2,720 each $2,720 each *Fees Included* Section Middle 341 Middle 341 Row 5 4 Tickets available 4 Tickets $2,840 each $2,840 each *Fees Included* Section Inner 210 Inner 210 Row 5 2 Tickets available 2 Tickets $2,872 each $2,872 each *Fees Included* Section Lower Club C106 Lower Club C106 Row 9 2 Tickets available 2 Tickets $3,121 each $3,121 each *Fees Included* Section PREMIUM HOT SEAT PREMIUM HOT SEAT', 'Inner 230 Inner 230 Row 20 1 to 6 Tickets available 1-6 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $2,720 each $2,720 each *Fees Included* Section Middle 341 Middle 341 Row 5 4 Tickets available 4 Tickets $2,840 each $2,840 each *Fees Included* Section Inner 210 Inner 210 Row 5 2 Tickets available 2 Tickets $2,872 each $2,872 each *Fees Included* Section Lower Club C106 Lower Club C106 Row 9 2 Tickets available 2 Tickets $3,121 each $3,121 each *Fees Included* Section PREMIUM HOT SEAT PREMIUM HOT SEAT', 'Package', '2 tickets; fees included', 3121, 1, 70),
    ('PREMIUM HOT SEAT PREMIUM HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $3,121 each $3,121 each *Fees Included* Section Lower 123 Lower 123', 'PREMIUM HOT SEAT PREMIUM HOT SEAT Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $3,121 each $3,121 each *Fees Included* Section Lower 123 Lower 123', '19', '2 tickets; fees included', 3128, 2, 70),
    ('Lower Club C129', 'Lower Club C129', '9', '2 tickets; fees included', 3292, 2, 65),
    ('Lower 123 Lower 123 Row 19 2 or 4 Tickets available 2 or 4 Tickets $3,128 each $3,128 each *Fees Included* Section Lower Club C129 Lower Club C129 Row 9 2 Tickets available 2 Tickets $3,292 each $3,292 each *Fees Included* Section Diamond Elite Diamond Elite', 'Lower 123 Lower 123 Row 19 2 or 4 Tickets available 2 or 4 Tickets $3,128 each $3,128 each *Fees Included* Section Lower Club C129 Lower Club C129 Row 9 2 Tickets available 2 Tickets $3,292 each $3,292 each *Fees Included* Section Diamond Elite Diamond Elite', 'Package', '2 tickets; fees included', 3324, 1, 70),
    ('Diamond Elite Diamond Elite Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,324 each $3,324 each *Fees Included* Section Lower 104 Lower 104', 'Diamond Elite Diamond Elite Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,324 each $3,324 each *Fees Included* Section Lower 104 Lower 104', '3', '2 tickets; fees included', 3441, 2, 70),
    ('Lower Club C133', 'Lower Club C133', '10', '2 tickets; fees included', 3729, 2, 65),
    ('Inner 234', 'Inner 234', '1', '2 tickets; fees included', 3813, 2, 65),
    ('Lower 104 Lower 104 Row 3 2 or 4 Tickets available 2 or 4 Tickets $3,441 each $3,441 each *Fees Included* Section Lower Club C133 Lower Club C133 Row 10 2 Tickets available 2 Tickets $3,729 each $3,729 each *Fees Included* Section Inner 234 Inner 234 Row 1 2 Tickets available 2 Tickets $3,813 each $3,813 each *Fees Included* Section Gold Fan Gold Fan', 'Lower 104 Lower 104 Row 3 2 or 4 Tickets available 2 or 4 Tickets $3,441 each $3,441 each *Fees Included* Section Lower Club C133 Lower Club C133 Row 10 2 Tickets available 2 Tickets $3,729 each $3,729 each *Fees Included* Section Inner 234 Inner 234 Row 1 2 Tickets available 2 Tickets $3,813 each $3,813 each *Fees Included* Section Gold Fan Gold Fan', 'Package', '2 tickets; fees included', 3871, 1, 70)
  ) AS v(category_name, section, row, seat_details, price, quantity_available, discount_percent);
END $$;


-- BTS WORLD TOUR 'ARIRANG' — Los Angeles — September 6
DO $$
DECLARE v_event_id uuid;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE lower(title) = lower('BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 6') LIMIT 1;
  IF v_event_id IS NULL THEN
    INSERT INTO public.events (title, description, date, venue, city, image_url, seat_map_url, status, category)
    VALUES (
      'BTS WORLD TOUR ''ARIRANG'' — Los Angeles — September 6',
      'Request access for BTS WORLD TOUR ARIRANG at SoFi Stadium. Inventory subject to verification.',
      '2026-09-06T20:00:00-07:00',
      'SoFi Stadium',
      'Inglewood, CA',
      '/images/events/bts/bts-arirang-tour.jpg',
      '/images/seatmaps/bts-chicago-2026-08-27.png',
      'upcoming',
      'Music'
    ) RETURNING id INTO v_event_id;
  ELSE
    UPDATE public.events SET date = '2026-09-06T20:00:00-07:00', venue='SoFi Stadium', city='Inglewood, CA', image_url='/images/events/bts/bts-arirang-tour.jpg' WHERE id = v_event_id;
  END IF;

  DELETE FROM public.event_tickets WHERE event_id = v_event_id;

  INSERT INTO public.event_tickets
    (event_id, category_name, section, row, seat_details, delivery_method, delivery_timing, image_url, price, quantity_available, status, discount_percent)
  SELECT v_event_id, v.category_name, v.section, v.row, v.seat_details, 'Mobile transfer', 'Evening before event', null, v.price, v.quantity_available, 'available', v.discount_percent
  FROM (VALUES
    ('Gold Deluxe', 'Gold Deluxe', 'Package', '2 tickets; fees included', 4044, 1, 70),
    ('SILVER VIP FLOOR', 'SILVER VIP FLOOR', 'Package', '2 tickets; fees included', 4044, 1, 70),
    ('Gold Fan Gold Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,871 each $3,871 each *Fees Included* Section Gold Deluxe Gold Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $4,044 each $4,044 each *Fees Included* Section SILVER VIP FLOOR SILVER VIP FLOOR Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $4,044 each $4,044 each *Fees Included* Section Lower Club C116 Lower Club C116', 'Gold Fan Gold Fan Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $3,871 each $3,871 each *Fees Included* Section Gold Deluxe Gold Deluxe Package 1 to 4 Ticket Packages available 1-4 Ticket Packages $4,044 each $4,044 each *Fees Included* Section SILVER VIP FLOOR SILVER VIP FLOOR Package 1 to 10 or 12 Ticket Packages available 1-10 or 12 Ticket Packages $4,044 each $4,044 each *Fees Included* Section Lower Club C116 Lower Club C116', '15', '2 tickets; fees included', 4124, 1, 70),
    ('Lower Club C116 Lower Club C116 Row 15 1 to 4 Tickets available 1-4 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $4,124 each $4,124 each *Fees Included* Section VIP SOUNDCHECK VIP SOUNDCHECK', 'Lower Club C116 Lower Club C116 Row 15 1 to 4 Tickets available 1-4 Tickets Important: Zone SeatingImportant: Zone Seating, Open Zone Seating Disclaimer $4,124 each $4,124 each *Fees Included* Section VIP SOUNDCHECK VIP SOUNDCHECK', 'Package', '2 tickets; fees included', 4159, 1, 70),
    ('VIP SOUNDCHECK VIP SOUNDCHECK Package 1 to 6 or 8 Ticket Packages available 1-6 or 8 Ticket Packages $4,159 each $4,159 each *Fees Included* Section Lower Club C128 Lower Club C128', 'VIP SOUNDCHECK VIP SOUNDCHECK Package 1 to 6 or 8 Ticket Packages available 1-6 or 8 Ticket Packages $4,159 each $4,159 each *Fees Included* Section Lower Club C128 Lower Club C128', '18', '2 tickets; fees included', 4186, 2, 70)
  ) AS v(category_name, section, row, seat_details, price, quantity_available, discount_percent);
END $$;
