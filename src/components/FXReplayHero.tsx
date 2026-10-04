import React, { useState } from 'react';
import {
  Play,
  ArrowDown,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  TrendingUp,
  X,
  RotateCcw,
  Sparkles,
  BarChart3,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { triggerHaptic } from '../services/telegram';
import { formatETB } from '../services/wallet';

interface FXReplayHeroProps {
  productId: string;
  startingPriceETB: number;
  onChoosePlan: () => void;
}

export const FXReplayHero: React.FC<FXReplayHeroProps> = ({
  productId,
  startingPriceETB,
  onChoosePlan,
}) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<'1x' | '3x' | '5x' | '10x'>('5x');
  const [isPlaying, setIsPlaying] = useState(true);

  const handleOpenDemo = () => {
    triggerHaptic('medium');
    setIsDemoOpen(true);
  };

  const handleCloseDemo = () => {
    triggerHaptic('light');
    setIsDemoOpen(false);
  };

  const handlePlanClick = () => {
    triggerHaptic('medium');
    if (isDemoOpen) {
      setIsDemoOpen(false);
    }
    onChoosePlan();
  };

  return (
    <>
      {/* Premium Fintech SaaS Hero Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-[#080D1A] via-[#060A14] to-[#04070E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-white select-none">
        {/* Subtle Ambient Lighting & Grid Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.35) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 p-5 sm:p-7 lg:p-8 space-y-6">
          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Brand Identity, Headline, Description & CTAs */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-4">
              {/* 1. FXREPLAY PRO Title & Official Logo Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-inner">
                <div className="w-6 h-6 rounded-md overflow-hidden ring-1 ring-emerald-400/40 shadow-sm shrink-0 flex items-center justify-center bg-[#070D18]">
                  <ProductPhotoLogo productId={productId} size="sm" className="w-full h-full" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider uppercase text-white font-mono">
                    FX<span className="text-emerald-400">REPLAY</span> PRO
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Official
                  </span>
                </div>
              </div>

              {/* 2. Strong Headline */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white leading-[1.18]">
                  Master Your Edge with{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                    True Tick-by-Tick
                  </span>{' '}
                  Market Replay.
                </h1>
                <p className="text-[11.5px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400/90 font-mono">
                  Zero Financial Risk • 100% Real Market Physics
                </p>
              </div>

              {/* 3. Short Product Description */}
              <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed font-normal">
                Replicate live execution across Forex, Crypto, and Indices with authentic spreads, slippage, and multi-timeframe chart synchronization. Speed-run years of historical sessions, optimize setups, and prove your strategy before risking real capital.
              </p>

              {/* Price Callout Banner */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-200">
                <span className="text-stone-400 text-[11px]">Access starting from:</span>
                <span className="font-extrabold text-white text-sm tabular-nums">
                  {formatETB(startingPriceETB)}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">• Instant Activation</span>
              </div>

              {/* 4. Action Buttons: "Choose Your Plan" & "Watch Demo" */}
              <div className="flex items-center gap-3 pt-1 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={handlePlanClick}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-extrabold text-xs sm:text-sm tracking-tight shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Choose Your Plan</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenDemo}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-xs sm:text-sm tracking-tight backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* 5. 3 Trust Badges */}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 text-amber-400">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-white leading-tight truncate">
                      Instant Delivery
                    </div>
                    <div className="text-[9.5px] text-stone-400 leading-tight">
                      Telegram in &lt;2 min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center shrink-0 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-white leading-tight truncate">
                      Genuine License
                    </div>
                    <div className="text-[9.5px] text-stone-400 leading-tight">
                      100% Official Pro
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0 text-cyan-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-white leading-tight truncate">
                      Tick-by-Tick
                    </div>
                    <div className="text-[9.5px] text-stone-400 leading-tight">
                      Live spread simulation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Large Realistic Trading-Platform Preview */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#070B14] shadow-[0_20px_50px_rgba(0,0,0,0.65)] ring-1 ring-white/10 group">
                {/* Window Chrome Title Bar */}
                <div className="h-9 px-3.5 bg-[#0C1220] border-b border-white/10 flex items-center justify-between text-xs">
                  {/* macOS Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 text-[10.5px] font-mono text-stone-400 hidden xs:inline">
                      FXReplay Engine • Session #104
                    </span>
                  </div>

                  {/* Active Instrument & Timeframe */}
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded bg-white/[0.06] border border-white/10">
                      EUR/USD • 15M
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      5x Replay
                    </span>
                  </div>
                </div>

                {/* Sub-header / Ticker & Quick Controls */}
                <div className="px-3.5 py-2 bg-[#090E1A] border-b border-white/5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3 font-mono">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-white">1.08642</span>
                      <span className="text-[10.5px] font-bold text-emerald-400">+0.48%</span>
                    </div>
                    <div className="text-[10px] text-stone-400 hidden sm:flex items-center gap-2">
                      <span>Bid: <b className="text-stone-300">1.08638</b></span>
                      <span>Ask: <b className="text-stone-300">1.08646</b></span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-cyan-300 border border-white/5">
                        Spread: 0.8
                      </span>
                    </div>
                  </div>

                  {/* Quick Order Buttons (Visual simulation) */}
                  <div className="flex items-center gap-1.5">
                    <div className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono">
                      BUY 1.0864
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold font-mono">
                      SELL 1.0863
                    </div>
                  </div>
                </div>

                {/* Main Interactive Realistic Candlestick Chart Area */}
                <div className="relative h-60 sm:h-72 w-full bg-[#070A12] overflow-hidden p-3 font-mono">
                  {/* Chart Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)',
                      backgroundSize: '40px 32px',
                    }}
                  />

                  {/* Price Scale Lines on Right */}
                  <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between text-[9px] text-stone-500 pointer-events-none select-none py-2 text-right">
                    <span>1.09100</span>
                    <span className="text-emerald-400 font-bold">1.08980 (TP)</span>
                    <span>1.08750</span>
                    <span className="text-cyan-300 font-bold">1.08520 (Entry)</span>
                    <span className="text-rose-400 font-bold">1.08310 (SL)</span>
                    <span>1.08150</span>
                  </div>

                  {/* Realistic Candlesticks and Position Setup rendered via SVG */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 520 240"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    {/* Dynamic Moving Average Ribbon */}
                    <path
                      d="M 10 160 Q 90 150, 160 170 T 260 140 T 360 90 T 500 60"
                      stroke="rgba(6, 182, 212, 0.45)"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Order Block Shaded Demand Zone */}
                    <rect
                      x="140"
                      y="145"
                      width="130"
                      height="35"
                      fill="rgba(16, 185, 129, 0.12)"
                      stroke="rgba(16, 185, 129, 0.35)"
                      strokeDasharray="2 2"
                    />
                    <text x="145" y="162" fill="#34D399" fontSize="8" fontFamily="monospace">
                      15m Demand / OB
                    </text>

                    {/* Long Position Risk-to-Reward Execution Box */}
                    {/* Take Profit Box (Green) */}
                    <rect
                      x="250"
                      y="50"
                      width="180"
                      height="85"
                      fill="rgba(16, 185, 129, 0.18)"
                      stroke="rgba(16, 185, 129, 0.5)"
                      strokeWidth="1"
                    />
                    {/* Stop Loss Box (Red) */}
                    <rect
                      x="250"
                      y="135"
                      width="180"
                      height="40"
                      fill="rgba(239, 68, 68, 0.18)"
                      stroke="rgba(239, 68, 68, 0.5)"
                      strokeWidth="1"
                    />
                    {/* Entry Line (Dashed Cyan) */}
                    <line
                      x1="240"
                      y1="135"
                      x2="450"
                      y2="135"
                      stroke="#22D3EE"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x="255" y="66" fill="#34D399" fontSize="9" fontWeight="bold">
                      Target: +3.42R (+$1,428.50)
                    </text>
                    <text x="255" y="130" fill="#22D3EE" fontSize="8">
                      Entry: 1.08520
                    </text>
                    <text x="255" y="165" fill="#F87171" fontSize="8">
                      Stop: 1.08310 (-1.0R)
                    </text>

                    {/* Candlestick Series (Wicks + Bodies) */}
                    {/* Candle 1 (Bear) */}
                    <line x1="30" y1="110" x2="30" y2="150" stroke="#EF4444" strokeWidth="1" />
                    <rect x="26" y="120" width="8" height="22" fill="#EF4444" rx="1" />

                    {/* Candle 2 (Bear) */}
                    <line x1="55" y1="130" x2="55" y2="170" stroke="#EF4444" strokeWidth="1" />
                    <rect x="51" y="138" width="8" height="24" fill="#EF4444" rx="1" />

                    {/* Candle 3 (Bull pullback) */}
                    <line x1="80" y1="145" x2="80" y2="175" stroke="#10B981" strokeWidth="1" />
                    <rect x="76" y="148" width="8" height="18" fill="#10B981" rx="1" />

                    {/* Candle 4 (Deep liquidity sweep bear) */}
                    <line x1="105" y1="150" x2="105" y2="195" stroke="#EF4444" strokeWidth="1" />
                    <rect x="101" y="156" width="8" height="22" fill="#EF4444" rx="1" />

                    {/* Candle 5 (Pin bar reversal at liquidity sweep) */}
                    <line x1="130" y1="148" x2="130" y2="200" stroke="#10B981" strokeWidth="1.5" />
                    <rect x="126" y="150" width="8" height="10" fill="#10B981" rx="1" />

                    {/* Candle 6 (Strong displacement Bull) */}
                    <line x1="155" y1="125" x2="155" y2="162" stroke="#10B981" strokeWidth="1" />
                    <rect x="151" y="128" width="8" height="28" fill="#10B981" rx="1" />

                    {/* Candle 7 (Continuation Bull) */}
                    <line x1="180" y1="110" x2="180" y2="140" stroke="#10B981" strokeWidth="1" />
                    <rect x="176" y="112" width="8" height="22" fill="#10B981" rx="1" />

                    {/* Candle 8 (Restest of OB Bear) */}
                    <line x1="205" y1="118" x2="205" y2="148" stroke="#EF4444" strokeWidth="1" />
                    <rect x="201" y="124" width="8" height="18" fill="#EF4444" rx="1" />

                    {/* Candle 9 (Entry Trigger Pin Bar) */}
                    <line x1="230" y1="128" x2="230" y2="152" stroke="#10B981" strokeWidth="1" />
                    <rect x="226" y="132" width="8" height="10" fill="#10B981" rx="1" />

                    {/* Candle 10 (Breakout Bull) */}
                    <line x1="255" y1="95" x2="255" y2="138" stroke="#10B981" strokeWidth="1" />
                    <rect x="251" y="98" width="8" height="34" fill="#10B981" rx="1" />

                    {/* Candle 11 (Strong Momentum Bull) */}
                    <line x1="280" y1="75" x2="280" y2="108" stroke="#10B981" strokeWidth="1" />
                    <rect x="276" y="78" width="8" height="26" fill="#10B981" rx="1" />

                    {/* Candle 12 (Small bear consolidation) */}
                    <line x1="305" y1="74" x2="305" y2="92" stroke="#EF4444" strokeWidth="1" />
                    <rect x="301" y="77" width="8" height="9" fill="#EF4444" rx="1" />

                    {/* Candle 13 (Target Hitter Giant Bull Candle) */}
                    <line x1="330" y1="45" x2="330" y2="82" stroke="#10B981" strokeWidth="1.5" />
                    <rect x="326" y="48" width="8" height="32" fill="#10B981" rx="1" />

                    {/* Candle 14 (Live tick candle with pulse ring) */}
                    <line x1="355" y1="42" x2="355" y2="68" stroke="#34D399" strokeWidth="1.5" />
                    <rect x="351" y="45" width="8" height="14" fill="#34D399" rx="1" />
                    <circle cx="355" cy="45" r="3" fill="#10B981" className="animate-ping" />
                  </svg>

                  {/* Floating Performance HUD Badge 1 (Top Left) */}
                  <div className="absolute top-3 left-3 px-3 py-2 rounded-xl bg-[#0B1324]/90 border border-emerald-500/30 backdrop-blur-md shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-stone-400 font-sans">
                        Replay Trade PnL
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-400 leading-tight">
                        +$1,428.50 <span className="text-[10px] text-emerald-300 font-normal">(+3.42R)</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Performance HUD Badge 2 (Bottom Left) */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-[#0B1324]/85 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[10px] font-mono text-stone-300">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> 68.4% Win Rate
                    </span>
                    <span className="text-stone-600">|</span>
                    <span className="text-stone-300">Avg RR: 2.8</span>
                    <span className="text-stone-600 hidden xs:inline">|</span>
                    <span className="text-stone-400 hidden xs:inline">42 Trades</span>
                  </div>
                </div>

                {/* Bottom Realistic Replay Controller Bar */}
                <div className="p-3 bg-[#0A0F1C] border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Transport Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => triggerHaptic('light')}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      title="Step back 1 bar"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setIsPlaying(!isPlaying);
                      }}
                      className="h-7 px-3 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <span className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
                          <span className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
                          <span className="text-[10.5px]">Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span className="text-[10.5px]">Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Scrubber Timeline */}
                  <div className="flex-1 max-w-xs mx-2 hidden sm:block">
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 mb-1">
                      <span>Bar 142 / 200</span>
                      <span className="text-emerald-400">London Session 14:15 UTC</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[71%]" />
                    </div>
                  </div>

                  {/* Replay Speed Toggle Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5 font-mono text-[10px]">
                    {(['1x', '3x', '5x', '10x'] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setReplaySpeed(spd);
                        }}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                          replaySpeed === spd
                            ? 'bg-emerald-500 text-stone-950 shadow-xs'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Watch Demo" Modal */}
      {isDemoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseDemo}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#090D18] border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0C1322]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-emerald-400/40 bg-[#070D18] flex items-center justify-center">
                  <ProductPhotoLogo productId={productId} size="sm" className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    FXReplay Pro Interactive Demo
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Live tick backtesting, candle execution & trade journaling workflow
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDemo}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close demo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - Feature Walkthrough Preview */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="rounded-2xl bg-[#050810] border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    How Backtesting on FXReplay Works
                  </span>
                  <span>Session Length: Custom</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-mono">
                        1
                      </span>
                      Select Date & Asset
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      Jump to any historical day across Forex, Crypto, or Indices with tick accuracy.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-mono">
                        2
                      </span>
                      Execute with Spreads
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      Place Market/Limit orders with exact Risk %, TP/SL, and realistic slippage.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-mono">
                        3
                      </span>
                      Auto-Logged Analytics
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      Every trade is automatically computed for Win Rate, Profit Factor, and Drawdown.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Conversion Callout inside Modal */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0A1424] to-cyan-950/60 border border-emerald-500/30 gap-4 flex-wrap sm:flex-nowrap">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-extrabold text-white">
                    Ready to practice on real market data?
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Plans start from {formatETB(startingPriceETB)} with instant Telegram activation.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlanClick}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-extrabold text-xs tracking-tight shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Choose Your Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
