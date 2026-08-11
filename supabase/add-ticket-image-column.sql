-- Run once in Supabase SQL Editor before using ticket image uploads.
alter table public.event_tickets
  add column if not exists image_url text;
