import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

const STATUS_MESSAGES = [
  'Preparing your backtests...',
  'Loading market data...',
  'Preparing your workspace...',
  'Almost ready...',
];

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);

  const systemReadyRef = useRef(false);
  const cycleCompleteRef = useRef(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // 1. Detect subsystem readiness in background
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

        // If status cycle has reached the final stage, smoothly transition
        if (cycleCompleteRef.current && !isTransitioningRef.current) {
          triggerFadeOut();
        }
      } catch (err) {
        console.warn('System readiness notice:', err);
        systemReadyRef.current = true;
        if (cycleCompleteRef.current && !isTransitioningRef.current) {
          triggerFadeOut();
        }
      }
    };

    detectSubsystems();

    // ─── Smooth Fade-Out into Dashboard ───
    const triggerFadeOut = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      triggerHaptic('light');
      setIsFadingOut(true);

      setTimeout(() => {
        setIsExited(true);
        onInitialized?.();
      }, 500);
    };

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 2. Smoothly rotate status messages:
    // Message 1: "Preparing your backtests..." (0s – 1.2s)
    // Message 2: "Loading market data..." (1.2s – 2.4s)
    timers.push(setTimeout(() => {
      setStatusIndex(1);
    }, 1200));

    // Message 3: "Preparing your workspace..." (2.4s – 3.6s)
    timers.push(setTimeout(() => {
      setStatusIndex(2);
    }, 2400));

    // Message 4: "Almost ready..." (3.6s – 4.6s)
    timers.push(setTimeout(() => {
      setStatusIndex(3);
    }, 3600));

    // Finish sequence and smoothly transition to Dashboard
    timers.push(setTimeout(() => {
      cycleCompleteRef.current = true;
      if (systemReadyRef.current && !isTransitioningRef.current) {
        triggerFadeOut();
      }
    }, 4600));

    // Safety fallback at 7.0s: ensure user is never blocked
    timers.push(setTimeout(() => {
      systemReadyRef.current = true;
      if (!isTransitioningRef.current) {
        triggerFadeOut();
      }
    }, 7000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onInitialized]);

  if (isExited) {
    return null;
  }

  const handleManualContinue = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    triggerHaptic('medium');
    setIsFadingOut(true);
    setTimeout(() => {
      setIsExited(true);
      onInitialized?.();
    }, 300);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Backtesting Lab"
      className={`fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-500 ease-out ${
        isFadingOut && !hasError
          ? 'opacity-0 scale-[1.015] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Very Subtle Trading-Grid Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Delicate hairline coordinate grid */}
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Soft radial ambient aura centered behind loader */}
        <div
          className="absolute inset-0 opacity-45 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 320px at 50% 50%, rgba(114, 20, 40, 0.08) 0%, rgba(114, 20, 40, 0.015) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* ─── Centered Content: Single-Focus Burgundy Circular Progress Loader ─── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm">
        {/* 1. Centered Logo inside Thin Animated Burgundy Circular Progress Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Circular Loader Frame */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* SVG Thin Burgundy Progress Ring (Single visual focus for loading) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
              viewBox="0 0 120 120"
            >
              <defs>
                <linearGradient id="athBurgundyProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A3213F" />
                  <stop offset="60%" stopColor="#721428" />
                  <stop offset="100%" stopColor="#4D0A17" />
                </linearGradient>
                <filter id="athBurgundyGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#721428" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Faint Background Track Ring */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#EAE2E4"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Animated Burgundy Progress Ring with Smooth Stroke Dash and Rotation */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#athBurgundyProgressGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#athBurgundyGlow)"
                className="animate-[athRingDash_2.6s_ease-in-out_infinite,athRingSpin_3.2s_linear_infinite] origin-center"
              />
            </svg>

            {/* Centered Logo with subtle pulse/breathing animation */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center animate-[athLogoBreathe_3.2s_ease-in-out_infinite]">
              <AthLogo
                size={78}
                animated={true}
                className="w-full h-full drop-shadow-[0_4px_16px_rgba(114,20,40,0.12)]"
              />
            </div>
          </div>
        </div>

        {/* 2. BACKTESTING LAB Brand Name */}
        <h1 className="text-[18px] sm:text-[20px] font-black tracking-tight text-stone-900 leading-tight uppercase mb-1">
          BACKTESTING LAB
        </h1>

        {/* 3. Built for Better Backtesting. Tagline */}
        <p className="text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide mb-6">
          Built for Better <span className="text-[#721428] font-bold">Backtesting.</span>
        </p>

        {/* 4. Small Rotating Status Message */}
        {hasError ? (
          <div className="space-y-3">
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
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-5 relative flex items-center justify-center overflow-hidden">
            <p
              key={statusIndex}
              className="text-[11.5px] font-medium text-stone-500 tracking-tight animate-[athStatusFade_0.35s_ease-out]"
            >
              {STATUS_MESSAGES[statusIndex]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
