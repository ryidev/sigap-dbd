import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Access env vars directly - Next.js replaces these at build time
  // Don't store in variables first to ensure proper inlining
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}
