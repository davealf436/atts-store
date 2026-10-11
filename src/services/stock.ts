import { DEFAULT_PLANS, PlanStockRecord } from '../shared/stockData';

export interface PlanStockInfo {
  productId: string;
  planId: string;
  stock: number;
  lowStockThreshold: number;
  isOut: boolean;
  isLow: boolean;
  availabilityText: string;
}

const STOCK_STORAGE_KEY = 'ath_plan_stock_v2';
const STOCK_EVENT = 'ath-stock-updated';

// In-memory cache initialized from localStorage or DEFAULT_PLANS
let localStockCache: Record<string, PlanStockRecord> = (() => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STOCK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_PLANS, ...parsed };
        }
      }
    } catch {
      // fallback
    }
  }
  return { ...DEFAULT_PLANS };
})();

/**
 * Synchronizes client cache with the backend database API.
 */
export async function syncStockFromBackend(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/stock');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.stock) {
        localStockCache = { ...DEFAULT_PLANS, ...data.stock };
        try {
          localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(localStockCache));
        } catch {}
        window.dispatchEvent(new CustomEvent(STOCK_EVENT));
      }
    }
  } catch (err) {
    // If backend request fails (e.g. offline), client gracefully relies on local cache
    console.debug('[Stock] Using cached inventory');
  }
}

// Initial background sync
if (typeof window !== 'undefined') {
  syncStockFromBackend();
  window.addEventListener('focus', () => syncStockFromBackend());
}

/**
 * Helper to build composite key for a plan.
 */
export function getPlanKey(productId: string, planId: string): string {
  return `${productId}:${planId}`;
}

/**
 * Resolves composite or prefixed product id to base product and plan id.
 */
export function parseProductAndPlanId(compoundId: string): { productId: string; planId: string } {
  if (!compoundId) return { productId: '', planId: '1m' };

  // Known special cases
  if (compoundId.startsWith('fxreplay-pro-')) {
    const planPart = compoundId.replace('fxreplay-pro-', '').split('-')[0];
    return { productId: 'fxreplay-pro', planId: planPart };
  }
  if (compoundId.startsWith('fxreplay-premium-')) {
    const planPart = compoundId.replace('fxreplay-premium-', '').split('-')[0];
    return { productId: 'fxreplay-premium', planId: planPart };
  }
  if (compoundId.startsWith('deepcharts-')) {
    const planPart = compoundId.replace('deepcharts-', '').split('-')[0];
    return { productId: 'deepcharts', planId: planPart };
  }
  if (compoundId.startsWith('tv-premium-')) {
    const planPart = compoundId.replace('tv-premium-', '').split('-')[0];
    return { productId: 'tv-premium', planId: planPart };
  }
  if (compoundId.startsWith('tv-plus-')) {
    const planPart = compoundId.replace('tv-plus-', '').split('-')[0];
    return { productId: 'tv-plus', planId: planPart };
  }
  if (compoundId.startsWith('tv-essential-')) {
    const planPart = compoundId.replace('tv-essential-', '').split('-')[0];
    return { productId: 'tv-essential', planId: planPart };
  }

  const parts = compoundId.split(':');
  if (parts.length === 2) {
    return { productId: parts[0], planId: parts[1] };
  }

  return { productId: compoundId, planId: '1m' };
}

/**
 * Returns exact available stock quantity for a specific purchasable plan.
 */
export function getPlanStock(productId: string, planId: string): number {
  const key = getPlanKey(productId, planId);
  if (localStockCache[key]) {
    return localStockCache[key].stock;
  }
  // Fallback to 1m default if plan isn't explicitly defined
  const fallbackKey = getPlanKey(productId, '1m');
  if (localStockCache[fallbackKey]) {
    return localStockCache[fallbackKey].stock;
  }
  return 10;
}

/**
 * Returns structured availability information for a purchasable plan.
 * Used for customer-facing plan badges and selection cards.
 */
export function getPlanStockInfo(productId: string, planId: string): PlanStockInfo {
  const stock = getPlanStock(productId, planId);
  const key = getPlanKey(productId, planId);
  const threshold = localStockCache[key]?.lowStockThreshold ?? 2;

  const isOut = stock <= 0;
  // Genuine low stock only: genuine quantity <= threshold, without fake scarcity
  const isLow = stock > 0 && stock <= threshold;

  let availabilityText = `${stock} available`;
  if (isOut) {
    availabilityText = 'Out of Stock';
  } else if (isLow) {
    availabilityText = `${stock} available`;
  }

  return {
    productId,
    planId,
    stock,
    lowStockThreshold: threshold,
    isOut,
    isLow,
    availabilityText,
  };
}

/**
 * Validates whether user can add a specific plan quantity to cart.
 */
export function canAddToCartPlan(
  productId: string,
  planId: string,
  currentCartQuantity: number = 0,
  additionalQuantity: number = 1
): { allowed: boolean; availableStock: number; message?: string } {
  const availableStock = getPlanStock(productId, planId);
  const newTotal = currentCartQuantity + additionalQuantity;

  if (availableStock <= 0) {
    return {
      allowed: false,
      availableStock: 0,
      message: 'This plan is currently out of stock.',
    };
  }

  if (newTotal > availableStock) {
    return {
      allowed: false,
      availableStock,
      message: `Only ${availableStock} license${availableStock === 1 ? '' : 's'} available in stock.`,
    };
  }

  return {
    allowed: true,
    availableStock,
  };
}

