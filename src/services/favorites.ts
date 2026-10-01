// Favorites / Saved Products Service
// Persists liked products in localStorage and provides real-time state sync

const FAVORITES_STORAGE_KEY = 'ath_saved_products';

// Default starter favorites for smooth first-time experience (e.g., TradingView Premium)
const DEFAULT_FAVORITES: string[] = ['tv-premium'];

export const getFavoriteIds = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_FAVORITES;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch {
    return DEFAULT_FAVORITES;
  }
};

export const isFavorite = (productId: string): boolean => {
  const ids = getFavoriteIds();
  return ids.includes(productId);
};

export const toggleFavorite = (productId: string): boolean => {
  const current = getFavoriteIds();
  const exists = current.includes(productId);
  let updated: string[];

  if (exists) {
    updated = current.filter((id) => id !== productId);
  } else {
    updated = [...current, productId];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites_updated', { detail: updated }));
  }

  return !exists;
};

export const subscribeToFavorites = (callback: (ids: string[]) => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string[]>;
    callback(customEvent.detail || getFavoriteIds());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('favorites_updated', handler);
    window.addEventListener('storage', () => callback(getFavoriteIds()));
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('favorites_updated', handler);
    }
  };
};
