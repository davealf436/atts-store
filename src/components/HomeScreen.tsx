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
  onNavigateToP2P: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onViewProduct,
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
      {/* ATH Home Hero Card — Compact Refined Edition */}
      <section className="relative overflow-hidden rounded-xl bg-[#FCFAF7] border border-stone-200/90 shadow-xs p-3.5 sm:p-4 select-none">
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
          <div className="flex-1 min-w-0">
            {/* Small subtle premium "ATH" label with short space above and below */}
            <div className="mb-0.5 select-none leading-none">
              <span className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-[#721428] leading-none inline-block">
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

      {/* P2P Platform Entry Point Card */}
      <section className="bg-white border border-gray-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FAF0F2] text-[#721428] flex items-center justify-center shrink-0 border border-[#F0D5DA]">
            <ArrowLeftRight className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                ATH P2P Desk
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1">
              P2P Currency Platform
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Peer-to-peer exchange for USDT and Ethiopian Birr (ETB) with verified instant transfers.
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
