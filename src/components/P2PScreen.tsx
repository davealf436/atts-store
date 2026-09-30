import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  ArrowLeftRight,
  Check,
  Copy,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Wallet,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Building2,
  Smartphone,
  Info,
  Upload,
} from 'lucide-react';
import { triggerHaptic, triggerNotificationHaptic } from '../services/telegram';
import { getWalletState, saveWalletState, formatETB } from '../services/wallet';
import {
  P2P_BUY_RATE,
  P2P_SELL_RATE,
  P2POrder,
  P2POrderType,
  P2POrderStatus,
  getP2POrders,
  createP2POrder,
} from '../services/p2p';
import { TelegramUser, WalletTransaction } from '../types';
import { SuccessCheckmarkAnimation } from './SuccessCheckmarkAnimation';

interface P2PScreenProps {
  onNavigateToWallet?: () => void;
  user?: TelegramUser;
}

type SellPayoutMethod = 'telebirr' | 'cbe' | 'awash';

interface PayoutOption {
  id: SellPayoutMethod;
  name: string;
  accountLabel: string;
  placeholder: string;
  icon: 'phone' | 'bank';
}

const PAYOUT_METHODS: PayoutOption[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    accountLabel: 'Phone Number',
    placeholder: '09XXXXXXXX',
    icon: 'phone',
  },
  {
    id: 'cbe',
    name: 'CBE',
    accountLabel: 'Account Number',
    placeholder: '1000XXXXXXXXX',
    icon: 'bank',
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    accountLabel: 'Account Number',
    placeholder: '013XXXXXXXXXXX',
    icon: 'bank',
  },
];

const BUY_PRESET_AMOUNTS = [250, 500, 1000, 2500];
const SELL_PRESET_AMOUNTS = [10, 25, 50, 100];

