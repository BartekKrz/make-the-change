/**
 * Next.js 15.5 Middleware - i18n + Supabase Auth + Session Refresh
 * Best practices 2025 : i18n routing + Session refresh automatique + protection routes
 */

import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { checkAuth } from '@/supabase/middleware';

import { routing } from './src/i18n/routing';

// Créer le middleware i18n
const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: [
    // Matcher pour i18n - toutes les routes sauf API et assets
    String.raw`/((?!api|_next|_vercel|.*\..*).*)`,
    // Routes protégées spécifiques
    '/(fr|en|nl)/admin/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Gestion i18n en premier pour toutes les routes
  const i18nResponse = handleI18nRouting(request);

  // Si i18n redirige, on suit la redirection
  if (i18nResponse.status === 307 || i18nResponse.status === 302) {
    return i18nResponse;
  }

  // 2. Routes admin protégées (avec locale)
  const isAdminRoute = pathname.match(/^\/(fr|en|nl)\/admin/);
  const isLoginRoute = pathname.match(/^\/(fr|en|nl)\/admin\/login/);
  const isRegisterRoute = pathname.match(/^\/(fr|en|nl)\/admin\/register/);

  if (isAdminRoute && !isLoginRoute && !isRegisterRoute) {
    try {
      // ✅ Session refresh + authentication check
      const { response, user, isAuthenticated } = await checkAuth(request);

      if (!isAuthenticated || !user) {
        // Extraire la locale du pathname actuel
        const localeMatch = pathname.match(/^\/(fr|en|nl)/);
        const locale = localeMatch ? localeMatch[1] : 'fr';

        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        const redirectTarget = pathname + request.nextUrl.search;
        loginUrl.searchParams.set('redirect', redirectTarget);
        return NextResponse.redirect(loginUrl);
      }

      // ✅ Email allowlist check (si configuré)
      const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(Boolean);

      if (
        allowlist.length > 0 &&
        !allowlist.includes((user.email || '').toLowerCase())
      ) {
        const localeMatch = pathname.match(/^\/(fr|en|nl)/);
        const locale = localeMatch ? localeMatch[1] : 'fr';

        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        loginUrl.searchParams.set('denied', '1');
        return NextResponse.redirect(loginUrl);
      }

      // ✅ User authenticated and authorized
      return response;
    } catch (error) {
      console.error('Middleware error:', error);

      const localeMatch = pathname.match(/^\/(fr|en|nl)/);
      const locale = localeMatch ? localeMatch[1] : 'fr';

      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('error', 'session-error');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Pour toutes les autres routes, utiliser la réponse i18n
  return i18nResponse;
}
