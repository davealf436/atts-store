import React from 'react';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  ctaVariant?: 'options' | 'details'; // 'options' on Home, 'details' on Products
  showPricePlaceholder?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  ctaVariant = 'details',
  showPricePlaceholder = false,
}) => {
  const isOptionsCTA = ctaVariant === 'options';

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onView(product);
      }}
      className="group bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* 1. Large visual / logo area (Style C) */}
      <ProductBrandVisual product={product} />

      {/* 2. Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Badge & Brand */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {product.brand}
            </span>
            {product.badge && (
              <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200/60">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 leading-relaxed mb-3.5">
            {product.shortDescription}
          </p>

          {/* Key Feature highlights (concise pills) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200/70 px-2 py-0.5 rounded-md"
              >
                <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Action Area */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          {/* Optional starting price for Products screen */}
          {showPricePlaceholder ? (
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-semibold text-gray-600 block">
                Starting from
              </span>
              <span className="text-xs font-bold text-gray-900 font-mono truncate block">
                {product.startingPricePlaceholder}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-gray-600">
              Subscription License
            </span>
          )}

          {/* Clear CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              onView(product);
            }}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] shrink-0 shadow-2xs ${
              isOptionsCTA
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label={isOptionsCTA ? `View options for ${product.name}` : `View details for ${product.name}`}
          >
            <span>{isOptionsCTA ? 'View Options' : 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
