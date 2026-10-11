export type NavigationTab = 'home' | 'p2p' | 'wallet' | 'orders';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'tradingview' | 'backtesting' | 'journaling' | 'subscriptions' | string;
  shortDescription: string;
  fullDescription: string;
  startingPricePlaceholder: string;
  priceETB: number;
  features: string[];
  badge?: string;
  tier?: string;
  subtitle?: string;
  stock?: number;
  maxStock?: number;
  parentProductId?: string;
  selectedPlanId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPurchasedItem {
  productId: string;
  planId: string;
  quantity: number;
  productName: string;
  planName?: string;
  priceETB?: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  date: string;
  status: 'active' | 'processing' | 'expired' | 'cancelled' | 'rejected' | 'returned';
  priceETB?: number;
  paymentMethod?: string;
  licenseKey?: string;
  items?: OrderPurchasedItem[];
  cancelReason?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase';
  amountETB: number;
  amountUSDT?: number;
  method: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  screenshotUrl?: string;
  adminCommand?: string;
}

export interface WalletState {
  balanceETB: number;
  totalDepositedETB: number;
  totalSpentETB: number;
  transactions: WalletTransaction[];
}

export interface AthAccount {
  id: string; // Internal account ID
  telegramId: number; // Permanent account identifier from Telegram
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  status: 'active' | 'suspended';
  role: 'customer' | 'admin';
  orderCount?: number;
  totalSpentETB?: number;
}

