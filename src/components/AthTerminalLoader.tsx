import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  // Phase sequence:
  // Phase 1 (0.0s – 1.5s): ATH logo smoothly fades in and scales into place.
  // Phase 2 (1.5s – 3.0s): "ABYSSINIA TRADING HUB" reveals gradually beneath the logo.
  // Phase 3 (3.0s – 4.0s): "Built for Better Trading." fades in, followed by loading indicator.
  // Phase 4 (4.0s – 5.0s): Hold complete branded screen so users can clearly see it.
  // Phase 5 (>= 5.0s): Smooth transition to Home once system is ready.
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isLogoMounted, setIsLogoMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);

  // References to ensure absolute determinism across async events
  const systemReadyRef = useRef(false);
  const minTimePassedRef = useRef(false);
  const isExitingRef = useRef(false);

  // Start Logo entrance on next microtask/frame after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsLogoMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── Deterministic 5-Second Timeline Engine ───
  useEffect(() => {
    // 1. Kick off real subsystem readiness detection in background
    const detectSubsystems = async () => {
      try {
        initTelegramApp();

        const domReady = new Promise<void>((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            const handleLoad = () => resolve();
            window.addEventListener('load', handleLoad, { once: true });
          }
        });

        const fontsReady = typeof document !== 'undefined' && 'fonts' in document
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

        const storageCheck = new Promise<void>((resolve) => {
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.getItem('ath_favorites_v1');
              window.localStorage.getItem('ath_user_profile');
            }
          } catch {
            // Safe fallback
          }
          resolve();
        });

        await Promise.all([domReady, fontsReady, storageCheck]);
        systemReadyRef.current = true;

        // If the minimum 5.0s time has already elapsed, trigger exit now
        if (minTimePassedRef.current && !isExitingRef.current) {
          triggerExit();
        }
      } catch (err) {
        console.warn('System readiness notice:', err);
        systemReadyRef.current = true;
        if (minTimePassedRef.current && !isExitingRef.current) {
          triggerExit();
        }
      }
    };

    detectSubsystems();

    const triggerExit = () => {
      if (isExitingRef.current) return;
      isExitingRef.current = true;
      triggerHaptic('light');
      setIsExiting(true);

      setTimeout(() => {
        setIsExited(true);
        onInitialized?.();
      }, 500);
    };

    // ─── Timeline Stage Scheduling (Zero drift, monotonic execution) ───
    // Phase 2: 1.5s – "ABYSSINIA TRADING HUB" reveals gradually beneath the logo
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 1500);

    // Phase 3: 3.0s – "Built for Better Trading." fades in, followed by loading indicator
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 3000);

    // Phase 4: 4.0s – Hold complete branded screen so users can clearly see it
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 4000);

    // Phase 5: 5.0s – Enforced Minimum 5-Second mark reached
    const t4 = setTimeout(() => {
      minTimePassedRef.current = true;
      setPhase(5);

      // If subsystem readiness is already confirmed, smoothly transition
      if (systemReadyRef.current && !isExitingRef.current) {
        triggerExit();
      }
    }, 5000);

    // Safety timeout at 7.5s: never block user indefinitely if network completely hangs
    const safetyTimeout = setTimeout(() => {
      systemReadyRef.current = true;
      if (!isExitingRef.current) {
        triggerExit();
      }
    }, 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(safetyTimeout);
    };
  }, [onInitialized]);

  if (isExited) {
    return null;
  }

  const handleManualContinue = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    triggerHaptic('medium');
    setIsExiting(true);
    setTimeout(() => {
      setIsExited(true);
      onInitialized?.();
    }, 300);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Abyssinia Trading Hub"
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-500 ease-out ${
        isExiting && !hasError
          ? 'opacity-0 scale-[1.015] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Architectural Grid & Technical Atmosphere ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle engineering coordinate grid (22px) */}
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Soft radial ambient aura centered behind logo */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 320px at 50% 44%, rgba(114, 20, 40, 0.065) 0%, transparent 100%)',
          }}
        />

        {/* Technical Terminal Corner Crosshairs (+) */}
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
      <header className="relative z-10 pt-safe pt-6 px-6 w-full flex items-center justify-between text-[10px] font-mono">
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
        {/* 1. ATH Logo: 0–1.5s Entrance (Fades in & scales into place smoothly) */}
        <div
          className={`relative mb-5 flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isLogoMounted
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-85 translate-y-2'
          }`}
        >
          {/* Subtle glowing halo */}
          <div className="absolute -inset-4 rounded-3xl bg-[#721428]/[0.035] border border-[#721428]/10 blur-[1px]" />

          {/* Pristine white logo container with soft border & shadow */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-center p-3">
            <AthLogo
              size="xl"
              animated={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* 2. Brand Name: 1.5–3.0s Reveal (Reveals gradually beneath the logo) */}
        <div className="h-7 mb-1 flex items-center justify-center overflow-hidden">
          <h1
            className={`text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              phase >= 2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            ABYSSINIA TRADING HUB
          </h1>
        </div>

        {/* 3. Brand Slogan: 3.0–4.0s Entrance ("Built for Better Trading.") */}
        <div className="h-6 mb-6 flex items-center justify-center overflow-hidden">
          <p
            className={`text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              phase >= 3
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            Built for Better <span className="text-[#721428] font-bold">Trading</span>
            <span className="text-[#C59F43] font-black">.</span>
          </p>
        </div>

        {/* 4. Loading Indicator: 3.0s+ with 4.0–5.0s Sustained Brand Hold */}
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
            className={`w-full flex flex-col items-center transition-all duration-[700ms] ease-out ${
              phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Slim Terminal Progress Hairline */}
            <div className="w-40 sm:w-48 h-1 bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner mb-2.5">
              <div
                className={`h-full rounded-full transition-all ${
                  phase >= 4
                    ? 'w-full bg-[#721428] duration-500'
                    : 'w-1/2 bg-gradient-to-r from-[#721428] via-[#A3213F] to-[#721428] animate-[athTerminalScan_1.4s_ease-in-out_infinite]'
                }`}
              />
            </div>

            {/* Dynamic Status Text */}
            <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5 h-5">
              {phase >= 4 ? (
                <span className="inline-flex items-center gap-1 text-stone-700 font-semibold transition-opacity duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#721428]" />
                  <span>Workspace Ready · Launching</span>
                </span>
              ) : (
                <span className="transition-opacity duration-300">
                  Initializing your workspace…
                </span>
              )}
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
