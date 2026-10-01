import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Upload,
  Zap,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  ReceiptText,
  Send,
  X
} from 'lucide-react';
import { TelegramUser } from '../types';
import {
  getWalletState,
  formatETB,
  etbToUsdt,
  submitDeposit,
  approvePendingDeposit,
  ETB_TO_USDT_RATE
} from '../services/wallet';
import { triggerHaptic, triggerNotificationHaptic, openTelegramSupport } from '../services/telegram';
import { SuccessCheckmarkAnimation } from './SuccessCheckmarkAnimation';
import { toast } from '../services/toast';

interface WalletScreenProps {
  user: TelegramUser;
  onNavigateToShop: () => void;
}

type DepositMethodId = 'telebirr' | 'cbe' | 'awash' | 'usdt';

interface PaymentMethodOption {
  id: DepositMethodId;
  name: string;
  badge: string;
  badgeColor: string;
  accountNumber: string;
  accountLabel: string;
  recipientName: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    badge: 'Instant Transfer',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accountNumber: '0934313020',
    accountLabel: 'Telebirr Phone Number',
    recipientName: 'Dawit',
    description: 'Instant mobile app & USSD (*127#)',
  },
  {
    id: 'cbe',
    name: 'CBE',
    badge: 'Bank Transfer',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    accountNumber: '1000638416151',
    accountLabel: 'CBE Account Number',
    recipientName: 'Dawit',
    description: 'CBE Mobile Banking & CBE Birr',
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    badge: 'Bank Transfer',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accountNumber: '013201369124500',
    accountLabel: 'Awash Account Number',
    recipientName: 'Dawit',
    description: 'Awash Online & Mobile App',
  },
  {
    id: 'usdt',
    name: 'USDT (Binance)',
    badge: 'Binance Pay',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    accountNumber: '874067761',
    accountLabel: 'Binance ID (Pay ID)',
    recipientName: 'ABYSSINIAVENDOR',
    description: 'Binance Pay instant transfer',
  },
];

const PRESET_AMOUNTS = [250, 500, 1000, 2500];

