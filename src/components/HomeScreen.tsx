import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight, ArrowLeftRight, Layers, ShieldCheck, Zap } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

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
  return (
    <div className="space-y-6 pb-6">
      {/* Welcome / Hero Banner */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            Official Store
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500 font-medium">Abyssinia Trading Tools</span>
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug mb-2">
          Verified Trading Tools & Subscriptions
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
          Genuine TradingView account upgrades and FXReplay Pro backtesting tools configured for retail traders.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Featured Tools & Licenses
            </h3>
            <p className="text-[11px] text-gray-500">
              Essential charting and replay software
            </p>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateToProducts();
            }}
            className="text-xs font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Product Cards Stack */}
        <div className="grid grid-cols-1 gap-3.5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* P2P Platform Entry Point Card */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0 border border-gray-200/80">
            <ArrowLeftRight className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                Separate Service
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1">
              P2P Currency & Escrow Platform
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3.5">
              Secure peer-to-peer exchange for USDT and Ethiopian Birr (ETB) with integrated escrow protection.
            </p>

            <button
              onClick={() => {
                triggerHaptic('medium');
                onNavigateToP2P();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold transition-all active:scale-[0.98]"
            >
              <span>Explore P2P Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Key Guarantees / Service Notes (Clean, concise, factual, no fake stats/reviews) */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 bg-white border border-gray-200/80 rounded-xl text-left">
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-gray-900 mb-0.5">Verified Accounts</h4>
          <p className="text-[11px] text-gray-500 leading-snug">
            Authentic subscriptions delivered with warranty.
          </p>
        </div>

        <div className="p-3.5 bg-white border border-gray-200/80 rounded-xl text-left">
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-gray-900 mb-0.5">Direct Telegram</h4>
          <p className="text-[11px] text-gray-500 leading-snug">
            Delivered directly inside your Telegram app.
          </p>
        </div>
      </section>
    </div>
  );
};
