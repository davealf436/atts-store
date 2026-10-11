import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { SwipeableProductCard } from './SwipeableProductCard';
import { ChevronLeft, Share2 } from 'lucide-react';
import { triggerHaptic, getTelegramWebApp } from '../services/telegram';
import { getPinnedIds, subscribeToPinned, sortProductsWithPinned } from '../services/pin';
import { toast } from '../services/toast';

export type SubscriptionFamily = 'tradingview' | 'fxreplay';

interface SubscriptionPlansPageProps {
  family: SubscriptionFamily;
  products?: Product[];
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}

export const SubscriptionPlansPage: React.FC<SubscriptionPlansPageProps> = ({
  family,
  products = PRODUCTS,
  onBack,
  onViewProduct,
}) => {
  const [pinnedIds, setPinnedIds] = useState<string[]>(getPinnedIds);

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

  // Subscribe to pin updates
  useEffect(() => {
    const unsubscribe = subscribeToPinned((ids) => {
      setPinnedIds(ids);
    });
    return unsubscribe;
  }, []);

  const isTradingView = family === 'tradingview';

  const title = isTradingView ? 'TradingView' : 'FXREPLAY';

  // Share action (Web Share API with Telegram contacts fallback)
  const handleShare = async () => {
    triggerHaptic('light');
    const shareUrl = window.location.href;
    const shareTitle = `${title} | Abyssinia Trading Hub`;
    const shareText = `Check out ${title} plans on Abyssinia Trading Hub`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared', `${title} link shared.`);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const tgWebApp = getTelegramWebApp();

    if (tgWebApp?.openTelegramLink) {
      tgWebApp.openTelegramLink(tgShareUrl);
      toast.success('Opening Telegram', 'Select a contact to share with.');
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link Copied', 'Link copied to clipboard.');
      } catch {
        const a = document.createElement('a');
        a.href = tgShareUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      const a = document.createElement('a');
      a.href = tgShareUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Show the exact cards requested for each subscription:
  // TradingView: 1. TradingView Essential, 2. TradingView Plus, 3. TradingView Premium
  // FX Replay: FX Replay Pro (Essential Plan) and FX Replay Pro (Premium Plan)
  const planIds = isTradingView
    ? ['tv-essential', 'tv-plus', 'tv-premium']
    : ['fxreplay-pro', 'fxreplay-premium'];

  const rawPlans = planIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const orderedPlanProducts = sortProductsWithPinned(rawPlans, pinnedIds);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-[#721428] dark:hover:text-[#F0D5DA] bg-white dark:bg-[#1C1C24] px-3 py-1.5 rounded-xl border border-gray-200/90 dark:border-gray-800 shadow-2xs transition-all active:scale-95 cursor-pointer"
          aria-label="Back to storefront"
        >
          <ChevronLeft className="w-4 h-4 text-[#721428] dark:text-[#F0D5DA]" />
          <span>Back</span>
        </button>

        {/* Share Button (Web Share API with Telegram contacts fallback) */}
        <button
          type="button"
          onClick={handleShare}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-2xs border bg-white dark:bg-[#1C1C24] border-gray-200/90 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer active:scale-90"
          aria-label={`Share ${title} plans`}
          title="Share with Telegram contacts"
        >
          <Share2 className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>

      {/* Available Plans Section with the Exact Product Cards */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </h2>
            <p className="text-[11px] text-gray-500">
              Select a plan to explore options and configure access
            </p>
          </div>
        </div>

        {/* 2-Column Grid Layout — Easy to view all cards directly */}
        <div className="grid grid-cols-2 gap-3 pt-0.5">
          {orderedPlanProducts.map((product) => (
            <SwipeableProductCard
              key={product.id}
              product={product}
              className="w-full"
              onView={onViewProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