export const WalletScreen: React.FC<WalletScreenProps> = ({ user, onNavigateToShop }) => {
  const [wallet, setWallet] = useState(getWalletState());
  const [showUsdt, setShowUsdt] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit'>('overview');
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Deposit state
  const [selectedMethod, setSelectedMethod] = useState<DepositMethodId | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [referenceInput, setReferenceInput] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedNotification, setSubmittedNotification] = useState<{
    adminText: string;
    transactionId: string;
    amountETB: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync wallet state reactively
  useEffect(() => {
    const handleUpdate = () => {
      setWallet(getWalletState());
    };
    window.addEventListener('ath_wallet_updated', handleUpdate);
    return () => window.removeEventListener('ath_wallet_updated', handleUpdate);
  }, []);

  const handleCopy = (text: string, label: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSelectAmount = (amount: number) => {
    triggerHaptic('light');
    setIsCustom(false);
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    setCustomAmount(numeric);
    setIsCustom(true);
    if (numeric) {
      setSelectedAmount(parseInt(numeric, 10));
    } else {
      setSelectedAmount(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image file is too large. Please choose an image under 8MB.');
        return;
      }
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
        triggerHaptic('light');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearScreenshot = () => {
    setScreenshotPreview(null);
    setScreenshotName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const effectiveAmount = isCustom ? (parseInt(customAmount, 10) || 0) : selectedAmount;
  const currentMethod = selectedMethod
    ? PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null
    : null;

  const isDepositFormValid =
    Boolean(selectedMethod && currentMethod) &&
    effectiveAmount >= 50 &&
    referenceInput.trim().length > 0 &&
    Boolean(screenshotPreview);

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !currentMethod) {
      triggerNotificationHaptic('error');
      alert('Please select a payment method first.');
      return;
    }
    if (effectiveAmount < 50) {
      triggerNotificationHaptic('error');
      alert('Minimum deposit amount is 50 ETB.');
      return;
    }
    if (!referenceInput.trim()) {
      triggerNotificationHaptic('error');
      alert('Please enter your transaction reference.');
      return;
    }
    if (!screenshotPreview) {
      triggerNotificationHaptic('error');
      alert('Please upload your payment transfer screenshot.');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    setTimeout(() => {
      const methodName = currentMethod.name;

      const result = submitDeposit(
        effectiveAmount,
        methodName,
        referenceInput.trim(),
        screenshotPreview || undefined,
        user
      );

      setIsSubmitting(false);
      triggerNotificationHaptic('success');
      toast.success(
        'Deposit Request Submitted!',
        `${formatETB(result.transaction.amountETB)} via ${methodName} is pending admin verification.`
      );
      setSubmittedNotification({
        adminText: result.adminNotification,
        transactionId: result.transaction.id,
        amountETB: result.transaction.amountETB,
      });

      // Clear deposit inputs and switch to overview to show success animation
      setReferenceInput('');
      handleClearScreenshot();
      setWallet(getWalletState());
      setActiveTab('overview');
    }, 700);
  };

  const handleSimulateApproval = (txId: string) => {
    triggerHaptic('medium');
    const newState = approvePendingDeposit(txId);
    setWallet(newState);
    triggerNotificationHaptic('success');
    toast.success(
      'Deposit Approved & Credited!',
      'Your funds have been added to your wallet balance.'
    );
    if (submittedNotification && submittedNotification.transactionId === txId) {
      setSubmittedNotification(null);
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Main Balance & Overview Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
        {/* Main Balance Display */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#721428] via-[#5A0E1E] to-[#3B0712] p-4 text-white shadow-md">
          {/* Subtle gold grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #C59F43 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-normal text-[#F0D5DA]/90">
                  Wallet Balance
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowUsdt(!showUsdt);
                  }}
                  className="text-[10px] text-white/70 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showUsdt ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showUsdt ? 'USDT' : 'ETB'}</span>
                </button>
              </div>

              {/* Amount */}
              <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                {formatETB(wallet.balanceETB)}
              </div>

              {/* Secondary USDT equivalent */}
              {showUsdt && (
                <div className="mt-1.5 text-xs font-semibold text-[#F7D388] flex items-center gap-1.5">
                  <span>≈ {etbToUsdt(wallet.balanceETB)}</span>
                  <span className="text-[10px] text-white/60 font-normal">
                    (1 USDT ≈ {ETB_TO_USDT_RATE} ETB)
                  </span>
                </div>
              )}
            </div>

            {/* Wallet Icon Badge */}
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* Quick Action Bar inside Hero Card */}
          <div className="relative z-10 grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setActiveTab('deposit');
              }}
              className="py-2 px-3 rounded-lg bg-white text-[#721428] hover:bg-stone-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Funds</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onNavigateToShop();
              }}
              className="py-2 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#F7D388]" />
              <span>Explore Tools</span>
            </button>
          </div>
        </div>

        {/* Segment Tabs: Overview and Add Funds with Burgundy Active UI */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl mt-3 border border-stone-200/60">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('overview');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#721428] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('deposit');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-[#721428] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Add Funds
          </button>
        </div>
      </div>

      {/* Admin Notification Preview Banner (if recently submitted) */}
      {submittedNotification && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Deposit Request Submitted</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmittedNotification(null)}
              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtle Success Checkmark Animation */}
          <div className="my-2.5 py-1">
            <SuccessCheckmarkAnimation
              size="md"
              color="emerald"
              title="Deposit Submitted Successfully!"
              subtitle={`Pending admin verification for ${formatETB(submittedNotification.amountETB)}`}
            />
          </div>

          <p className="text-xs text-stone-600 mb-3 leading-relaxed text-center">
            Your payment receipt has been registered. The admin will verify the reference code and approve your balance:
          </p>

          {/* Formatted Admin Command Code block */}
          <div className="bg-stone-900 text-stone-100 rounded-xl p-3 font-mono text-[11px] relative mb-3 overflow-x-auto border border-stone-800">
            <div className="text-[10px] text-[#F7D388] mb-1 font-bold">
              Admin Telegram Notification &amp; Command:
            </div>
            <div className="whitespace-pre-wrap select-all">
              {submittedNotification.adminText.replace(/<[^>]*>?/gm, '')}
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  submittedNotification.adminText.replace(/<[^>]*>?/gm, ''),
                  'admin-text'
                )
              }
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] font-sans font-bold text-white flex items-center gap-1 border border-stone-700 transition-colors cursor-pointer"
            >
              {copiedItem === 'admin-text' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Simulation Button for instant testing */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleSimulateApproval(submittedNotification.transactionId)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Admin Approval (/send)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                openTelegramSupport();
              }}
              className="py-2 px-3 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3 text-[#721428]" />
              <span>Open Support Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Overview Screen */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          {/* Instant Wallet Checkout Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-[#721428]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">
                  Instant Wallet Checkout
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                  Keep funds in your ATH Wallet and pay for trading tools instantly. No repeated payment steps or manual receipt submissions.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveTab('deposit');
                    }}
                    className="py-2 px-3 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Deposit Now</span>
                    <ArrowDownLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onNavigateToShop();
                    }}
                    className="py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Explore Tools
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900">
                Recent Activity
              </h3>
              {wallet.transactions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowAllActivity(true);
                  }}
                  className="text-[11px] font-semibold text-[#721428] hover:text-[#5A0E1E] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View All</span>
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>

            {wallet.transactions.length === 0 ? (
              <div className="py-6 px-4 text-center select-none">
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-stone-800 mb-0.5">
                  No wallet activity yet
                </p>
                <p className="text-[11px] text-stone-500">
                  Your deposits and purchases will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wallet.transactions.slice(0, 3).map((tx) => {
                  const isDeposit = tx.type === 'deposit';

                  return (
                    <div
                      key={tx.id}
                      className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            isDeposit
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-[#FAF0F2] text-[#721428] border-[#F0D5DA]/80'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-stone-900 block truncate">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                            {tx.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold block ${
                            isDeposit ? 'text-emerald-700' : 'text-stone-900'
                          }`}
                        >
                          {isDeposit ? `+${formatETB(tx.amountETB)}` : `−${formatETB(tx.amountETB)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Deposit / Top-Up Flow */}
      {activeTab === 'deposit' && (
        <form onSubmit={handleSubmitDeposit} className="space-y-4">
          {/* Step 1: Select Amount */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#721428] text-white text-[10px] font-black flex items-center justify-center">
                  1
                </span>
                <span>Select Deposit Amount</span>
              </h3>
              <span className="text-[10.5px] font-semibold text-stone-500">
                Min: 50 ETB
              </span>
            </div>

            {/* Quick deposit presets: 250, 500, 1000, 2500 ETB */}
            <div className="grid grid-cols-4 gap-2 mb-2.5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = !isCustom && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#721428] text-white border-[#721428] shadow-xs scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{amt}</span>
                    <span className="block text-[9px] font-medium opacity-80">ETB</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <label className="text-[10.5px] font-semibold text-stone-600 block mb-1">
                Or Enter Custom Amount (ETB):
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="e.g. 5,000"
                  className={`w-full h-10 px-3 pr-16 rounded-xl border text-xs font-bold focus:outline-none transition-colors ${
                    isCustom
                      ? 'border-[#721428] bg-white ring-1 ring-[#721428]'
                      : 'border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:border-[#721428]'
                  }`}
                />
                <span className="absolute right-3 text-xs font-bold text-stone-400">
                  ETB
                </span>
              </div>
            </div>

            {/* Live conversion info in Standard Caps */}
            <div className="mt-2.5 p-2 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-between text-[11px]">
              <span className="text-stone-600 font-medium">Deposit Value:</span>
              <span className="font-bold text-[#721428]">
                {formatETB(effectiveAmount)} <span className="text-stone-500 font-medium">({etbToUsdt(effectiveAmount)})</span>
              </span>
            </div>
          </div>

          {/* Step 2: Choose Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#721428] text-white text-[10px] font-black flex items-center justify-center">
                  2
                </span>
                <span>Select Payment Method</span>
              </h3>
            </div>

            {/* Method selection cards */}
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => {
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedMethod(m.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#721428] bg-[#FAF0F2]/70 ring-1 ring-[#721428] shadow-xs'
                        : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">{m.name}</span>
                      {isSelected && (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#721428] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate">{m.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Details for Selected Method (Shown ONLY after clicking) */}
            {currentMethod ? (
              <div className="mt-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-200/80">
                  <span className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#721428]" />
                    <span>Payment Details • {currentMethod.name}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#721428] bg-[#FAF0F2] px-2 py-0.5 rounded-md border border-[#F0D5DA]">
                    {currentMethod.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Deposit Amount */}
                  <div className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-stone-500 font-medium">Deposit Amount:</span>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">
                        {formatETB(effectiveAmount)}
                      </span>
                      {selectedMethod === 'usdt' && (
                        <span className="text-stone-500 text-[11px] ml-1 font-semibold">
                          (≈ {etbToUsdt(effectiveAmount)})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipient Name */}
                  <div className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-stone-500 font-medium">Recipient Name:</span>
                    <span className="font-bold text-stone-900">{currentMethod.recipientName}</span>
                  </div>

                  {/* Account / Binance ID with Copy button */}
                  <div className="flex items-center justify-between text-xs py-1.5 border-t border-stone-200/70 mt-1">
                    <div className="min-w-0 pr-2">
                      <span className="text-stone-500 text-[10.5px] font-medium block">
                        {currentMethod.accountLabel}:
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm tracking-tight select-all">
                        {currentMethod.accountNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(currentMethod.accountNumber, currentMethod.id)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 ${
                        copiedItem === currentMethod.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#721428] hover:bg-[#5A0E1E] text-white active:scale-95'
                      }`}
                      title={`Copy ${currentMethod.accountLabel}`}
                    >
                      {copiedItem === currentMethod.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 py-2.5 px-3 rounded-xl bg-stone-50/80 border border-dashed border-stone-200 text-center">
                <span className="text-[11px] text-stone-500 font-medium">
                  Tap any payment method above to view payment details
                </span>
              </div>
            )}
          </div>

          {/* Step 3: Payment Verification */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#721428] text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
                <span>Payment Verification</span>
              </h3>
            </div>

            {/* Input: Transaction Reference in Standard Caps */}
            <div className="mb-3">
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Transaction Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="e.g. TLB8291049, CBE0192840, or TxHash"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-xs font-medium text-stone-900 transition-colors"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Paste the transaction reference ID received from your mobile banking confirmation receipt.
              </span>
            </div>

            {/* Screenshot Upload with Preview */}
            <div className="mb-4">
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Upload Payment Screenshot <span className="text-rose-500 font-bold">*</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="deposit-screenshot-upload"
              />

              {!screenshotPreview ? (
                <label
                  htmlFor="deposit-screenshot-upload"
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-200 hover:border-[#721428] rounded-xl bg-stone-50/70 hover:bg-[#FAF0F2]/40 transition-all cursor-pointer text-center group"
                >
                  <Upload className="w-5 h-5 text-stone-400 group-hover:text-[#721428] mb-1 transition-colors" />
                  <span className="text-xs font-bold text-stone-700 group-hover:text-[#721428]">
                    Click to upload screenshot receipt *
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    JPG, PNG or WEBP (Max 8MB)
                  </span>
                </label>
              ) : (
                <div className="relative rounded-xl border border-stone-200 overflow-hidden bg-stone-100 p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={screenshotPreview}
                      alt="Receipt preview"
                      className="w-12 h-12 object-cover rounded-lg border border-stone-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-900 block truncate">
                        {screenshotName || 'Receipt screenshot'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Attached
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearScreenshot}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-200 transition-colors cursor-pointer"
                    title="Remove screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isDepositFormValid}
              className={`w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isDepositFormValid
                  ? 'bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white shadow-xs cursor-pointer active:scale-[0.98]'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Deposit...</span>
                </>
              ) : !selectedMethod ? (
                <span>Select Payment Method *</span>
              ) : effectiveAmount < 50 ? (
                <span>Min. Deposit is 50 ETB</span>
              ) : !referenceInput.trim() ? (
                <span>Enter Transaction Reference *</span>
              ) : !screenshotPreview ? (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Payment Screenshot *</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Submit Deposit ({formatETB(effectiveAmount)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Full Activity History Modal */}
      {showAllActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAllActivity(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-4 z-10 shadow-xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900">
                All Wallet Activity ({wallet.transactions.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAllActivity(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-gray-100 py-1 flex-1">
              {wallet.transactions.map((tx) => {
                const isDeposit = tx.type === 'deposit';
                return (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                          isDeposit
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-[#FAF0F2] text-[#721428] border-[#F0D5DA]/80'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-900 block truncate">
                          {tx.description}
                        </span>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span>{tx.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold block ${
                          isDeposit ? 'text-emerald-700' : 'text-stone-900'
                        }`}
                      >
                        {isDeposit ? `+${formatETB(tx.amountETB)}` : `−${formatETB(tx.amountETB)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAllActivity(false)}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
