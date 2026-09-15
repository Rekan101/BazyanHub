import "server-only";

// lib/data/categories.server.ts

import {
  categories,
  type ServiceCategory,
} from "@/lib/data/categories";
import { fetchCategories } from "@/lib/supabase/queries";

/*
|--------------------------------------------------------------------------
| Category lookup seam (server only)
|--------------------------------------------------------------------------
|
| Supabase first, local mock second.
|
| This is deliberately a separate module from lib/data/categories.ts. That
| file is imported by client components, and anything reachable from it ends
| up in the browser bundle - including, transitively, next/headers, which
| cannot be bundled for the client. The `server-only` import at the top makes
| any accidental client import fail loudly at build time instead of
| producing a confusing bundler trace.
|
| A null from fetchCategories() means "no answer" - Supabase is not
| configured, or the query failed. An empty array means the database answered
| and is genuinely empty. Both fall back to the mock, so the app never
| renders a blank category list while the database is still being populated.
|
*/

export async function getCategories(): Promise<
  ServiceCategory[]
> {
  const rows = await fetchCategories();

  if (!rows || rows.length === 0) {
    return categories;
  }

  return rows;
}

export async function getCategoryBySlug(
  slug: string
): Promise<ServiceCategory | null> {
  const all = await getCategories();

  return (
    all.find((item) => item.id === slug) ?? null
  );
}
