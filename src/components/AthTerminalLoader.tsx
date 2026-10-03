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
      aria-label="Loading Abyssinia Trading Hub"
      className={`fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden transition-all duration-500 ease-out ${
        isFadingOut && !hasError
          ? 'opacity-0 scale-[1.015] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* ─── Subtle Dot-Matrix Background (No connecting lines) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Evenly spaced tiny points in refined neutral/burgundy tint */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(114, 20, 40, 0.18) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            backgroundPosition: 'center',
          }}
        />

        {/* Soft radial ambient aura centered behind loader for subtle depth */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 340px at 50% 50%, rgba(114, 20, 40, 0.06) 0%, rgba(114, 20, 40, 0.01) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* ─── Centered Content: 4-Dot Sequential Loader with Logo, Brand & Status ─── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm">
        {/* 1. Centered Frameless Logo with subtle breathing animation */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle soft ambient glow centered behind logo */}
          <div
            className="absolute -inset-8 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(114, 20, 40, 0.08) 0%, rgba(114, 20, 40, 0.015) 55%, transparent 75%)',
            }}
          />

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center animate-[athLogoBreathe_3.2s_ease-in-out_infinite]">
            <AthLogo
              size={96}
              animated={true}
              className="w-full h-full drop-shadow-[0_6px_20px_rgba(114,20,40,0.12)]"
            />
          </div>
        </div>

        {/* 2. ABYSSINIA TRADING HUB Brand Name */}
        <h1 className="text-[18px] sm:text-[20px] font-black tracking-tight text-stone-900 leading-tight uppercase mb-1">
          ABYSSINIA TRADING HUB
        </h1>

        {/* 3. Built for Better Trading. Tagline */}
        <p className="text-xs sm:text-[13px] font-semibold text-stone-600 tracking-wide mb-6">
          Built for Better <span className="text-[#721428] font-bold">Trading.</span>
        </p>

        {/* 4. Four Small Burgundy Dots with Smooth Sequential Pulse/Wave + Rotating Status Message */}
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
            {/* 4 small burgundy dots with smooth sequential pulse/wave left to right */}
            <div className="flex items-center justify-center gap-1.5 mb-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.35s ease-in-out infinite 0s',
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.35s ease-in-out infinite 0.16s',
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.35s ease-in-out infinite 0.32s',
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#721428]"
                style={{
                  animation: 'athDotPulse 1.35s ease-in-out infinite 0.48s',
                }}
              />
            </div>

            {/* Rotating Status Message with fade transition */}
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
