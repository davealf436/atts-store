import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { SwipeableProductCard } from './SwipeableProductCard';
import { ArrowRight, ArrowLeftRight, ShieldCheck, Zap, Bookmark, Compass, Star } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { AthLogo } from './AthLogo';
import { getFavoriteIds, subscribeToFavorites } from '../services/favorites';

interface HomeScreenProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToP2P: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onViewProduct,
  onNavigateToP2P,
}) => {
  const [homeTab, setHomeTab] = useState<'all' | 'saved'>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavoriteIds);

  useEffect(() => {
    const unsubscribe = subscribeToFavorites((ids) => {
      setFavoriteIds(ids);
    });
    return unsubscribe;
  }, []);

  const savedProducts = products.filter((p) => favoriteIds.includes(p.id));

  // Display products in the exact requested order:
  // 1. TradingView Premium
  // 2. TradingView Essential
  // 3. FXReplay Pro
  const orderedProducts = ['tv-premium', 'tv-essential', 'fxreplay-pro']
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Journaling Tools in exact requested order:
  // 1. Abyssinia Journal
  // 2. Backtesting Journal
  // 3. Notion Template Journal — Free
  const orderedJournalProducts = ['abyssinia-journal', 'backtesting-journal', 'notion-template-journal']
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Premium Subscriptions in exact requested order:
  // 1. Telegram Premium
  // 2. Google AI
  const orderedSubscriptionProducts = ['telegram-premium', 'google-ai']
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="space-y-4 pb-4">
      {/* ATH Home Hero Card — Compact Refined Edition */}
      <section className="relative overflow-hidden rounded-2xl bg-[#FCFAF7] dark:bg-[#1C1C24] border border-[#721428]/40 dark:border-[#721428]/55 shadow-xs pt-2.5 pb-3.5 px-3.5 sm:pt-3 sm:pb-4 sm:px-4 select-none">
        {/* Subtle background technical grid & market watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Faint coordinate grid lines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #1C1917 1px, transparent 1px), linear-gradient(to bottom, #1C1917 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Minimalist market chart vector hairline behind logo */}
          <svg
            className="absolute right-1 sm:right-3 bottom-1 w-48 sm:w-56 h-22 sm:h-24 pointer-events-none overflow-visible"
            viewBox="0 0 190 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal price levels */}
            <line x1="16" y1="26" x2="182" y2="26" stroke="#721428" strokeOpacity="0.12" strokeWidth="0.75" strokeDasharray="2 3" />
            <line x1="36" y1="62" x2="182" y2="62" stroke="#721428" strokeOpacity="0.12" strokeWidth="0.75" strokeDasharray="2 3" />
            
            {/* Constant baseline chart trajectory: ascending from bottom (y=80) to top (y=10) */}
            <path
              d="M 12 80 L 44 68 L 76 52 L 106 60 L 140 32 L 176 10"
              stroke="#721428"
              strokeWidth="1.2"
              strokeOpacity="0.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Smooth animated active flow line drawing from bottom to top */}
            <path
              d="M 12 80 L 44 68 L 76 52 L 106 60 L 140 32 L 176 10"
              stroke="#721428"
              strokeWidth="1.8"
              strokeOpacity="0.85"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="190"
              strokeDashoffset="190"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="190;0;0;190"
                keyTimes="0;0.45;0.8;1"
                dur="5.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.9;0.9;0.3"
                keyTimes="0;0.45;0.8;1"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Hero Content: Headline, Description & Compact Button on Left; Refined ATH Logo on Right */}
        <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 -mt-0.5">
            {/* ATH Badge with refined border line and minimized top space */}
            <div className="mb-1 select-none leading-none">
              <span className="inline-flex items-center px-1.5 py-[2px] rounded-[5px] border border-[#721428]/45 dark:border-[#721428]/60 bg-[#721428]/[0.05] dark:bg-[#721428]/20 text-[9px] font-extrabold tracking-[0.16em] uppercase text-[#721428] dark:text-[#FB7185] leading-none shadow-2xs">
                ATH
              </span>
            </div>

            <h1 className="text-[19px] sm:text-[21px] font-black text-stone-900 tracking-tight leading-[1.18] mb-1.5">
              Built for Better<br />
              <span className="text-[#721428] inline-block">
                Trading<span className="text-[#C59F43]">.</span>
              </span>
            </h1>

            <p className="text-xs text-stone-600 font-medium leading-relaxed max-w-[240px] sm:max-w-[280px] mb-2.5">
              Premium tools, journals &amp; digital resources for traders who take their process seriously.
            </p>

            <div>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  const el = document.getElementById('featured-tools');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Explore Tools</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Refined ATH Logo Area: Single outer square frame only, clean and centered */}
          <div className="shrink-0 flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs self-center w-[76px] h-[76px] sm:w-[84px] sm:h-[84px]">
            <AthLogo size="lg" animated={true} />
          </div>
        </div>
      </section>

      {/* Category / Saved Tab Switcher */}
      <section className="flex items-center gap-2 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setHomeTab('all');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            homeTab === 'all'
              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>All Tools</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setHomeTab('saved');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            homeTab === 'saved'
              ? 'bg-white text-[#721428] shadow-2xs border border-stone-200/80'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${favoriteIds.length > 0 ? 'fill-[#721428] text-[#721428]' : ''}`} />
          <span>Saved</span>
          {favoriteIds.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]">
              {favoriteIds.length}
            </span>
          )}
        </button>
      </section>

      {/* ─── SAVED VIEW (When Saved Tab is Active) ─── */}
      {homeTab === 'saved' && (
        <section className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 fill-[#721428] text-[#721428]" />
                <span>Your Saved Tools</span>
                <span className="text-[10px] font-semibold text-gray-400">· {savedProducts.length} items</span>
              </h3>
              <p className="text-[11px] text-gray-500">
                Bookmarked platforms and licenses for fast access
              </p>
            </div>

            {savedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setHomeTab('all');
                }}
                className="text-[11px] font-bold text-[#721428] hover:underline cursor-pointer"
              >
                Browse Store
              </button>
            )}
          </div>

          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {savedProducts.map((product) => (
                <div key={`saved-grid-${product.id}`} className="w-full">
                  <SwipeableProductCard
                    product={product}
                    onView={onViewProduct}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 rounded-2xl bg-white border border-stone-200/90 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428]">
                <Bookmark className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">No Saved Items Yet</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Tap the star icon on any tool card in the store to save it here for fast access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setHomeTab('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore All Tools</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─── ALL TOOLS VIEW (When All Tools Tab is Active) ─── */}
      {homeTab === 'all' && (
        <>
          {/* Optional Saved Items Highlight Section if user has favorited items */}
          {savedProducts.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 fill-[#721428] text-[#721428]" />
                    <span>Saved Items</span>
                    <span className="text-[10px] font-semibold text-gray-400">· {savedProducts.length} saved</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Your bookmarked subscriptions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setHomeTab('saved');
                  }}
                  className="text-[11px] font-bold text-[#721428] hover:underline cursor-pointer"
                >
                  View All ({savedProducts.length})
                </button>
              </div>

              {/* Horizontal Track of Saved Items */}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 -mx-3.5 px-3.5 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {savedProducts.map((product) => (
                  <SwipeableProductCard
                    key={`saved-track-${product.id}`}
                    product={product}
                    onView={onViewProduct}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Featured Tools Section with Horizontal Swipeable Cards */}
          <section id="featured-tools" className="space-y-2.5 scroll-mt-16">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <span>Featured Tools</span>
                  <span className="text-[10px] font-semibold text-gray-400">· Swipe</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Select a tool to explore subscription options
                </p>
              </div>
            </div>

            {/* Horizontal Swipeable Track (Ordered: 1. TV Premium, 2. TV Essential, 3. FXReplay Pro) */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 -mx-3.5 px-3.5 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {orderedProducts.map((product) => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  onView={onViewProduct}
                />
              ))}
            </div>
          </section>

          {/* Journaling Tools Section with Exact Same Horizontal Swipeable Cards */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <span>Journaling Tools</span>
                  <span className="text-[10px] font-semibold text-gray-400">· Swipe</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Track executions, psychology &amp; backtesting systems
                </p>
              </div>
            </div>

            {/* Horizontal Swipeable Track (Ordered: 1. Abyssinia Journal, 2. Backtesting Journal, 3. Notion Template Journal — Free) */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 -mx-3.5 px-3.5 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {orderedJournalProducts.map((product) => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  onView={onViewProduct}
                />
              ))}
            </div>
          </section>

          {/* Premium Subscriptions Section (Ordered: 1. Telegram Premium, 2. Google AI) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <span>Premium Subscriptions</span>
                  <span className="text-[10px] font-semibold text-gray-400">· Swipe</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Official productivity, communication &amp; AI licenses
                </p>
              </div>
            </div>

            {/* Horizontal Swipeable Track */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 -mx-3.5 px-3.5 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {orderedSubscriptionProducts.map((product) => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  onView={onViewProduct}
                />
              ))}
            </div>
          </section>

          {/* Exchange Desk Entry Point Card */}
          <section className="bg-white border border-gray-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF0F2] text-[#721428] flex items-center justify-center shrink-0 border border-[#F0D5DA]">
                <ArrowLeftRight className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    Exchange Desk
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1">
                  Exchange Desk
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Direct exchange for USDT and Ethiopian Birr (ETB) with verified instant transfers.
                </p>

                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    onNavigateToP2P();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Exchange Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-700" />
                </button>
              </div>
            </div>
          </section>

          {/* Key Guarantees / Service Notes */}
          <section className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white border border-gray-200/80 rounded-xl text-left shadow-2xs">
              <div className="w-6.5 h-6.5 rounded-md bg-[#FAF0F2] text-[#721428] flex items-center justify-center mb-1.5 border border-[#F0D5DA]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-0.5">Verified Accounts</h4>
              <p className="text-[10.5px] text-gray-500 leading-snug">
                Authentic subscriptions with active warranty.
              </p>
            </div>

            <div className="p-3 bg-white border border-gray-200/80 rounded-xl text-left shadow-2xs">
              <div className="w-6.5 h-6.5 rounded-md bg-[#FAF0F2] text-[#721428] flex items-center justify-center mb-1.5 border border-[#F0D5DA]">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-0.5">Direct Telegram</h4>
              <p className="text-[10.5px] text-gray-500 leading-snug">
                Dispatched directly inside ATH.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
