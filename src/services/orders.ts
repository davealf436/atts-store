import { OrderItem } from '../types';

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
