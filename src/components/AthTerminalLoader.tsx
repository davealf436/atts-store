import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

const STATUS_MESSAGES = [
  'Initializing your workspace...',
  'Loading market data...',
  'Preparing your backtests...',
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

        // If status rotation cycle has completed, fade out to dashboard
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
    // Message 1: "Initializing your workspace..." (0s – 1.15s)
    // Message 2: "Loading market data..." (1.15s – 2.3s)
    timers.push(setTimeout(() => {
      setStatusIndex(1);
    }, 1150));

    // Message 3: "Preparing your backtests..." (2.3s – 3.45s)
    timers.push(setTimeout(() => {
      setStatusIndex(2);
    }, 2300));

    // Message 4: "Almost ready..." (3.45s – 4.5s)
    timers.push(setTimeout(() => {
      setStatusIndex(3);
    }, 3450));

    // Finish sequence and smoothly transition to Dashboard
    timers.push(setTimeout(() => {
      cycleCompleteRef.current = true;
      if (systemReadyRef.current && !isTransitioningRef.current) {
        triggerFadeOut();
      }
    }, 4500));

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
      aria-label="Loading Abyssinia Trading Hub"
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
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #721428 1px, transparent 1px), linear-gradient(to bottom, #721428 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Soft radial ambient aura centered behind logo */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 340px at 50% 50%, rgba(114, 20, 40, 0.08) 0%, rgba(114, 20, 40, 0.015) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* ─── Centered Content Area: Logo, Brand Name, Tagline, Loader, and Rotating Status ─── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm">
        {/* 1. ATH Logo with subtle fade/scale breathing animation */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center animate-[athLogoBreathe_3.4s_ease-in-out_infinite]">
            <AthLogo
              size={96}
              animated={true}
              className="w-full h-full drop-shadow-[0_8px_20px_rgba(114,20,40,0.12)]"
            />
          </div>
        </div>

        {/* 2. Brand Name */}
        <h1 className="text-[18px] sm:text-[20px] font-black tracking-tight text-stone-900 leading-tight uppercase mb-1">
          ABYSSINIA TRADING HUB
        </h1>

        {/* 3. Tagline */}
        <p className="text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide mb-6">
          Built for Better <span className="text-[#721428] font-bold">Trading.</span>
        </p>

        {/* 4. Loader: Three Smoothly Pulsing Dots & Rotating Status Text */}
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
          <div className="flex flex-col items-center justify-center">
            {/* Three Smoothly Pulsing Burgundy Dots */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="w-2 h-2 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.4s ease-in-out infinite 0s',
                }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.4s ease-in-out infinite 0.22s',
                }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.4s ease-in-out infinite 0.44s',
                }}
              />
            </div>

            {/* Smoothly Rotating Status Text */}
            <div className="h-5 relative flex items-center justify-center overflow-hidden">
              <p
                key={statusIndex}
                className="text-[11.5px] font-medium text-stone-500 tracking-tight animate-[athStatusFade_0.35s_ease-out]"
              >
                {STATUS_MESSAGES[statusIndex]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
