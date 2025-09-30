import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet)
            request.cookies.set(name, value);

          response = NextResponse.next({
            request: { headers: request.headers },
          });

          for (const { name, value, options } of cookiesToSet)
            response.cookies.set(name, value, options);
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    process.env.NODE_ENV === 'development' &&
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    // Development mode - no additional auth checks
  }

  return { response, user, error };
}

export async function checkAuth(request: NextRequest) {
  const { response, user, error } = await updateSession(request);

  return {
    response,
    user,
    error,
    isAuthenticated: !!user && !error,
  };
}
