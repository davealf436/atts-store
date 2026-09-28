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

  // Telegram Premium Visual
  if (isTelegram) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-[#24A1DE] flex flex-col items-center justify-center p-5 border-b border-gray-100 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-white/20 shadow-sm" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Telegram Premium
              </div>
              <span className="text-[10px] font-semibold text-blue-100 tracking-wider uppercase block mt-1">
                Official Account Upgrade
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-[10px] font-bold text-white shadow-xs">
            ★ FAST ACTIVATION · DOUBLED LIMITS
          </div>
        </div>
      </div>
    );
  }

  // Google AI Visual
  if (isGoogleAI) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-white flex flex-col items-center justify-center p-5 border-b border-gray-200 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #4285F4 1px, transparent 1px), linear-gradient(to bottom, #4285F4 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-200 shadow-sm" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-gray-900 leading-none">
                Google AI
              </div>
              <span className="text-[10px] font-semibold text-[#4285F4] tracking-wider uppercase block mt-1">
                Gemini Advanced & Workspace
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F2] border border-[#F0D5DA] text-[10px] font-bold text-[#721428] shadow-xs">
            ✦ GEMINI 1.5 PRO · 2M CONTEXT
          </div>
        </div>
      </div>
    );
  }

  // Abyssinia Journal Visual
  if (isAbyssiniaJournal) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-white flex flex-col items-center justify-center p-5 border-b border-gray-200 select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-200 shadow-sm" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-gray-900 leading-none">
                Abyssinia Journal
              </div>
              <span className="text-[10px] font-semibold text-[#721428] tracking-wider uppercase block mt-1">
                Official Trading Hub Ledger
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F2] border border-[#F0D5DA] text-[10px] font-bold text-[#721428] shadow-xs">
            ★ PREMIUM JOURNALING
          </div>
        </div>
      </div>
    );
  }

  // Backtesting Journal Visual
  if (isBacktestingJournal) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-black flex flex-col items-center justify-center p-5 border-b border-gray-900 select-none ${className}`}
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
            <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-800" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Backtesting Journal
              </div>
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block mt-1">
                Quantitative System Testing
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white shadow-xs">
            ★ ADVANCED BACKTESTING
          </div>
        </div>
      </div>
    );
  }

  // Notion Template Journal Visual
  if (isNotion) {
    return (
      <div
        className={`relative w-full h-36 sm:h-40 rounded-t-xl overflow-hidden bg-white flex flex-col items-center justify-center p-5 border-b border-gray-200 select-none ${className}`}
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
            <ProductPhotoLogo productId={product.id} size="md" className="border border-gray-200 shadow-sm" />
            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-gray-900 leading-none">
                Notion Template Journal
              </div>
              <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase block mt-1">
                100% Free Workspace
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F2] border border-[#F0D5DA] text-[10px] font-bold text-[#721428] shadow-xs">
            1-CLICK DUPLICATE · FREE TEMPLATE
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
