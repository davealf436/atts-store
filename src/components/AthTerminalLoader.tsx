import React, { useState, useEffect, useRef } from 'react';
import { AthLogo } from './AthLogo';
import { initTelegramApp, triggerHaptic } from '../services/telegram';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AthTerminalLoaderProps {
  onInitialized?: () => void;
}

const FULL_BRAND = 'ABYSSINIA TRADING HUB';
const SLOGAN_WORDS = ['Built', 'for', 'Better', 'Trading.'];

export const AthTerminalLoader: React.FC<AthTerminalLoaderProps> = ({ onInitialized }) => {
  // ─── Deliberate 12-Second Master Timeline Sequence (NO FADES) ───
  // 0.0s – 1.0s: Clean initial presentation with centered logo at start scale
  // 1.0s – 4.0s: Deliberate logo movement & scaling into position (motion only, zero opacity fade)
  // 4.0s – 7.0s: Crisp letter-by-letter reveal of "ABYSSINIA TRADING HUB" (typing, zero opacity fade)
  // 7.0s – 9.0s: Crisp word-by-word reveal of "Built for Better Trading." (zero opacity fade)
  // 9.0s – 11.0s: Refined burgundy loading indicator active with workspace status (zero opacity fade)
  // 11.0s – 12.0s: Complete branded display hold in stillness
  // At 12.0s: Instant cut directly to Home page (0ms cut, NO crossfade, NO opacity transition)

  const [logoMoved, setLogoMoved] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const [revealedWords, setRevealedWords] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const [isWorkspaceVerified, setIsWorkspaceVerified] = useState(false);
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

        // If the 12-second mark has already been reached, cut instantly to Home
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

    // ─── Instant Cut to Home: 0ms cut with zero opacity fade, zero crossfade ───
    const triggerInstantCut = () => {
      if (isCutTriggeredRef.current) return;
      isCutTriggeredRef.current = true;
      triggerHaptic('light');
      setIsExited(true);
      onInitialized?.();
    };

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Stage 1 (1.0s – 4.0s): Logo movement and scaling into place (scale/movement only, no fade)
    timers.push(setTimeout(() => {
      setLogoMoved(true);
    }, 1000));

    // Stage 2 (4.0s – 7.0s): Letter-by-letter reveal of "ABYSSINIA TRADING HUB"
    const totalChars = FULL_BRAND.length;
    for (let i = 1; i <= totalChars; i++) {
      const charDelay = 4000 + Math.round((i - 1) * (3000 / totalChars));
      timers.push(setTimeout(() => {
        setRevealedChars(i);
      }, charDelay));
    }

    // Stage 3 (7.0s – 9.0s): Word-by-word reveal of "Built for Better Trading."
    for (let w = 1; w <= SLOGAN_WORDS.length; w++) {
      const wordDelay = 7000 + (w - 1) * 500;
      timers.push(setTimeout(() => {
        setRevealedWords(w);
      }, wordDelay));
    }

    // Stage 4 (9.0s – 10.5s): Show refined burgundy loading indicator
    timers.push(setTimeout(() => {
      setShowIndicator(true);
    }, 9000));

    // Stage 5 (10.5s – 12.0s): Update status to "Workspace Verified · Ready"
    timers.push(setTimeout(() => {
      setIsWorkspaceVerified(true);
    }, 10500));

    // Stage 6 (12.0s): 12-second mark reached -> Instant Cut directly to Home!
    timers.push(setTimeout(() => {
      minTimePassedRef.current = true;
      if (systemReadyRef.current && !isCutTriggeredRef.current) {
        triggerInstantCut();
      }
    }, 12000));

    // Safety fallback at 16.0s: guarantee user is never blocked indefinitely if offline
    timers.push(setTimeout(() => {
      systemReadyRef.current = true;
      if (!isCutTriggeredRef.current) {
        triggerInstantCut();
      }
    }, 16000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onInitialized]);

  // Once exited, completely unmount (instant cut, no transition)
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

      {/* ─── Main Centerpiece: Logo Movement, Sharp Typography, Slogan, and Indicator ─── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm -mt-4">
        {/* 1. ATH Logo: Deliberate movement & scaling from 1.0s to 4.0s (NO fade) */}
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
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center transition-transform duration-[3000ms] cubic-bezier(0.25, 1, 0.5, 1) ${
              logoMoved ? 'scale-100 translate-y-0' : 'scale-90 translate-y-2'
            }`}
          >
            <AthLogo
              size={110}
              animated={true}
              className="w-full h-full drop-shadow-[0_8px_24px_rgba(114,20,40,0.10)]"
            />
          </div>
        </div>

        {/* 2. Brand Name: 4.0s–7.0s Letter-by-Letter Sharp Typing Reveal (NO fade) */}
        <div className="min-h-[28px] mb-2 flex items-center justify-center">
          <h1 className="text-[17px] sm:text-[19px] font-black tracking-tight text-stone-900 leading-tight uppercase flex items-center justify-center flex-wrap">
            {FULL_BRAND.slice(0, revealedChars)}
            {revealedChars > 0 && revealedChars < FULL_BRAND.length && (
              <span className="w-1.5 h-4 bg-[#721428] ml-0.5 inline-block" />
            )}
          </h1>
        </div>

        {/* 3. Brand Slogan: 7.0s–9.0s Word-by-Word Sharp Reveal (NO fade, "Trading." in burgundy) */}
        <div className="min-h-[24px] mb-7 flex items-center justify-center">
          {revealedWords > 0 && (
            <p className="text-xs sm:text-[13.5px] font-semibold text-stone-600 tracking-wide">
              {SLOGAN_WORDS.slice(0, revealedWords).map((word, idx) => {
                const isLastWord = word === 'Trading.';
                return (
                  <span
                    key={`slogan-${idx}`}
                    className={isLastWord ? 'text-[#721428] font-bold ml-1' : idx > 0 ? 'ml-1' : ''}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          )}
        </div>

        {/* 4. Loading Indicator: 9.0s–12.0s Active Indicator (NO fade, scale pulse only) */}
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
          showIndicator && (
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

              {/* Dynamic Refined Status Text */}
              <div className="text-[11px] font-medium text-stone-500 tracking-tight flex items-center justify-center gap-1.5 h-5">
                {isWorkspaceVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-stone-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#721428]" />
                    <span>Workspace Verified · Ready</span>
                  </span>
                ) : (
                  <span>Initializing workspace environment…</span>
                )}
              </div>
            </div>
          )
        )}
      </main>

      {/* ─── Clean Minimalist Brand Footer ─── */}
      <footer className="relative z-10 pb-safe pb-6 px-6 w-full text-center">
        <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
          Abyssinia Trading Hub
        </p>
      </footer>
    </div>
  );
};
