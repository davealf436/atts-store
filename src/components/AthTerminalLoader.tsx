import React, { useState, useEffect } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  const [isReady, setIsReady] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    let isMounted = true;

    // Verify true application readiness
    const initializeApplication = async () => {
      try {
        // 1. Telegram Mini App initialization (viewport, safe areas, colors)
        initTelegramApp();

        // 2. DOM readiness promise
        const domPromise = new Promise<void>((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            const handleLoad = () => resolve();
            window.addEventListener('load', handleLoad, { once: true });
          }
        });

        // 3. Font asset readiness (Plus Jakarta Sans typography system)
        const fontPromise = typeof document !== 'undefined' && 'fonts' in document
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

        // 4. Ensure synchronous verification of core persistence
        const statePromise = new Promise<void>((resolve) => {
          try {
            // Verify access to localStorage / session caches
            if (typeof window !== 'undefined') {
              window.localStorage.getItem('ath_favorites_v1');
              window.localStorage.getItem('ath_user_profile');
            }
          } catch {
            // Safe ignore if storage restricted in iframe
          }
          resolve();
        });

        // Await true readiness across all subsystems
        await Promise.all([domPromise, fontPromise, statePromise]);

        if (isMounted) {
          triggerHaptic('light');
          setIsReady(true);
        }
      } catch (error) {
        console.error('App terminal initialization issue:', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    initializeApplication();

    // Safety fallback: if anything stalls (e.g. slow network font), ensure terminal unblocks
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isReady) {
        setIsReady(true);
      }
    }, 3800);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [isReady]);

  // Handle smooth exit transition after readiness
  useEffect(() => {
    if (isReady && !hasError) {
      const exitDuration = prefersReducedMotion ? 50 : 380;
      const exitTimer = setTimeout(() => {
        setIsExited(true);
        onInitialized?.();
      }, exitDuration);
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, hasError, onInitialized, prefersReducedMotion]);

  if (isExited) {
    return null;
  }

  const handleManualContinue = () => {
    triggerHaptic('medium');
    setIsReady(true);
    setIsExited(true);
    onInitialized?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Abyssinia Trading Hub"
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-380 ease-out ${
        isReady && !hasError
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Architectural Grid & Terminal Texture ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle engineering coordinate grid (22px) */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Radial ambient lighting centered on logo */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 280px at 50% 46%, rgba(114, 20, 40, 0.05) 0%, transparent 100%)',
          }}
        />

        {/* Terminal Corner Crosshairs (+) */}
        <div className="absolute top-4 left-4 text-[9px] font-mono font-bold text-stone-300 select-none">
          + ATH.01
        </div>
        <div className="absolute top-4 right-4 text-[9px] font-mono font-bold text-stone-300 select-none">
          SECURE.CH +
        </div>
        <div className="absolute bottom-4 left-4 text-[9px] font-mono font-bold text-stone-300 select-none">
          + LATENCY:LOW
        </div>
        <div className="absolute bottom-4 right-4 text-[9px] font-mono font-bold text-stone-300 select-none">
          STATUS:LIVE +
        </div>
      </div>

      {/* ─── Top Terminal Header Indicator ─── */}
      <header className="relative z-10 pt-safe pt-6 px-6 w-full flex items-center justify-between text-[10px] font-mono text-stone-400">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#721428]/20 bg-[#FAF0F2] text-[#721428] font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#721428] animate-pulse" />
          <span>ATH // TERMINAL</span>
        </div>

        <div className="flex items-center gap-1 text-[10.5px] font-semibold text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#721428]" />
          <span>VERIFIED ENCLAVE</span>
        </div>
      </header>

      {/* ─── Main Centerpiece: Logo, Title, Slogan, and Indicator ─── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm -mt-4">
        {/* ATH Logo with subtle ambient circular frame */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-3xl bg-[#721428]/[0.035] border border-[#721428]/10 blur-[1px]" />
          
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-3">
            <AthLogo
              size="xl"
              animated={!prefersReducedMotion}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase mb-1">
          ABYSSINIA TRADING HUB
        </h1>

        {/* Brand Slogan */}
        <p className="text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide mb-6">
          Built for Better <span className="text-[#721428] font-bold">Trading</span>
          <span className="text-[#C59F43] font-black">.</span>
        </p>

        {/* Error State or Subtle High-Precision Terminal Loading Indicator */}
        {hasError ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Network handshake delayed. Ready to enter.</span>
            </div>
            <div>
              <button
                type="button"
                onClick={handleManualContinue}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Slim Terminal Progress Hairline */}
            <div className="w-40 sm:w-48 h-1 bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner mb-2.5">
              <div
                className={`h-full bg-gradient-to-r from-[#721428] via-[#A3213F] to-[#721428] rounded-full ${
                  prefersReducedMotion ? 'w-full' : 'w-1/2 animate-[athTerminalScan_1.4s_ease-in-out_infinite]'
                }`}
              />
            </div>

            {/* Status text */}
            <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5">
              <span>Initializing your workspace…</span>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer Institutional Verification Note ─── */}
      <footer className="relative z-10 pb-safe pb-5 px-6 w-full text-center">
        <p className="text-[10px] text-stone-400 font-medium tracking-tight">
          Official Abyssinia Trading Hub Terminal · Verified Telegram Ecosystem
        </p>
      </footer>
    </div>
  );
};
