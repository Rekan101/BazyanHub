import "server-only";

// lib/data/stories.server.ts

import {
  SLIDES,
  type Slide,
} from "@/lib/data/stories";
import { fetchStorySlides } from "@/lib/supabase/queries";

/*
|--------------------------------------------------------------------------
| Story slide lookup seam (server only)
|--------------------------------------------------------------------------
|
| Supabase first, local mock second - the same contract as
| lib/data/providers.ts and lib/data/categories.server.ts:
|
|   * null  -> "no answer" (unconfigured, or the query errored)
|   * []    -> the database answered and has no live slides
|
| Both fall back to SLIDES, so the carousel is never empty.
|
| A slide with zero live stories is dropped before the fallback check runs.
| Otherwise a slide whose stories had all expired would render as an empty
| 3-up grid with just a title, which looks broken rather than empty. If that
| leaves nothing at all, the mock takes over.
|
*/

export async function getStorySlides(): Promise<
  Slide[]
> {
  const rows = await fetchStorySlides();

  if (!rows) {
    return SLIDES;
  }

  const populated = rows.filter(
    (slide) => slide.stories.length > 0
  );

  if (populated.length === 0) {
    return SLIDES;
  }

  return populated;
}
