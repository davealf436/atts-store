import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  QrCode,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Send,
  Zap,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronRight,
  ExternalLink,
  Info,
  AlertCircle,
  FileImage,
  X
} from 'lucide-react';
import { TelegramUser, WalletTransaction } from '../types';
import {
  getWalletState,
  saveWalletState,
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

interface PaymentMethodConfig {
  id: DepositMethodId;
  name: string;
  badge: string;
  badgeColor: string;
  color: string;
  details: {
    label: string;
    value: string;
    copyValue: string;
  }[];
  instructions: string;
  qrValue: string;
}

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    badge: 'Instant & Most Popular',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: '#0072BC',
    details: [
      { label: 'Mobile Phone', value: '+251 98 457 2019', copyValue: '0984572019' },
      { label: 'Merchant / Till Code', value: '849201', copyValue: '849201' },
      { label: 'Account Name', value: 'Abyssinia Trading Hub', copyValue: 'Abyssinia Trading Hub' },
    ],
    instructions: 'Send via Telebirr app or *127# to the phone or merchant code above, then submit the Telebirr SMS transaction ID below.',
    qrValue: 'telebirr://pay?receiver=0984572019&name=AbyssiniaTradingHub',
  },
  {
    id: 'cbe',
    name: 'CBE & CBE Birr',
    badge: 'Zero Transfer Fee',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    color: '#6F2C91',
    details: [
      { label: 'CBE Account Number', value: '1000482910482', copyValue: '1000482910482' },
      { label: 'CBE Birr Phone', value: '0984572019', copyValue: '0984572019' },
      { label: 'Account Holder', value: 'Abyssinia Trading Hub / Dave Alf', copyValue: 'Dave Alf' },
    ],
    instructions: 'Transfer via Commercial Bank of Ethiopia (CBE Mobile App / CBE Birr) and provide the 12-digit transaction sequence code.',
    qrValue: 'cbe://transfer?account=1000482910482&name=AbyssiniaTradingHub',
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    badge: 'Commercial Bank',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    color: '#005596',
    details: [
      { label: 'Awash Account Number', value: '01304892184900', copyValue: '01304892184900' },
      { label: 'Account Name', value: 'Abyssinia Trading Hub', copyValue: 'Abyssinia Trading Hub' },
      { label: 'Branch', value: 'Bole Medhanialem, Addis Ababa', copyValue: 'Bole Medhanialem' },
    ],
    instructions: 'Transfer to our Awash Bank account and enter the reference number shown on your mobile banking confirmation receipt.',
    qrValue: 'awash://transfer?account=01304892184900&name=AbyssiniaTradingHub',
  },
  {
    id: 'usdt',
    name: 'USDT (TRC-20 & TON)',
    badge: 'Crypto Traders',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    color: '#26A17B',
    details: [
      { label: 'TRC-20 (Tron) Address', value: 'TJ7xK8mP2Q9vL5rW1aBcDeFgHiJkLmNoPq', copyValue: 'TJ7xK8mP2Q9vL5rW1aBcDeFgHiJkLmNoPq' },
      { label: 'TON Network Address', value: 'EQB_ATH_Trading_Hub_TonWalletAddressXYZ987', copyValue: 'EQB_ATH_Trading_Hub_TonWalletAddressXYZ987' },
      { label: 'Current Exchange Rate', value: `1 USDT = ${ETB_TO_USDT_RATE} ETB`, copyValue: '140' },
    ],
    instructions: 'Send USDT on TRC-20 or TON network. Rate calculated automatically. Provide your Transaction Hash (TxHash) below.',
    qrValue: 'tron:TJ7xK8mP2Q9vL5rW1aBcDeFgHiJkLmNoPq?token=USDT',
  },
];

const PRESET_AMOUNTS = [250, 500, 1000, 2500];

