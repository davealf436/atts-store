import { Product } from '../types';
import { triggerHaptic } from './telegram';

const PINNED_STORAGE_KEY = 'ath_pinned_products_v1';

export const getPinnedIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isPinned = (productId: string): boolean => {
  const ids = getPinnedIds();
  return ids.includes(productId);
};

export const togglePin = (productId: string): boolean => {
  triggerHaptic('light');
  const current = getPinnedIds();
  const exists = current.includes(productId);
  let updated: string[];

  if (exists) {
    // Unpin: remove from pinned list, returns to normal position
    updated = current.filter((id) => id !== productId);
  } else {
    // Pin: prepend to pinned list so it instantly moves to first position
    // while preserving subsequent pin order
    updated = [productId, ...current.filter((id) => id !== productId)];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new CustomEvent('ath_pinned_updated', { detail: updated }));
  }

  return !exists;
};

export const subscribeToPinned = (callback: (ids: string[]) => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string[]>;
    callback(customEvent.detail || getPinnedIds());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('ath_pinned_updated', handler);
    const storageHandler = () => callback(getPinnedIds());
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('ath_pinned_updated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }

  return () => {};
};

/**
 * Sorts products so that pinned items are placed at the top/first position
 * in their exact pinned sequence, while unpinned items retain their original relative order.
 */
export function sortProductsWithPinned(products: Product[], pinnedIds: string[]): Product[] {
  if (!pinnedIds || pinnedIds.length === 0) return products;

  const productMap = new Map<string, Product>();
  const unpinned: Product[] = [];

  for (const product of products) {
    if (pinnedIds.includes(product.id)) {
      productMap.set(product.id, product);
    } else {
      unpinned.push(product);
    }
  }

  // Pinned products in their exact pin sequence
  const pinnedList: Product[] = [];
  for (const id of pinnedIds) {
    const p = productMap.get(id);
    if (p) {
      pinnedList.push(p);
    }
  }

  return [...pinnedList, ...unpinned];
}

// Active contextual card tracking for touch/mobile devices
let currentActiveCardId: string | null = null;
const CARD_ACTIVE_EVENT = 'ath_card_active_change';

export function setActiveCard(id: string | null) {
  if (currentActiveCardId === id) return;
  currentActiveCardId = id;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CARD_ACTIVE_EVENT, { detail: id }));
  }
}

export function getActiveCard(): string | null {
  return currentActiveCardId;
}

export function subscribeToActiveCard(callback: (id: string | null) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string | null>;
    callback(customEvent.detail ?? null);
  };
  if (typeof window !== 'undefined') {
    window.addEventListener(CARD_ACTIVE_EVENT, handler);
    return () => window.removeEventListener(CARD_ACTIVE_EVENT, handler);
  }
  return () => {};
}

// Global click/touch outside listener to dismiss temporary mobile pin control
if (typeof window !== 'undefined') {
  const handleGlobalPointerDown = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest('[data-product-card]')) {
      setActiveCard(null);
    }
  };

  document.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
}

