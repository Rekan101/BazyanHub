const FAVORITES_STORAGE_KEY = "bazianhub-favorites";

export function readFavorites(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(
      FAVORITES_STORAGE_KEY
    );

    if (!stored) {
      return {};
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, boolean>;
    }

    return {};
  } catch {
    return {};
  }
}

export function saveFavorites(
  favorites: Record<string, boolean>
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );

    window.dispatchEvent(
      new CustomEvent(
        "bazianhub-favorites-changed"
      )
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function isFavorite(id: string): boolean {
  const favorites = readFavorites();

  return favorites[id] === true;
}

export function toggleFavorite(
  id: string
): boolean {
  const favorites = readFavorites();

  const newValue =
    favorites[id] !== true;

  const updated = {
    ...favorites,
    [id]: newValue,
  };

  saveFavorites(updated);

  return newValue;
}

export function removeFavorite(
  id: string
) {
  const favorites = readFavorites();

  const updated = {
    ...favorites,
    [id]: false,
  };

  saveFavorites(updated);
}

export { FAVORITES_STORAGE_KEY };