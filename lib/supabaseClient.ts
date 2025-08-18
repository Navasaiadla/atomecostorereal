import { createClient } from '@supabase/supabase-js';

let supabase = null;

if (process.env.NODE_ENV === 'production') {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export { supabase };
