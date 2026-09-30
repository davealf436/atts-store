import React, { useState, useEffect } from 'react';
import { Package, ShieldCheck, CheckCircle2, Clock, Key, Copy, Check, ExternalLink } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { triggerHaptic } from '../services/telegram';
import { OrderItem } from '../types';
import { getStoredOrders } from '../services/orders';
import { formatETB } from '../services/wallet';

interface OrdersScreenProps {
  onBrowseProducts: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBrowseProducts }) => {
  const [orders, setOrders] = useState<OrderItem[]>(getStoredOrders());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(getStoredOrders());
    };
    window.addEventListener('ath_orders_updated', handleUpdate);
    return () => window.removeEventListener('ath_orders_updated', handleUpdate);
  }, []);

  const handleCopyKey = (key: string, id: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-3.5 pb-4">
      {/* Page Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          My Orders &amp; Subscriptions
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          View your active licenses, instant delivery receipts, and credentials.
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs p-6">
          <EmptyState
            icon={<Package className="w-6 h-6 text-[#721428] stroke-[1.8]" />}
            title="No orders yet"
            description="Your completed TradingView subscriptions and FXReplay licenses will appear here once purchased."
            actionLabel="Browse Catalog"
            onAction={() => {
              triggerHaptic('light');
              onBrowseProducts();
            }}
          />
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-2.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-3.5 space-y-2.5 select-none"
            >
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#721428] uppercase tracking-wider">
                      {order.orderNumber}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10.5px] text-gray-400 font-medium">
                      {order.date}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 truncate">
                    {order.productName}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  {order.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Active</span>
                    </span>
                  )}
                  {order.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9.5px] font-bold">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Processing</span>
                    </span>
                  )}
                  {order.status === 'expired' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[9.5px] font-bold">
                      <span>Expired</span>
                    </span>
                  )}

                  {typeof order.priceETB === 'number' && (
                    <div className="text-[11px] font-extrabold text-gray-800 mt-1">
                      {formatETB(order.priceETB)}
                    </div>
                  )}
                </div>
              </div>

              {/* License Key / Credential Box */}
              {order.licenseKey && (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Key className="w-3.5 h-3.5 text-[#721428] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9.5px] font-semibold text-stone-500 block">
                        License Key / Activation Code
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-900 truncate block">
                        {order.licenseKey}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyKey(order.licenseKey!, order.id)}
                    className="px-2 py-1 rounded bg-white hover:bg-stone-100 border border-stone-200 text-[#721428] font-bold text-[10.5px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedKey === order.id ? (
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
              )}

              {/* Delivery method footnote */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                <span>Method: {order.paymentMethod || 'Wallet Balance'}</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Dispatched via Telegram
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery Info Card */}
      <div className="p-3.5 bg-white rounded-2xl border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-600 shadow-2xs">
        <ShieldCheck className="w-4.5 h-4.5 text-[#721428] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-gray-900 text-xs">How License Delivery Works</h4>
          <p className="text-[10.5px] text-gray-500 leading-relaxed">
            When you complete an order using your ATH Wallet balance, your login credentials or license activation keys are automatically dispatched inside ATH and backed up to your Telegram chat.
          </p>
        </div>
      </div>
    </div>
  );
};
