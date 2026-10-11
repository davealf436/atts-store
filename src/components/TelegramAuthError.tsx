import React, { useState } from 'react';
import { AthLogo } from './AthLogo';
import { ShieldAlert, RotateCw, ExternalLink } from 'lucide-react';
import { retryAuth } from '../services/auth';
import { triggerHaptic, openTelegramSupport } from '../services/telegram';

interface TelegramAuthErrorProps {
  errorMessage?: string;
  onRetrySuccess?: () => void;
}

export const TelegramAuthError: React.FC<TelegramAuthErrorProps> = ({
  errorMessage = 'Unable to connect your Telegram account. Please reopen ATH from Telegram.',
  onRetrySuccess,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    triggerHaptic('medium');
    setIsRetrying(true);
    try {
      const success = await retryAuth();
      if (success) {
        onRetrySuccess?.();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 text-center space-y-5 animate-in fade-in duration-200">
        {/* ATH Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FCFAF7] border border-[#721428]/25 flex items-center justify-center p-2.5 shadow-2xs">
            <AthLogo size="md" />
          </div>
        </div>

        {/* Shield Alert Icon */}
        <div className="flex justify-center -mt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shadow-2xs">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Heading & Message */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Telegram Verification
          </h2>
          <p className="text-xs font-semibold text-gray-700 leading-relaxed px-1">
            {errorMessage}
          </p>
          <p className="text-[11px] text-gray-400 leading-normal max-w-xs mx-auto pt-1">
            ATH uses authentic Telegram session verification to securely link your orders, licenses, and wallet without passwords.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full py-2.5 px-4 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Verifying...' : 'Retry Connection'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              openTelegramSupport();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-150 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open in Telegram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
};
