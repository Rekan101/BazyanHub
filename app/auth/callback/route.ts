import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| OAuth callback
|--------------------------------------------------------------------------
|
| Where Facebook (and any future provider) lands after the user approves.
|
| The browser client uses the PKCE flow, so the provider returns a one-time
| `code` that must be exchanged for a session. That exchange has to happen
| somewhere that can WRITE cookies, which a server component cannot do —
| hence a route handler.
|
| This is the one place the cookie-based client (lib/supabase/server.ts) is
| genuinely required. Everything else in the app either reads public content
| through the cookie-free client or talks to Supabase from the browser.
|
| The client is constructed inline rather than via getSupabaseServerClient()
| because that helper deliberately swallows cookie writes — correct inside a
| server component, wrong here, where persisting the session IS the job.
|
*/

export async function GET(
  request: Request
) {
  const { searchParams, origin } = new URL(
    request.url
  );

  const code = searchParams.get("code");

  /*
   * `next` lets a caller choose where to land afterwards. Only relative
   * paths are honoured — accepting an absolute URL here would turn this
   * route into an open redirect.
   */
  const rawNext =
    searchParams.get("next") ?? "/profile";

  const next =
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//")
      ? rawNext
      : "/profile";

  const errorParam =
    searchParams.get("error_description") ??
    searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login`
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      `${origin}/login`
    );
  }

  /*
   * Cookies are set on THIS response object, which is then returned — that
   * is what actually persists the session in the browser.
   */
  const response = NextResponse.redirect(
    `${origin}${next}`
  );

  const supabase =
    createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.headers
              .get("cookie")
              ?.split(";")
              .map((pair) => {
                const index =
                  pair.indexOf("=");

                return {
                  name: pair
                    .slice(0, index)
                    .trim(),
                  value: pair
                    .slice(index + 1)
                    .trim(),
                };
              })
              .filter(
                (cookie) => cookie.name
              ) ?? [];
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code
    );

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return response;
}
