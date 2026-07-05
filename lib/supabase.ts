import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key (bypasses RLS).
// Only import this from Route Handlers / Server Components — never from a
// Client Component, or the service key would be bundled to the browser.
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
