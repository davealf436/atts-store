import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  Copy,
  Check,
  Upload,
  Zap,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
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
  description: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    badge: 'Instant & Most Popular',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Pay via Telebirr mobile app or *127#',
  },
  {
    id: 'cbe',
    name: 'CBE & CBE Birr',
    badge: 'Zero Transfer Fee',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Transfer via CBE Mobile Banking or CBE Birr',
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    badge: 'Commercial Bank',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Transfer via Awash Online or Mobile App',
  },
  {
    id: 'usdt',
    name: 'USDT (TRC-20 & TON)',
    badge: 'Crypto Payment',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: `Calculated at 1 USDT ≈ ${ETB_TO_USDT_RATE} ETB`,
  },
];

const PRESET_AMOUNTS = [250, 500, 1000, 2500];

export const WalletScreen: React.FC<WalletScreenProps> = ({ user, onNavigateToShop }) => {
  const [wallet, setWallet] = useState(getWalletState());
  const [showUsdt, setShowUsdt] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit'>('overview');

  // Deposit state
  const [selectedMethod, setSelectedMethod] = useState<DepositMethodId>('telebirr');
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

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 50) {
      triggerNotificationHaptic('error');
      alert('Minimum deposit amount is 50 ETB.');
      return;
    }
    if (!referenceInput.trim()) {
      triggerNotificationHaptic('error');
      alert('Please enter your transaction reference or SMS code.');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    setTimeout(() => {
      const activeMethodConfig = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
      const methodName = activeMethodConfig ? activeMethodConfig.name : 'Telebirr';

      const result = submitDeposit(
        effectiveAmount,
        methodName,
        referenceInput.trim(),
        screenshotPreview || undefined,
        user
      );

      setIsSubmitting(false);
      triggerNotificationHaptic('success');
      setSubmittedNotification({
        adminText: result.adminNotification,
        transactionId: result.transaction.id,
        amountETB: result.transaction.amountETB,
      });

      // Clear deposit inputs
      setReferenceInput('');
      handleClearScreenshot();
      setWallet(getWalletState());
    }, 700);
  };

  const handleSimulateApproval = (txId: string) => {
    triggerHaptic('medium');
    const newState = approvePendingDeposit(txId);
    setWallet(newState);
    triggerNotificationHaptic('success');
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
                  ATH Store Wallet Balance
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

        {/* 3 Quick Stats Cards in Standard Caps (Tightened) */}
        <div className="grid grid-cols-3 gap-1.5 mt-2.5">
          <div className="px-2 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80">
            <span className="text-[9.5px] font-semibold text-stone-500 block leading-tight mb-0.5">
              Available
            </span>
            <div className="text-xs font-bold text-[#721428] truncate leading-tight">
              {formatETB(wallet.balanceETB)}
            </div>
            <span className="text-[9px] text-stone-400 block truncate leading-tight mt-0.5">
              {etbToUsdt(wallet.balanceETB)}
            </span>
          </div>

          <div className="px-2 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70">
            <span className="text-[9.5px] font-semibold text-emerald-800 block leading-tight mb-0.5">
              Deposited
            </span>
            <div className="text-xs font-bold text-emerald-700 truncate leading-tight">
              {formatETB(wallet.totalDepositedETB)}
            </div>
            <span className="text-[9px] text-emerald-600/80 block truncate leading-tight mt-0.5">
              Lifetime total
            </span>
          </div>

          <div className="px-2 py-1.5 rounded-lg bg-stone-50 border border-stone-200/80">
            <span className="text-[9.5px] font-semibold text-stone-500 block leading-tight mb-0.5">
              Total Spent
            </span>
            <div className="text-xs font-bold text-stone-800 truncate leading-tight">
              {formatETB(wallet.totalSpentETB)}
            </div>
            <span className="text-[9px] text-stone-400 block truncate leading-tight mt-0.5">
              Tool checkouts
            </span>
          </div>
        </div>

        {/* Segment Tabs: Overview and Add Funds in Standard Caps */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl mt-2.5 border border-stone-200/60">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('overview');
            }}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
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
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-[#721428] text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Add Funds
          </button>
        </div>
      </div>

      {/* Admin Notification Preview Banner (if recently submitted) */}
      {submittedNotification && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Top-Up Submitted • Pending Admin Review</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmittedNotification(null)}
              className="text-amber-700 hover:text-amber-900 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-amber-800 mb-3 leading-relaxed">
            Your deposit of <strong>{formatETB(submittedNotification.amountETB)}</strong> has been registered. The admin will verify the reference code and approve your balance via the formatted command:
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
          {/* Instant 1-Second Checkout Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-[#721428]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">
                  Instant 1-Second Wallet Checkout
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                  Pre-fund your ATH Store Wallet balance once. Whenever you want TradingView, FXReplay, or Telegram Premium, choose <strong>Pay with Wallet Balance</strong> in your cart for immediate license dispatch without submitting manual payment receipts.
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
          </div>

          {/* Step 3: Verification Form */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#721428] text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
                <span>Verification Form</span>
              </h3>
            </div>

            {/* Input: Transaction Reference / SMS Code in Standard Caps */}
            <div className="mb-3">
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Transaction Reference / SMS Code <span className="text-rose-500">*</span>
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
                Paste the transaction ID received from your mobile banking SMS or confirmation receipt.
              </span>
            </div>

            {/* Screenshot Upload with Preview */}
            <div className="mb-4">
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Payment Screenshot (Optional, Accelerates Verification)
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
                    Click to upload screenshot receipt
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
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Deposit...</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Submit Deposit Verification ({formatETB(effectiveAmount)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
