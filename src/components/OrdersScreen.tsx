import React from 'react';
import { Package, ShieldCheck } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { triggerHaptic } from '../services/telegram';

interface OrdersScreenProps {
  onBrowseProducts: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBrowseProducts }) => {
  return (
    <div className="space-y-4 pb-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          My Orders
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          View your active subscriptions, licenses, and delivery receipts.
        </p>
      </div>

      {/* Realistic Empty State */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xs">
        <EmptyState
          icon={<Package className="w-6 h-6 stroke-[1.8]" />}
          title="No orders yet"
          description="Your completed TradingView subscriptions and FXReplay licenses will appear here once purchased."
          actionLabel="Browse Catalog"
          onAction={() => {
            triggerHaptic('light');
            onBrowseProducts();
          }}
        />
      </div>

      {/* Delivery Info Card */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start gap-3 text-xs text-gray-600">
        <ShieldCheck className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900">How Delivery Works</h4>
          <p className="text-[11px] leading-relaxed">
            When you complete an order, your login credentials or license activation keys are automatically dispatched inside this Mini App and backed up to your Telegram chat.
          </p>
        </div>
      </div>
    </div>
  );
};
