import React from 'react';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import { ArrowRight, Check } from 'lucide-react';
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
      className="group bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      {/* 1. Large visual / logo area (Style C with real logos) */}
      <ProductBrandVisual product={product} />

      {/* 2. Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Badge & Brand */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {product.brand}
            </span>
            {product.badge && (
              <span className="text-[10px] font-semibold text-[#721428] bg-[#FAF0F2] px-2 py-0.5 rounded border border-[#F0D5DA]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug group-hover:text-[#721428] transition-colors mb-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            {product.shortDescription}
          </p>

          {/* Key Feature highlights */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {product.features.slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10.5px] font-medium text-gray-700 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded"
              >
                <Check className="w-3 h-3 text-[#721428] stroke-[2.5]" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Action Area */}
        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-3">
          {showPricePlaceholder ? (
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-gray-500 block">
                Starting from
              </span>
              <span className="text-xs font-bold text-gray-900 truncate block">
                {product.startingPricePlaceholder}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-semibold text-gray-500">
              Subscription License
            </span>
          )}

          {/* Clear Burgundy CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              onView(product);
            }}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] shrink-0 shadow-xs ${
              isOptionsCTA
                ? 'bg-[#721428] hover:bg-[#5A0E1E] text-white active:bg-[#470A17]'
                : 'bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] hover:bg-[#F3E2E6]'
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
