import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // No demo fallback exists by design — without credentials the app must fail
  // closed (empty data, real auth errors), never open.
  console.error(
    '[anna-travel] Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    'Data and auth will not work. Set them in Vercel → Settings → Environment Variables ' +
    'for Production, Preview, and Development, then redeploy.'
  );
}

// Keep the app buildable without local secrets. Data operations must be disabled
// until these variables are supplied in Vercel or a local .env file.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export default supabase;
