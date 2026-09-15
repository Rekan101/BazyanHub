import "server-only";

// lib/supabase/server.ts

import { cookies } from "next/headers";
import {
  createServerClient,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| Server-side Supabase client
|--------------------------------------------------------------------------
|
| For use in server components, route handlers and server actions. Reads the
| auth cookie so RLS policies see the signed-in user rather than `anon`.
|
| Like the browser client, this returns null when credentials are missing
| instead of throwing, so pages that fall back to mock data keep rendering.
|
| This module must never be imported from a "use client" file - next/headers
| is server-only.
|
*/

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfiguredOnServer(): boolean {
  return Boolean(
    SUPABASE_URL && SUPABASE_ANON_KEY
  );
}

export async function getSupabaseServerClient(): Promise<
  SupabaseClient<Database> | null
> {
  if (!isSupabaseConfiguredOnServer()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_URL as string,
    SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          /*
           * Server components cannot mutate cookies. Swallowing the write
           * here is the documented Supabase SSR pattern: session refresh is
           * handled wherever cookies ARE writable (a route handler, a server
           * action, or middleware). Without the try/catch this throws on
           * every token refresh during a page render.
           */
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            );
          } catch {
            // Called from a server component - safe to ignore.
          }
        },
      },
    }
  );
}
