import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface ScreenshotData {
  id: string;
  renderVisual: (isExpanded?: boolean) => React.ReactNode;
}

export const ProductPreviewGallery: React.FC = () => {
  // Start on the CENTER screenshot (index 2 of 5: Trade Execution)
  const initialCenterIndex = 2;
  const [activeIndex, setActiveIndex] = useState<number>(initialCenterIndex);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 5 High-fidelity graphical software screenshots (No text, pure UI visuals)
  const screenshots: ScreenshotData[] = [
    // 1. Market Replay
    {
      id: 'market-replay',
      renderVisual: (isExpanded = false) => (
        <div className="w-full h-full bg-[#0B0E14] p-2 sm:p-3 flex flex-col justify-between font-mono select-none relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="h-2 w-12 bg-stone-700/80 rounded-xs" />
              <div className="h-2 w-6 bg-stone-800 rounded-xs" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-8 bg-emerald-950/80 border border-emerald-800/60 rounded-xs" />
            </div>
          </div>

          {/* Candlestick Canvas */}
          <div className="relative flex-1 my-1.5 flex items-end justify-between px-1">
            <div className="absolute inset-x-0 top-1/4 border-b border-stone-800/30" />
            <div className="absolute inset-x-0 top-2/4 border-b border-stone-800/30" />
            <div className="absolute inset-x-0 top-3/4 border-b border-stone-800/30" />

            {[
              { o: 38, c: 54, h: 62, l: 34, bull: true },
              { o: 54, c: 46, h: 58, l: 40, bull: false },
              { o: 46, c: 62, h: 68, l: 44, bull: true },
              { o: 62, c: 74, h: 80, l: 58, bull: true },
              { o: 74, c: 66, h: 78, l: 62, bull: false },
              { o: 66, c: 84, h: 90, l: 64, bull: true },
              { o: 84, c: 76, h: 88, l: 70, bull: false },
              { o: 76, c: 92, h: 96, l: 74, bull: true },
              { o: 92, c: 86, h: 94, l: 82, bull: false },
              { o: 86, c: 100, h: 104, l: 84, bull: true },
            ].map((candle, idx) => {
              const bottom = Math.min(candle.o, candle.c);
              const height = Math.abs(candle.c - candle.o) || 4;
              const wickBottom = candle.l;
              const wickHeight = candle.h - candle.l;

              return (
                <div key={idx} className="relative flex-1 flex justify-center h-full items-end pb-1">
                  <div
                    className={`absolute w-px ${candle.bull ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ bottom: `${wickBottom * 0.7}%`, height: `${wickHeight * 0.7}%` }}
                  />
                  <div
                    className={`relative ${isExpanded ? 'w-4' : 'w-2 sm:w-2.5'} rounded-[1px] ${candle.bull ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ bottom: `${bottom * 0.7}%`, height: `${height * 0.7}%` }}
                  />
                </div>
              );
            })}

            {/* Dotted Replay Marker Line */}
            <div className="absolute right-5 inset-y-0 w-px border-r border-dashed border-amber-400/90" />
          </div>

          {/* Bottom Replay Control Panel */}
          <div className="bg-[#141824] rounded-lg p-1 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-stone-800 flex items-center justify-center">
                <Play className="w-2 h-2 fill-emerald-400 text-emerald-400" />
              </div>
              <div className="h-1.5 w-10 bg-stone-700/60 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded bg-[#721428]/40 border border-[#721428]/60" />
              <div className="w-4 h-3 rounded bg-stone-800" />
              <div className="w-4 h-3 rounded bg-stone-800" />
            </div>
          </div>
        </div>
      ),
    },
    // 2. Multi-Timeframe Charts
    {
      id: 'multi-timeframe',
      renderVisual: (isExpanded = false) => (
        <div className="w-full h-full bg-[#0B0E14] p-1.5 sm:p-2 flex flex-col justify-between font-mono select-none">
          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1.5 flex-1">
            {/* Chart 1: Daily */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-6 bg-stone-600 rounded-xs" />
                <div className="h-1.5 w-4 bg-emerald-500/80 rounded-xs" />
              </div>
              <div className="h-6 flex items-end gap-1">
                <div className="flex-1 bg-emerald-400/80 h-3 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-4 rounded-xs" />
                <div className="flex-1 bg-rose-500/80 h-2 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
              </div>
            </div>

            {/* Chart 2: 4H */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-5 bg-stone-600 rounded-xs" />
                <div className="h-1.5 w-5 bg-amber-500/80 rounded-xs" />
              </div>
              <div className="h-6 flex items-end gap-1">
                <div className="flex-1 bg-rose-500/80 h-4 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-6 rounded-xs" />
                <div className="flex-1 bg-rose-500/80 h-3 rounded-xs" />
              </div>
            </div>

            {/* Chart 3: 15m */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-6 bg-stone-600 rounded-xs" />
                <div className="h-1.5 w-4 bg-emerald-500/80 rounded-xs" />
              </div>
              <div className="h-6 flex items-end gap-1">
                <div className="flex-1 bg-emerald-400/80 h-2 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-4 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-6 rounded-xs" />
                <div className="flex-1 bg-emerald-400/80 h-5 rounded-xs" />
              </div>
            </div>

            {/* Chart 4: 1m with Entry Line */}
            <div className="bg-[#131722] rounded border border-[#721428]/60 p-1 flex flex-col justify-between overflow-hidden relative">
              <div className="flex justify-between items-center">
                <div className="h-1.5 w-5 bg-rose-400/80 rounded-xs" />
                <div className="h-1.5 w-6 bg-emerald-400 rounded-xs" />
              </div>
              <div className="h-6 flex items-end gap-1">
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
    // 3. Trade Execution (Center Image)
    {
      id: 'trade-execution',
      renderVisual: (isExpanded = false) => (
        <div className="w-full h-full bg-[#0B0E14] p-1.5 sm:p-2 flex flex-col justify-between font-mono select-none">
          <div className="grid grid-cols-2 gap-1.5 flex-1">
            {/* Chart Side with Green TP Box & Red SL Box */}
            <div className="bg-[#131722] rounded border border-stone-800 p-1.5 flex flex-col justify-between overflow-hidden">
              <div className="h-1.5 w-10 bg-stone-600 rounded-xs" />

              {/* Take Profit Zone (Green) */}
              <div className="bg-emerald-500/25 border-t border-b border-emerald-500/60 h-6 rounded-xs p-1 flex items-center justify-between">
                <div className="h-1.5 w-8 bg-emerald-300 rounded-xs" />
                <div className="h-2 w-5 bg-emerald-400/80 rounded-xs" />
              </div>

              {/* Stop Loss Zone (Red) */}
              <div className="bg-rose-500/25 border-t border-b border-rose-500/60 h-3 rounded-xs p-1 flex items-center justify-between -mt-1">
                <div className="h-1.5 w-6 bg-rose-300 rounded-xs" />
                <div className="h-2 w-4 bg-rose-400/80 rounded-xs" />
              </div>
            </div>

            {/* Order Settings Side */}
            <div className="bg-[#141824] rounded border border-stone-800 p-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-stone-700/60 rounded-xs" />
                <div className="h-1.5 w-3/4 bg-stone-700/60 rounded-xs" />
                <div className="h-1.5 w-full bg-emerald-950 border border-emerald-800/60 rounded-xs" />
              </div>

              {/* Buy / Sell Buttons */}
              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-stone-800">
                <div className="h-4 sm:h-5 rounded bg-rose-600/80 flex items-center justify-center">
                  <div className="h-1.5 w-6 bg-white/80 rounded-xs" />
                </div>
                <div className="h-4 sm:h-5 rounded bg-emerald-600 flex items-center justify-center">
                  <div className="h-1.5 w-6 bg-white rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // 4. Trading Journal
    {
      id: 'trading-journal',
      renderVisual: (isExpanded = false) => (
        <div className="w-full h-full bg-[#0B0E14] p-1.5 sm:p-2 flex flex-col justify-between font-mono select-none">
          {/* Log Table Rows */}
          <div className="space-y-1 flex-1">
            {[
              { win: true, width: 'w-14', badge: 'bg-emerald-950 border-emerald-800' },
              { win: true, width: 'w-10', badge: 'bg-emerald-950 border-emerald-800' },
              { win: false, width: 'w-12', badge: 'bg-rose-950 border-rose-800' },
              ...(isExpanded ? [{ win: true, width: 'w-16', badge: 'bg-emerald-950 border-emerald-800' }] : []),
            ].map((row, idx) => (
              <div
                key={idx}
                className="p-1 rounded bg-[#141824] border border-stone-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${row.win ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                  <div className={`h-1.5 ${row.width} bg-stone-600 rounded-xs`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-7 rounded border ${row.badge}`} />
                  <div className={`h-2.5 w-8 rounded ${row.win ? 'bg-emerald-500/25' : 'bg-rose-500/25'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="flex justify-between items-center pt-1 border-t border-stone-800">
            <div className="h-1.5 w-12 bg-stone-700/60 rounded-xs" />
            <div className="h-1.5 w-10 bg-emerald-500/60 rounded-xs" />
          </div>
        </div>
      ),
    },
    // 5. Performance Analytics
    {
      id: 'performance-analytics',
      renderVisual: (isExpanded = false) => (
        <div className="w-full h-full bg-[#0B0E14] p-1.5 sm:p-2 flex flex-col justify-between font-mono select-none">
          {/* Top KPI Metrics Strip */}
          <div className="grid grid-cols-3 gap-1 mb-1">
            <div className="bg-[#141824] p-1 rounded border border-stone-800 flex flex-col items-center gap-0.5">
              <div className="h-1 w-6 bg-stone-600 rounded-xs" />
              <div className="h-2 w-7 bg-emerald-400/80 rounded-xs" />
            </div>
            <div className="bg-[#141824] p-1 rounded border border-stone-800 flex flex-col items-center gap-0.5">
              <div className="h-1 w-7 bg-stone-600 rounded-xs" />
              <div className="h-2 w-6 bg-white/80 rounded-xs" />
            </div>
            <div className="bg-[#141824] p-1 rounded border border-stone-800 flex flex-col items-center gap-0.5">
              <div className="h-1 w-6 bg-stone-600 rounded-xs" />
              <div className="h-2 w-6 bg-amber-400/80 rounded-xs" />
            </div>
          </div>

          {/* Ascending Green Equity Curve SVG */}
          <div className="flex-1 bg-[#131722] rounded border border-stone-800 p-1 flex items-end relative overflow-hidden">
            <svg viewBox="0 0 100 32" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="eqCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 30 Q 15 27 25 28 T 45 20 T 65 12 T 85 8 T 100 3 L 100 32 L 0 32 Z"
                fill="url(#eqCurveGrad)"
              />
              <path
                d="M 0 30 Q 15 27 25 28 T 45 20 T 65 12 T 85 8 T 100 3"
                fill="none"
                stroke="#10B981"
                strokeWidth={isExpanded ? '2' : '1.8'}
                strokeLinecap="round"
              />
              <circle cx="100" cy="3" r="2" fill="#10B981" />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  // Scroll to a specific slide smoothly
  const scrollToSlide = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.children[index] as HTMLElement;
    if (card) {
      const scrollPos = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: scrollPos, behavior });
    }
    setActiveIndex(index);
  }, []);

  // When the page opens for the first time, center the carousel on the CENTER screenshot (index 2)
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToSlide(initialCenterIndex, 'auto');
    }, 50);
    return () => clearTimeout(timeout);
  }, [scrollToSlide]);

  // Handle auto-animation between screenshots
  useEffect(() => {
    if (isInteracting || lightboxIndex !== null) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % screenshots.length;
        scrollToSlide(next);
        return next;
      });
    }, 3800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isInteracting, lightboxIndex, screenshots.length, scrollToSlide]);

  // Update active index based on scroll position
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const card = child as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  const handlePrevSlide = () => {
    triggerHaptic('light');
    const prev = activeIndex === 0 ? screenshots.length - 1 : activeIndex - 1;
    scrollToSlide(prev);
  };

  const handleNextSlide = () => {
    triggerHaptic('light');
    const next = (activeIndex + 1) % screenshots.length;
    scrollToSlide(next);
  };

  const handleOpenLightbox = (index: number) => {
    triggerHaptic('light');
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    triggerHaptic('light');
    setLightboxIndex(null);
  };

  const handlePrevLightbox = () => {
    triggerHaptic('light');
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? screenshots.length - 1 : prev - 1) : 0));
  };

  const handleNextLightbox = () => {
    triggerHaptic('light');
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % screenshots.length : 0));
  };

  return (
    // Free Edge-to-Edge Container (No card border, no background, no box shadow)
    <div
      className="relative w-full select-none py-1 group"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsInteracting(false), 2000);
      }}
    >
      {/* Premium Minimal Glass Left Navigation Control */}
      <button
        type="button"
        onClick={handlePrevSlide}
        className="group/btn absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-stone-950/55 hover:bg-stone-950/80 active:bg-stone-950/95 backdrop-blur-md border border-white/12 hover:border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
        aria-label="Previous screenshot"
      >
        <ChevronLeft className="w-3.5 h-3.5 stroke-[1.6] text-stone-300/80 group-hover/btn:text-white transition-colors duration-200 -ml-0.5" />
      </button>

      {/* Edge-to-Edge Horizontal Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-2.5 sm:gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1 px-1 sm:px-2 items-center scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {screenshots.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(idx)}
              className={`h-24 sm:h-28 w-[74vw] max-w-[270px] sm:w-[220px] md:w-[240px] shrink-0 snap-center rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out border shadow-xs ${
                isActive
                  ? 'scale-100 opacity-100 border-[#721428]/45 ring-1 ring-[#721428]/25 shadow-md'
                  : 'scale-[0.92] opacity-70 hover:opacity-90 border-stone-800/80 shadow-2xs'
              }`}
            >
              {item.renderVisual(false)}
            </div>
          );
        })}
      </div>

      {/* Premium Minimal Glass Right Navigation Control */}
      <button
        type="button"
        onClick={handleNextSlide}
        className="group/btn absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-stone-950/55 hover:bg-stone-950/80 active:bg-stone-950/95 backdrop-blur-md border border-white/12 hover:border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
        aria-label="Next screenshot"
      >
        <ChevronRight className="w-3.5 h-3.5 stroke-[1.6] text-stone-300/80 group-hover/btn:text-white transition-colors duration-200 -mr-0.5" />
      </button>

      {/* Fullscreen / Lightbox Modal with Swipe Navigation */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none"
            onClick={handleCloseLightbox}
          >
            {/* Lightbox Top Bar */}
            <div
              className="flex items-center justify-between z-10 w-full max-w-xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Minimal Counter Strip */}
              <div className="flex items-center gap-1.5">
                {screenshots.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      lightboxIndex === idx ? 'w-4 bg-[#FB7185]' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseLightbox}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close fullscreen preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Center Expanded Screenshot Canvas (Swipeable) */}
            <div
              className="relative flex-1 flex items-center justify-center w-full max-w-xl mx-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Arrow */}
              <button
                type="button"
                onClick={handlePrevLightbox}
                className="absolute left-1 sm:left-2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/15 transition-all active:scale-95 cursor-pointer"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Animated Expanded Screenshot with Drag/Swipe Support */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) {
                      handlePrevLightbox();
                    } else if (info.offset.x < -50) {
                      handleNextLightbox();
                    }
                  }}
                  className="w-full h-[62vh] sm:h-[68vh] max-h-[440px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative cursor-grab active:cursor-grabbing"
                >
                  {screenshots[lightboxIndex].renderVisual(true)}
                </motion.div>
              </AnimatePresence>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={handleNextLightbox}
                className="absolute right-1 sm:right-2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/15 transition-all active:scale-95 cursor-pointer"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Bottom Swipe Hint Indicator */}
            <div
              className="text-center text-[10px] text-white/40 pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              Swipe left or right to browse screenshots
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
