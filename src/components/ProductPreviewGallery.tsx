import React, { useState, useRef, useEffect } from 'react';
import { Play, LineChart, LayoutGrid, CheckCircle2, TrendingUp, Layers, BookOpen, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface ScreenshotItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  preview: React.ReactNode;
}

export const ProductPreviewGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const screenshots: ScreenshotItem[] = [
    {
      id: 'market-replay',
      title: 'Market Replay',
      subtitle: 'Tick-by-tick TradingView simulation with speed controls',
      tag: 'Core Simulator',
      preview: (
        <div className="w-full h-full bg-[#0C0F17] p-2.5 flex flex-col justify-between font-mono text-[9px] text-stone-300 select-none relative overflow-hidden">
          {/* Chart Header Bar */}
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5 text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-wider">EURUSD</span>
              <span className="px-1 py-0.5 rounded bg-stone-800 text-stone-300 text-[8px]">15m</span>
              <span className="text-emerald-400 font-semibold">1.08425</span>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Replay: 1x</span>
            </div>
          </div>

          {/* Realistic Candlestick Canvas Simulation */}
          <div className="relative flex-1 my-1.5 flex items-end justify-between px-1">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-stone-800/40" />
            <div className="absolute inset-x-0 top-2/4 border-b border-stone-800/40" />
            <div className="absolute inset-x-0 top-3/4 border-b border-stone-800/40" />

            {/* Candlesticks Sequence */}
            {[
              { o: 40, c: 55, h: 62, l: 36, bull: true },
              { o: 55, c: 48, h: 58, l: 42, bull: false },
              { o: 48, c: 62, h: 66, l: 45, bull: true },
              { o: 62, c: 75, h: 80, l: 58, bull: true },
              { o: 75, c: 68, h: 78, l: 64, bull: false },
              { o: 68, c: 84, h: 90, l: 65, bull: true },
              { o: 84, c: 78, h: 87, l: 72, bull: false },
              { o: 78, c: 92, h: 96, l: 75, bull: true },
              { o: 92, c: 88, h: 95, l: 83, bull: false },
              { o: 88, c: 100, h: 104, l: 85, bull: true },
            ].map((candle, idx) => {
              const bottom = Math.min(candle.o, candle.c);
              const height = Math.abs(candle.c - candle.o) || 4;
              const wickBottom = candle.l;
              const wickHeight = candle.h - candle.l;

              return (
                <div key={idx} className="relative flex-1 flex justify-center h-full items-end pb-1">
                  {/* Wick */}
                  <div
                    className={`absolute w-px ${candle.bull ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ bottom: `${wickBottom * 0.7}%`, height: `${wickHeight * 0.7}%` }}
                  />
                  {/* Body */}
                  <div
                    className={`relative w-2.5 rounded-[1px] ${candle.bull ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ bottom: `${bottom * 0.7}%`, height: `${height * 0.7}%` }}
                  />
                </div>
              );
            })}

            {/* Replay Vertical Cut Line */}
            <div className="absolute right-4 inset-y-0 w-px border-r border-dashed border-amber-400 flex items-start">
              <span className="bg-amber-400 text-stone-950 font-bold px-1 rounded-[2px] text-[7px] -mt-1 -ml-3">
                NOW
              </span>
            </div>
          </div>

          {/* Replay Controller Bar */}
          <div className="bg-[#141824] rounded-lg p-1.5 border border-stone-800 flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1.5 text-stone-300">
              <button type="button" className="w-5 h-5 rounded bg-stone-800 flex items-center justify-center hover:bg-stone-700">
                <Play className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
              </button>
              <span>0.5s / bar</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-[#721428]/30 border border-[#721428]/60 text-rose-300 font-bold">1x</span>
              <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-bold">3x</span>
              <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-bold">5x</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'multi-timeframe',
      title: 'Multi-Timeframe Charts',
      subtitle: 'Quad sync charts across Daily, 4H, 15m and 1m intervals',
      tag: 'Quad View',
      preview: (
        <div className="w-full h-full bg-[#0C0F17] p-2 flex flex-col font-mono text-[9px] text-stone-300 select-none">
          {/* Top Quad Label */}
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-800 text-[8px] text-stone-400">
            <span>4-Chart Synchronized Layout</span>
            <span className="text-emerald-400 font-bold">Cursor Linked</span>
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1.5 flex-1">
            {/* Quadrant 1: 1D */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between">
              <div className="flex justify-between text-[7px] text-stone-400">
                <span className="font-bold text-white">Daily</span>
                <span className="text-emerald-400">Bullish Trend</span>
              </div>
              <div className="h-6 flex items-end gap-0.5">
                <div className="flex-1 bg-emerald-400/80 h-3 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-4 rounded-xs" />
                <div className="flex-1 bg-rose-500/80 h-2 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
              </div>
            </div>

            {/* Quadrant 2: 4H */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between">
              <div className="flex justify-between text-[7px] text-stone-400">
                <span className="font-bold text-white">4H</span>
                <span className="text-amber-400">Key POI Tap</span>
              </div>
              <div className="h-6 flex items-end gap-0.5">
                <div className="flex-1 bg-rose-500/80 h-4 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-6 rounded-xs" />
                <div className="flex-1 bg-rose-500/80 h-3 rounded-xs" />
              </div>
            </div>

            {/* Quadrant 3: 15m */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between">
              <div className="flex justify-between text-[7px] text-stone-400">
                <span className="font-bold text-white">15m</span>
                <span className="text-emerald-400">Structure Shift</span>
              </div>
              <div className="h-6 flex items-end gap-0.5">
                <div className="flex-1 bg-emerald-400/80 h-2 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-4 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-6 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
              </div>
            </div>

            {/* Quadrant 4: 1m */}
            <div className="bg-[#131722] rounded border border-[#721428]/50 p-1 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between text-[7px] text-stone-400">
                <span className="font-bold text-rose-300">1m Entry</span>
                <span className="text-emerald-400 font-bold">1:3.4 R:R</span>
              </div>
              <div className="h-6 flex items-end gap-0.5">
                <div className="flex-1 bg-rose-500/80 h-2 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-6 rounded-xs" />
                <div className="flex-1 bg-emerald-400 h-6 rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'trade-execution',
      title: 'Trade Execution',
      subtitle: 'Realistic order tickets with automated risk and TP/SL zones',
      tag: 'Order Panel',
      preview: (
        <div className="w-full h-full bg-[#0C0F17] p-2 flex flex-col justify-between font-mono text-[9px] text-stone-300 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-[8px]">
            <span className="font-bold text-white">ORDER EXECUTION</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold">ACTIVE ORDER</span>
          </div>

          {/* Split Chart + Order Ticket */}
          <div className="grid grid-cols-2 gap-2 flex-1 my-1">
            {/* Left: Chart with Risk/Reward Box */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1.5 flex flex-col justify-between relative overflow-hidden">
              <span className="text-[7.5px] text-stone-400">EURUSD Long Setup</span>
              
              {/* Visual Take Profit (Green Box) */}
              <div className="bg-emerald-500/20 border-t border-b border-emerald-500/60 h-7 rounded-xs p-1 flex items-center justify-between text-[7.5px] text-emerald-300">
                <span>TP: 1.08850</span>
                <span className="font-bold">+3.2R</span>
              </div>
              
              {/* Visual Stop Loss (Red Box) */}
              <div className="bg-rose-500/20 border-t border-b border-rose-500/60 h-3 rounded-xs p-1 flex items-center justify-between text-[7.5px] text-rose-300 -mt-1">
                <span>SL: 1.08210</span>
                <span className="font-bold">-1R</span>
              </div>
            </div>

            {/* Right: Realistic Order Settings */}
            <div className="bg-[#141824] rounded border border-stone-800 p-1.5 flex flex-col justify-between text-[8px]">
              <div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Risk Size</span>
                  <span className="text-white font-bold">1.0% ($1,000)</span>
                </div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Lots</span>
                  <span className="text-white font-bold">2.45 Lots</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Risk / Reward</span>
                  <span className="text-emerald-400 font-bold">1 : 3.20</span>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-stone-800">
                <button type="button" className="py-1 rounded bg-rose-600/80 text-white font-bold text-[8px] text-center">
                  SELL
                </button>
                <button type="button" className="py-1 rounded bg-emerald-600 text-white font-bold text-[8px] text-center">
                  BUY
                </button>
              </div>
            </div>
          </div>

          <div className="text-[7.5px] text-stone-400 text-center">
            P&L Calculated instantly with realistic slippage & spread
          </div>
        </div>
      ),
    },
    {
      id: 'trading-journal',
      title: 'Trading Journal',
      subtitle: 'Complete trade logs, session tags, and screenshot logs',
      tag: 'Playbook',
      preview: (
        <div className="w-full h-full bg-[#0C0F17] p-2 flex flex-col justify-between font-mono text-[9px] text-stone-300 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-[8px]">
            <span className="font-bold text-white">PLAYBOOK & TRADE LOG</span>
            <span className="text-stone-400">Total: 48 Trades</span>
          </div>

          {/* Trade Rows Table */}
          <div className="space-y-1 my-1 flex-1">
            {/* Trade Row 1 */}
            <div className="p-1 rounded bg-[#141824] border border-stone-800 flex items-center justify-between text-[8px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">EURUSD Long</span>
                <span className="text-stone-500">London Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1 py-0.2 rounded bg-stone-800 text-stone-300 text-[7px]">Liquidity Sweep</span>
                <span className="font-bold text-emerald-400">+$1,420</span>
              </div>
            </div>

            {/* Trade Row 2 */}
            <div className="p-1 rounded bg-[#141824] border border-stone-800 flex items-center justify-between text-[8px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">GBPUSD Short</span>
                <span className="text-stone-500">NY Session</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1 py-0.2 rounded bg-stone-800 text-stone-300 text-[7px]">Order Block</span>
                <span className="font-bold text-emerald-400">+$980</span>
              </div>
            </div>

            {/* Trade Row 3 */}
            <div className="p-1 rounded bg-[#141824] border border-stone-800 flex items-center justify-between text-[8px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="font-bold text-white">NAS100 Long</span>
                <span className="text-stone-500">NY Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1 py-0.2 rounded bg-stone-800 text-stone-300 text-[7px]">Breakout</span>
                <span className="font-bold text-rose-400">-$350</span>
              </div>
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="flex justify-between items-center pt-1 border-t border-stone-800 text-[8px]">
            <span className="text-stone-400">Weekly Gain: <strong className="text-emerald-400">+7.8R</strong></span>
            <span className="text-stone-400">Win Rate: <strong className="text-white">68.2%</strong></span>
          </div>
        </div>
      ),
    },
    {
      id: 'performance-analytics',
      title: 'Performance Analytics',
      subtitle: 'Equity curve growth, win-loss ratio, and drawdown analysis',
      tag: 'Edge Metrics',
      preview: (
        <div className="w-full h-full bg-[#0C0F17] p-2 flex flex-col justify-between font-mono text-[9px] text-stone-300 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-[8px]">
            <span className="font-bold text-white">EQUITY GROWTH & EDGE</span>
            <span className="text-emerald-400 font-bold">+$18,450 (+36.9%)</span>
          </div>

          {/* Key KPI Strip */}
          <div className="grid grid-cols-3 gap-1 my-1 text-[8px]">
            <div className="bg-[#141824] p-1 rounded border border-stone-800 text-center">
              <span className="text-stone-400 block text-[7px]">Win Rate</span>
              <span className="font-bold text-emerald-400">68.4%</span>
            </div>
            <div className="bg-[#141824] p-1 rounded border border-stone-800 text-center">
              <span className="text-stone-400 block text-[7px]">Profit Factor</span>
              <span className="font-bold text-white">2.85</span>
            </div>
            <div className="bg-[#141824] p-1 rounded border border-stone-800 text-center">
              <span className="text-stone-400 block text-[7px]">Max DD</span>
              <span className="font-bold text-amber-400">-3.4%</span>
            </div>
          </div>

          {/* Smooth Ascending Equity Line Chart */}
          <div className="h-10 bg-[#131722] rounded border border-stone-800 p-1 flex items-end relative overflow-hidden">
            <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 32 Q 15 28 25 30 T 45 22 T 65 14 T 85 10 T 100 4 L 100 35 L 0 35 Z"
                fill="url(#eqGrad)"
              />
              <path
                d="M 0 32 Q 15 28 25 30 T 45 22 T 65 14 T 85 10 T 100 4"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="4" r="2.5" fill="#10B981" className="animate-pulse" />
            </svg>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-stone-800 text-[8px] text-stone-400">
            <span>Expectancy: <strong className="text-white">+1.24R / trade</strong></span>
            <span className="text-emerald-400">Sharpe: 2.14</span>
          </div>
        </div>
      ),
    },
  ];

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth === 0) return;
    // Calculate nearest card based on scroll position
    const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 300;
    const gap = 12; // gap-3 is 12px
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), screenshots.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    triggerHaptic('light');
    const card = carouselRef.current.children[index] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setActiveIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-3.5 sm:p-4 select-none space-y-3">
      {/* Gallery Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
            <LineChart className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              Product Preview Gallery
            </h3>
            <span className="text-[10px] text-stone-500 leading-none mt-0.5 block">
              Official TradingView simulation engine screenshots
            </span>
          </div>
        </div>

        {/* Counter indicator */}
        <span className="text-[10px] font-bold text-[#721428] bg-[#FAF0F2] border border-[#F0D5DA] px-2 py-0.5 rounded-full">
          {activeIndex + 1} / {screenshots.length}
        </span>
      </div>

      {/* Horizontal Swipeable Screenshot Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1 -mx-0.5 px-0.5 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {screenshots.map((item, idx) => (
          <div
            key={item.id}
            className="w-[84vw] max-w-[340px] sm:w-[290px] md:w-[310px] shrink-0 snap-start bg-stone-950 rounded-xl sm:rounded-2xl border border-stone-800 shadow-sm overflow-hidden flex flex-col transition-all hover:border-stone-700"
          >
            {/* Window Chrome Header */}
            <div className="bg-[#121622] px-3 py-1.5 border-b border-stone-800/90 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-stone-400 font-mono text-[9.5px] ml-1 font-semibold truncate max-w-[130px]">
                  {item.title}
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#FB7185] bg-[#721428]/25 border border-[#721428]/40 px-1.5 py-0.5 rounded">
                {item.tag}
              </span>
            </div>

            {/* Simulated Live UI Canvas Area */}
            <div className="h-44 sm:h-46 w-full relative">
              {item.preview}
            </div>

            {/* Card Caption Footer */}
            <div className="bg-[#10141F] p-2.5 border-t border-stone-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  {idx + 1}. {item.title}
                </h4>
                <span className="text-[9px] text-stone-400 font-medium">FXReplay v3</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Navigation Dots & Arrows */}
      <div className="flex items-center justify-between pt-1">
        {/* Swipe Hint */}
        <span className="text-[10px] text-stone-400 sm:text-stone-500 font-medium">
          ← Swipe horizontally to preview all features →
        </span>

        {/* 5 Navigation Dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Gallery pagination">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-5 bg-[#721428]'
                  : 'w-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to screenshot ${idx + 1}`}
              aria-selected={activeIndex === idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
