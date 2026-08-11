-- Replace only the broken Pexels image reference reported by the browser.
-- This does not delete listings or change prices/details.
update public.listings
set images = (
  select array_agg(
    case
      when image_url like '%1441319%' then '/images/hotel-luxury.jpg'
      else image_url
    end
    order by image_position
  )
  from unnest(images) with ordinality as image_rows(image_url, image_position)
)
where exists (
  select 1
  from unnest(images) as broken_images(image_url)
  where broken_images.image_url like '%1441319%'
);
