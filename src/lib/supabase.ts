import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/*
 ┌──────────────────────────────────────────────────────┐
 │  SUPABASE SETUP — FOLLOW THESE STEPS:               │
 │                                                       │
 │  1. Go to https://supabase.com and create an account │
 │  2. Create a new project (free tier is fine)          │
 │  3. Go to Settings → API                             │
 │  4. Copy your Project URL and anon/public key         │
 │  5. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON     │
 │  6. Go to SQL Editor and run the schema below         │
 └──────────────────────────────────────────────────────┘
*/

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || '';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON || '';

/**
 * Returns true when real Supabase keys have been provided.
 * When false, the app falls back to localStorage (demo mode).
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnon.length > 0 &&
  !supabaseUrl.includes('your-project');

/** Supabase client — only useful when isSupabaseConfigured === true */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnon || 'placeholder',
);

export default supabase;

/*
 ═══════════════════════════════════════════════════════
  DATABASE SCHEMA — Run this in Supabase SQL Editor
 ═══════════════════════════════════════════════════════

-- PROFILES (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    CASE WHEN NEW.email = 'admin@annatravelagency.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- LISTINGS
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'apartment', 'shortlet')),
  city TEXT NOT NULL,
  city_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  max_guests INTEGER DEFAULT 2,
  bedrooms INTEGER DEFAULT 1,
  description TEXT,
  nearest_stadium TEXT,
  distance_to_stadium TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CONTACT MESSAGES
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ROW-LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Admin manage listings" ON listings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users read own bookings" ON bookings FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users create bookings" ON bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin read all bookings" ON bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin update bookings" ON bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users create reviews" ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users manage own profile" ON profiles FOR ALL
  USING (id = auth.uid());
CREATE POLICY "Anyone submit contact" ON contact_messages FOR INSERT
  WITH CHECK (true);

*/
