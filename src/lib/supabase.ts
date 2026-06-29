import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 🔥 HARDCODED — guaranteed to work regardless of Vercel env vars
const supabaseUrl = 'https://wtktniphfzeltvajpbhb.supabase.co';
const supabaseAnon = 'sb_publishable_4E748vUDiLSXThheSvniYA_ICB97paN';

/**
 * Always true because we hardcoded real keys.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnon.length > 0 &&
  !supabaseUrl.includes('your-project');

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnon);

export default supabase;