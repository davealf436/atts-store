export interface PlanStockRecord {
  productId: string;
  planId: string;
  productName: string;
  planName: string;
  stock: number;
  lowStockThreshold: number;
  allocated: number;
  lastUpdated: string;
}

export interface StockHistoryRecord {
  id: string;
  timestamp: string;
  productId: string;
  planId: string;
  productName: string;
  planName: string;
  action: 'purchase' | 'cancel' | 'restore' | 'admin_set' | 'admin_add' | 'admin_remove' | 'seed';
  quantityDelta: number;
  stockBefore: number;
  stockAfter: number;
  orderNumber?: string;
  reason?: string;
  actor: 'customer' | 'admin' | 'system';
}

/**
 * Initial seed plans inventory.
 * Note the requested sample:
 * - 7 Days — 4 available
 * - 2 Weeks — 2 available (Low Stock)
 * - 1 Month — Out of Stock (0 available)
 * - 3 Months — 5 available
 * - Other catalog products with realistic stock numbers.
 */
export const DEFAULT_PLANS: Record<string, PlanStockRecord> = {
  // FX Replay Pro (Essential Plan)
  'fxreplay-pro:6d': {
    productId: 'fxreplay-pro',
    planId: '6d',
    productName: 'FX Replay Pro',
    planName: '7 Days',
    stock: 4,
    lowStockThreshold: 2,
    allocated: 12,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'fxreplay-pro:2w': {
    productId: 'fxreplay-pro',
    planId: '2w',
    productName: 'FX Replay Pro',
    planName: '2 Weeks',
    stock: 2,
    lowStockThreshold: 2,
    allocated: 18,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'fxreplay-pro:1m': {
    productId: 'fxreplay-pro',
    planId: '1m',
    productName: 'FX Replay Pro',
    planName: '1 Month',
    stock: 0, // Explicitly Out of Stock as requested in example
    lowStockThreshold: 2,
    allocated: 30,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'fxreplay-pro:3m': {
    productId: 'fxreplay-pro',
    planId: '3m',
    productName: 'FX Replay Pro',
    planName: '3 Months',
    stock: 5,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // FX Replay Pro (Premium Plan)
  'fxreplay-premium:1m': {
    productId: 'fxreplay-premium',
    planId: '1m',
    productName: 'FX Replay Pro',
    planName: '1 Month',
    stock: 3,
    lowStockThreshold: 2,
    allocated: 7,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'fxreplay-premium:annual': {
    productId: 'fxreplay-premium',
    planId: 'annual',
    productName: 'FX Replay Pro',
    planName: 'Annual',
    stock: 2,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // DeepCharts
  'deepcharts:1m': {
    productId: 'deepcharts',
    planId: '1m',
    productName: 'DeepCharts',
    planName: '1 Month',
    stock: 6,
    lowStockThreshold: 2,
    allocated: 9,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'deepcharts:3m': {
    productId: 'deepcharts',
    planId: '3m',
    productName: 'DeepCharts',
    planName: '3 Months',
    stock: 4,
    lowStockThreshold: 2,
    allocated: 6,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'deepcharts:annual': {
    productId: 'deepcharts',
    planId: 'annual',
    productName: 'DeepCharts',
    planName: 'Annual',
    stock: 2,
    lowStockThreshold: 2,
    allocated: 4,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // TradingView Premium
  'tv-premium:1m': {
    productId: 'tv-premium',
    planId: '1m',
    productName: 'TradingView Premium',
    planName: '1 Month',
    stock: 5,
    lowStockThreshold: 2,
    allocated: 15,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-premium:3m': {
    productId: 'tv-premium',
    planId: '3m',
    productName: 'TradingView Premium',
    planName: '3 Months',
    stock: 3,
    lowStockThreshold: 2,
    allocated: 10,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-premium:annual': {
    productId: 'tv-premium',
    planId: 'annual',
    productName: 'TradingView Premium',
    planName: 'Annual',
    stock: 2,
    lowStockThreshold: 2,
    allocated: 6,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // TradingView Plus
  'tv-plus:1m': {
    productId: 'tv-plus',
    planId: '1m',
    productName: 'TradingView Plus',
    planName: '1 Month',
    stock: 8,
    lowStockThreshold: 2,
    allocated: 14,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-plus:3m': {
    productId: 'tv-plus',
    planId: '3m',
    productName: 'TradingView Plus',
    planName: '3 Months',
    stock: 4,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-plus:annual': {
    productId: 'tv-plus',
    planId: 'annual',
    productName: 'TradingView Plus',
    planName: 'Annual',
    stock: 3,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // TradingView Essential
  'tv-essential:1m': {
    productId: 'tv-essential',
    planId: '1m',
    productName: 'TradingView Essential',
    planName: '1 Month',
    stock: 12,
    lowStockThreshold: 3,
    allocated: 20,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-essential:3m': {
    productId: 'tv-essential',
    planId: '3m',
    productName: 'TradingView Essential',
    planName: '3 Months',
    stock: 8,
    lowStockThreshold: 3,
    allocated: 14,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'tv-essential:annual': {
    productId: 'tv-essential',
    planId: 'annual',
    productName: 'TradingView Essential',
    planName: 'Annual',
    stock: 4,
    lowStockThreshold: 2,
    allocated: 8,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // Telegram Premium
  'telegram-premium:1m': {
    productId: 'telegram-premium',
    planId: '1m',
    productName: 'Telegram Premium',
    planName: '1 Month',
    stock: 8,
    lowStockThreshold: 3,
    allocated: 16,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'telegram-premium:3m': {
    productId: 'telegram-premium',
    planId: '3m',
    productName: 'Telegram Premium',
    planName: '3 Months',
    stock: 5,
    lowStockThreshold: 2,
    allocated: 9,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'telegram-premium:annual': {
    productId: 'telegram-premium',
    planId: 'annual',
    productName: 'Telegram Premium',
    planName: 'Annual',
    stock: 3,
    lowStockThreshold: 2,
    allocated: 5,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // Google AI
  'google-ai:1m': {
    productId: 'google-ai',
    planId: '1m',
    productName: 'Google AI',
    planName: '1 Month',
    stock: 4,
    lowStockThreshold: 2,
    allocated: 11,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'google-ai:3m': {
    productId: 'google-ai',
    planId: '3m',
    productName: 'Google AI',
    planName: '3 Months',
    stock: 3,
    lowStockThreshold: 2,
    allocated: 7,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'google-ai:annual': {
    productId: 'google-ai',
    planId: 'annual',
    productName: 'Google AI',
    planName: 'Annual',
    stock: 1, // Genuinely low stock
    lowStockThreshold: 2,
    allocated: 4,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },

  // Free Journaling Tools (Always in stock)
  'abyssinia-journal:1m': {
    productId: 'abyssinia-journal',
    planId: '1m',
    productName: 'Abyssinia Journal',
    planName: '1 Month',
    stock: 42,
    lowStockThreshold: 5,
    allocated: 58,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'backtesting-journal:1m': {
    productId: 'backtesting-journal',
    planId: '1m',
    productName: 'Backtesting Journal',
    planName: '1 Month',
    stock: 35,
    lowStockThreshold: 5,
    allocated: 45,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
  'notion-template-journal:1m': {
    productId: 'notion-template-journal',
    planId: '1m',
    productName: 'Notion Template Journal',
    planName: '1 Month',
    stock: 88,
    lowStockThreshold: 5,
    allocated: 112,
    lastUpdated: '2026-10-07T00:00:00.000Z',
  },
};
