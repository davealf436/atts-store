import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductBrandVisual } from './ProductBrandVisual';
import { ArrowRight, Check, Heart } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { isFavorite, toggleFavorite, subscribeToFavorites } from '../services/favorites';
import { toast } from '../services/toast';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  ctaVariant?: 'options' | 'details'; // 'options' on Home, 'details' on Products
  showPricePlaceholder?: boolean;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  ctaVariant = 'details',
  showPricePlaceholder = false,
  isSaved: controlledIsSaved,
  onToggleSave,
}) => {
  const [internalIsSaved, setInternalIsSaved] = useState<boolean>(() => isFavorite(product.id));

  useEffect(() => {
    if (controlledIsSaved !== undefined) return;
    const unsubscribe = subscribeToFavorites((favIds) => {
      setInternalIsSaved(favIds.includes(product.id));
    });
    return unsubscribe;
  }, [product.id, controlledIsSaved]);

  const isLiked = controlledIsSaved !== undefined ? controlledIsSaved : internalIsSaved;

  const handleToggleFavorite = () => {
    triggerHaptic('medium');
    if (onToggleSave) {
      onToggleSave(product.id);
    } else {
      const nowSaved = toggleFavorite(product.id);
      if (nowSaved) {
        toast.success('Added to Saved', `${product.name} added to your saved list.`);
      } else {
        toast.info('Removed from Saved', `${product.name} removed from your saved list.`);
      }
    }
  };

  const isOptionsCTA = ctaVariant === 'options';

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onView(product);
      }}
      className="group bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      {/* 1. Large visual / logo area with Heart action */}
      <div className="relative">
        <ProductBrandVisual product={product} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-90 ${
            isLiked
              ? 'bg-white text-rose-600 shadow-md ring-1 ring-rose-200'
              : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs border border-white/20'
          }`}
          aria-label={isLiked ? `Remove ${product.name} from saved items` : `Save ${product.name} to favorites`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'stroke-[2.2]'
            }`}
          />
        </button>
      </div>

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
