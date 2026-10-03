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
  const isTelegram = product.id === 'telegram-premium';
  const isGoogleAI = product.id === 'google-ai';

  // 1. Telegram Premium Compact Horizontal Card
  if (isTelegram) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-[#24A1DE] flex items-center px-3 sm:px-3.5 py-2 border-b border-blue-400/30 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #FFFFFF 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-white/25 shadow-xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs border border-white/30 text-[9px] sm:text-[9.5px] font-bold text-white leading-none shadow-2xs uppercase tracking-wide">
              ★ FAST ACTIVATION · DOUBLED LIMITS
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-tight truncate mb-0.5">
            Telegram Premium
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-medium text-blue-100 tracking-wide truncate leading-none">
            Official Account Upgrade · Cloud Speed
          </span>
        </div>
      </div>
    );
  }

  // 2. Google AI Compact Horizontal Card
  if (isGoogleAI) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-white dark:bg-[#16161D] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-150 dark:border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #4285F4 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-200 dark:border-gray-700 shadow-2xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FAF0F2] border border-[#F0D5DA] text-[9px] sm:text-[9.5px] font-bold text-[#721428] leading-none shadow-2xs uppercase tracking-wide">
              ✦ GEMINI 1.5 PRO · 2M CONTEXT
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight truncate mb-0.5">
            Google AI
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#4285F4] tracking-wide truncate leading-none">
            Gemini Advanced &amp; Workspace Integration
          </span>
        </div>
      </div>
    );
  }

  // 3. Abyssinia Journal Compact Horizontal Card
  if (isAbyssiniaJournal) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-white dark:bg-[#16161D] flex items-center px-3 sm:px-3.5 py-2 border-b border-stone-200/80 dark:border-stone-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #721428 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-stone-200 dark:border-stone-700 shadow-2xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FAF0F2] border border-[#F0D5DA] text-[9px] sm:text-[9.5px] font-bold text-[#721428] leading-none shadow-2xs uppercase tracking-wide">
              ★ PREMIUM JOURNALING
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight truncate mb-0.5">
            Abyssinia Journal
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#721428] dark:text-[#FB7185] tracking-wide truncate leading-none">
            Official Trading Hub Execution Ledger
          </span>
        </div>
      </div>
    );
  }

  // 4. Backtesting Journal Compact Horizontal Card
  if (isBacktestingJournal) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-[#090D16] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38BDF8 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-800 shadow-xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-[9px] sm:text-[9.5px] font-bold text-sky-300 leading-none shadow-2xs uppercase tracking-wide">
              ★ ADVANCED BACKTESTING
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-tight truncate mb-0.5">
            Backtesting Journal
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-medium text-gray-400 tracking-wide truncate leading-none">
            Quantitative System &amp; Sample Testing
          </span>
        </div>
      </div>
    );
  }

  // 5. Notion Template Journal Compact Horizontal Card
  if (isNotion) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-white dark:bg-[#16161D] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-150 dark:border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #525252 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-200 dark:border-gray-700 shadow-2xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FAF0F2] border border-[#F0D5DA] text-[9px] sm:text-[9.5px] font-bold text-[#721428] leading-none shadow-2xs uppercase tracking-wide">
              1-CLICK DUPLICATE · FREE TEMPLATE
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight truncate mb-0.5">
            Notion Template Journal
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-semibold text-gray-500 tracking-wide truncate leading-none">
            100% Free Complete Workspace
          </span>
        </div>
      </div>
    );
  }

  // 6. FXReplay Pro / Premium Compact Horizontal Card
  if (isFXReplay) {
    const isPremiumTier = product.id === 'fxreplay-premium';
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-[#070D18] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #334155 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-white/15 shadow-xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 text-[9px] sm:text-[9.5px] font-bold text-emerald-300 leading-none shadow-2xs uppercase tracking-wide">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPremiumTier ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              {product.badge || (isPremiumTier ? 'Dedicated Private · 1 Month' : 'Tick-by-Tick Engine · Pro')}
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-tight truncate mb-0.5 uppercase">
            FX<span className="text-emerald-400">REPLAY</span> <span className="text-xs text-gray-300 font-semibold">{isPremiumTier ? 'Premium Plan' : 'Pro'}</span>
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-medium text-gray-400 tracking-wide truncate leading-none">
            {product.subtitle || 'Market Simulator · Tick Replay'}
          </span>
        </div>
      </div>
    );
  }

  // 7. TradingView Premium Compact Horizontal Card
  if (isTVPremium) {
    return (
      <div
        className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-[#000000] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #334155 0.85px, transparent 0.85px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Left: Product Icon */}
        <div className="relative z-10 shrink-0">
          <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20 shadow-xs" />
        </div>
        {/* Right: Tight Content Area */}
        <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1 leading-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#721428] border border-[#721428] text-[9px] sm:text-[9.5px] font-bold text-white leading-none shadow-2xs uppercase tracking-wide">
              ★ PREMIUM · 8 CHARTS / TAB
            </span>
          </div>
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-tight truncate mb-0.5">
            TradingView Premium
          </h4>
          <span className="text-[10px] sm:text-[10.5px] font-medium text-blue-300 tracking-wide truncate leading-none">
            Official Flagship Account License
          </span>
        </div>
      </div>
    );
  }

  // 8. TradingView Essential & Generic Default Compact Horizontal Card
  return (
    <div
      className={`relative w-full h-[76px] sm:h-[82px] overflow-hidden bg-[#0A0A0A] flex items-center px-3 sm:px-3.5 py-2 border-b border-gray-800 select-none ${className}`}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #374151 0.85px, transparent 0.85px)',
          backgroundSize: '14px 14px',
        }}
      />
      {/* Left: Product Icon */}
      <div className="relative z-10 shrink-0">
        <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20 shadow-xs" />
      </div>
      {/* Right: Tight Content Area */}
      <div className="relative z-10 flex-1 min-w-0 ml-2.5 sm:ml-3 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1 leading-none">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-[9px] sm:text-[9.5px] font-bold text-slate-200 leading-none shadow-2xs uppercase tracking-wide">
            {product.badge || 'CORE SETUP · 2 CHARTS / TAB'}
          </span>
        </div>
        <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-tight truncate mb-0.5">
          {product.name}
        </h4>
        <span className="text-[10px] sm:text-[10.5px] font-medium text-slate-300 tracking-wide truncate leading-none">
          {product.subtitle || (product.tier ? `${product.tier} Subscription` : 'Official Account License')}
        </span>
      </div>
    </div>
  );
};
