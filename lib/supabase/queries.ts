import "server-only";

// lib/supabase/queries.ts

import type { Provider } from "@/lib/types/provider";
import type {
  ServiceCategory,
  ServiceFilter,
} from "@/lib/data/categories";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import {
  mapCategoryRow,
  mapFilterRow,
  mapNewsFeedRow,
  mapProviderRow,
  mapStorySlideRow,
  type CategoryRowWithFilters,
} from "@/lib/supabase/mappers";
import type { Slide } from "@/lib/data/stories";
import type { FeedPost } from "@/lib/data/news";
import type {
  FilterRow,
  NewsFeedRow,
  ProviderRowWithRelations,
  StorySlideRowWithStories,
} from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| Read queries
|--------------------------------------------------------------------------
|
| Every function here returns null to mean "no answer from the database" -
| either because Supabase is not configured, or because the query failed.
| That is deliberately distinct from returning an empty array, which means
| "the database answered, and there is genuinely nothing there".
|
| Callers in lib/data/ use that distinction to decide whether to fall back to
| mock data.
|
| These use the COOKIE-FREE public client (lib/supabase/public.ts), not the
| cookie-based one. Everything read here is public content that already
| grants `anon` select in RLS, and avoiding cookies() is what keeps the
| pages that call these functions statically prerenderable / ISR-able.
| Anything user-specific must NOT be added to this module.
|
| Server-side only (the public client module is `server-only`), so: server
| components, route handlers and server actions.
|
*/

const PROVIDER_SELECT = `
  *,
  categories ( slug, name_ckb, name_ar, name_en ),
  provider_hours ( * )
`;

function logQueryError(
  context: string,
  error: unknown
): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[supabase] ${context} failed, falling back to local data:`,
      error
    );
  }
}

export async function fetchProvidersByCategory(
  categorySlug: string
): Promise<Provider[] | null> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_SELECT)
    .eq("categories.slug", categorySlug)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) {
    logQueryError(
      `fetchProvidersByCategory(${categorySlug})`,
      error
    );

    return null;
  }

  /*
   * An inner-join filter on an embedded resource still returns the parent
   * row with `categories: null` when it does not match, so drop those here
   * rather than trusting the filter alone.
   */
  return (data as ProviderRowWithRelations[])
    .filter((row) => row.categories !== null)
    .map(mapProviderRow);
}

export async function fetchAllProviders(): Promise<
  Provider[] | null
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_SELECT)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) {
    logQueryError("fetchAllProviders", error);

    return null;
  }

  return (
    data as ProviderRowWithRelations[]
  ).map(mapProviderRow);
}

export async function fetchProviderById(
  providerId: string
): Promise<Provider | null | undefined> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return undefined;
  }

  /*
   * Routes are built on the slug, but accept a raw uuid too so that links
   * generated straight from the database still resolve.
   */
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      providerId
    );

  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_SELECT)
    .eq(isUuid ? "id" : "slug", providerId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    logQueryError(
      `fetchProviderById(${providerId})`,
      error
    );

    return undefined;
  }

  if (!data) {
    return null;
  }

  return mapProviderRow(
    data as ProviderRowWithRelations
  );
}

export async function fetchCategories(): Promise<
  ServiceCategory[] | null
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*, filters ( * )")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logQueryError("fetchCategories", error);

    return null;
  }

  return (data as CategoryRowWithFilters[]).map(
    mapCategoryRow
  );
}

export async function fetchFiltersByCategory(
  categorySlug: string
): Promise<ServiceFilter[] | null> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("filters")
    .select("*, categories!inner ( slug )")
    .eq("categories.slug", categorySlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logQueryError(
      `fetchFiltersByCategory(${categorySlug})`,
      error
    );

    return null;
  }

  return (data as unknown as FilterRow[]).map(
    mapFilterRow
  );
}

/*
 * Approved news posts with their reaction aggregates, newest first.
 *
 * Reads the news_feed VIEW, not the table, so total_reactions and
 * top_reaction_types come back already computed.
 *
 * Only `approved` rows: this runs through the cookie-free public client, so
 * the caller is `anon` and RLS would hide pending posts anyway — the explicit
 * filter documents the intent and keeps the query honest if that ever changes.
 *
 * Consumed by lib/data/news.server.ts, which applies the mock fallback.
 */
export async function fetchNewsFeed(
  language: "ckb" | "ar" | "en" = "ckb"
): Promise<FeedPost[] | null> {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("news_feed")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    logQueryError("fetchNewsFeed", error);

    return null;
  }

  return (data as NewsFeedRow[]).map((row) =>
    mapNewsFeedRow(row, language)
  );
}

/*
 * Story slides with their live (unexpired) stories.
 *
 * Consumed by lib/data/stories.server.ts, which applies the mock fallback.
 */
export async function fetchStorySlides(): Promise<
  Slide[] | null
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const [slidesResult, categoriesResult] =
    await Promise.all([
      supabase
        .from("story_slides")
        .select(
          `*, stories ( *, providers ( slug, name, category_id ) )`
        )
        .eq("is_active", true)
        .order("position", { ascending: true }),

      supabase
        .from("categories")
        .select("id, slug"),
    ]);

  if (slidesResult.error) {
    logQueryError(
      "fetchStorySlides",
      slidesResult.error
    );

    return null;
  }

  const categoryRows = (categoriesResult.data ??
    []) as Array<{ id: string; slug: string }>;

  const categorySlugById = new Map<string, string>(
    categoryRows.map(
      (row) => [row.id, row.slug] as const
    )
  );

  return (
    slidesResult.data as StorySlideRowWithStories[]
  ).map((row) =>
    mapStorySlideRow(row, categorySlugById)
  );
}

