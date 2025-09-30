import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: cs => {
          try {
            for (const c of cs) store.set(c.name, c.value, c.options);
          } catch (error) {
            console.error('Cookie setting failed:', error);
          }
        },
      },
    }
  );
}
