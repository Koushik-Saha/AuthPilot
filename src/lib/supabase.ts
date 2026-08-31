import { createBrowserClient as createSsrBrowserClient, createServerClient as createSsrServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

/**
 * 1. createBrowserClient — for Client Components (anon key + PKCE auth)
 */
export function createBrowserClient() {
  return createSsrBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * 2. createServerClient — for Server Components, Server Actions, and API routes
 * Includes cookie handling for SSR auth session management
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSsrServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // The `remove` method was called from a Server Component.
        }
      },
    },
  })
}

/**
 * 3. supabaseAdmin — Service role client for admin operations only (never exposed to browser)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
