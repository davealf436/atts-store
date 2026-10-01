import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductPhotoLogo } from './ProductPhotoLogo';
import { ArrowRight, Heart } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { isFavorite, toggleFavorite, subscribeToFavorites } from '../services/favorites';
import { toast } from '../services/toast';

interface SwipeableProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
}

export const SwipeableProductCard: React.FC<SwipeableProductCardProps> = ({
  product,
  onView,
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

  const handleClick = () => {
    triggerHaptic('light');
    onView(product);
  };

  const isFXReplay = product.id === 'fxreplay-pro';
  const isAbyssiniaJournal = product.id === 'abyssinia-journal';
  const isBacktestingJournal = product.id === 'backtesting-journal';
  const isNotion = product.id === 'notion-template-journal';
  const isTelegram = product.id === 'telegram-premium';
  const isGoogleAI = product.id === 'google-ai';

  const isLightBg = isAbyssiniaJournal || isNotion || isGoogleAI;

  const containerBg = isAbyssiniaJournal
    ? 'bg-white border border-gray-150'
    : isBacktestingJournal
    ? 'bg-black'
    : isNotion
    ? 'bg-white border border-gray-150'
    : isTelegram
    ? 'bg-[#24A1DE]'
    : isGoogleAI
    ? 'bg-white border border-gray-150'
    : isFXReplay
    ? 'bg-[#070D18]'
    : 'bg-black';

  return (
    <div
      onClick={handleClick}
      className="w-[210px] xs:w-[225px] shrink-0 snap-start bg-white border border-gray-200/90 hover:border-[#721428]/40 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group active:scale-[0.98]"
      role="button"
      tabIndex={0}
      aria-label={`View options for ${product.name}`}
    >
      <div>
        {/* Large Product Logo/Image Area with subtle badge overlay & Heart action */}
        <div
          className={`relative w-full h-32 xs:h-36 rounded-xl overflow-hidden flex items-center justify-center shadow-inner ${containerBg}`}
        >
          {/* Official brand logo centered & scaled */}
          <div className="w-full h-full p-3.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <ProductPhotoLogo
              productId={product.id}
              size="banner"
              className="w-full h-full"
            />
          </div>

          {/* Small subtle badge over the image area */}
          {product.badge && (
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-xs ${
                  isLightBg
                    ? 'bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]'
                    : 'bg-white/95 backdrop-blur-md text-[#721428] border border-white/60'
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className={`absolute top-2 right-2 z-20 w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-90 ${
              isLiked
                ? 'bg-white text-rose-600 shadow-md ring-1 ring-rose-200'
                : isLightBg
                ? 'bg-stone-100/90 hover:bg-white text-stone-400 hover:text-rose-500 border border-stone-200'
                : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs border border-white/20'
            }`}
            aria-label={isLiked ? `Remove ${product.name} from saved items` : `Save ${product.name} to favorites`}
            title={isLiked ? 'Remove from Saved' : 'Save to Favorites'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'stroke-[2.2]'
              }`}
            />
          </button>
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
