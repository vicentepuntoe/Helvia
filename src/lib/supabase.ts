import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: mostrar las variables de entorno (también en producción para debugging)
console.log('🔍 Supabase Configuration Check:');
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('Mode:', import.meta.env.MODE);
console.log('All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Use placeholder values if credentials are not configured to prevent errors
// The app will still work, but auth features won't function until credentials are set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.warn('⚠️ Authentication features will not work until credentials are configured.');
} else {
  // Validate URL format
  try {
    new URL(url);
    console.log('✅ Supabase URL is valid');
  } catch (e) {
    console.error('❌ Invalid Supabase URL format:', url);
  }
  
  // Validate key format (should be a JWT-like string)
  if (key.length < 50) {
    console.warn('⚠️ Supabase Anon Key seems too short. Please verify it is correct.');
  }
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Usar 'implicit' si PKCE causa problemas, o 'pkce' para mayor seguridad
    flowType: 'pkce',
    // Deshabilitar PKCE si causa problemas (cambiar a 'implicit')
    // flowType: 'implicit',
  }
});
