import "server-only";

// lib/data/news.server.ts

import {
  MOCK_POSTS,
  type FeedPost,
} from "@/lib/data/news";
import { fetchNewsFeed } from "@/lib/supabase/queries";

/*
|--------------------------------------------------------------------------
| News feed lookup seam (server only)
|--------------------------------------------------------------------------
|
| Supabase first, local mock second — the same contract as
| lib/data/providers.ts, categories.server.ts and stories.server.ts:
|
|   * null  -> "no answer" (unconfigured, or the query errored)
|   * []    -> the database answered and has no approved posts
|
| Both fall back to MOCK_POSTS, so the feed is never an empty page while the
| database is still being populated.
|
| Reads go through the cookie-free public client, which is what lets /news
| stay statically prerendered with ISR. The signed-in user's OWN reaction is
| deliberately not fetched here — that is user-specific and would require
| cookies; the client resolves it after hydration.
|
| Language note: `time` is a pre-formatted relative string, so it is baked
| into the prerendered HTML in one language. Kurdish is used, matching the
| app default. Re-formatting per reader would mean a client pass; the raw
| `createdAt` is carried on every post so that stays possible.
|
*/

export async function getNewsFeed(): Promise<
  FeedPost[]
> {
  const rows = await fetchNewsFeed("ckb");

  if (!rows || rows.length === 0) {
    return MOCK_POSTS;
  }

  return rows;
}
