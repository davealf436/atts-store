import { TelegramUser } from '../types';

export const P2P_BUY_RATE = 142.50; // 1 USDT = 142.50 ETB
export const P2P_SELL_RATE = 140.00; // 1 USDT = 140.00 ETB

export type P2POrderType = 'buy' | 'sell';
export type P2POrderStatus = 'pending' | 'approved' | 'rejected';

export interface P2POrder {
  id: string;
  type: P2POrderType;
  amountUSDT: number;
  amountETB: number;
  rate: number;
  paymentMethod: string; // 'Wallet Balance' for buy; 'Telebirr' | 'CBE' | 'Awash Bank' for sell
  accountNumber?: string;
  accountName?: string;
  destinationAddress?: string; // Binance ID / USDT Address
  reference?: string;
  date: string;
  status: P2POrderStatus;
}

const P2P_STORAGE_KEY = 'ath_p2p_orders_v1';

const SEED_P2P_ORDERS: P2POrder[] = [
  {
    id: 'P2P-849201',
    type: 'buy',
    amountUSDT: 15.00,
    amountETB: 2137.50,
    rate: P2P_BUY_RATE,
    paymentMethod: 'Wallet Balance',
    destinationAddress: '874067761 (Binance Pay)',
    reference: 'WLT-P2P-849201',
    date: 'Sep 29, 2026 • 11:20 AM',
    status: 'approved',
  },
  {
    id: 'P2P-731940',
    type: 'sell',
    amountUSDT: 20.00,
    amountETB: 2800.00,
    rate: P2P_SELL_RATE,
    paymentMethod: 'Telebirr',
    accountNumber: '0934313020',
    accountName: 'Dawit',
    reference: 'TLB-892401',
    date: 'Sep 28, 2026 • 04:45 PM',
    status: 'approved',
  },
  {
    id: 'P2P-620481',
    type: 'buy',
    amountUSDT: 10.00,
    amountETB: 1425.00,
    rate: P2P_BUY_RATE,
    paymentMethod: 'Wallet Balance',
    destinationAddress: '874067761 (Binance Pay)',
    reference: 'WLT-P2P-620481',
    date: 'Sep 30, 2026 • 09:15 AM',
    status: 'pending',
  },
];

export const getP2POrders = (): P2POrder[] => {
  if (typeof window === 'undefined') return SEED_P2P_ORDERS;
  try {
    const raw = localStorage.getItem(P2P_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse P2P orders:', e);
  }
  return SEED_P2P_ORDERS;
};

export const saveP2POrders = (orders: P2POrder[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(P2P_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('p2p_orders_updated', { detail: orders }));
  } catch (e) {
    console.warn('Failed to save P2P orders:', e);
  }
};

export const createP2POrder = (
  orderData: Omit<P2POrder, 'id' | 'date' | 'status'>
): P2POrder => {
  const currentOrders = getP2POrders();
  const now = new Date();
  const dateFormatted =
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' • ' +
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const newOrder: P2POrder = {
    ...orderData,
    id: `P2P-${randomNum}`,
    date: dateFormatted,
    status: 'pending',
  };

  const updated = [newOrder, ...currentOrders];
  saveP2POrders(updated);
  return newOrder;
};
