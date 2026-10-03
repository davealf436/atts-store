import React, { useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { ChevronLeft, LineChart, BookOpen, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
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

  const getProductContainerBg = (product: Product) => {
    if (product.id === 'abyssinia-journal' || product.id === 'notion-template-journal') {
      return 'bg-white border border-stone-200/90';
    }
    if (product.id === 'telegram-premium') {
      return 'bg-[#24A1DE]';
    }
    if (product.brand === 'FXReplay' || product.id.startsWith('fxreplay')) {
      return 'bg-[#070D18]';
    }
    return 'bg-black';
  };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
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

        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
          {details.products.length} {details.products.length === 1 ? 'Product' : 'Products'}
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shrink-0 shadow-2xs">
          <IconComponent className="w-5.5 h-5.5 stroke-[2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 text-[9.5px] font-bold tracking-wide text-[#721428] mb-0.5">
            <span>{details.badge}</span>
          </div>
          <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">
            {details.title}
          </h2>
          <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed mt-0.5">
            {details.description}
          </p>
        </div>
      </div>

      {/* Distinct Compact Product Cards List */}
      <div className="space-y-2">
        {details.products.map((product) => {
          const containerBg = getProductContainerBg(product);

          return (
            <div
              key={`category-compact-${product.id}`}
              onClick={() => {
                triggerHaptic('light');
                onViewProduct(product);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerHaptic('light');
                  onViewProduct(product);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View options for ${product.name}`}
              className="group bg-white border border-gray-200/90 hover:border-[#721428]/40 active:border-[#721428] rounded-xl p-2.5 sm:p-3 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all active:scale-[0.985] cursor-pointer"
            >
              {/* Compact Brand Logo Thumbnail */}
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2 select-none shadow-2xs ${containerBg}`}
              >
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <ProductPhotoLogo
                    productId={product.id}
                    size="banner"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Product Info (Middle) */}
              <div className="flex-1 min-w-0">
                {product.badge && (
                  <div className="mb-0.5 leading-none">
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded text-[9.5px] font-bold tracking-tight bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]/80">
                      {product.badge}
                    </span>
                  </div>
                )}
                <h4 className="text-[13.5px] font-bold text-gray-900 group-hover:text-[#721428] transition-colors truncate leading-snug">
                  {product.name}
                </h4>
                <div className="text-[11px] font-semibold text-stone-500 truncate mt-0.5">
                  {product.startingPricePlaceholder || (product.priceETB ? `${product.priceETB} ETB` : 'Free')}
                </div>
              </div>

              {/* Compact Action Button (Right) */}
              <div className="shrink-0 pl-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] text-white text-[11px] font-bold transition-all shadow-2xs group-hover:shadow-xs">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Instant Dispatch Notice */}
      <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-center gap-2.5 text-xs text-gray-600 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#721428] shrink-0" />
        <span className="text-[11px] text-gray-500 font-medium leading-snug">
          Instant Telegram dispatch with authentic license warranty.
        </span>
      </div>
    </div>
  );
};
