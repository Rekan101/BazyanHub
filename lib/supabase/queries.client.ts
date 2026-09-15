"use client";

// lib/supabase/queries.client.ts

import { getSupabaseClient } from "@/lib/supabase/client";
import { mapNotificationRow } from "@/lib/supabase/mappers";
import type {
  NewsReactionType,
  NotificationRow,
} from "@/lib/supabase/types";
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

/*
|--------------------------------------------------------------------------
| News reactions
|--------------------------------------------------------------------------
|
| User-specific, so browser-side by necessity: "which reaction did I pick?"
| cannot be answered without a session, and reading the session on the server
| would make /news dynamic. The aggregate counts come from the server via the
| news_feed view; only the caller's own choice is resolved here.
|
*/

/*
 * The signed-in user's reactions, keyed by post id. Returns an empty map for
 * a signed-out visitor rather than null — "nobody is signed in" is a real
 * answer, not a failure.
 */
export async function fetchMyReactions(
  postIds: string[]
): Promise<Record<
  string,
  NewsReactionType
> | null> {
  const supabase = getSupabaseClient();

  if (!supabase || postIds.length === 0) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  const { data, error } = await supabase
    .from("news_reactions")
    .select("post_id, reaction_type")
    .eq("user_id", user.id)
    .in("post_id", postIds);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] fetchMyReactions failed:",
        error
      );
    }

    return null;
  }

  const result: Record<
    string,
    NewsReactionType
  > = {};

  for (const row of data as Array<{
    post_id: string;
    reaction_type: NewsReactionType;
  }>) {
    result[row.post_id] = row.reaction_type;
  }

  return result;
}

/*
 * Sets (or changes) the caller's reaction on a post.
 *
 * The composite primary key (post_id, user_id) makes this a genuine upsert:
 * reacting again overwrites reaction_type instead of adding a second row.
 * Note ON CONFLICT DO UPDATE is checked against the UPDATE policy, not the
 * INSERT one — both exist in supabase-schema.sql for exactly this reason.
 */
export async function setMyReaction(
  postId: string,
  reactionType: NewsReactionType
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      error: new Error(
        "Supabase is not configured."
      ),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: new Error("Not signed in."),
    };
  }

  const { error } = await supabase
    .from("news_reactions")
    .upsert(
      {
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      },
      { onConflict: "post_id,user_id" }
    );

  return { error };
}

/* Removes the caller's reaction — a plain delete on the key. */
export async function clearMyReaction(
  postId: string
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      error: new Error(
        "Supabase is not configured."
      ),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: new Error("Not signed in."),
    };
  }

  const { error } = await supabase
    .from("news_reactions")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id);

  return { error };
}

/*
|--------------------------------------------------------------------------
| Post submission
|--------------------------------------------------------------------------
|
| `status` is deliberately NOT sent. The RLS insert policy's WITH CHECK pins
| it to 'pending', so passing anything else would be rejected outright —
| letting the column default do the work keeps the client honest and makes
| the moderation guarantee impossible to bypass from here.
|
| media_url is likewise not sent: the composer's preview is a local blob URL
| and nothing is uploaded yet. Supabase Storage is a follow-up.
|
*/

export async function submitNewsPost(
  textContent: string
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      error: new Error(
        "Supabase is not configured."
      ),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: new Error("Not signed in."),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("news_posts")
    .insert({
      user_id: user.id,
      author_name:
        profile?.full_name ??
        profile?.username ??
        null,
      text_content: textContent.trim(),
    });

  return { error };
}
