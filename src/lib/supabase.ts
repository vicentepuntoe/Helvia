import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: mostrar las variables de entorno (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Configuration Check:');
  console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
  console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
}

// Use placeholder values if credentials are not configured to prevent errors
// The app will still work, but auth features won't function until credentials are set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.warn('⚠️ Authentication features will not work until credentials are configured.');
}

export const supabase = createClient(url, key);
