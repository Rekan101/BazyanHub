"use client";

// lib/supabase/queries.client.ts

import { getSupabaseClient } from "@/lib/supabase/client";
import { mapNotificationRow } from "@/lib/supabase/mappers";
import type { NotificationRow } from "@/lib/supabase/types";
import type { AppNotification } from "@/lib/data/notifications";
import type { LanguageCode } from "@/lib/data/categories";

/*
|--------------------------------------------------------------------------
| Browser-side queries
|--------------------------------------------------------------------------
|
| The counterpart to lib/supabase/queries.ts. That module is `server-only`
| and uses cookies(); this one runs in the browser against the same tables.
|
| Notifications live here rather than on the server on purpose, for two
| reasons:
|
|   1. Static rendering. A cookies() call in the root layout opts EVERY
|      route into dynamic rendering. Fetching here keeps /, /about, /news,
|      /profile, /favorites and /legal prerendered as static (the `○` marks
|      in `next build` output), which is what a PWA shell wants.
|
|   2. Language. The user's chosen language lives in localStorage and is
|      only known on the client, so the server could never pick the right
|      title_/body_ column. Here it can.
|
| Same null contract as the server module: null means "no answer"
| (unconfigured, or the query failed), [] means "answered, nothing there".
|
*/

export async function fetchNotificationsFromBrowser(
  language: LanguageCode
): Promise<AppNotification[] | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  /*
   * RLS already restricts this to the caller's own rows plus broadcasts
   * (user_id is null); no client-side filter is needed, and adding one
   * would be security theatre.
   */
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] fetchNotificationsFromBrowser failed:",
        error
      );
    }

    return null;
  }

  return (data as NotificationRow[]).map((row) =>
    mapNotificationRow(row, language)
  );
}
