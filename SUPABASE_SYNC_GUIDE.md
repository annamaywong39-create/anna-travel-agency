# Supabase sync guide for Anna Travel Agency

The React app and Supabase database are separate. New frontend data does not automatically appear in Supabase.

## Safe order

1. Back up the Supabase project.
2. Confirm Vercel has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Confirm Supabase Auth is enabled.
4. Add or verify the BTS event in the `events` table.
5. Add verified ticket rows in `event_tickets`.
6. Add event/seat-map images to a Supabase Storage bucket and save their public URLs.
7. Test RLS policies with a normal customer and an admin.

## BTS event data

Event:
- Title: BTS WORLD TOUR “ARIRANG” IN BALTIMORE
- Date: 2026-08-10 20:00 local time
- Venue: M&T Bank Stadium
- City: Baltimore, MD
- Category: Music
- Status: upcoming
- Seat map file: `/images/seatmaps/mt-bank-stadium-bts-2026-08-10.png`

Verified inventory provided by Anna:

1. Five Hundreds Level 532, Row 16, 2 mobile tickets, $149 each
2. Field R, Row 13, 2 tickets, $973 each
3. Hundreds Level 133, Row 32, 2 tickets, $371 each

Delivery:
- Mobile transfer
- Expected evening before the event, subject to supplier/platform confirmation

## Recommended columns for event_tickets

- `event_id`
- `category_name`
- `section`
- `row`
- `seat_details`
- `price`
- `quantity_available`
- `delivery_method`
- `delivery_timing`
- `status`
- `created_at`

Do not add ticket inventory unless Anna has acquired or verified it.

## Images

Supabase Storage is useful for images that need to be managed from the admin area:

- Create a bucket named `event-assets`.
- Upload seat maps and event campaign images.
- Use approved/licensed images only.
- Save the public image URL in `events.image_url` or a seat-map field.

The files under `public/images` are bundled with the Vercel frontend; they are not automatically uploaded to Supabase.

## Auth

The frontend now expects Supabase Auth. Create an admin user under Authentication > Users, then ensure the matching row in `profiles` has `role = 'admin'`. Do not use browser localStorage passwords.

## Important

Do not run destructive SQL or disable RLS. The exact SQL migration should be prepared only after checking the existing column types and constraints in the project.