export const WalletScreen: React.FC<WalletScreenProps> = ({ user, onNavigateToShop }) => {
  const [wallet, setWallet] = useState(getWalletState());
  const [showUsdt, setShowUsdt] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'history'>('overview');
  
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
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [submittedNotification, setSubmittedNotification] = useState<{
    adminText: string;
    transaction: WalletTransaction;
  } | null>(null);

  // History filtering
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposits' | 'purchases'>('all');
  const [inspectTx, setInspectTx] = useState<WalletTransaction | null>(null);

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
      const methodName = activeMethodConfig ? activeMethodConfig.name : 'Ethiopian Banking';

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
        transaction: result.transaction,
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
    if (submittedNotification && submittedNotification.transaction.id === txId) {
      setSubmittedNotification(null);
    }
    if (inspectTx && inspectTx.id === txId) {
      setInspectTx((prev) => (prev ? { ...prev, status: 'completed' } : null));
    }
  };

  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0];

  const filteredTransactions = wallet.transactions.filter((tx) => {
    if (historyFilter === 'deposits') return tx.type === 'deposit';
    if (historyFilter === 'purchases') return tx.type === 'purchase';
    return true;
  });

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Header Overview & Navigation Pills */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
        {/* User Account Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#721428] to-[#470A17] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              {user.first_name ? user.first_name[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none mb-1">
                <span className="text-xs font-bold text-gray-900 truncate">
                  {user.username ? `@${user.username}` : user.first_name}
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Connected</span>
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <span>Telegram ID:</span>
                <span className="font-semibold text-gray-600">{user.id}</span>
                <button
                  onClick={() => handleCopy(user.id.toString(), 'user-id')}
                  className="hover:text-gray-900 transition-colors p-0.5"
                  title="Copy Telegram ID"
                >
                  {copiedItem === 'user-id' ? (
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Support / Bot helper */}
          <button
            onClick={() => {
              triggerHaptic('light');
              openTelegramSupport();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Open Telegram Support"
          >
            <Send className="w-3 h-3 text-[#721428]" />
            <span className="hidden xs:inline">Support</span>
          </button>
        </div>

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
                <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#F0D5DA]/90">
                  Available ATH Balance
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setShowUsdt(!showUsdt);
                  }}
                  className="text-[10px] text-white/70 hover:text-white inline-flex items-center gap-1 transition-colors"
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
                <div className="mt-1 text-xs font-semibold text-[#F7D388] flex items-center gap-1.5">
                  <span>≈ {etbToUsdt(wallet.balanceETB)}</span>
                  <span className="text-[10px] text-white/60 font-normal">
                    (@ 1 USDT = {ETB_TO_USDT_RATE} ETB)
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
          <div className="relative z-10 grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => {
                triggerHaptic('medium');
                setActiveTab('deposit');
              }}
              className="py-2 px-3 rounded-lg bg-white text-[#721428] hover:bg-stone-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Top-Up Balance</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                onNavigateToShop();
              }}
              className="py-2 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#F7D388]" />
              <span>Spend in Store</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Stats Cards: Available Balance, Total Deposited, Total Spent */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
              Available
            </span>
            <div className="text-xs font-black text-[#721428] truncate">
              {formatETB(wallet.balanceETB)}
            </div>
            <span className="text-[9px] text-stone-400 block truncate">
              {etbToUsdt(wallet.balanceETB)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
            <span className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
              Deposited
            </span>
            <div className="text-xs font-black text-emerald-700 truncate">
              {formatETB(wallet.totalDepositedETB)}
            </div>
            <span className="text-[9px] text-emerald-600/80 block truncate">
              Lifetime total
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
              Total Spent
            </span>
            <div className="text-xs font-black text-stone-800 truncate">
              {formatETB(wallet.totalSpentETB)}
            </div>
            <span className="text-[9px] text-stone-400 block truncate">
              Instant checkouts
            </span>
          </div>
        </div>

        {/* Segment Tabs: Overview, Deposit / Top-Up, Activity History */}
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl mt-3 border border-stone-200/60">
          <button
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
            Deposit ETB
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('history');
            }}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Activity ({wallet.transactions.length})
          </button>
        </div>
      </div>

      {/* 2. Admin Notification Preview Banner (if recently submitted) */}
      {submittedNotification && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Top-Up Submitted • Pending Admin Review</span>
            </div>
            <button
              onClick={() => setSubmittedNotification(null)}
              className="text-amber-700 hover:text-amber-900 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-amber-800 mb-3 leading-relaxed">
            Your deposit of <strong>{formatETB(submittedNotification.transaction.amountETB)}</strong> has been registered. The admin will verify the SMS/Reference and approve your balance via the formatted command:
          </p>

          {/* Formatted Admin Command Code block */}
          <div className="bg-stone-900 text-stone-100 rounded-xl p-3 font-mono text-[11px] relative mb-3 overflow-x-auto border border-stone-800">
            <div className="text-[10px] text-[#F7D388] uppercase tracking-wider mb-1 font-bold">
              Admin Telegram Notification &amp; Command:
            </div>
            <div className="whitespace-pre-wrap select-all">
              {submittedNotification.adminText.replace(/<[^>]*>?/gm, '')}
            </div>
            <button
              onClick={() =>
                handleCopy(
                  submittedNotification.adminText.replace(/<[^>]*>?/gm, ''),
                  'admin-text'
                )
              }
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] font-sans font-bold text-white flex items-center gap-1 border border-stone-700 transition-colors"
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
              onClick={() => handleSimulateApproval(submittedNotification.transaction.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Admin Approval (/send)</span>
            </button>
            <button
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

      {/* 3. Tab: Overview Screen Perks */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
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
                  Pre-fund your ATH wallet once via Telebirr or CBE. Whenever you want TradingView, FXReplay, or Telegram Premium, tap <strong>'Pay with Wallet Balance'</strong> for zero wait time and automatic license activation.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveTab('deposit');
                    }}
                    className="py-2 px-3 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Deposit Now</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onNavigateToShop();
                    }}
                    className="py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ethiopian Payment Methods Supported Banner */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Supported Deposit Gateways
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Zero Fees
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMethod(method.id);
                    setActiveTab('deposit');
                  }}
                  className="p-3 rounded-xl border border-gray-200/80 bg-gray-50/60 hover:bg-[#FAF0F2]/50 hover:border-[#F0D5DA] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-gray-900 group-hover:text-[#721428] transition-colors">
                      {method.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#721428] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${method.badgeColor}`}>
                    {method.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity snippet on Overview */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Recent Activity
              </h3>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('history');
                }}
                className="text-xs font-bold text-[#721428] hover:underline"
              >
                View All
              </button>
            </div>

            {wallet.transactions.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {wallet.transactions.slice(0, 3).map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    onInspect={() => setInspectTx(tx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Tab: Deposit / Top-Up Flow */}
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
              <span className="text-[10.5px] font-bold text-stone-500">
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
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
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
              <label className="text-[10.5px] font-bold text-stone-500 block mb-1">
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

            {/* Live conversion info */}
            <div className="mt-2.5 p-2 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-between text-[11px]">
              <span className="text-stone-600 font-medium">Deposit Value:</span>
              <span className="font-extrabold text-[#721428]">
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

            {/* Method selection pills */}
            <div className="grid grid-cols-2 gap-2 mb-3">
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
                    <span className="text-[9.5px] text-stone-500 block truncate">{m.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Account Details Box with One-Click Copy & QR Code */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-[#721428]">
                    {activeMethod.name} Transfer Details
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowQrModal(true);
                  }}
                  className="px-2 py-1 rounded-md bg-white hover:bg-stone-100 border border-stone-200 text-[10.5px] font-bold text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3 h-3 text-[#721428]" />
                  <span>Show QR</span>
                </button>
              </div>

              {/* Detail fields */}
              <div className="space-y-2">
                {activeMethod.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/70"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider block">
                        {detail.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-900 select-all break-all">
                        {detail.value}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(detail.copyValue, `${activeMethod.id}-${idx}`)}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-[#FAF0F2] text-[#721428] font-bold text-[10.5px] flex items-center gap-1 shrink-0 border border-stone-200 transition-colors cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedItem === `${activeMethod.id}-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[10.5px] text-stone-500 leading-relaxed pt-1">
                {activeMethod.instructions}
              </p>
            </div>
          </div>

          {/* Step 3: Deposit Verification Form */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#721428] text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
                <span>Verification Form</span>
              </h3>
            </div>

            {/* Input: Transaction Reference / SMS Code */}
            <div className="mb-3">
              <label className="text-[10.5px] font-bold text-stone-700 block mb-1">
                Transaction Reference / SMS Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="e.g. TLB8291049, CBE0192840, or TxHash"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Paste the transaction ID received from Telebirr, CBE SMS, or blockchain explorer.
              </span>
            </div>

            {/* Screenshot Upload with Preview */}
            <div className="mb-4">
              <label className="text-[10.5px] font-bold text-stone-700 block mb-1">
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

      {/* 5. Tab: Activity & Transaction History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Wallet History
            </h3>

            {/* History Filter Chips */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/60">
              {(['all', 'deposits', 'purchases'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    triggerHaptic('light');
                    setHistoryFilter(filter);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    historyFilter === filter
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-stone-400">
              <Clock className="w-7 h-7 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-stone-700">No activity matching filter</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Top-up your balance or make instant purchases to populate your ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onInspect={() => setInspectTx(tx)}
                  onSimulateApprove={() => handleSimulateApproval(tx.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowQrModal(false)}
          />
          <div className="relative w-full max-w-[310px] bg-white rounded-2xl border border-stone-200 p-5 z-10 text-center shadow-xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#721428] block mb-1">
              Scan with {activeMethod.name} App
            </span>
            <h4 className="text-sm font-bold text-stone-900 mb-3">
              Abyssinia Trading Hub
            </h4>

            {/* SVG QR Code Simulation */}
            <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs inline-block mb-3">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="white" />
                {/* 3 Corner locator boxes */}
                <rect x="5" y="5" width="26" height="26" fill="#1C1917" rx="2" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="1" />
                <rect x="13" y="13" width="10" height="10" fill="#721428" rx="1" />

                <rect x="69" y="5" width="26" height="26" fill="#1C1917" rx="2" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="1" />
                <rect x="77" y="13" width="10" height="10" fill="#721428" rx="1" />

                <rect x="5" y="69" width="26" height="26" fill="#1C1917" rx="2" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="1" />
                <rect x="13" y="77" width="10" height="10" fill="#721428" rx="1" />

                {/* Random decorative QR data blocks */}
                <rect x="36" y="8" width="8" height="8" fill="#1C1917" />
                <rect x="48" y="14" width="8" height="8" fill="#721428" />
                <rect x="36" y="24" width="6" height="6" fill="#1C1917" />
                <rect x="46" y="26" width="10" height="6" fill="#1C1917" />

                <rect x="10" y="38" width="6" height="8" fill="#1C1917" />
                <rect x="22" y="42" width="8" height="6" fill="#1C1917" />
                <rect x="34" y="38" width="8" height="8" fill="#721428" />
                <rect x="46" y="44" width="8" height="8" fill="#1C1917" />
                <rect x="58" y="38" width="8" height="8" fill="#1C1917" />
                <rect x="70" y="44" width="6" height="6" fill="#721428" />
                <rect x="82" y="38" width="8" height="6" fill="#1C1917" />

                <rect x="36" y="54" width="8" height="8" fill="#1C1917" />
                <rect x="48" y="58" width="8" height="8" fill="#721428" />
                <rect x="60" y="54" width="6" height="6" fill="#1C1917" />

                <rect x="36" y="70" width="8" height="6" fill="#1C1917" />
                <rect x="48" y="74" width="8" height="8" fill="#1C1917" />
                <rect x="62" y="70" width="8" height="8" fill="#721428" />
                <rect x="76" y="74" width="14" height="8" fill="#1C1917" />
              </svg>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              Scan in the banking app to auto-fill recipient details.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Transaction Detail Inspector Modal */}
      {inspectTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInspectTx(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-5 z-10 shadow-xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setInspectTx(null)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`p-2 rounded-xl ${
                  inspectTx.type === 'deposit'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-[#FAF0F2] text-[#721428]'
                }`}
              >
                {inspectTx.type === 'deposit' ? (
                  <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                )}
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {inspectTx.type === 'deposit' ? 'Deposit Details' : 'Purchase Details'}
                </h4>
                <span className="text-[11px] text-stone-500">{inspectTx.date}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs mb-3">
              <div className="flex justify-between">
                <span className="text-stone-500">Amount (ETB)</span>
                <span className="font-bold text-stone-900">{formatETB(inspectTx.amountETB)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">USDT Equivalent</span>
                <span className="font-mono text-stone-700">≈ {etbToUsdt(inspectTx.amountETB)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Method</span>
                <span className="font-bold text-stone-900">{inspectTx.method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Status</span>
                <StatusBadge status={inspectTx.status} />
              </div>
              {inspectTx.reference && (
                <div className="flex justify-between items-center pt-1 border-t border-stone-200/70">
                  <span className="text-stone-500">Reference</span>
                  <span className="font-mono text-[11px] font-bold text-[#721428]">
                    {inspectTx.reference}
                  </span>
                </div>
              )}
            </div>

            {/* Screenshot if available */}
            {inspectTx.screenshotUrl && (
              <div className="mb-3">
                <span className="text-[10.5px] font-bold text-stone-600 block mb-1">
                  Attached Receipt:
                </span>
                <img
                  src={inspectTx.screenshotUrl}
                  alt="Receipt"
                  className="w-full max-h-40 object-cover rounded-xl border border-stone-200"
                />
              </div>
            )}

            {/* Admin Command String */}
            {inspectTx.adminCommand && inspectTx.status === 'pending' && (
              <div className="mb-3 p-2.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-[10.5px]">
                <div className="text-[9.5px] text-[#F7D388] uppercase tracking-wider mb-1 font-bold">
                  Admin Verification Command:
                </div>
                <div className="select-all break-all">{inspectTx.adminCommand}</div>
                <button
                  onClick={() => handleSimulateApproval(inspectTx.id)}
                  className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Execute /send Approval</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setInspectTx(null)}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Transaction Row
interface TransactionRowProps {
  tx: WalletTransaction;
  onInspect: () => void;
  onSimulateApprove?: () => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ tx, onInspect, onSimulateApprove }) => {
  const isDeposit = tx.type === 'deposit';

  return (
    <div
      onClick={onInspect}
      className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:shadow-2xs transition-all flex items-center justify-between gap-3 cursor-pointer group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
            isDeposit
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-[#FAF0F2] text-[#721428] border-[#F0D5DA]'
          }`}
        >
          {isDeposit ? (
            <ArrowDownLeft className="w-4 h-4 stroke-[2.2]" />
          ) : (
            <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-bold text-stone-900 group-hover:text-[#721428] transition-colors truncate">
              {tx.description}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <span>{tx.date}</span>
            <span>•</span>
            <span className="font-medium text-stone-600">{tx.method}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div
          className={`text-xs font-black leading-tight ${
            isDeposit ? 'text-emerald-700' : 'text-stone-900'
          }`}
        >
          {isDeposit ? `+${formatETB(tx.amountETB)}` : `-${formatETB(tx.amountETB)}`}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1">
          <StatusBadge status={tx.status} />
          {tx.status === 'pending' && onSimulateApprove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSimulateApprove();
              }}
              className="text-[9px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200"
              title="Quick approve"
            >
              /send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Live Status Badge
const StatusBadge: React.FC<{ status: 'completed' | 'pending' | 'failed' }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
        <CheckCircle2 className="w-2.5 h-2.5" />
        <span>Completed</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>Pending Review</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
      <XCircle className="w-2.5 h-2.5" />
      <span>Failed</span>
    </span>
  );
};

// Arrow icon helper
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
