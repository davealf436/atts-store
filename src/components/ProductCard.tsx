import React from 'react';
import { Product } from '../types';
import { LineChart, PlayCircle, ArrowRight, Eye, Plus } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onAddToCart,
}) => {
  const isTradingView = product.brand === 'TradingView';

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header row: Icon & Tag */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isTradingView
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}
          >
            {isTradingView ? (
              <LineChart className="w-5 h-5 stroke-[2]" />
            ) : (
              <PlayCircle className="w-5 h-5 stroke-[2]" />
            )}
          </div>

          {product.badge && (
            <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200/60">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">
          {product.name}
        </h3>

        {/* Brand category subtitle */}
        <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-2">
          {product.brand} · {product.category === 'tradingview' ? 'Charting Platform' : 'Backtesting Engine'}
        </div>

        {/* Short Description */}
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          {product.shortDescription}
        </p>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-3 border-t border-gray-100 flex items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider block">
            Pricing
          </span>
          <span className="text-xs font-bold text-gray-900 leading-tight block mt-0.5">
            {product.startingPricePlaceholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Details CTA */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onView(product);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {/* Quick Add CTA */}
          {onAddToCart && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onAddToCart(product);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all flex items-center gap-1 shadow-xs active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
