import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  // All text and branding elements are displayed at full opacity immediately and remain completely static.
  // Only non-text visual elements are animated (ATH origami bird dynamics & triple harmonic burgundy pips).
  // At 12.0s, switches directly to Home page with a 0ms instant cut (no fade, no transition).

  const [isExited, setIsExited] = useState(false);
  const [hasError, setHasError] = useState(false);

  const systemReadyRef = useRef(false);
  const minTimePassedRef = useRef(false);
  const isCutTriggeredRef = useRef(false);

  useEffect(() => {
    // 1. Detect actual subsystem readiness (Telegram, fonts, cache)
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

        // If the 12-second mark has already been reached, switch directly to Home
        if (minTimePassedRef.current && !isCutTriggeredRef.current) {
          triggerInstantCut();
        }
      } catch (err) {
        console.warn('System readiness notice:', err);
        systemReadyRef.current = true;
        if (minTimePassedRef.current && !isCutTriggeredRef.current) {
          triggerInstantCut();
        }
      }
    };

    detectSubsystems();

    // ─── Direct Switch to Home: 0ms cut with zero opacity fade, zero transition ───
    const triggerInstantCut = () => {
      if (isCutTriggeredRef.current) return;
      isCutTriggeredRef.current = true;
      triggerHaptic('light');
      setIsExited(true);
      onInitialized?.();
    };

    // 12-Second Master Presentation: Switch directly to Home at 12.0s
    const masterTimer = setTimeout(() => {
      minTimePassedRef.current = true;
      if (systemReadyRef.current && !isCutTriggeredRef.current) {
        triggerInstantCut();
      }
    }, 12000);

    // Safety fallback at 16.0s: ensure user is never blocked indefinitely if offline
    const safetyTimeout = setTimeout(() => {
      systemReadyRef.current = true;
      if (!isCutTriggeredRef.current) {
        triggerInstantCut();
      }
    }, 16000);

    return () => {
      clearTimeout(masterTimer);
      clearTimeout(safetyTimeout);
    };
  }, [onInitialized]);

  // Once exited, completely unmount (instant direct cut to Home)
  if (isExited) {
    return null;
  }

  const handleManualContinue = () => {
    if (isCutTriggeredRef.current) return;
    isCutTriggeredRef.current = true;
    triggerHaptic('medium');
    setIsExited(true);
    onInitialized?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Initializing Abyssinia Trading Hub"
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#F8F9FA] text-stone-900 select-none overflow-hidden"
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

      {/* ─── Clean Header Spacer ─── */}
      <div className="pt-safe pt-6 w-full" />

      {/* ─── Main Centerpiece: Fully Opacity, Static Readable Typography & Visual Indicators ─── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm -mt-4">
        {/* 1. ATH Logo: Clean Frameless Vector with Subtle Origami Dynamics */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle burgundy ambient glow (static solid presence, no opacity fading) */}
          <div
            className="absolute -inset-10 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(114, 20, 40, 0.10) 0%, rgba(114, 20, 40, 0.02) 55%, transparent 75%)',
            }}
          />

          {/* Clean frameless ATH Logo without box or border */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <AthLogo
              size={110}
              animated={true}
              className="w-full h-full drop-shadow-[0_8px_24px_rgba(114,20,40,0.10)]"
            />
          </div>
        </div>

        {/* 2. Brand Name: Completely Static and Readable at Full Opacity */}
        <div className="min-h-[28px] mb-2 flex items-center justify-center">
          <h1 className="text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase">
            ABYSSINIA TRADING HUB
          </h1>
        </div>

        {/* 3. Brand Slogan: Completely Static and Readable at Full Opacity ("Trading." in burgundy) */}
        <div className="min-h-[24px] mb-7 flex items-center justify-center">
          <p className="text-xs sm:text-[13.5px] font-semibold text-stone-600 tracking-wide">
            Built for Better <span className="text-[#721428] font-bold">Trading.</span>
          </p>
        </div>

        {/* 4. Loading Indicator: Non-Text Visual Harmonic Pips & Static Readable Status */}
        {hasError ? (
          <div className="space-y-3">
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
          <div className="w-full flex flex-col items-center">
            {/* Refined Luxury Indicator: Harmonic Triple Breathing Burgundy Pips (scale pulse only) */}
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
            <div className="w-24 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#721428]/35 to-transparent mb-2.5" />

            {/* Static Readable Status Text */}
            <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5 h-5">
              <span>Initializing your workspace…</span>
            </div>
          </div>
        )}
      </main>

      {/* ─── Clean Minimalist Brand Footer (Completely Static) ─── */}
      <footer className="relative z-10 pb-safe pb-6 px-6 w-full text-center">
        <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
          Abyssinia Trading Hub
        </p>
      </footer>
    </div>
  );
};
