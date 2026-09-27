import React from 'react';
import { Product } from '../types';

interface ProductBrandVisualProps {
  product: Product;
  className?: string;
}

export const ProductBrandVisual: React.FC<ProductBrandVisualProps> = ({ product, className = '' }) => {
  const isTVPremium = product.id === 'tv-premium';
  const isTVEssential = product.id === 'tv-essential';
  const isFXReplay = product.brand === 'FXReplay';

  if (isFXReplay) {
    return (
      <div
        className={`relative w-full h-44 rounded-t-2xl overflow-hidden bg-[#0A0E17] flex flex-col items-center justify-center p-6 border-b border-gray-100 select-none ${className}`}
      >
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient backtest glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Sim simulated replay bar chart graphic in background */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-1 opacity-25 pointer-events-none h-10">
          <div className="w-1.5 h-4 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-7 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-5 bg-rose-400 rounded-xs" />
          <div className="w-1.5 h-8 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-3 bg-rose-400 rounded-xs" />
          <div className="w-1.5 h-9 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-6 bg-emerald-400 rounded-xs" />
          <div className="w-1.5 h-10 bg-teal-300 rounded-xs animate-pulse" />
        </div>

        {/* Real FXReplay official logo mark & text */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-1.5">
            {/* FXReplay Icon symbol */}
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center p-2 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" opacity="0.3"/>
                <path d="M11.5 7.5v9l6.5-4.5-6.5-4.5zM6 7.5v9l6.5-4.5-6.5-4.5z" />
              </svg>
            </div>
            
            <div className="text-left">
              <div className="text-lg font-black tracking-tight text-white font-display uppercase leading-tight">
                FX<span className="text-emerald-400">REPLAY</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block -mt-0.5">
                Market Simulator
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tick-by-Tick Engine
          </div>
        </div>
      </div>
    );
  }

  // TradingView Premium
  if (isTVPremium) {
    return (
      <div
        className={`relative w-full h-44 rounded-t-2xl overflow-hidden bg-[#0A0D14] flex flex-col items-center justify-center p-6 border-b border-gray-100 select-none ${className}`}
      >
        {/* TradingView background grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Premium ambient blue/indigo glow */}
        <div className="absolute -top-12 -left-8 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-8 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Ambient candle line wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-14 opacity-25 pointer-events-none"
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 45 Q 40 20, 80 35 T 160 15 T 240 30 T 300 10 L 300 60 L 0 60 Z"
            fill="url(#tv-grad-blue)"
          />
          <path
            d="M0 45 Q 40 20, 80 35 T 160 15 T 240 30 T 300 10"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="tv-grad-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Real TradingView Official Logo */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1.5">
            {/* Real TradingView SVG mark from simple-icons */}
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center p-2.5 shadow-lg shadow-black/40">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z" />
              </svg>
            </div>

            <div className="text-left">
              <div className="text-xl font-black tracking-tight text-white leading-none">
                TradingView
              </div>
              <span className="text-[11px] font-semibold text-blue-400 tracking-wider uppercase block mt-1">
                Official Account License
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] font-bold text-blue-300">
            ★ PREMIUM TIER · 8 CHARTS / TAB
          </div>
        </div>
      </div>
    );
  }

  // TradingView Essential (clean slate theme)
  return (
    <div
      className={`relative w-full h-44 rounded-t-2xl overflow-hidden bg-[#0F172A] flex flex-col items-center justify-center p-6 border-b border-gray-100 select-none ${className}`}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute -top-10 -right-8 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle dual-chart divider */}
      <div className="absolute inset-x-8 bottom-3 flex items-center justify-center gap-3 opacity-20 pointer-events-none">
        <div className="h-6 w-20 border border-dashed border-gray-400 rounded" />
        <div className="h-6 w-20 border border-dashed border-gray-400 rounded" />
      </div>

      {/* Real TradingView Official Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center p-2.5 shadow-lg shadow-black/40">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z" />
            </svg>
          </div>

          <div className="text-left">
            <div className="text-xl font-black tracking-tight text-white leading-none">
              TradingView
            </div>
            <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase block mt-1">
              Essential Subscription
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full bg-slate-700/60 border border-slate-600/70 text-[10px] font-bold text-slate-200">
          CORE SETUP · 2 CHARTS / TAB
        </div>
      </div>
    </div>
  );
};
