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

  const isFXReplay = product.id === 'fxreplay-pro';

  return (
    <div
      onClick={handleClick}
      className="w-[210px] xs:w-[225px] shrink-0 snap-start bg-white border border-gray-200/90 hover:border-[#721428]/40 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group active:scale-[0.98]"
      role="button"
      tabIndex={0}
      aria-label={`View options for ${product.name}`}
    >
      <div>
        {/* Large Product Logo/Image Area with subtle badge overlay */}
        <div
          className={`relative w-full h-32 xs:h-36 rounded-xl overflow-hidden flex items-center justify-center shadow-inner ${
            isFXReplay ? 'bg-[#070D18]' : 'bg-black'
          }`}
        >
          {/* Official brand logo centered & scaled */}
          <div className="w-full h-full p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <ProductPhotoLogo
              productId={product.id}
              size="banner"
              className="w-full h-full"
            />
          </div>

          {/* Small subtle badge over the image area */}
          {product.badge && (
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-white/95 backdrop-blur-md text-[#721428] border border-white/60 shadow-xs">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Product Name at the bottom of the image area (No price, no description) */}
        <div className="mt-2.5 mb-2 px-1">
          <h4 className="text-[13.5px] font-bold text-gray-900 tracking-tight leading-snug group-hover:text-[#721428] transition-colors truncate">
            {product.name}
          </h4>
        </div>
      </div>

      {/* Deep Burgundy View Options Button */}
      <div className="pt-1">
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
