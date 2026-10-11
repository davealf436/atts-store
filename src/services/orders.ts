import { OrderItem } from '../types';
import { restorePlanStock } from './stock';

const ORDERS_STORAGE_KEY = 'ath_orders_storage_v1';

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-seed-1',
    orderNumber: 'ATH-ORD-849201',
    productName: 'Telegram Premium (6 Months)',
    date: 'Sep 28, 2026 • 15:45',
    status: 'active',
    priceETB: 1000,
    paymentMethod: 'Wallet Balance',
    licenseKey: 'TG-PRM-ATH-9842-8819',
    items: [
      {
        productId: 'telegram-premium',
        planId: '3m',
        quantity: 1,
        productName: 'Telegram Premium',
      },
    ],
  },
];

export const getStoredOrders = (): OrderItem[] => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse orders:', e);
  }
  return INITIAL_ORDERS;
};

export const saveOrder = (order: OrderItem): OrderItem[] => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ath_orders_updated', { detail: updated }));
  } catch (e) {
    console.warn('Failed to save order:', e);
  }
  return updated;
};

/**
 * Cancels or rejects an order and restores the consumed stock for all purchased plans.
 */
export const cancelOrder = async (orderId: string, reason: string = 'Order cancelled'): Promise<boolean> => {
  const current = getStoredOrders();
  const targetIndex = current.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (targetIndex === -1) return false;

  const order = current[targetIndex];
  if (order.status === 'cancelled' || order.status === 'returned' || order.status === 'rejected') {
    return false; // Already handled
  }

  // Restore stock for all plan items in this order
  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      await restorePlanStock(item.productId, item.planId, item.quantity, order.orderNumber, reason);
    }
  }

  // Update order status
  order.status = 'cancelled';
  order.cancelReason = reason;

  current[targetIndex] = { ...order };
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('ath_orders_updated', { detail: current }));
  } catch (e) {
    console.warn('Failed to persist cancelled order:', e);
  }
  return true;
};

/**
 * Returns an order and restores its stock quantity.
 */
export const returnOrder = async (orderId: string, reason: string = 'Order returned / refunded'): Promise<boolean> => {
  return cancelOrder(orderId, reason);
};

