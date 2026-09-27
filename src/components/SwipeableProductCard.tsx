import React from 'react';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';

interface SwipeableProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export const SwipeableProductCard: React.FC<SwipeableProductCardProps> = ({
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
      className="w-[245px] xs:w-[260px] shrink-0 snap-start bg-white border border-gray-200/90 hover:border-[#721428]/40 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group active:scale-[0.98]"
      role="button"
      tabIndex={0}
      aria-label={`View options for ${product.name}`}
    >
      {/* Top Header: Official Brand Logo & Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <ProductPhotoLogo productId={product.id} size="md" className="shrink-0" />
          {product.badge && (
            <span className="text-[10px] font-bold text-[#721428] bg-[#FAF0F2] px-2 py-0.5 rounded-full border border-[#F0D5DA] truncate">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h4 className="text-sm font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#721428] transition-colors mb-1.5 truncate">
          {product.name}
        </h4>

        {/* Very Short Description - strictly 2 lines compact */}
        <p className="text-[11.5px] text-gray-500 leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
      </div>

      {/* Bottom Action: View Options (No prices) */}
      <div className="pt-3 mt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white text-xs font-bold transition-all active:scale-[0.98] shadow-xs"
          aria-label={`View options for ${product.name}`}
        >
          <span>View Options</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
