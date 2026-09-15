import "server-only";

// lib/data/providers.ts

import type { Provider } from "@/lib/types/provider";

import { restaurants } from "@/lib/data/services/restaurants";
import {
  fetchAllProviders,
  fetchProviderById,
  fetchProvidersByCategory,
} from "@/lib/supabase/queries";

/*
|--------------------------------------------------------------------------
| Provider registry
|--------------------------------------------------------------------------
|
| The single lookup seam for provider data, now backed by Supabase with the
| local mock arrays as a fallback.
|
| Fallback contract - the distinction matters:
|
|   * The query helpers return `null` to mean "no answer from the database"
|     (Supabase is not configured, or the query errored). We serve mock data.
|
|   * They return an empty array to mean "the database answered, and there is
|     genuinely nothing there". We ALSO serve mock data in that case, because
|     the database is brand new and empty while the app is already live; an
|     empty category page would look broken rather than new.
|
| Once real rows exist, the mock simply stops being reachable. To make the
| database strictly authoritative later, drop the `length === 0` half of each
| condition below.
|
| These functions are async and use next/headers underneath, so they can only
| be called from server components, route handlers and server actions. The
| `server-only` import above turns a mistaken client import into a clear
| build error rather than a bundler trace about next/headers.
|
*/

const PROVIDERS_BY_CATEGORY: Record<
  string,
  Provider[]
> = {
  restaurants,
};

function mockProvidersByCategory(
  categoryId: string
): Provider[] {
  return (
    PROVIDERS_BY_CATEGORY[categoryId] ?? []
  );
}

function mockAllProviders(): Provider[] {
  return Object.values(
    PROVIDERS_BY_CATEGORY
  ).flat();
}

export async function getProvidersByCategory(
  categoryId: string
): Promise<Provider[]> {
  const rows = await fetchProvidersByCategory(
    categoryId
  );

  if (!rows || rows.length === 0) {
    return mockProvidersByCategory(categoryId);
  }

  return rows;
}

export async function getAllProviders(): Promise<
  Provider[]
> {
  const rows = await fetchAllProviders();

  if (!rows || rows.length === 0) {
    return mockAllProviders();
  }

  return rows;
}

export async function getProviderById(
  providerId: string
): Promise<Provider | null> {
  const row = await fetchProviderById(providerId);

  /*
   * `undefined` means the database could not answer, so fall through to the
   * mock. `null` means it answered and there is no such provider - but the
   * mock is still checked, because a story or an old link may point at a
   * provider that only exists locally.
   */
  if (row) {
    return row;
  }

  return (
    mockAllProviders().find(
      (provider) =>
        provider.id === providerId
    ) ?? null
  );
}
