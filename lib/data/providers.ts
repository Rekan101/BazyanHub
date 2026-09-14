// lib/data/providers.ts

import type { Provider } from "@/lib/types/provider";

import { restaurants } from "@/lib/data/services/restaurants";

/*
|--------------------------------------------------------------------------
| Provider registry
|--------------------------------------------------------------------------
|
| Single lookup seam for provider data. Today it reads the local mock
| arrays; once Supabase is wired up these two functions become the only
| place that needs to change (they can stay sync or become async).
|
| The remaining category files under lib/data/services/ are still empty,
| so they are simply absent from the registry until they have rows.
|
*/

const PROVIDERS_BY_CATEGORY: Record<
  string,
  Provider[]
> = {
  restaurants,
};

export function getProvidersByCategory(
  categoryId: string
): Provider[] {
  return (
    PROVIDERS_BY_CATEGORY[categoryId] ?? []
  );
}

export function getAllProviders(): Provider[] {
  return Object.values(
    PROVIDERS_BY_CATEGORY
  ).flat();
}

export function getProviderById(
  providerId: string
): Provider | null {
  return (
    getAllProviders().find(
      (provider) =>
        provider.id === providerId
    ) ?? null
  );
}
