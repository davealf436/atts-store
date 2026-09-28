import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ReceiptText, 
  KeyRound, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle,
  X
} from 'lucide-react';
import { triggerHaptic, getInitialTelegramUser } from '../services/telegram';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateToOrders: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateToOrders,
}) => {
  const user = getInitialTelegramUser();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

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
          Your Telegram session authenticates your instant digital license deliveries and P2P escrow transfers.
        </p>
      </div>

      {/* Navigation Shortcuts: My Orders & My Access */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
          Account Shortcuts
        </h3>

        {/* My Orders Shortcut */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onNavigateToOrders();
          }}
          className="w-full p-3.5 rounded-xl bg-white hover:bg-gray-50/80 active:bg-gray-100 border border-gray-200/90 shadow-2xs flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shrink-0 shadow-2xs">
              <ReceiptText className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#721428] transition-colors">
                My Orders
              </h4>
              <p className="text-[11px] text-gray-500">
                View active orders, license receipts &amp; history
              </p>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </div>
        </button>

        {/* My Access Shortcut */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsAccessModalOpen(true);
          }}
          className="w-full p-3.5 rounded-xl bg-white hover:bg-gray-50/80 active:bg-gray-100 border border-gray-200/90 shadow-2xs flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shrink-0 shadow-2xs">
              <KeyRound className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#721428] transition-colors">
                My Access
              </h4>
              <p className="text-[11px] text-gray-500">
                Active licenses, digital keys &amp; resource vault
              </p>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* My Access Modal */}
      {isAccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsAccessModalOpen(false)}
          />

          <div className="relative w-full max-w-[360px] bg-white rounded-2xl border border-stone-200 shadow-xl p-5 z-10 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAccessModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shrink-0">
                <KeyRound className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">My Access Vault</h3>
                <p className="text-[11px] text-gray-500">Trading licenses &amp; resources</p>
              </div>
            </div>

            <div className="space-y-2.5 my-3.5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Notion Trading Journal</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Free Tier</span>
                </div>
                <p className="text-[11px] text-gray-600">Free template link ready for instant duplicate</p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10.5px] font-mono text-gray-500 truncate flex-1 bg-white px-2 py-1 rounded border border-gray-200">
                    notion.so/ath-journal-template
                  </span>
                  <button
                    onClick={() => handleCopy('https://notion.so/ath-journal-template', 'notion-link')}
                    className="p-1 text-xs bg-[#721428] text-white rounded font-medium px-2 shrink-0 cursor-pointer"
                  >
                    {copiedField === 'notion-link' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Paid Subscriptions</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Auto-Linked</span>
                </div>
                <p className="text-[11px] text-gray-600">TradingView &amp; FXReplay credentials link to Telegram ID</p>
              </div>
            </div>

            <button
              onClick={() => setIsAccessModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
