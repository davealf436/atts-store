import React from 'react';
import { Product } from '../types';
import { X, Check, LineChart, PlayCircle, ShoppingBag } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const isTradingView = product.brand === 'TradingView';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-xl animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto my-2.5"></div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isTradingView
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isTradingView ? (
                <LineChart className="w-6 h-6 stroke-[2]" />
              ) : (
                <PlayCircle className="w-6 h-6 stroke-[2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.badge && (
                  <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200/60">
                    {product.badge}
                  </span>
                )}
              </div>
              <h2
                id="modal-product-title"
                className="text-lg font-bold text-gray-900 tracking-tight"
              >
                {product.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          {/* Price Box */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Indicative Pricing Placeholder
            </span>
            <span className="text-base font-bold text-gray-900 font-mono">
              {product.startingPricePlaceholder}
            </span>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">
              Final pricing and subscription durations will be enabled during the checkout phase.
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              Overview
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Included Features
            </h4>
            <ul className="space-y-2">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white pb-safe">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onAddToCart(product);
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
