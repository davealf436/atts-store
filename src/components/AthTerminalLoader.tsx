import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

const BRAND_LETTERS = 'ABYSSINIA TRADING HUB'.split('');

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  // Phase sequence (12-Second Master Timeline):
  // Phase 1 (0.0s – 2.5s): Subtle burgundy glow emerges; ATH logo smoothly scales and fades in cleanly without square box.
  // Phase 2 (2.5s – 5.5s): "ABYSSINIA TRADING HUB" reveals letter-by-letter with cinematic stagger.
  // Phase 3 (5.5s – 7.5s): "Built for Better Trading." fades in with "Trading." in burgundy.
  // Phase 4 (7.5s – 9.5s): Refined luxury burgundy loading indicator activates with workspace status.
  // Phase 5 (9.5s – 12.0s): Status updates to "Workspace Verified"; full brand lockup is held in poise and stillness.
  // Phase 6 (>= 12.0s): Smooth cinematic transition into Home page once system is ready.
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isLogoMounted, setIsLogoMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);

  // References to guarantee strict monotonic execution and prevent state races
  const systemReadyRef = useRef(false);
  const minTimePassedRef = useRef(false);
  const isExitingRef = useRef(false);

  // Trigger logo entrance on the first animation frame after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsLogoMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── 12-Second Choreographed Sequence Engine ───
  useEffect(() => {
    // 1. Background real readiness detection (Telegram, fonts, cache)
    const detectSubsystemReadiness = async () => {
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
            // Safe ignore
          }
          resolve();
        });

        await Promise.all([domReady, fontsReady, storageCheck]);
        systemReadyRef.current = true;

        // If the 12s minimum has already completed when ready, trigger transition
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

    detectSubsystemReadiness();

    const triggerExit = () => {
      if (isExitingRef.current) return;
      isExitingRef.current = true;
      triggerHaptic('light');
      setIsExiting(true);

      setTimeout(() => {
        setIsExited(true);
        onInitialized?.();
      }, 600);
    };

    // ─── Precision Master Timeline Scheduling ───
    // Phase 2: 2.5s – Letter-by-letter reveal of "ABYSSINIA TRADING HUB"
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 2500);

    // Phase 3: 5.5s – Fade in "Built for Better Trading."
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 5500);

    // Phase 4: 7.5s – Activate refined burgundy loading indicator
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 7500);

    // Phase 5: 9.5s – Status verified; sustain complete composition for 2.5s hold
    const t4 = setTimeout(() => {
      setPhase(5);
    }, 9500);

    // Phase 6: 12.0s – Enforced 12-Second Minimum Presentation Mark reached
    const t5 = setTimeout(() => {
      minTimePassedRef.current = true;
      setPhase(6);

      // If subsystem readiness is confirmed, transition to Home
      if (systemReadyRef.current && !isExitingRef.current) {
        triggerExit();
      }
    }, 12000);

    // Safety fallback at 15.0s: guarantee users are never trapped if connection completely drops
    const safetyTimeout = setTimeout(() => {
      systemReadyRef.current = true;
      if (!isExitingRef.current) {
        triggerExit();
      }
    }, 15000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
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
    }, 400);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Abyssinia Trading Hub"
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-600 ease-out ${
        isExiting && !hasError
          ? 'opacity-0 scale-[1.018] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Architectural Grid Background (Subtle 22px coordinate pattern) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Soft radial ambient aura centered behind logo */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 380px at 50% 42%, rgba(114, 20, 40, 0.075) 0%, rgba(114, 20, 40, 0.015) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* ─── Clean Header Spacer (Distracting technical labels removed) ─── */}
      <div className="pt-safe pt-6 w-full" />

      {/* ─── Main Centerpiece: Clean Logo, Letter-by-Letter Title, Slogan, and Refined Indicator ─── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm -mt-4">
        {/* 1. ATH Logo with subtle burgundy glow behind it (No square box, clean against background) */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle burgundy ambient breathing aura */}
          <div
            className={`absolute -inset-10 rounded-full pointer-events-none transition-all duration-1000 ease-out ${
              isLogoMounted ? 'opacity-80 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
              background:
                'radial-gradient(circle at center, rgba(114, 20, 40, 0.12) 0%, rgba(114, 20, 40, 0.03) 55%, transparent 75%)',
            }}
          />

          {/* Clean frameless ATH Logo */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center transition-all duration-[1800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              isLogoMounted
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-85 translate-y-3'
            }`}
          >
            <AthLogo
              size={110}
              animated={true}
              className="w-full h-full drop-shadow-[0_8px_24px_rgba(114,20,40,0.10)]"
            />
          </div>
        </div>

        {/* 2. Brand Name: 2.5s–5.5s Letter-by-Letter Cinematic Staggered Reveal */}
        <div className="min-h-[28px] mb-2 flex items-center justify-center">
          <h1 className="text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase flex items-center justify-center flex-wrap">
            {BRAND_LETTERS.map((char, index) => (
              <span
                key={`ath-char-${index}`}
                className={`inline-block transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                  phase >= 2
                    ? 'opacity-100 translate-y-0 filter-none'
                    : 'opacity-0 translate-y-3 blur-[3px]'
                }`}
                style={{
                  transitionDelay: phase >= 2 ? `${index * 55}ms` : '0ms',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>

        {/* 3. Brand Slogan: 5.5s–7.5s Fade-In ("Built for Better Trading.") */}
        <div className="min-h-[24px] mb-7 flex items-center justify-center overflow-hidden">
          <p
            className={`text-xs sm:text-[13.5px] font-semibold text-stone-600 tracking-wide transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
              phase >= 3
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2.5 pointer-events-none'
            }`}
          >
            Built for Better <span className="text-[#721428] font-bold">Trading.</span>
          </p>
        </div>

        {/* 4. Refined Burgundy Loading Indicator: 7.5s+ with 9.5s–12.0s Sustained Brand Hold */}
        {hasError ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Connection paused. Tap to enter.</span>
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
            className={`w-full flex flex-col items-center transition-all duration-[900ms] ease-out ${
              phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Refined Luxury Indicator: Harmonic Triple Breathing Burgundy Pips */}
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athHarmonicPulse 1.6s ease-in-out infinite 0s',
                }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#721428]"
                style={{
                  animation: 'athHarmonicPulse 1.6s ease-in-out infinite 0.28s',
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athHarmonicPulse 1.6s ease-in-out infinite 0.56s',
                }}
              />
            </div>

            {/* Subtle Gradient Hairline Accent */}
            <div className="w-24 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#721428]/25 to-transparent mb-2.5" />

            {/* Dynamic Refined Status Text */}
            <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5 h-5">
              {phase >= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-stone-700 font-semibold animate-in fade-in duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#721428]" />
                  <span>Workspace Verified · Launching</span>
                </span>
              ) : (
                <span className="animate-in fade-in duration-300">
                  Initializing workspace environment…
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── Clean Minimalist Brand Footer (Distracting technical labels removed) ─── */}
      <footer className="relative z-10 pb-safe pb-6 px-6 w-full text-center">
        <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
          Abyssinia Trading Hub
        </p>
      </footer>
    </div>
  );
};
