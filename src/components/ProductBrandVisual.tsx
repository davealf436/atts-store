import React from 'react';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';

interface ProductBrandVisualProps {
  product: Product;
  className?: string;
}

export const ProductBrandVisual: React.FC<ProductBrandVisualProps> = ({ product, className = '' }) => {
  const isTVPremium = product.id === 'tv-premium';
  const isTVEssential = product.id === 'tv-essential';
  const isFXReplay = product.brand === 'FXReplay';
  const isAbyssiniaJournal = product.id === 'abyssinia-journal';
  const isBacktestingJournal = product.id === 'backtesting-journal';
  const isNotion = product.id === 'notion-template-journal';
  const isTelegram = product.id === 'telegram-premium';
  const isGoogleAI = product.id === 'google-ai';

  // 1. Telegram Premium — Compact Horizontal Identity Card
  if (isTelegram) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#1D92D3] via-[#24A1DE] to-[#1281BC] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-blue-400/40 select-none ${className}`}
      >
        {/* Subtle background ambient radial light & micro dot texture */}
        <div
          className="absolute inset-0 opacity-12 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFFFFF 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 100% 50%, rgba(255, 255, 255, 0.45) 0%, transparent 70%)',
          }}
        />

        {/* Left + Center Content Group */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Logo Showcase with subtle glass ring */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center bg-[#24A1DE]">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          {/* Typographic Core */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            {/* Kicker with live status indicator */}
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-100 leading-none">
                Instant Account Activation
              </span>
            </div>

            {/* Product Title */}
            <h3 className="text-[15px] sm:text-[16px] font-black text-white tracking-tight leading-tight truncate">
              Telegram Premium
            </h3>
          </div>
        </div>

        {/* Right Tag Seal */}
        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-2xs">
            Official
          </span>
        </div>
      </div>
    );
  }

  // 2. Google AI — Compact Horizontal Identity Card
  if (isGoogleAI) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-white via-[#FAFBFD] to-[#F1F5FD] dark:from-[#141722] dark:via-[#161B28] dark:to-[#111420] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-200/90 dark:border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #4285F4 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-25 dark:opacity-15"
          style={{
            background: 'radial-gradient(circle at 100% 50%, rgba(66, 133, 244, 0.20) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-2xs flex items-center justify-center bg-white">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#4285F4] dark:text-[#60A5FA] leading-none">
                Gemini Advanced Ecosystem
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-gray-900 dark:text-white tracking-tight leading-tight truncate">
              Google AI · Gemini Pro
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF0F2] dark:bg-[#721428]/25 border border-[#F0D5DA] dark:border-[#721428]/40 text-[9px] font-extrabold uppercase tracking-widest text-[#721428] dark:text-[#FB7185] shadow-2xs">
            AI Powered
          </span>
        </div>
      </div>
    );
  }

  // 3. Abyssinia Journal — Compact Horizontal Identity Card
  if (isAbyssiniaJournal) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#FAF8F5] via-[#FCFAF7] to-[#F5EFE8] dark:from-[#181822] dark:via-[#1A1A26] dark:to-[#14141E] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-[#721428]/20 dark:border-[#721428]/35 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #721428 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-[#721428]/25 shadow-2xs flex items-center justify-center bg-white">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#721428] dark:bg-[#FB7185] shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#721428] dark:text-[#FB7185] leading-none">
                ATH Flagship Ledger
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-stone-900 dark:text-white tracking-tight leading-tight truncate">
              Abyssinia Journal
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF0F2] dark:bg-[#721428]/25 border border-[#F0D5DA] dark:border-[#721428]/40 text-[9px] font-extrabold uppercase tracking-widest text-[#721428] dark:text-[#FB7185] shadow-2xs">
            Official
          </span>
        </div>
      </div>
    );
  }

  // 4. Backtesting Journal — Compact Horizontal Identity Card
  if (isBacktestingJournal) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#070B14] via-[#091120] to-[#04070E] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #38BDF8 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-sky-500/30 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center bg-black">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-sky-400 leading-none">
                Quantitative System Testing
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-white tracking-tight leading-tight truncate">
              Backtesting Journal
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-800/60 text-[9px] font-extrabold uppercase tracking-widest text-sky-300 shadow-2xs">
            Advanced
          </span>
        </div>
      </div>
    );
  }

  // 5. Notion Template Journal — Compact Horizontal Identity Card
  if (isNotion) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#F8F9FA] via-[#FFFFFF] to-[#F1F3F5] dark:from-[#14161A] dark:via-[#17191E] dark:to-[#111316] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-800 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #525252 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-2xs flex items-center justify-center bg-white">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300 leading-none">
                Community Trading Workspace
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-stone-900 dark:text-white tracking-tight leading-tight truncate">
              Notion Template Journal
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 shadow-2xs">
            Free Gift
          </span>
        </div>
      </div>
    );
  }

  // 6. FXReplay Pro / Premium — Compact Horizontal Identity Card
  if (isFXReplay) {
    const isPremiumTier = product.id === 'fxreplay-premium';
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#040810] via-[#070F1E] to-[#040811] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-800/90 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #334155 0.85px, transparent 0.85px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at 100% 50%, ${isPremiumTier ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ${isPremiumTier ? 'ring-amber-400/30' : 'ring-emerald-400/30'} shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex items-center justify-center bg-[#070D18]`}>
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPremiumTier ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className={`text-[9.5px] font-extrabold uppercase tracking-wider leading-none ${isPremiumTier ? 'text-amber-300' : 'text-emerald-400'}`}>
                {isPremiumTier ? 'Dedicated Private License · 1 Month' : 'Tick-by-Tick Market Simulator'}
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-white tracking-tight leading-tight truncate uppercase">
              FX<span className="text-emerald-400">REPLAY</span> <span className="text-xs font-semibold text-gray-300 normal-case">{isPremiumTier ? '· Premium Plan' : '· Pro Plan'}</span>
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-2xs ${
            isPremiumTier
              ? 'bg-amber-950/80 border border-amber-800/60 text-amber-300'
              : 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-300'
          }`}>
            {isPremiumTier ? 'Private' : 'Flexible'}
          </span>
        </div>
      </div>
    );
  }

  // 7. TradingView Premium — Compact Horizontal Identity Card
  if (isTVPremium) {
    return (
      <div
        className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#000000] via-[#0A0B10] to-[#040508] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-800/90 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #721428 0.95px, transparent 0.95px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 100% 50%, rgba(114, 20, 40, 0.40) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.5)] flex items-center justify-center bg-black">
              <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-300 leading-none">
                Official Account License
              </span>
            </div>

            <h3 className="text-[15px] sm:text-[16px] font-black text-white tracking-tight leading-tight truncate">
              TradingView Premium
            </h3>
          </div>
        </div>

        <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#721428] border border-[#721428] text-[9px] font-extrabold uppercase tracking-widest text-white shadow-2xs">
            Flagship
          </span>
        </div>
      </div>
    );
  }

  // 8. TradingView Essential & Default Fallback — Compact Horizontal Identity Card
  return (
    <div
      className={`relative w-full h-[74px] sm:h-[80px] overflow-hidden bg-gradient-to-r from-[#08080A] via-[#101217] to-[#08080B] flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-gray-800/90 select-none ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #374151 0.85px, transparent 0.85px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        <div className="relative shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.4)] flex items-center justify-center bg-black">
            <ProductPhotoLogo productId={product.id} size="md" className="w-full h-full" />
          </div>
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-0.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-300 leading-none">
              {isTVEssential ? 'Essential Charting Setup' : 'Verified Software Resource'}
            </span>
          </div>

          <h3 className="text-[15px] sm:text-[16px] font-black text-white tracking-tight leading-tight truncate">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="relative z-10 shrink-0 ml-2 hidden xs:flex">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-[9px] font-extrabold uppercase tracking-widest text-slate-200 shadow-2xs">
          {product.badge || 'Verified'}
        </span>
      </div>
    </div>
  );
};
