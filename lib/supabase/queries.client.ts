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
| Media upload
|--------------------------------------------------------------------------
|
| Uploads to the public `news-media` bucket created by
| supabase-migration-02-news.sql.
|
| The path is `<user-id>/<random>.<ext>` because the storage INSERT policy
| pins the first segment to auth.uid() — that is what stops one user writing
| into another's folder or overwriting their file by guessing its name.
|
*/

/* Mirrors the bucket's file_size_limit. Checked here too so an oversized
 * file fails instantly instead of after a long upload. */
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

export type UploadedMedia = {
  url: string;
  type: "image" | "video";
};

export async function uploadNewsMedia(
  file: File
): Promise<{
  media: UploadedMedia | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      media: null,
      error: new Error(
        "Supabase is not configured."
      ),
    };
  }

  if (file.size > MAX_MEDIA_BYTES) {
    return {
      media: null,
      error: new Error("FILE_TOO_LARGE"),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      media: null,
      error: new Error("Not signed in."),
    };
  }

  const isVideo =
    file.type.startsWith("video");

  /*
   * Derived from the MIME type, not from the original filename: a Kurdish or
   * Arabic filename would produce a path with non-ASCII characters, which
   * Supabase Storage rejects.
   */
  const extension =
    file.type.split("/")[1]?.split("+")[0] ??
    (isVideo ? "mp4" : "jpg");

  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } =
    await supabase.storage
      .from("news-media")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

  if (uploadError) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] uploadNewsMedia failed:",
        uploadError
      );
    }

    return { media: null, error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("news-media")
    .getPublicUrl(path);

  return {
    media: {
      url: publicUrl,
      type: isVideo ? "video" : "image",
    },
    error: null,
  };
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
*/

export async function submitNewsPost(
  textContent: string,
  media?: UploadedMedia | null
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
      media_url: media?.url ?? null,
      media_type: media?.type ?? null,
    });

  return { error };
}

/*
|--------------------------------------------------------------------------
| Admin moderation
|--------------------------------------------------------------------------
|
| Browser-side for the same reason as everything else user-specific: reading
| the session on the server would make /news dynamic (CLAUDE.md §8).
|
| THE GATE IS RLS, NOT THIS CODE. `news_posts: read approved` already permits
| a select of pending rows only for their author or an admin, and
| `news_posts: admin moderate` restricts UPDATE to is_admin(). Hiding the tab
| from non-admins is presentation; a non-admin calling these directly still
| gets nothing back and cannot write.
|
*/

export type PendingPost = {
  id: string;
  authorName: string | null;
  textContent: string | null;
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  createdAt: string;
};

export async function fetchPendingPosts(): Promise<
  PendingPost[] | null
> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select(
      "id, author_name, text_content, media_url, media_type, created_at"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] fetchPendingPosts failed:",
        error
      );
    }

    return null;
  }

  return data.map((row) => ({
    id: row.id,
    authorName: row.author_name,
    textContent: row.text_content,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    createdAt: row.created_at,
  }));
}

const NEWS_MEDIA_BUCKET = "news-media";

/*
 * Recovers the storage path from a public URL, so a deleted post can take its
 * uploaded file with it instead of orphaning bytes in the bucket forever.
 *
 * Returns null for anything that is not one of our uploads — seeded posts
 * point at /images/... in the Next.js public folder, and deleting those is
 * neither possible nor desirable.
 */
function storagePathFromPublicUrl(
  url: string | null
): string | null {
  if (!url) {
    return null;
  }

  const marker = `/storage/v1/object/public/${NEWS_MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const path = url.slice(
    index + marker.length
  );

  return path
    ? decodeURIComponent(path)
    : null;
}

/*
 * Deletes a post outright.
 *
 * Permitted by the `news_posts: delete own` policy for the author OR an
 * admin — so this same call serves a user withdrawing their own submission
 * and an admin removing something from the live feed.
 *
 * The row goes first. If the row delete fails there is nothing to clean up,
 * and if the file delete fails afterwards the post is still gone — an
 * orphaned file is a storage-cost problem, not a correctness one, so it must
 * never block or fail the delete the user actually asked for.
 */
export async function deleteNewsPost(
  postId: string,
  mediaUrl?: string | null
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      error: new Error(
        "Supabase is not configured."
      ),
    };
  }

  const { error } = await supabase
    .from("news_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    return { error };
  }

  const path =
    storagePathFromPublicUrl(mediaUrl ?? null);

  if (path) {
    const { error: storageError } =
      await supabase.storage
        .from(NEWS_MEDIA_BUCKET)
        .remove([path]);

    if (
      storageError &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn(
        "[supabase] post deleted but its media file was not:",
        storageError
      );
    }
  }

  return { error: null };
}

/*
 * Approve or reject. `approved_by` is stamped for both outcomes — knowing who
 * rejected something is as useful as knowing who approved it — while
 * `approved_at` is only set on an actual approval, so it stays meaningful as
 * "when this went live".
 */
export async function moderateNewsPost(
  postId: string,
  status: "approved" | "rejected"
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
    .from("news_posts")
    .update({
      status,
      approved_by: user.id,
      approved_at:
        status === "approved"
          ? new Date().toISOString()
          : null,
    })
    .eq("id", postId);

  return { error };
}
