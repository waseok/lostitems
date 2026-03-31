import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xpxkmlllsmxebzoaiich.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweGttbGxsc214ZWJ6b2FpaWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzY1NjUsImV4cCI6MjA4OTE1MjU2NX0.XC9wKhMut6mFbSzb6qlKfnK6ZNcBjoCECziyNTIB7IE"

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}
