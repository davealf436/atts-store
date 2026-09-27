import React from 'react';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { ArrowRight, Check } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface CompactProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = ({
  product,
  onView,
}) => {
  const handleClick = () => {
    triggerHaptic('light');
    onView(product);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-gray-200/90 rounded-xl p-3.5 shadow-2xs hover:border-gray-300 hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between"
      role="button"
      tabIndex={0}
      aria-label={`View options for ${product.name}`}
    >
      {/* 1. Header: Real Photo Logo + Brand Meta + Title */}
      <div className="flex items-start gap-3 mb-2.5">
        {/* Real Official Logo from Photos */}
        <ProductPhotoLogo productId={product.id} size="md" className="shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {product.brand}
            </span>
            {product.badge && (
              <span className="text-[10px] font-semibold text-[#721428] bg-[#FAF0F2] px-1.5 py-0.2 rounded border border-[#F0D5DA] truncate">
                {product.badge}
              </span>
            )}
          </div>

          <h4 className="text-[15px] font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#721428] transition-colors truncate">
            {product.name}
          </h4>
        </div>
      </div>

      {/* 2. Essential Information & Key Specs */}
      <p className="text-xs text-gray-600 leading-relaxed mb-2.5 line-clamp-2">
        {product.shortDescription}
      </p>

      {/* 2 Key Feature Highlight Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {product.features.slice(0, 2).map((feature, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 text-[10.5px] font-medium text-gray-700 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded"
          >
            <Check className="w-3 h-3 text-[#721428] shrink-0 stroke-[2.5]" />
            <span className="truncate">{feature}</span>
          </span>
        ))}
      </div>

      {/* 3. Clear Burgundy CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs"
        aria-label={`View options for ${product.name}`}
      >
        <span>View Options</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
