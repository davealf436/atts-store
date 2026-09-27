import React from 'react';
import { Product } from '../types';
import { SwipeableProductCard } from './SwipeableProductCard';
import { ArrowRight, ArrowLeftRight, Layers, ShieldCheck, Zap } from 'lucide-react';
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

  return (
    <div className="space-y-4 pb-4">
      {/* Welcome / Hero Banner (Clean, compact, professional trading look) */}
      <section className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#721428] bg-[#FAF0F2] px-2 py-0.5 rounded border border-[#F0D5DA]">
                Official
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] text-gray-500 font-semibold">ATH</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug mb-1">
              Built for Better Trading.
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              Authentic TradingView account licenses and FXReplay Pro backtesting tools curated for serious retail traders.
            </p>
          </div>

          <div className="shrink-0 pt-0.5">
            <AthLogo size="lg" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
