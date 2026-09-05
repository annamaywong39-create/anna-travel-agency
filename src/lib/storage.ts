import { supabase } from './supabase';

const MEDIA_BUCKET = 'site-media';

export async function uploadPublicImage(file: File, folder: 'listings' | 'events' | 'tickets') {
  // Keep in sync with the site-media bucket's allowed_mime_types (see supabase SQL).
  // SVG is deliberately rejected — it can embed scripts (stored XSS).
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED.includes(file.type)) throw new Error('Please choose a JPEG, PNG, or WebP image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be smaller than 8 MB.');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}-${safeName}.${extension}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
