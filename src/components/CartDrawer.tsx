import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Info } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { triggerHaptic } from '../services/telegram';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBrowseProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onBrowseProducts,
}) => {
  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
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
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 id="cart-drawer-title" className="text-base font-bold text-gray-900">
              Shopping Cart
            </h2>
            {totalItemsCount > 0 && (
              <span className="text-xs text-gray-500 font-medium">
                ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Your cart is empty"
              description="Browse our verified trading tools and licenses to add items to your cart."
              actionLabel="Explore Products"
              onAction={() => {
                triggerHaptic('light');
                onClose();
                onBrowseProducts();
              }}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                    {item.product.brand}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-xs text-gray-600 font-mono mt-0.5">
                    {item.product.startingPricePlaceholder}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQuantity(item.product.id, item.quantity - 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQuantity(item.product.id, item.quantity + 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded"
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
                      className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Note banner */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <p className="leading-relaxed text-[11px]">
                Payment methods (Telebirr, CBE, and USDT) and automated bot delivery will be enabled in the upcoming release.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 pb-safe space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Selected Items</span>
              <span className="font-bold text-gray-900">{totalItemsCount}</span>
            </div>

            <button
              disabled
              className="w-full h-12 rounded-xl bg-gray-300 text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span>Checkout (Coming Soon)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
