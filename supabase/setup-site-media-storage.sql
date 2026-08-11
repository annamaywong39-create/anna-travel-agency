-- Run once in Supabase SQL Editor.
-- Creates the public image bucket used by Admin uploads.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

-- Customers may view published images, but only admins may change them.
create policy "Public can view site media"
on storage.objects for select
to public
using (bucket_id = 'site-media');

create policy "Admins can upload site media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

create policy "Admins can update site media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-media'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'site-media'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

create policy "Admins can delete site media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-media'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