/**
 * Atomically consumes stock when an order is completed.
 * Calls backend API to prevent overselling across multiple simultaneous customers.
 */
export async function consumePlanStock(
  items: Array<{ productId: string; planId: string; quantity: number }>,
  orderNumber?: string
): Promise<{ success: boolean; error?: string }> {
  // 1. First attempt backend API call
  try {
    const res = await fetch('/api/stock/consume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, orderNumber }),
    });

    if (res.status === 409) {
      const data = await res.json();
      return { success: false, error: data.error || 'Selected item just went out of stock.' };
    }

    if (res.ok) {
      const data = await res.json();
      if (data.remaining) {
        for (const [key, qty] of Object.entries(data.remaining)) {
          if (localStockCache[key]) {
            localStockCache[key].stock = qty as number;
          }
        }
        saveLocalCache();
      }
      return { success: true };
    }
  } catch (err) {
    console.debug('[Stock] Backend call failed, processing locally');
  }

  // 2. Local fallback if offline: atomic client check
  for (const item of items) {
    const key = getPlanKey(item.productId, item.planId);
    const current = localStockCache[key]?.stock ?? 0;
    if (current < item.quantity) {
      return {
        success: false,
        error: `Only ${current} license(s) available for this plan.`,
      };
    }
  }

  // Deduct
  for (const item of items) {
    const key = getPlanKey(item.productId, item.planId);
    if (localStockCache[key]) {
      localStockCache[key].stock = Math.max(0, localStockCache[key].stock - item.quantity);
      localStockCache[key].allocated += item.quantity;
    }
  }
  saveLocalCache();
  return { success: true };
}

/**
 * Restores plan stock (when an order is cancelled, rejected, or refunded).
 */
export async function restorePlanStock(
  productId: string,
  planId: string,
  quantity: number,
  orderNumber?: string,
  reason: string = 'Order cancelled / refunded'
): Promise<boolean> {
  // 1. Try backend
  try {
    const res = await fetch('/api/stock/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, planId, quantity, orderNumber, reason }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.newStock === 'number') {
        const key = getPlanKey(productId, planId);
        if (localStockCache[key]) {
          localStockCache[key].stock = data.newStock;
          saveLocalCache();
        }
      }
      return true;
    }
  } catch {}

  // 2. Local fallback
  const key = getPlanKey(productId, planId);
  if (localStockCache[key]) {
    localStockCache[key].stock += quantity;
    localStockCache[key].allocated = Math.max(0, localStockCache[key].allocated - quantity);
    saveLocalCache();
    return true;
  }
  return false;
}

/**
 * Saves cache to localStorage and emits sync event.
 */
function saveLocalCache() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(localStockCache));
    } catch {}
    window.dispatchEvent(new CustomEvent(STOCK_EVENT));
  }
}

/**
 * Subscribes a React component to live stock updates.
 */
export function subscribeToStock(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback();
  };

  window.addEventListener(STOCK_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(STOCK_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

/**
 * Future Admin Portal Compatibility APIs
 * Ready for future screens without building UI now.
 */
export async function adminSetStock(productId: string, planId: string, quantity: number, reason?: string) {
  try {
    const res = await fetch('/api/stock/admin/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, planId, quantity, reason }),
    });
    const data = await res.json();
    await syncStockFromBackend();
    return data;
  } catch (e) {
    const key = getPlanKey(productId, planId);
    if (localStockCache[key]) {
      localStockCache[key].stock = quantity;
      saveLocalCache();
    }
    return { success: true };
  }
}

export async function adminAddStock(productId: string, planId: string, quantity: number, reason?: string) {
  try {
    const res = await fetch('/api/stock/admin/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, planId, quantity, reason }),
    });
    const data = await res.json();
    await syncStockFromBackend();
    return data;
  } catch (e) {
    const key = getPlanKey(productId, planId);
    if (localStockCache[key]) {
      localStockCache[key].stock += quantity;
      saveLocalCache();
    }
    return { success: true };
  }
}

export async function adminRemoveStock(productId: string, planId: string, quantity: number, reason?: string) {
  try {
    const res = await fetch('/api/stock/admin/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, planId, quantity, reason }),
    });
    const data = await res.json();
    await syncStockFromBackend();
    return data;
  } catch (e) {
    const key = getPlanKey(productId, planId);
    if (localStockCache[key]) {
      localStockCache[key].stock = Math.max(0, localStockCache[key].stock - quantity);
      saveLocalCache();
    }
    return { success: true };
  }
}

export async function adminGetStockHistory(productId?: string, planId?: string) {
  try {
    const params = new URLSearchParams();
    if (productId) params.set('productId', productId);
    if (planId) params.set('planId', planId);
    const res = await fetch(`/api/stock/history?${params.toString()}`);
    return await res.json();
  } catch {
    return { success: false, history: [] };
  }
}

/**
 * Backward compatibility helpers for root-level product queries.
 */
export function getProductStock(productId: string): number {
  return getPlanStock(productId, '1m');
}

export function canAddToCart(
  productId: string,
  currentCartQuantity: number,
  additionalQuantity: number = 1
) {
  const { productId: pId, planId } = parseProductAndPlanId(productId);
  return canAddToCartPlan(pId, planId, currentCartQuantity, additionalQuantity);
}

export function decrementProductStock(productId: string, quantity: number = 1) {
  const { productId: pId, planId } = parseProductAndPlanId(productId);
  consumePlanStock([{ productId: pId, planId, quantity }]);
  return true;
}
