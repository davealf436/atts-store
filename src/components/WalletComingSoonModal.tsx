import React, { useEffect } from 'react';
import { Wallet, X, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface WalletComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletComingSoonModal: React.FC<WalletComingSoonModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      triggerHaptic('light');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          triggerHaptic('light');
          onClose();
        }}
      />

      {/* Compact Premium Modal Card */}
      <div className="relative w-full max-w-[320px] bg-white rounded-2xl border border-stone-200/90 shadow-[0_16px_40px_-8px_rgba(28,25,23,0.22)] p-5 z-10 animate-in zoom-in-95 duration-150 select-none">
        {/* Close Button */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Wallet Icon Accent */}
          <div className="relative w-12 h-12 rounded-2xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shadow-xs mb-3">
            <Wallet className="w-6 h-6 stroke-[1.8]" />
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-[#F0D5DA] shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#721428]" />
            </span>
          </div>

          {/* Status Label */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] text-[10px] font-extrabold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#721428] animate-pulse" />
            <span>Coming Soon</span>
          </span>

          {/* Title */}
          <h3 className="text-base font-bold text-stone-900 tracking-tight mb-1.5">
            ATH Wallet
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 font-medium leading-relaxed mb-4">
            Direct crypto &amp; local currency balances, instant P2P settlements, and automatic subscription renewals are coming in an upcoming release.
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
