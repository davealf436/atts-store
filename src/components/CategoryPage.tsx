import React, { useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { SwipeableProductCard } from './SwipeableProductCard';
import { ChevronLeft, LineChart, BookOpen, Crown, ShieldCheck } from 'lucide-react';
import { triggerHaptic, getTelegramWebApp } from '../services/telegram';

export type CategoryId = 'trading-tools' | 'journaling' | 'subscriptions';

interface CategoryPageProps {
  categoryId: CategoryId;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  onBack,
  onViewProduct,
}) => {
  // Sync native Telegram WebApp back button
  useEffect(() => {
    const tg = getTelegramWebApp();
    const backBtn = tg?.BackButton;
    if (backBtn) {
      backBtn.show();
      const handleTgBack = () => {
        triggerHaptic('light');
        onBack();
      };
      backBtn.onClick(handleTgBack);
      return () => {
        backBtn.offClick(handleTgBack);
        backBtn.hide();
      };
    }
  }, [onBack]);

  // Determine products and metadata based on exact user specification
  const getCategoryDetails = () => {
    switch (categoryId) {
      case 'trading-tools': {
        // "1. Trading Tools = Do inside Tradingview Essential and both FXReplay pro cards"
        const allowedIds = ['tv-essential', 'fxreplay-pro', 'fxreplay-premium'];
        const items = allowedIds
          .map((id) => PRODUCTS.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));

        return {
          title: 'Trading Tools',
          badge: 'Charting & Replay',
          description: 'Official TradingView Essential license and dedicated FXReplay Pro simulation engines.',
          icon: LineChart,
          products: items,
        };
      }

      case 'journaling': {
        // "2. Journaling = Dp three cards inside."
        const allowedIds = ['abyssinia-journal', 'backtesting-journal', 'notion-template-journal'];
        const items = allowedIds
          .map((id) => PRODUCTS.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));

        return {
          title: 'Journaling',
          badge: 'Performance & Psychology',
          description: 'Execution logs, mechanical backtest sample sheets, and free Notion workspace templates.',
          icon: BookOpen,
          products: items,
        };
      }

      case 'subscriptions': {
        // "3. Subscriptions = Do inside only Telegram premium card"
        const allowedIds = ['telegram-premium'];
        const items = allowedIds
          .map((id) => PRODUCTS.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));

        return {
          title: 'Subscriptions',
          badge: 'Official Upgrades',
          description: 'Official Telegram Premium subscriptions with doubled limits and high-speed cloud access.',
          icon: Crown,
          products: items,
        };
      }
    }
  };

  const details = getCategoryDetails();
  const IconComponent = details.icon;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="inline-flex items-center gap-1.5 py-1 px-2.5 -ml-1 rounded-lg text-xs font-bold text-gray-700 hover:text-[#721428] hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Back</span>
        </button>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
          {details.products.length} {details.products.length === 1 ? 'Product' : 'Products'}
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shrink-0 shadow-2xs">
          <IconComponent className="w-6 h-6 stroke-[2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 text-[9.5px] font-extrabold uppercase tracking-wider text-[#721428] mb-0.5">
            <span>{details.badge}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
            {details.title}
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
            {details.description}
          </p>
        </div>
      </div>

      {/* Product Cards Stack / Grid */}
      <div className="space-y-3">
        {details.products.map((product) => (
          <SwipeableProductCard
            key={`category-card-${product.id}`}
            product={product}
            onView={onViewProduct}
            className="w-full shrink-0 shadow-xs"
          />
        ))}
      </div>

      {/* Trust & Instant Dispatch Notice */}
      <div className="p-3 bg-white rounded-xl border border-gray-200/80 flex items-center gap-2.5 text-xs text-gray-600 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#721428] shrink-0" />
        <span className="text-[11px] text-gray-500 font-medium leading-snug">
          All licenses and access credentials are automatically dispatched via Telegram and stored in your ATH account.
        </span>
      </div>
    </div>
  );
};
