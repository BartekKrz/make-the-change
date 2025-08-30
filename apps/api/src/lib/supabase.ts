/**
 * Client Supabase pour l'API tRPC
 * Configuration sécurisée avec service role key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided'
  );
}

// Client avec service role key pour l'API (bypass RLS)
export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Client pour authentification utilisateur (avec RLS)
export const supabaseAuth = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
