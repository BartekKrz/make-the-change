import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

import type { NextRequest } from 'next/server';

// Créer le middleware next-intl
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TOUJOURS appliquer l'internationalisation en premier
  // Mais continuer le traitement même s'il y a une réponse
  const intlResponse = intlMiddleware(request);

  // Si intl veut rediriger, on le fait (par exemple /admin -> /fr/admin)
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse;
  }

  // Gérer l'authentification pour les routes admin
  if (pathname.startsWith('/admin') || /^\/[a-z]{2}\/admin/.test(pathname)) {
    if (
      pathname === '/admin/login' ||
      /^\/[a-z]{2}\/admin\/login$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    try {
      const response = NextResponse.next();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: cookies => {
              for (const { name, value, options } of cookies)
                response.cookies.set(name, value, options);
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Extraire la locale du pathname
        const localeMatch = pathname.match(/^\/([a-z]{2})\//);
        const locale = localeMatch ? localeMatch[1] : 'fr';
        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      if (allow.length > 0) {
        const email = (user.email || '').toLowerCase();
        if (!allow.includes(email)) {
          // Extraire la locale du pathname
          const localeMatch = pathname.match(/^\/([a-z]{2})\//);
          const locale = localeMatch ? localeMatch[1] : 'fr';
          const loginUrl = new URL(`/${locale}/admin/login`, request.url);
          loginUrl.searchParams.set('redirect', pathname);
          loginUrl.searchParams.set('denied', '1');
          return NextResponse.redirect(loginUrl);
        }
      }

      return response;
    } catch (error) {
      console.error('Middleware auth error:', error);
      // Extraire la locale du pathname
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'fr';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(fr|en|nl)/:path*', '/admin/:path*'],
};
