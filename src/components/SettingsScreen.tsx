import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { AthLogo } from './AthLogo';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  const handleSelectAppearance = (mode: 'light' | 'dark' | 'system') => {
    triggerHaptic('light');
    setAppearance(mode);
  };

  const handleToggleNotifications = () => {
    triggerHaptic('medium');
    setNotificationsEnabled((prev) => !prev);
  };

  const handleTogglePromo = () => {
    triggerHaptic('light');
    setPromoAlerts((prev) => !prev);
  };

  return (
    <div className="space-y-4 pb-6 select-none animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex items-center gap-2.5 pb-1">
        <button
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            Settings
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">
            Preferences &amp; application info
          </p>
        </div>
      </div>

      {/* 1. Appearance Section */}
      <div className="rounded-2xl bg-white border border-gray-200/90 shadow-xs p-4 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-[#721428]" />
            <span>Appearance</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Choose your preferred display theme for the Mini App
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Light */}
          <button
            onClick={() => handleSelectAppearance('light')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              appearance === 'light'
                ? 'bg-[#FAF0F2] border-[#721428] text-[#721428] shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200/80 text-gray-600'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-xs font-bold">Light</span>
            {appearance === 'light' && (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#721428]">
                Active
              </span>
            )}
          </button>

          {/* Dark */}
          <button
            onClick={() => handleSelectAppearance('dark')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              appearance === 'dark'
                ? 'bg-[#FAF0F2] border-[#721428] text-[#721428] shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200/80 text-gray-600'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">Dark</span>
            {appearance === 'dark' && (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#721428]">
                Active
              </span>
            )}
          </button>

          {/* System */}
          <button
            onClick={() => handleSelectAppearance('system')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              appearance === 'system'
                ? 'bg-[#FAF0F2] border-[#721428] text-[#721428] shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200/80 text-gray-600'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-xs font-bold">System</span>
            {appearance === 'system' && (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#721428]">
                Active
              </span>
            )}
          </button>
        </div>

        <p className="text-[10.5px] text-gray-500 italic">
          ATH interface is tailored for high-contrast light trading readability.
        </p>
      </div>

      {/* 2. Notifications Section */}
      <div className="rounded-2xl bg-white border border-gray-200/90 shadow-xs p-4 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#721428]" />
            <span>Notifications</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Manage your order alerts and stock refill updates
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                Order Delivery Alerts
              </span>
              <span className="text-[10.5px] text-gray-500">
                Direct Telegram notifications on completed purchases
              </span>
            </div>

            <button
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsEnabled ? 'bg-[#721428]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs absolute top-0.75 ${
                  notificationsEnabled ? 'translate-x-5.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sub Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                Promotions &amp; Flash Stock
              </span>
              <span className="text-[10.5px] text-gray-500">
                Alerts when limited TradingView or FXReplay slots open
              </span>
            </div>

            <button
              onClick={handleTogglePromo}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                promoAlerts ? 'bg-[#721428]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs absolute top-0.75 ${
                  promoAlerts ? 'translate-x-5.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. About ATH Section */}
      <div className="rounded-2xl bg-white border border-gray-200/90 shadow-xs p-4 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
            <AthLogo size="sm" animated={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Abyssinia Trading Hub
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-[#721428]" />
            </div>
            <p className="text-[11px] text-[#721428] font-mono font-bold">
              ATH App v2.4.0 <span className="text-gray-400 font-normal">· Build 2026.09</span>
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 border border-gray-150 text-[11px] text-gray-600 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-gray-900">Abyssinia Trading Hub (ATH)</strong> is Ethiopia’s premier digital trading resource ecosystem. We deliver verified TradingView Pro/Premium licenses, FXReplay backtesting suites, algorithmic tools, and secure P2P payment solutions.
          </p>
          <p className="text-gray-500">
            Built for professional traders who demand precision, instant delivery, and zero downtime.
          </p>
        </div>

        {/* Official Channels */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="https://t.me/abyssiniatradinget"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/90 shadow-2xs flex items-center justify-between group transition-all"
          >
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block">CHANNEL</span>
              <span className="font-bold text-gray-800 text-[11.5px] group-hover:text-[#721428]">
                @abyssiniatradinget
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#721428]" />
          </a>

          <a
            href="https://t.me/abyssiniavendor"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/90 shadow-2xs flex items-center justify-between group transition-all"
          >
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block">SUPPORT</span>
              <span className="font-bold text-gray-800 text-[11.5px] group-hover:text-[#721428]">
                @abyssiniavendor
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#721428]" />
          </a>
        </div>
      </div>
    </div>
  );
};
