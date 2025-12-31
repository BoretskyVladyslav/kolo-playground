import { createClient } from '@supabase/supabase-js';

// Якщо змінних немає (під час білду), ставимо заглушки, щоб код не ламався.
// На реальному сервері Vercel підставить сюди справжні ключі.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});