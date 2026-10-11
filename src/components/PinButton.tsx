import React, { useState, useEffect } from 'react';
import { Pin } from 'lucide-react';
import {
  isPinned as checkIsPinned,
  togglePin,
  subscribeToPinned,
  getActiveCard,
  subscribeToActiveCard,
} from '../services/pin';

interface PinButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'default';
  variant?: 'card' | 'badge' | 'header';
}

export const PinButton: React.FC<PinButtonProps> = ({
  productId,
  className = '',
  size = 'sm',
  variant = 'card',
}) => {
  const [pinned, setPinned] = useState<boolean>(() => checkIsPinned(productId));
  const [isCardActive, setIsCardActive] = useState<boolean>(() => getActiveCard() === productId);

  useEffect(() => {
    setPinned(checkIsPinned(productId));
    const unsubscribePin = subscribeToPinned((ids) => {
      setPinned(ids.includes(productId));
    });
    const unsubscribeActive = subscribeToActiveCard((activeId) => {
      setIsCardActive(activeId === productId);
    });
    return () => {
      unsubscribePin();
      unsubscribeActive();
    };
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    togglePin(productId);
  };

  const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  let buttonStyle = '';
  let visibilityStyle = '';

  if (variant === 'card') {
    // Visual appearance
    buttonStyle = pinned
      ? 'bg-[#FAF0F2] border-[#F0D5DA] text-[#721428] shadow-2xs'
      : 'bg-white/95 hover:bg-white border-stone-200/90 text-stone-500 hover:text-[#721428] hover:border-[#F0D5DA] shadow-2xs';

    // Desktop: hidden by default, smoothly revealed on card hover (group-hover:opacity-100).
    // If pinned: remains visible at subtle opacity so pinned state is recognizable.
    // Mobile: revealed when this card is active (touch).
    visibilityStyle = pinned
      ? 'opacity-90 hover:opacity-100 pointer-events-auto'
      : isCardActive
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto';
  } else if (variant === 'header') {
    buttonStyle = pinned
      ? 'bg-[#FAF0F2] border-[#F0D5DA] text-[#721428] shadow-2xs'
      : 'bg-white border-stone-200 text-stone-400 hover:text-[#721428] shadow-2xs';
    visibilityStyle = 'opacity-100 pointer-events-auto';
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center transition-opacity duration-150 ease-out cursor-pointer active:scale-90 border select-none ${
        size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-8 h-8 rounded-xl'
      } ${buttonStyle} ${visibilityStyle} ${className}`}
      aria-label={pinned ? 'Unpin product' : 'Pin product'}
      title={pinned ? 'Unpin product' : 'Pin to top'}
    >
      <Pin
        className={`${iconSizeClass} transition-transform duration-150 ${
          pinned ? 'rotate-[-30deg] scale-105' : 'rotate-0'
        }`}
        fill={pinned ? 'currentColor' : 'none'}
        strokeWidth={pinned ? 1.7 : 2}
      />
    </button>
  );
};
