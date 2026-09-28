import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCircle 
} from 'lucide-react';
import { triggerHaptic, getInitialTelegramUser } from '../services/telegram';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateToOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
}) => {
  const user = getInitialTelegramUser();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    triggerHaptic('light');
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
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
            User Profile
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">
            Telegram account &amp; access status
          </p>
        </div>
      </div>

      {/* Main Profile Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200/90 shadow-xs p-4.5">
        <div className="flex items-center gap-3.5">
          {/* Telegram Profile Photo or Initial Avatar */}
          <div className="relative shrink-0">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#F0D5DA] shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#721428] text-white flex items-center justify-center font-black text-2xl shadow-xs ring-4 ring-[#FAF0F2]">
                {(user.first_name?.[0] || 'D').toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#F0D5DA] flex items-center justify-center shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-[#721428]" />
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-900 truncate">
                {user.first_name} {user.last_name || ''}
              </h2>
            </div>

            {user.username && (
              <button
                onClick={() => handleCopy(`@${user.username}`, 'username')}
                className="text-xs text-[#721428] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                title="Copy username"
              >
                <span>@{user.username}</span>
                {copiedField === 'username' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60" />
                )}
              </button>
            )}

            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] text-[10px] font-bold border border-[#F0D5DA]">
                <ShieldCheck className="w-3 h-3 text-[#721428]" />
                <span>ATH Verified</span>
              </span>
              <span className="text-[10.5px] font-mono text-gray-400">
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Account Connection Status Card */}
      <div className="rounded-xl bg-white border border-gray-200/90 shadow-2xs p-3.5 space-y-2">
        <h3 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Telegram Connection Status</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-150">
            <span className="text-[10px] text-gray-500 font-semibold block uppercase">Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <span>Connected</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-150">
            <span className="text-[10px] text-gray-500 font-semibold block uppercase">Protocol</span>
            <span className="font-bold text-gray-800 mt-0.5 block">TMA v7.0+</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
          Your Telegram session authenticates your instant digital license deliveries and P2P transfers.
        </p>
      </div>
    </div>
  );
};
