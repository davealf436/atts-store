import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  RefreshCw,
  Key,
  Copy,
  Check
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { triggerHaptic, triggerNotificationHaptic, openTelegramSupport } from '../services/telegram';
import { getWalletState, formatETB, etbToUsdt, instantWalletPurchase } from '../services/wallet';
import { saveOrder } from '../services/orders';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBrowseProducts: () => void;
  onClearCart?: () => void;
  onNavigateToWallet?: () => void;
  onViewOrders?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onBrowseProducts,
  onClearCart,
  onNavigateToWallet,
  onViewOrders,
}) => {
  const [wallet, setWallet] = useState(getWalletState());
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    totalPaid: number;
    itemsCount: number;
    generatedKey: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setWallet(getWalletState());
    };
    window.addEventListener('ath_wallet_updated', handleUpdate);
    return () => window.removeEventListener('ath_wallet_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalCostETB = items.reduce(
    (sum, item) => sum + (item.product.priceETB || 0) * item.quantity,
    0
  );

  const hasEnoughBalance = wallet.balanceETB >= totalCostETB;
  const shortfall = totalCostETB - wallet.balanceETB;

  const handleInstantWalletCheckout = () => {
    if (!hasEnoughBalance) {
      triggerNotificationHaptic('warning');
      return;
    }

    setIsProcessing(true);
    triggerHaptic('medium');

    // 1-second instant wallet checkout
    setTimeout(() => {
      const orderPayload = items.map((i) => ({
        name: i.product.name,
        priceETB: i.product.priceETB || 0,
        quantity: i.quantity,
      }));

      const result = instantWalletPurchase(orderPayload);

      if (result.success) {
        const generatedKey = `ATH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const now = new Date();
        const dateFormatted =
          now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
          ' • ' +
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // Save order to orders ledger
        saveOrder({
          id: `ord-${Date.now()}`,
          orderNumber: result.orderId,
          productName: items.map((i) => (i.quantity > 1 ? `${i.product.name} (x${i.quantity})` : i.product.name)).join(', '),
          date: dateFormatted,
          status: 'active',
          priceETB: result.totalCost,
          paymentMethod: 'ATH Wallet Balance',
          licenseKey: generatedKey,
        });

        triggerNotificationHaptic('success');
        setIsProcessing(false);
        setOrderSuccess({
          orderId: result.orderId,
          totalPaid: result.totalCost,
          itemsCount: totalItemsCount,
          generatedKey,
        });

        onClearCart?.();
      } else {
        setIsProcessing(false);
        triggerNotificationHaptic('error');
        alert(result.message);
      }
    }, 1000);
  };

  const handleCopyKey = (key: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4.5 h-4.5 text-[#721428]" strokeWidth={2} />
            <h2 id="cart-drawer-title" className="text-sm font-bold text-gray-900">
              Your Cart
            </h2>
            {totalItemsCount > 0 && (
              <span className="text-[11px] text-gray-500 font-medium">
                ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-7.5 h-7.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Order Success Celebration Overlay */}
        {orderSuccess ? (
          <div className="flex-1 p-5 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs mb-3">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              Instant Payment Successful
            </span>

            <h3 className="text-base font-extrabold text-stone-900 mb-1">
              Order Confirmed &amp; Activated!
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mb-4">
              Paid <strong>{formatETB(orderSuccess.totalPaid)}</strong> with your ATH Wallet balance. 1-second instant completion.
            </p>

            {/* Generated License Code */}
            <div className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200/90 mb-4 text-left">
              <div className="flex items-center justify-between text-[10.5px] text-stone-500 mb-1">
                <span>Order #{orderSuccess.orderId}</span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-stone-200">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Key className="w-3.5 h-3.5 text-[#721428] shrink-0" />
                  <span className="font-mono text-xs font-bold text-stone-900 truncate">
                    {orderSuccess.generatedKey}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyKey(orderSuccess.generatedKey)}
                  className="px-2 py-1 rounded bg-stone-100 hover:bg-[#FAF0F2] text-[#721428] text-[10.5px] font-bold shrink-0 transition-colors"
                >
                  {copiedKey ? 'Copied' : 'Copy'}
                </button>
              </div>

              <span className="text-[10px] text-stone-400 mt-1.5 block">
                Dispatched to your Telegram account. Also accessible under 'My Orders'.
              </span>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setOrderSuccess(null);
                  onClose();
                  onViewOrders?.();
                }}
                className="w-full h-10 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>View in My Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setOrderSuccess(null);
                  onClose();
                }}
                className="w-full h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<ShoppingCart className="w-6 h-6 text-[#721428]" strokeWidth={1.8} />}
              title="Your cart is empty"
              description="Browse our verified trading tools and licenses from ATH to add items to your cart."
              actionLabel="Explore Products"
              onAction={() => {
                triggerHaptic('light');
                onClose();
                onBrowseProducts();
              }}
            />
          </div>
        ) : (
          /* Cart items list */
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {/* Wallet balance banner */}
            <div className="p-3 bg-[#FAF0F2]/70 rounded-xl border border-[#F0D5DA] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#721428] text-white flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#721428] uppercase tracking-wider block">
                    Your ATH Wallet
                  </span>
                  <span className="text-xs font-black text-gray-900">
                    {formatETB(wallet.balanceETB)} <span className="text-[10px] text-gray-500 font-medium">({etbToUsdt(wallet.balanceETB)})</span>
                  </span>
                </div>
              </div>

              {onNavigateToWallet && (
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                    onNavigateToWallet();
                  }}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-stone-100 border border-[#F0D5DA] text-[10.5px] font-bold text-[#721428] transition-colors cursor-pointer"
                >
                  Deposit
                </button>
              )}
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#721428] uppercase tracking-wider block">
                    {item.product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] font-bold text-[#721428] mt-0.5">
                    {item.product.priceETB > 0 ? formatETB(item.product.priceETB) : 'Free License'}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60">
                    <div className="flex items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-2xs">
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQuantity(item.product.id, item.quantity - 1);
                        }}
                        className="w-5.5 h-5.5 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQuantity(item.product.id, item.quantity + 1);
                        }}
                        className="w-5.5 h-5.5 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        onRemoveItem(item.product.id);
                      }}
                      className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Instant checkout speed guarantee banner */}
            <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start gap-2 text-xs text-emerald-800">
              <Zap className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 fill-emerald-600" />
              <p className="leading-relaxed text-[10.5px]">
                <strong>1-Second Instant Completion:</strong> Paying with your ATH Wallet activates and dispatches your license code automatically without having to submit payment receipts.
              </p>
            </div>
          </div>
        )}

        {/* Footer & Checkout Buttons */}
        {!orderSuccess && items.length > 0 && (
          <div className="p-3.5 border-t border-gray-100 bg-gray-50/70 pb-safe space-y-2.5 select-none">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Cart Total</span>
              <div className="text-right">
                <span className="font-black text-sm text-gray-900">
                  {formatETB(totalCostETB)}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  ≈ {etbToUsdt(totalCostETB)}
                </span>
              </div>
            </div>

            {hasEnoughBalance ? (
              /* Pay with Wallet Balance button */
              <button
                onClick={handleInstantWalletCheckout}
                disabled={isProcessing}
                className="w-full h-11 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deducting &amp; Activating License (1s)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#F7D388] fill-[#F7D388]" />
                    <span>Pay with Wallet Balance (Instant 1s)</span>
                  </>
                )}
              </button>
            ) : (
              /* Shortfall / Need Top Up */
              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>
                    Need <strong>{formatETB(shortfall)}</strong> more in wallet balance.
                  </span>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                    onNavigateToWallet?.();
                  }}
                  className="w-full h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <Wallet className="w-4 h-4 text-[#F7D388]" />
                  <span>Top-Up Wallet (+{formatETB(shortfall)})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
