import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 🔥 HARDCODED — IGNORES VERCEL ENV VARS (Guaranteed connection)
const supabaseUrl = 'https://wtktniphfzeltvajpbhb.supabase.co';
const supabaseAnon = 'sb_publishable_4E748vUDiLSXThheSvniYA_ICB97paN';

/**
 * Returns true when real Supabase keys have been provided.
 * Since we hardcoded them, this will always be true.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnon.length > 0 &&
  !supabaseUrl.includes('your-project');

/** Supabase client — always connected to your project */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnon);

export default supabase;