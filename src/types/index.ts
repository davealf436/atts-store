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
  features: string[];
  badge?: string;
  tier?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  date: string;
  status: 'active' | 'processing' | 'expired';
}
