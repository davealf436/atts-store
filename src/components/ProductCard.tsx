import React from 'react';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import { PinButton } from './PinButton';
import { ArrowRight, Check } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { setActiveCard, getActiveCard, isPinned } from '../services/pin';

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

  const handleCardClick = (e: React.MouseEvent) => {
    const isTouchOnly =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      !window.matchMedia('(hover: hover)').matches;

    if (isTouchOnly) {
      const currentActive = getActiveCard();
      const isCardActive = currentActive === product.id;

      if (!isCardActive && !isPinned(product.id)) {
        setActiveCard(product.id);
        triggerHaptic('soft');
        return;
      }
    }

    triggerHaptic('light');
    onView(product);
  };

  return (
    <div
      onClick={handleCardClick}
      data-product-card="true"
      className="group bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      {/* 1. Large visual / logo area (Style C with real logos) */}
      <div className="relative">
        <ProductBrandVisual product={product} />
        <div className="absolute top-2.5 right-2.5 z-10">
          <PinButton productId={product.id} variant="card" />
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Badge & Brand */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
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

          {/* Tier Label */}
          <p className="text-xs font-semibold text-gray-500 mb-2">
            {product.tier}
          </p>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Key Features List (Top 2) */}
          <div className="space-y-1 mb-4">
            {product.features.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-[#721428] shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Row: Action Button */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
          {showPricePlaceholder && (
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block">
                Starting from
              </span>
              <span className="text-sm font-bold text-gray-900">
                {product.priceETB ? `${product.priceETB.toLocaleString()} ETB` : 'Flexible'}
              </span>
            </div>
          )}

          {isOptionsCTA ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                onView(product);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold transition-all"
            >
              <span>View Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                onView(product);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
