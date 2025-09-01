/**
 * Next.js 15.5 Middleware - Supabase Auth + Session Refresh
 * Best practices 2025 : Session refresh automatique + protection routes
 */

import { NextResponse, type NextRequest } from 'next/server'
import { checkAuth } from '@/supabase/middleware'

export const config = {
  matcher: [
    '/admin/:path*',
    // Ajouter d'autres routes protégées si nécessaire
    // '/dashboard/:path*',
  ],
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Allow login route to avoid redirect loops
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  try {
    // ✅ Session refresh + authentication check
    const { response, user, isAuthenticated } = await checkAuth(request)

    if (!isAuthenticated || !user) {
      const loginUrl = new URL('/admin/login', request.url)
      const redirectTarget = pathname + request.nextUrl.search
      loginUrl.searchParams.set('redirect', redirectTarget)
      return NextResponse.redirect(loginUrl)
    }

    // ✅ Email allowlist check (si configuré)
    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)

    if (allowlist.length && !allowlist.includes((user.email || '').toLowerCase())) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('denied', '1')
      return NextResponse.redirect(loginUrl)
    }

    // ✅ User authenticated and authorized
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // En cas d'erreur, rediriger vers login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'session-error')
    return NextResponse.redirect(loginUrl)
  }
}

