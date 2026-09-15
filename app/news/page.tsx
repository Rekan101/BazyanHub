import { getNewsFeed } from "@/lib/data/news.server";

import NewsPageClient from "./NewsPageClient";

/*
 * ISR, same rationale as `/` and `/services/[category]`: the feed is read
 * through the COOKIE-FREE public client, so the page can be prerendered and
 * refreshed periodically rather than rendered per request.
 *
 * Five minutes is deliberately shorter-feeling than it sounds — posts only
 * appear here once an admin approves them, so there is no expectation of
 * instant publication. Any cookies() call in this tree would lose the `○`.
 */
export const revalidate = 300;

/*
 * Server component. Fetches approved posts + their reaction aggregates and
 * hands them to the client, which resolves the viewer's OWN reaction after
 * hydration (that part is user-specific and cannot be prerendered).
 */
export default async function NewsPage() {
  const posts = await getNewsFeed();

  return <NewsPageClient posts={posts} />;
}
