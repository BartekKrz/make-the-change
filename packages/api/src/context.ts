/**
 * tRPC Context for Next.js Route Handlers (shared)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

// Service client for server-side verification
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface TRPCContext {
  supabase: typeof supabase
  user: any | null
  req: Request
}

export const createTRPCContext = async (opts: { req: Request }): Promise<TRPCContext> => {
  const { req } = opts
  let user: any | null = null

  // Method 1: Try Bearer token from Authorization header (for API calls)
  const authorization = req.headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7)
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser(token)
      if (!error && authUser) {
        user = authUser
      }
    } catch (error) {
      console.error('Error verifying Bearer token:', error)
    }
  }

  // Method 2: Try cookie-based auth (for Next.js SSR)
  if (!user) {
    try {
      const cookieHeader = req.headers.get('cookie')
      if (cookieHeader) {
        // Parse cookies to find Supabase auth tokens
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=')
          if (name) {
            acc[name] = decodeURIComponent(value || '')
          }
          return acc
        }, {} as Record<string, string>)

        // Look for Supabase auth cookie
        const accessTokenCookie = cookies[`sb-ebmjxinsyyjwshnynwwu-auth-token`]
        if (accessTokenCookie) {
          try {
            let authData: any;

            // Check if cookie is base64 encoded
            if (accessTokenCookie.startsWith('base64-')) {
              const base64Data = accessTokenCookie.replace('base64-', '')
              const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8')
              authData = JSON.parse(decodedData)
            } else {
              // Try direct JSON parse for backwards compatibility
              authData = JSON.parse(accessTokenCookie)
            }

            if (authData?.access_token) {
              const {
                data: { user: cookieUser },
                error: cookieError,
              } = await supabase.auth.getUser(authData.access_token)

              if (!cookieError && cookieUser) {
                user = cookieUser
              }
            }
          } catch (parseError) {
            // Cookie might not be valid JSON or base64, skip parsing
            console.warn('Could not parse auth cookie:', parseError)
          }
        }
      }
    } catch (error) {
      console.error('Error verifying cookie auth:', error)
    }
  }

  // Method 3: Admin allowlist fallback (for development)
  if (!user) {
    const adminEmails = (process.env.ADMIN_EMAIL_ALLOWLIST || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    if (adminEmails.length > 0) {
      // For development: create a mock admin user
      user = {
        id: 'admin-dev',
        email: adminEmails[0],
        role: 'admin'
      }
    }
  }

  return {
    supabase,
    user,
    req,
  }
}

