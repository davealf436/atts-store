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
  const isAbyssiniaJournal = product.id === 'abyssinia-journal';
  const isBacktestingJournal = product.id === 'backtesting-journal';
  const isNotion = product.id === 'notion-template-journal';

  // Abyssinia Journal Visual
  if (isAbyssiniaJournal) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#28060F] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/15" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Abyssinia Journal
              </div>
              <span className="text-[10px] font-semibold text-[#F5D061] tracking-wider uppercase block mt-1">
                Official Trading Hub Ledger
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#721428] border border-[#A5203D] text-[10px] font-bold text-white shadow-xs">
            ATH EXCLUSIVE · PSYCHOLOGY & METRICS
          </div>
        </div>
      </div>
    );
  }

  // Backtesting Journal Visual
  if (isBacktestingJournal) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#0B1326] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/15" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Backtesting Journal
              </div>
              <span className="text-[10px] font-semibold text-sky-400 tracking-wider uppercase block mt-1">
                Quantitative System Testing
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-600/50 text-[10px] font-bold text-sky-200 shadow-xs">
            100+ SAMPLES · MONTE CARLO & DRAWDOWN
          </div>
        </div>
      </div>
    );
  }

  // Notion Template Journal Visual
  if (isNotion) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#191919] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #525252 1px, transparent 1px), linear-gradient(to bottom, #525252 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Notion Journal
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase block mt-1">
                100% Free Workspace
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-bold text-emerald-200 shadow-xs">
            1-CLICK DUPLICATE · FREE COMMUNITY GIFT
          </div>
        </div>
      </div>
    );
  }

  // FXReplay Pro Visual (matching Photo 2)
  if (isFXReplay) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#070D18] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
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
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
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
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
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
