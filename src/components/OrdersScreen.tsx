import React from 'react';
import { Package, ShieldCheck } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { triggerHaptic } from '../services/telegram';

interface OrdersScreenProps {
  onBrowseProducts: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBrowseProducts }) => {
  return (
    <div className="space-y-3.5 pb-4">
      {/* Page Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          My Orders
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          View your active subscriptions, licenses, and delivery receipts.
        </p>
      </div>

      {/* Realistic Empty State */}
      <div className="bg-white border border-gray-200/90 rounded-xl shadow-xs">
        <EmptyState
          icon={<Package className="w-5 h-5 stroke-[1.8]" />}
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
      <div className="p-3.5 bg-white rounded-xl border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-600 shadow-2xs">
        <ShieldCheck className="w-4.5 h-4.5 text-[#721428] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-gray-900 text-xs">How License Delivery Works</h4>
          <p className="text-[10.5px] text-gray-500 leading-relaxed">
            When you complete an order, your login credentials or license activation keys are automatically dispatched inside Abyssinia Trading Hub and backed up to your Telegram chat.
          </p>
        </div>
      </div>
    </div>
  );
};
