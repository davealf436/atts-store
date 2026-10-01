import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { ToastItem, subscribeToasts, dismissToast } from '../services/toast';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToasts((updated) => {
      setToasts(updated);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-20 inset-x-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-3 sm:px-4"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        const borderColor = isSuccess
          ? 'border-emerald-500/40 shadow-[0_8px_30px_rgb(16,185,129,0.15)]'
          : isWarning
          ? 'border-amber-500/40 shadow-[0_8px_30px_rgb(245,158,11,0.15)]'
          : isError
          ? 'border-rose-500/40 shadow-[0_8px_30px_rgb(244,63,94,0.15)]'
          : 'border-sky-500/40 shadow-[0_8px_30px_rgb(14,165,233,0.15)]';

        const iconBg = isSuccess
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : isWarning
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : isError
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30';

        const progressBarColor = isSuccess
          ? 'bg-emerald-400'
          : isWarning
          ? 'bg-amber-400'
          : isError
          ? 'bg-rose-400'
          : 'bg-sky-400';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden w-full max-w-sm bg-stone-950/95 backdrop-blur-md text-white border ${borderColor} rounded-2xl p-3.5 shadow-2xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in select-none`}
          >
            {/* Type Icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              {isSuccess && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
              {isInfo && <Info className="w-4 h-4 stroke-[2.5]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 stroke-[2.5]" />}
              {isError && <XCircle className="w-4 h-4 stroke-[2.5]" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] text-stone-300 font-medium mt-0.5 leading-snug line-clamp-2">
                  {toast.message}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Timed progress bar indicator */}
            {toast.duration && toast.duration > 0 && (
              <div
                className={`absolute bottom-0 left-0 h-0.5 ${progressBarColor} opacity-70`}
                style={{
                  width: '100%',
                  animation: `toast-progress ${toast.duration}ms linear forwards`,
                }}
              />
            )}
          </div>
        );
      })}
    </aside>
  );
};
