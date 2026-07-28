import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env as unknown as Record<string, string>).SUPABASE_URL ||
  'https://placeholder-project.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env as unknown as Record<string, string>).SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://placeholder-project.supabase.co' &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
