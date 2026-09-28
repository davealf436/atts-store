import React from 'react';
import { Product } from '../types';
import { SwipeableProductCard } from './SwipeableProductCard';
import { ArrowRight, ArrowLeftRight, ShieldCheck, Zap } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { AthLogo } from './AthLogo';

interface HomeScreenProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToProducts: () => void;
  onNavigateToP2P: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onViewProduct,
  onAddToCart,
  onNavigateToProducts,
  onNavigateToP2P,
}) => {
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
      {/* ATH Home Hero Card — Architectural Editorial Redesign */}
      <section className="relative overflow-hidden rounded-2xl bg-[#FCFAF7] border border-stone-250/90 shadow-[0_4px_24px_-6px_rgba(28,25,23,0.07)] p-4 sm:p-5 select-none">
        {/* Subtle background technical grid & market watermark */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Faint coordinate grid lines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #1C1917 1px, transparent 1px), linear-gradient(to bottom, #1C1917 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Precision corner crosshairs */}
          <span className="absolute top-2.5 left-3 font-mono text-[9px] text-stone-300 select-none">+</span>
          <span className="absolute top-2.5 right-3 font-mono text-[9px] text-stone-300 select-none">+</span>
          <span className="absolute bottom-2.5 left-3 font-mono text-[9px] text-stone-300 select-none">+</span>
          <span className="absolute bottom-2.5 right-3 font-mono text-[9px] text-stone-300 select-none">+</span>

          {/* Minimalist market chart vector hairline behind logo */}
          <svg
            className="absolute right-0 bottom-10 w-48 h-24 text-stone-300/40 pointer-events-none"
            viewBox="0 0 190 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal price levels */}
            <line x1="10" y1="25" x2="180" y2="25" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
            <line x1="30" y1="65" x2="180" y2="65" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
            
            {/* Precision market path */}
            <path
              d="M 10 70 L 45 62 L 75 48 L 105 54 L 140 28 L 175 18"
              stroke="#721428"
              strokeWidth="1.2"
              strokeOpacity="0.28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Small execution data point */}
            <circle cx="175" cy="18" r="2.5" fill="#721428" fillOpacity="0.5" />
            <circle cx="175" cy="18" r="5" stroke="#721428" strokeWidth="0.75" strokeOpacity="0.25" />
          </svg>
        </div>

        {/* Hero Top Metadata & Status Strip */}
        <div className="relative z-10 flex items-center justify-between pb-3 mb-3.5 border-b border-stone-200/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#F0D5DA] shadow-[0_1px_2px_rgba(114,20,40,0.06)] text-[10px] font-extrabold tracking-wider text-[#721428]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#721428] animate-pulse" />
              <span>OFFICIAL ATH</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9.5px] font-semibold text-stone-400 tracking-tight">
            <span>TERMINAL</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-600">ED. 2026</span>
          </div>
        </div>

        {/* Asymmetric Composition: Headline & Copy integrated with Sculptural ATH Brand Mark */}
        <div className="relative z-10 grid grid-cols-12 gap-3 items-center mb-4">
          {/* Left / Primary Text Column (7 cols) */}
          <div className="col-span-8 xs:col-span-8 min-w-0 pr-1">
            <h1 className="text-[21px] xs:text-[23px] sm:text-2xl font-black text-stone-900 tracking-tight leading-[1.18] mb-2">
              Built for Better{' '}
              <span className="text-[#721428] inline-block">
                Trading<span className="text-[#C59F43]">.</span>
              </span>
            </h1>

            <p className="text-[12px] sm:text-[13px] text-stone-600 font-medium leading-[1.55] max-w-[270px]">
              Premium tools, journals &amp; digital resources for traders who take their process seriously.
            </p>
          </div>

          {/* Right / Major Sculptural ATH Logo Stage (4 cols) */}
          <div className="col-span-4 xs:col-span-4 flex justify-end">
            <div className="relative flex items-center justify-center p-3 rounded-2xl bg-white border border-stone-200/90 shadow-[0_2px_12px_rgba(28,25,23,0.05)] aspect-square w-[88px] h-[88px] xs:w-[98px] xs:h-[98px] sm:w-[104px] sm:h-[104px]">
              {/* Concentric subtle Fibonacci / aperture arcs */}
              <div className="absolute inset-1 rounded-xl border border-stone-100 pointer-events-none" />
              <div className="absolute inset-3 rounded-lg border border-dashed border-stone-200/60 pointer-events-none" />
              
              {/* Major ATH Brand Mark */}
              <div className="relative z-10 scale-120 sm:scale-130 transition-transform">
                <AthLogo size="lg" animated={true} />
              </div>

              {/* Micro badge in bottom corner */}
              <span className="absolute bottom-1 right-1.5 font-mono text-[8px] font-bold text-stone-400">
                ATH
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Deep Burgundy CTA Strip */}
        <div className="relative z-10 pt-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white transition-all active:scale-[0.99] shadow-[0_4px_14px_rgba(114,20,40,0.22)] cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-[13px] font-bold tracking-tight">Browse Catalog</span>
              <span className="text-[10px] font-semibold text-white/70 hidden xs:inline-block">
                — Explore All Products
              </span>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </section>

      {/* Featured Tools Section with Horizontal Swipeable Cards */}
      <section className="space-y-2.5">
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

          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="text-xs font-bold text-[#721428] hover:text-[#5A0E1E] flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
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
              Track executions, psychology & backtesting systems
            </p>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="text-xs font-bold text-[#721428] hover:text-[#5A0E1E] flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
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
              Official productivity, communication & AI licenses
            </p>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="text-xs font-bold text-[#721428] hover:text-[#5A0E1E] flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
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

      {/* P2P Platform Entry Point Card */}
      <section className="bg-white border border-gray-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FAF0F2] text-[#721428] flex items-center justify-center shrink-0 border border-[#F0D5DA]">
            <ArrowLeftRight className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                ATH Escrow Desk
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1">
              P2P Currency & Escrow Platform
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Peer-to-peer exchange for USDT and Ethiopian Birr (ETB) with integrated escrow security.
            </p>

            <button
              onClick={() => {
                triggerHaptic('medium');
                onNavigateToP2P();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition-all active:scale-[0.98]"
            >
              <span>Explore P2P Platform</span>
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
    </div>
  );
};
