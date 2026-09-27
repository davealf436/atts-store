import React from 'react';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';

interface ProductBrandVisualProps {
  product: Product;
  className?: string;
}

export const ProductBrandVisual: React.FC<ProductBrandVisualProps> = ({ product, className = '' }) => {
  const isTVPremium = product.id === 'tv-premium';
  const isFXReplay = product.brand === 'FXReplay';

  // FXReplay Pro Visual (matching Photo 2)
  if (isFXReplay) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#070D18] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        {/* Subtle trading terminal micro-grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Ambient subtle backtest bars in background */}
        <div className="absolute bottom-2 left-6 right-6 flex items-end justify-between gap-1 opacity-20 pointer-events-none h-8">
          <div className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-6 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-4 bg-gray-400 rounded-xs" />
          <div className="w-1.5 h-7 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-2 bg-gray-400 rounded-xs" />
          <div className="w-1.5 h-8 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-5 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-7 bg-[#721428] rounded-xs" />
        </div>

        {/* Real FXReplay Official Logo Mark matching Photo 2 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/15" />

            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white uppercase leading-none">
                FX<span className="text-emerald-400">REPLAY</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block mt-1">
                Market Simulator
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Tick-by-Tick Engine · Pro
          </div>
        </div>
      </div>
    );
  }

  // TradingView Premium Visual (matching Photo 1)
  if (isTVPremium) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#000000] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        {/* Trading terminal micro-grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Ambient subtle candle wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-10 opacity-20 pointer-events-none"
          viewBox="0 0 300 40"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 30 Q 50 10, 100 25 T 200 15 T 300 20 L 300 40 L 0 40 Z"
            fill="#3B82F6"
          />
        </svg>

        {/* Real TradingView Official Logo matching Photo 1 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20" />

            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                TradingView
              </div>
              <span className="text-[10px] font-semibold text-blue-300 tracking-wider uppercase block mt-1">
                Official Account License
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#721428]/80 border border-[#721428] text-[10px] font-bold text-white shadow-xs">
            ★ PREMIUM · 8 CHARTS / TAB
          </div>
        </div>
      </div>
    );
  }

  // TradingView Essential Visual (matching Photo 1)
  return (
    <div
      className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Real TradingView Official Logo matching Photo 1 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2.5 mb-2">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20" />

          <div className="text-left">
            <div className="text-base font-extrabold tracking-tight text-white leading-none">
              TradingView
            </div>
            <span className="text-[10px] font-semibold text-slate-300 tracking-wider uppercase block mt-1">
              Essential Subscription
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-700/80 border border-slate-600 text-[10px] font-semibold text-slate-200">
          CORE SETUP · 2 CHARTS / TAB
        </div>
      </div>
    </div>
  );
};
