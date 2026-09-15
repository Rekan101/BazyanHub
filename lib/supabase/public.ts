import "server-only";

// lib/supabase/public.ts

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| Cookie-free server client, for PUBLIC content only
|--------------------------------------------------------------------------
|
| The difference from lib/supabase/server.ts is the whole point: that client
| reads the auth cookie via next/headers, and ANY call to cookies() opts the
| entire route into dynamic rendering. This one never touches cookies, so a
| page that reads only public content stays statically prerenderable (and
| ISR-able via `export const revalidate`).
|
| It authenticates as `anon`, which is exactly right for categories,
| providers, filters and stories — all four already grant public read in the
| RLS policies, gated on is_active / not-expired.
|
| Consequences to be aware of, both intentional:
|
|   * An admin browsing a public page sees the PUBLIC view (no inactive rows).
|     Admin tooling must use the cookie-based client instead.
|   * Nothing user-specific can be read here. Notifications deliberately do
|     not use this module; they are fetched in the browser.
|
*/

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let publicClient:
  | SupabaseClient<Database>
  | null = null;

export function getSupabasePublicClient():
  | SupabaseClient<Database>
  | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  if (!publicClient) {
    publicClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          /*
           * No session handling at all: nothing to persist on a server
           * that serves every visitor, and no URL to parse.
           */
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return publicClient;
}