export const P2PScreen: React.FC<P2PScreenProps> = ({ onNavigateToWallet, user }) => {
  const [activeAction, setActiveAction] = useState<P2POrderType>('buy');
  const [wallet, setWallet] = useState(getWalletState());
  const [orders, setOrders] = useState<P2POrder[]>(getP2POrders());

  // Buy state
  const [buyAmountETB, setBuyAmountETB] = useState<string>('1000');
  const [destinationAddress, setDestinationAddress] = useState<string>('');

  // Sell state: Account Holder Full Name is always empty and never prefilled
  const [sellAmountUSDT, setSellAmountUSDT] = useState<string>('20');
  const [sellPayoutMethod, setSellPayoutMethod] = useState<SellPayoutMethod>('telebirr');
  const [sellAccountNumber, setSellAccountNumber] = useState<string>('');
  const [sellAccountName, setSellAccountName] = useState<string>('');
  const [sellTxReference, setSellTxReference] = useState<string>('');

  // Sell screenshot state
  const [sellScreenshotPreview, setSellScreenshotPreview] = useState<string | null>(null);
  const [sellScreenshotName, setSellScreenshotName] = useState<string>('');
  const sellFileInputRef = useRef<HTMLInputElement>(null);

  const handleSellFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image file is too large. Please choose an image under 8MB.');
        return;
      }
      setSellScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSellScreenshotPreview(reader.result as string);
        triggerHaptic('light');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSellScreenshot = () => {
    setSellScreenshotPreview(null);
    setSellScreenshotName('');
    if (sellFileInputRef.current) {
      sellFileInputRef.current.value = '';
    }
  };

  // UI feedback & modals
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showAllOrders, setShowAllOrders] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'buy' | 'sell' | 'pending'>('all');
  const [pendingApprovalModal, setPendingApprovalModal] = useState<P2POrder | null>(null);
  const [showBuyConfirmModal, setShowBuyConfirmModal] = useState<boolean>(false);

  // Sync wallet state and orders reactively
  useEffect(() => {
    const handleWalletUpdate = () => setWallet(getWalletState());
    const handleOrdersUpdate = () => setOrders(getP2POrders());

    window.addEventListener('ath_wallet_updated', handleWalletUpdate);
    window.addEventListener('p2p_orders_updated', handleOrdersUpdate);

    return () => {
      window.removeEventListener('ath_wallet_updated', handleWalletUpdate);
      window.removeEventListener('p2p_orders_updated', handleOrdersUpdate);
    };
  }, []);

  const handleCopy = (text: string, label: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Calculations & Validation
  const parsedBuyETB = parseFloat(buyAmountETB) || 0;
  const calculatedBuyUSDT = parsedBuyETB > 0 ? (parsedBuyETB / P2P_BUY_RATE).toFixed(2) : '0.00';
  const isExceedingBalance = parsedBuyETB > wallet.balanceETB;
  const isBuyAmountValid = parsedBuyETB >= 50 && !isExceedingBalance;
  const isBuyValid = isBuyAmountValid && destinationAddress.trim().length > 0;

  const parsedSellUSDT = parseFloat(sellAmountUSDT) || 0;
  const calculatedSellETB = parsedSellUSDT > 0 ? (parsedSellUSDT * P2P_SELL_RATE).toFixed(2) : '0.00';
  const currentPayout = PAYOUT_METHODS.find((p) => p.id === sellPayoutMethod) || PAYOUT_METHODS[0];

  // Buy submission handler (triggers confirmation modal to prevent accidental purchase)
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parsedBuyETB < 50) {
      triggerNotificationHaptic('error');
      alert('Minimum buy order is 50 ETB.');
      return;
    }

    if (parsedBuyETB > wallet.balanceETB) {
      triggerNotificationHaptic('error');
      alert(`Insufficient wallet balance. You have ${formatETB(wallet.balanceETB)} available.`);
      return;
    }

    if (!destinationAddress.trim()) {
      triggerNotificationHaptic('error');
      alert('Please enter your Binance ID or USDT destination address.');
      return;
    }

    triggerHaptic('medium');
    setShowBuyConfirmModal(true);
  };

  // Execution after user explicitly confirms in modal
  const executeBuyOrder = () => {
    setIsSubmitting(true);
    triggerHaptic('medium');

    setTimeout(() => {
      // Deduct from wallet balance
      const newBalance = wallet.balanceETB - parsedBuyETB;
      const txId = `tx-p2p-${Date.now().toString().slice(-6)}`;
      const now = new Date();
      const dateFormatted =
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' • ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newTx: WalletTransaction = {
        id: txId,
        type: 'purchase',
        amountETB: parsedBuyETB,
        amountUSDT: parseFloat(calculatedBuyUSDT),
        method: 'Wallet Balance',
        description: `P2P Buy: ${calculatedBuyUSDT} USDT`,
        date: dateFormatted,
        status: 'completed',
        reference: `BUY-${destinationAddress.slice(0, 10)}`,
      };

      const updatedWallet = {
        ...wallet,
        balanceETB: newBalance,
        totalSpentETB: wallet.totalSpentETB + parsedBuyETB,
        transactions: [newTx, ...wallet.transactions],
      };
      saveWalletState(updatedWallet);

      // Create P2P order
      const newOrder = createP2POrder({
        type: 'buy',
        amountUSDT: parseFloat(calculatedBuyUSDT),
        amountETB: parsedBuyETB,
        rate: P2P_BUY_RATE,
        paymentMethod: 'Wallet Balance',
        destinationAddress: destinationAddress.trim(),
        reference: txId,
      });

      setIsSubmitting(false);
      setShowBuyConfirmModal(false);
      triggerNotificationHaptic('success');
      setPendingApprovalModal(newOrder);
      setDestinationAddress('');
    }, 600);
  };

  // Sell submission handler
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parsedSellUSDT < 2) {
      triggerNotificationHaptic('error');
      alert('Minimum sell order is 2 USDT.');
      return;
    }

    if (!sellAccountNumber.trim()) {
      triggerNotificationHaptic('error');
      alert('Please enter your receiving account / phone number.');
      return;
    }

    if (!sellAccountName.trim()) {
      triggerNotificationHaptic('error');
      alert('Please enter the recipient account name.');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    setTimeout(() => {
      const selectedPayout = PAYOUT_METHODS.find((p) => p.id === sellPayoutMethod);
      const newOrder = createP2POrder({
        type: 'sell',
        amountUSDT: parsedSellUSDT,
        amountETB: parseFloat(calculatedSellETB),
        rate: P2P_SELL_RATE,
        paymentMethod: selectedPayout?.name || 'Telebirr',
        accountNumber: sellAccountNumber.trim(),
        accountName: sellAccountName.trim(),
        reference: sellTxReference.trim() || undefined,
        screenshot: sellScreenshotPreview || undefined,
      });

      setIsSubmitting(false);
      triggerNotificationHaptic('success');
      setPendingApprovalModal(newOrder);
      setSellAccountNumber('');
      setSellTxReference('');
      handleClearSellScreenshot();
    }, 700);
  };

  const getStatusBadge = (status: P2POrderStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'buy') return o.type === 'buy';
    if (orderFilter === 'sell') return o.type === 'sell';
    if (orderFilter === 'pending') return o.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Main Exchange Desk Card (Matches Wallet Screen Card Architecture) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
        {/* Burgundy Card Display */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#721428] via-[#5A0E1E] to-[#3B0712] p-4 text-white shadow-md">
          {/* Subtle gold grid overlay matching Wallet card */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #C59F43 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10">
            {/* Header: Title & Subtitle on left, P2P/Exchange Icon Badge on right */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  Exchange Desk
                </h1>
                <p className="text-xs text-white/80 font-medium mt-0.5">
                  Buy or sell USDT with ETB.
                </p>
              </div>

              {/* P2P / Exchange Icon Badge (Matches Wallet icon style) */}
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                <ArrowLeftRight className="w-5 h-5 stroke-[2]" />
              </div>
            </div>

            {/* Clean Compact Rate Row (Exchange Terminal Style) */}
            <div className="mt-3.5 bg-black/25 backdrop-blur-xs rounded-xl border border-white/15 overflow-hidden shadow-xs">
              <div className="grid grid-cols-2 divide-x divide-white/15">
                {/* BUY USDT Column */}
                <div className="py-2.5 px-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/90">
                    BUY USDT
                  </span>
                  <div className="text-base sm:text-lg font-black text-white tracking-tight tabular-nums mt-0.5 leading-tight">
                    {P2P_BUY_RATE.toFixed(2)} <span className="text-xs font-bold text-white/80">ETB</span>
                  </div>
                  <span className="text-[10px] text-white/60 font-medium mt-0.5">
                    1 USDT
                  </span>
                </div>

                {/* SELL USDT Column */}
                <div className="py-2.5 px-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90">
                    SELL USDT
                  </span>
                  <div className="text-base sm:text-lg font-black text-white tracking-tight tabular-nums mt-0.5 leading-tight">
                    {P2P_SELL_RATE.toFixed(2)} <span className="text-xs font-bold text-white/80">ETB</span>
                  </div>
                  <span className="text-[10px] text-white/60 font-medium mt-0.5">
                    1 USDT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segment Tabs: Buy USDT and Sell USDT with Burgundy Active UI */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl mt-3 border border-stone-200/60">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveAction('buy');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeAction === 'buy'
                ? 'bg-[#721428] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ArrowDownLeft className={`w-3.5 h-3.5 ${activeAction === 'buy' ? 'text-white' : 'text-stone-400'}`} />
            <span>Buy USDT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveAction('sell');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeAction === 'sell'
                ? 'bg-[#721428] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ArrowUpRight className={`w-3.5 h-3.5 ${activeAction === 'sell' ? 'text-white' : 'text-stone-400'}`} />
            <span>Sell USDT</span>
          </button>
        </div>
      </div>

      {/* 3. Buy USDT Form */}
      {activeAction === 'buy' && (
        <form onSubmit={handleBuySubmit} className="space-y-3.5 animate-in fade-in-50 duration-150">
          {/* Card: Payment Method (Wallet Balance only) & Amount */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            {/* Payment Method Notice */}
            <div className="mb-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold block">
                    Payment Method
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    Wallet Balance only
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-500 font-semibold block">
                  Available
                </span>
                <span className="text-xs font-bold text-[#721428]">
                  {formatETB(wallet.balanceETB)}
                </span>
              </div>
            </div>

            {/* If balance is lower than entered amount */}
            {isExceedingBalance && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs animate-in fade-in-50 duration-150">
                <div className="flex items-center gap-1.5 min-w-0">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-rose-800">
                    Insufficient balance ({formatETB(wallet.balanceETB)})
                  </span>
                </div>
                {onNavigateToWallet && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onNavigateToWallet();
                    }}
                    className="text-[11px] font-bold text-[#721428] hover:underline underline-offset-2 shrink-0 cursor-pointer ml-2 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
                  >
                    Top Up →
                  </button>
                )}
              </div>
            )}

            {/* Quick Presets */}
            <div className="mb-2.5">
              <label className="text-[10.5px] font-semibold text-stone-600 block mb-1">
                Quick Select Amount (ETB):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BUY_PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setBuyAmountETB(amt.toString());
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      buyAmountETB === amt.toString()
                        ? 'bg-[#721428] text-white border-[#721428] shadow-xs scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{amt}</span>
                    <span className="block text-[9px] font-medium opacity-80">ETB</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10.5px] font-semibold text-stone-700">
                  Enter ETB Amount
                </label>
                {wallet.balanceETB > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setBuyAmountETB(wallet.balanceETB.toString());
                    }}
                    className="text-[10.5px] font-bold text-[#721428] hover:underline cursor-pointer"
                  >
                    Use Max ({formatETB(wallet.balanceETB)})
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  value={buyAmountETB}
                  onChange={(e) => setBuyAmountETB(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 1000"
                  className="w-full h-11 px-3.5 pr-16 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-sm font-bold text-stone-900 transition-colors"
                />
                <span className="absolute right-3.5 text-xs font-bold text-stone-400">
                  ETB
                </span>
              </div>
            </div>

            {/* Calculated USDT Output */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <span className="text-xs text-stone-600 font-medium">
                You Receive:
              </span>
              <div className="text-right">
                <span className="text-base font-black text-emerald-700 tracking-tight">
                  {calculatedBuyUSDT} USDT
                </span>
                <span className="text-[10px] text-stone-400 block">
                  @ {P2P_BUY_RATE.toFixed(2)} ETB/USDT
                </span>
              </div>
            </div>
          </div>

          {/* Card: Receiving USDT Destination Address */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <h3 className="text-xs font-bold text-gray-900 mb-2">
              USDT Destination
            </h3>
            <div>
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Binance ID or TRC-20 Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="e.g. Binance Pay ID: 874067761 or T..."
                className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-xs font-medium text-stone-900 transition-colors"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                USDT will be credited to this address after approval.
              </span>
            </div>

            {/* Submit Buy Button */}
            <button
              type="submit"
              disabled={!isBuyValid || isSubmitting}
              className={`mt-4 w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                isBuyValid && !isSubmitting
                  ? 'bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Buy Order...</span>
                </>
              ) : isExceedingBalance ? (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Insufficient balance</span>
                </>
              ) : parsedBuyETB < 50 ? (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Min. Buy is 50 ETB</span>
                </>
              ) : !destinationAddress.trim() ? (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Enter Destination Address</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Buy {calculatedBuyUSDT} USDT ({formatETB(parsedBuyETB)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 4. Sell USDT Form */}
      {activeAction === 'sell' && (
        <form onSubmit={handleSellSubmit} className="space-y-3.5 animate-in fade-in-50 duration-150">
          {/* Card: Amount to Sell */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            {/* Quick Presets */}
            <div className="mb-2.5">
              <label className="text-[10.5px] font-semibold text-stone-600 block mb-1">
                Quick Select Amount (USDT):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SELL_PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSellAmountUSDT(amt.toString());
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      sellAmountUSDT === amt.toString()
                        ? 'bg-[#721428] text-white border-[#721428] shadow-xs scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{amt}</span>
                    <span className="block text-[9px] font-medium opacity-80">USDT</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enter USDT Amount */}
            <div className="mb-3">
              <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                Enter USDT Amount to Sell
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  value={sellAmountUSDT}
                  onChange={(e) => setSellAmountUSDT(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="e.g. 20"
                  className="w-full h-11 px-3.5 pr-20 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-sm font-bold text-stone-900 transition-colors"
                />
                <span className="absolute right-3.5 text-xs font-bold text-stone-400">
                  USDT
                </span>
              </div>
            </div>

            {/* Calculated ETB Output */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <span className="text-xs text-stone-600 font-medium">
                You Receive:
              </span>
              <div className="text-right">
                <span className="text-base font-black text-[#721428] tracking-tight">
                  {formatETB(parseFloat(calculatedSellETB) || 0)}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  @ {P2P_SELL_RATE.toFixed(2)} ETB/USDT
                </span>
              </div>
            </div>
          </div>

          {/* Card: Receiving Method & Account Details */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
            <h3 className="text-xs font-bold text-gray-900 mb-2">
              Receive Payment Via
            </h3>

            {/* Payout method selector */}
            <div className="grid grid-cols-3 gap-2 mb-3.5">
              {PAYOUT_METHODS.map((method) => {
                const isSelected = sellPayoutMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSellPayoutMethod(method.id);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#721428] bg-[#FAF0F2]/80 text-[#721428] ring-1 ring-[#721428] shadow-xs'
                        : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {method.icon === 'phone' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-bold block">{method.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Account / Phone input (Dynamic receiving details) */}
            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                  {currentPayout.accountLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sellAccountNumber}
                  onChange={(e) => setSellAccountNumber(e.target.value)}
                  placeholder={currentPayout.placeholder}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-xs font-medium text-stone-900 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-semibold text-stone-700 block mb-1">
                  Account Holder Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sellAccountName}
                  onChange={(e) => setSellAccountName(e.target.value)}
                  placeholder="Enter account holder full name"
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-[#721428] focus:outline-none text-xs font-medium text-stone-900 transition-colors"
                />
              </div>
            </div>

            {/* Transfer USDT Desk Destination */}
            <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10.5px] font-bold text-stone-800 block mb-1.5">
                Send USDT to Desk:
              </span>
              <div className="flex items-center justify-between text-xs py-1">
                <div>
                  <span className="text-[10px] text-stone-500 block">Binance Pay ID:</span>
                  <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                    874067761
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    Name: ABYSSINIAVENDOR
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('874067761', 'binance_id')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    copiedItem === 'binance_id'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#721428] hover:bg-[#5A0E1E] text-white active:scale-95'
                  }`}
                >
                  {copiedItem === 'binance_id' ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tx Reference */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/80">
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  Transaction Reference / Order ID:
                </label>
                <input
                  type="text"
                  value={sellTxReference}
                  onChange={(e) => setSellTxReference(e.target.value)}
                  placeholder="e.g. Binance Order # or TxID"
                  className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-white focus:border-[#721428] focus:outline-none text-xs font-medium text-stone-900"
                />
              </div>

              {/* Upload Payment Screenshot Feature */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/80">
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  Upload Payment Screenshot:
                </label>

                <input
                  type="file"
                  ref={sellFileInputRef}
                  onChange={handleSellFileChange}
                  accept="image/*"
                  className="hidden"
                  id="sell-payment-screenshot-upload"
                />

                {!sellScreenshotPreview ? (
                  <label
                    htmlFor="sell-payment-screenshot-upload"
                    className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-stone-200 hover:border-[#721428] rounded-xl bg-white hover:bg-[#FAF0F2]/40 transition-all cursor-pointer text-center group"
                  >
                    <Upload className="w-4 h-4 text-stone-400 group-hover:text-[#721428] mb-1 transition-colors" />
                    <span className="text-xs font-bold text-stone-700 group-hover:text-[#721428]">
                      Click to upload transfer screenshot
                    </span>
                    <span className="text-[9.5px] text-stone-400 mt-0.5">
                      JPG, PNG or WEBP (Max 8MB)
                    </span>
                  </label>
                ) : (
                  <div className="relative rounded-xl border border-stone-200 overflow-hidden bg-white p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={sellScreenshotPreview}
                        alt="Transfer receipt"
                        className="w-11 h-11 object-cover rounded-lg border border-stone-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-900 block truncate">
                          {sellScreenshotName || 'Payment receipt'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSellScreenshot}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Remove screenshot"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Sell Button */}
            <button
              type="submit"
              disabled={isSubmitting || parsedSellUSDT <= 0}
              className="mt-4 w-full h-11 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Sell Order...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sell {parsedSellUSDT} USDT ({formatETB(parseFloat(calculatedSellETB) || 0)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 5. Recent Activity Section with View All → */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 select-none">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-gray-900 tracking-tight">
              Recent Activity
            </h3>
            <span className="text-[10px] text-gray-500 font-medium">
              Your Exchange Desk buy and sell orders
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowAllOrders(true);
            }}
            className="text-xs font-bold text-[#721428] hover:text-[#5A0E1E] transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-6 text-center text-stone-400 text-xs">
            No Exchange Desk activity yet.
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between transition-colors hover:bg-stone-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      order.type === 'buy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {order.type === 'buy' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">
                        {order.type === 'buy' ? 'Buy USDT' : 'Sell USDT'}
                      </span>
                      <span className="text-[10.5px] text-stone-400 font-mono">
                        #{order.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {order.date} • {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-bold text-stone-900">
                    {order.type === 'buy' ? '+' : '-'}
                    {order.amountUSDT.toFixed(2)} USDT
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] text-stone-500 font-medium">
                      {formatETB(order.amountETB)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal 0: Confirm Buy USDT Purchase (Prevents accidental purchase) */}
      {showBuyConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => !isSubmitting && setShowBuyConfirmModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-5 z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 select-none">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  Confirm USDT Purchase
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Review transaction details before confirming
                </p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  triggerHaptic('light');
                  setShowBuyConfirmModal(false);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Details summary */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs mb-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">You Pay:</span>
                <span className="font-bold text-[#721428] text-sm tabular-nums">
                  {formatETB(parsedBuyETB)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">You Receive:</span>
                <span className="font-bold text-emerald-700 text-sm tabular-nums">
                  {calculatedBuyUSDT} USDT
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200/80">
                <span className="text-stone-500 font-medium">Exchange Rate:</span>
                <span className="font-medium text-stone-700">
                  1 USDT = {P2P_BUY_RATE.toFixed(2)} ETB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Payment Source:</span>
                <span className="font-semibold text-stone-900">
                  Wallet Balance
                </span>
              </div>

              <div className="pt-1 border-t border-stone-200/80">
                <span className="text-[10px] text-stone-500 font-medium block mb-1">
                  Recipient Destination (Binance ID / USDT):
                </span>
                <span className="font-mono font-bold text-stone-900 text-xs break-all bg-white px-2.5 py-1.5 rounded-lg border border-stone-200 block">
                  {destinationAddress.trim()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200/80">
                <span className="text-stone-500 font-medium">Balance After:</span>
                <span className="font-semibold text-stone-700 tabular-nums">
                  {formatETB(wallet.balanceETB - parsedBuyETB)}
                </span>
              </div>
            </div>

            {/* Confirmation Alert Note */}
            <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Funds will be deducted immediately from your wallet. Please verify your address carefully.
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  triggerHaptic('light');
                  setShowBuyConfirmModal(false);
                }}
                className="py-2.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={executeBuyOrder}
                className="py-2.5 px-3 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 text-center"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Confirm & Buy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Pending Admin Approval Confirmation */}
      {pendingApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setPendingApprovalModal(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-5 z-10 shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Subtle Animated Checkmark Feedback */}
            <div className="mb-2">
              <SuccessCheckmarkAnimation
                size="md"
                color="emerald"
                title="Order Submitted Successfully!"
                subtitle={`Pending admin verification for your ${pendingApprovalModal.type === 'buy' ? 'Buy' : 'Sell'} order`}
              />
            </div>

            {/* Order Details summary */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs mb-4 mt-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold text-stone-900">
                  #{pendingApprovalModal.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Order Type:</span>
                <span className="font-bold text-stone-900">
                  {pendingApprovalModal.type === 'buy' ? 'Buy USDT' : 'Sell USDT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount USDT:</span>
                <span className="font-bold text-emerald-700">
                  {pendingApprovalModal.amountUSDT.toFixed(2)} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount ETB:</span>
                <span className="font-bold text-[#721428]">
                  {formatETB(pendingApprovalModal.amountETB)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Method:</span>
                <span className="font-semibold text-stone-900">
                  {pendingApprovalModal.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <div>{getStatusBadge(pendingApprovalModal.status)}</div>
              </div>
              {pendingApprovalModal.screenshot && (
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/80">
                  <span className="text-stone-500">Screenshot:</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setPendingApprovalModal(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: View All Recent Activity History */}
      {showAllOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAllOrders(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-4 z-10 shadow-xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Exchange Desk Order History</h3>
                <span className="text-[10px] text-gray-500">
                  {orders.length} total recorded orders
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAllOrders(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-lg my-3 border border-stone-200/60">
              {(['all', 'buy', 'sell', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setOrderFilter(filter);
                  }}
                  className={`py-1 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                    orderFilter === filter
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Orders list */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-0.5">
              {filteredOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  No orders match this filter.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            order.type === 'buy' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-stone-900">
                          {order.type === 'buy' ? 'Buy USDT' : 'Sell USDT'}
                        </span>
                        <span className="text-[10.5px] font-mono text-stone-500">
                          #{order.id}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">
                        {order.amountUSDT.toFixed(2)} USDT
                      </span>
                      <span className="font-bold text-[#721428]">
                        {formatETB(order.amountETB)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-200/50 pt-1">
                      <span>{order.paymentMethod}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAllOrders(false)}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
