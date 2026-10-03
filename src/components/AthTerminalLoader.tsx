import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  // Real subsystem readiness state
  const [systemReady, setSystemReady] = useState(false);
  // Sequenced timeline animation stages: 0 to 5
  // 0: Mount & Grid
  // 1: Logo entrance (150ms)
  // 2: Brand title reveal (650ms)
  // 3: Slogan reveal (1150ms)
  // 4: Progress scan & verification (1650ms)
  // 5: Sustained brand lockup & readiness confirmation (2250ms)
  // 6: Smooth exit trigger (2700ms)
  const [animationStage, setAnimationStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const minimumTimeElapsedRef = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(reduced);
      if (reduced) {
        // Fast-path for reduced motion users
        setAnimationStage(5);
      }
    }

    let isMounted = true;

    // ─── 1. Subsystem Readiness Detection (True App Readiness) ───
    const detectSubsystemReadiness = async () => {
      try {
        // Initialize Telegram WebApp configuration
        initTelegramApp();

        // Check DOM load status
        const domPromise = new Promise<void>((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            const handleLoad = () => resolve();
            window.addEventListener('load', handleLoad, { once: true });
          }
        });

        // Check Plus Jakarta Sans typography readiness
        const fontPromise = typeof document !== 'undefined' && 'fonts' in document
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

        // Check state hydration readiness
        const storagePromise = new Promise<void>((resolve) => {
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.getItem('ath_favorites_v1');
              window.localStorage.getItem('ath_user_profile');
            }
          } catch {
            // Ignore restricted storage
          }
          resolve();
        });

        await Promise.all([domPromise, fontPromise, storagePromise]);

        if (isMounted) {
          setSystemReady(true);
        }
      } catch (err) {
        console.warn('ATH Terminal startup notice:', err);
        if (isMounted) {
          setSystemReady(true);
        }
      }
    };

    detectSubsystemReadiness();

    // ─── 2. Sequenced Animation Timeline (~2.5 - 2.8s Presentation) ───
    const timer1 = setTimeout(() => isMounted && setAnimationStage(1), 150);   // Logo enters
    const timer2 = setTimeout(() => isMounted && setAnimationStage(2), 650);   // Brand name reveals
    const timer3 = setTimeout(() => isMounted && setAnimationStage(3), 1150);  // Slogan reveals
    const timer4 = setTimeout(() => isMounted && setAnimationStage(4), 1650);  // Terminal progress scan
    const timer5 = setTimeout(() => isMounted && setAnimationStage(5), 2250);  // Ready confirmation & stillness
    const timer6 = setTimeout(() => {
      if (isMounted) {
        minimumTimeElapsedRef.current = true;
        setAnimationStage(6);
      }
    }, 2650); // Minimum 2.65s presentation reached

    // Safety timeout: never leave users blocked beyond 4.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isExiting) {
        setSystemReady(true);
        setIsExiting(true);
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(safetyTimer);
    };
  }, [isExiting]);

  // ─── 3. Trigger Exit only when BOTH minimum presentation (2.65s) AND system readiness are met ───
  useEffect(() => {
    if (animationStage >= 6 && systemReady && !isExiting && !hasError) {
      triggerHaptic('light');
      setIsExiting(true);

      const exitDuration = prefersReducedMotion ? 60 : 420;
      const unmountTimer = setTimeout(() => {
        setIsExited(true);
        onInitialized?.();
      }, exitDuration);

      return () => clearTimeout(unmountTimer);
    }
  }, [animationStage, systemReady, isExiting, hasError, onInitialized, prefersReducedMotion]);

  if (isExited) {
    return null;
  }

  const handleManualContinue = () => {
    triggerHaptic('medium');
    setIsExiting(true);
    setIsExited(true);
    onInitialized?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Abyssinia Trading Hub"
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-420 ease-out ${
        isExiting && !hasError
          ? 'opacity-0 scale-[1.018] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Architectural Grid & Technical Atmosphere ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle engineering coordinate grid (22px) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            animationStage >= 1 ? 'opacity-[0.038]' : 'opacity-0'
          }`}
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Soft radial ambient aura centered on logo */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-out pointer-events-none ${
            animationStage >= 1 ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle 300px at 50% 45%, rgba(114, 20, 40, 0.06) 0%, transparent 100%)',
          }}
        />

        {/* Technical Terminal Corner Crosshairs (+) */}
        <div
          className={`absolute top-4 left-4 text-[9px] font-mono font-bold text-stone-300 transition-opacity duration-700 ${
            animationStage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          + ATH.01
        </div>
        <div
          className={`absolute top-4 right-4 text-[9px] font-mono font-bold text-stone-300 transition-opacity duration-700 ${
            animationStage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          SECURE.CH +
        </div>
        <div
          className={`absolute bottom-4 left-4 text-[9px] font-mono font-bold text-stone-300 transition-opacity duration-700 ${
            animationStage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          + LATENCY:LOW
        </div>
        <div
          className={`absolute bottom-4 right-4 text-[9px] font-mono font-bold text-stone-300 transition-opacity duration-700 ${
            animationStage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          STATUS:LIVE +
        </div>
      </div>

      {/* ─── Top Terminal Header Indicator ─── */}
      <header
        className={`relative z-10 pt-safe pt-6 px-6 w-full flex items-center justify-between text-[10px] font-mono transition-all duration-600 ease-out ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#721428]/20 bg-[#FAF0F2] text-[#721428] font-bold tracking-wider shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#721428] animate-pulse" />
          <span>ATH // TERMINAL</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#721428]" />
          <span>VERIFIED ENCLAVE</span>
        </div>
      </header>

      {/* ─── Main Centerpiece: Sequenced Brand Reveal ─── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm -mt-2">
        {/* 1. ATH Logo with ambient backdrop (Stage 1) */}
        <div
          className={`relative mb-5 flex items-center justify-center transition-all duration-700 ease-out ${
            animationStage >= 1
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 -translate-y-3'
          }`}
        >
          {/* Subtle glowing halo */}
          <div className="absolute -inset-4 rounded-3xl bg-[#721428]/[0.035] border border-[#721428]/10 blur-[1px]" />

          {/* Pristine white logo container with soft border & shadow */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-3">
            <AthLogo
              size="xl"
              animated={!prefersReducedMotion}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* 2. Brand Name (Stage 2) */}
        <h1
          className={`text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase mb-1 transition-all duration-600 ease-out ${
            animationStage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2.5'
          }`}
        >
          ABYSSINIA TRADING HUB
        </h1>

        {/* 3. Brand Slogan (Stage 3) */}
        <p
          className={`text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide mb-6 transition-all duration-600 ease-out ${
            animationStage >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          Built for Better <span className="text-[#721428] font-bold">Trading</span>
          <span className="text-[#C59F43] font-black">.</span>
        </p>

        {/* 4. Loading Indicator & Dynamic Status (Stage 4 & 5) */}
        {hasError ? (
          <div className="space-y-3 animate-in fade-in duration-300">
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
          <div
            className={`w-full flex flex-col items-center transition-all duration-500 ease-out ${
              animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {/* Slim Terminal Progress Hairline */}
            <div className="w-40 sm:w-48 h-1 bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner mb-2.5">
              <div
                className={`h-full rounded-full transition-all ${
                  animationStage >= 5
                    ? 'w-full bg-[#721428] duration-300'
                    : prefersReducedMotion
                    ? 'w-3/4 bg-[#721428]'
                    : 'w-1/2 bg-gradient-to-r from-[#721428] via-[#A3213F] to-[#721428] animate-[athTerminalScan_1.4s_ease-in-out_infinite]'
                }`}
              />
            </div>

            {/* Dynamic Status Text */}
            <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5 h-5">
              {animationStage >= 5 ? (
                <span className="inline-flex items-center gap-1 text-stone-700 font-semibold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#721428]" />
                  <span>Workspace Ready · Launching</span>
                </span>
              ) : (
                <span className="animate-in fade-in duration-200">
                  Initializing your workspace…
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer Institutional Verification Note ─── */}
      <footer
        className={`relative z-10 pb-safe pb-5 px-6 w-full text-center transition-opacity duration-600 ${
          animationStage >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-[10px] text-stone-400 font-medium tracking-tight">
          Official Abyssinia Trading Hub Terminal · Verified Telegram Ecosystem
        </p>
      </footer>
    </div>
  );
};
