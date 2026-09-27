import React from 'react';

interface ProductPhotoLogoProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
}

/**
 * Renders the exact official brandmark photos:
 * - Photo 1: TradingView official white monogram on solid jet-black background (for Premium & Essential)
 * - Photo 2: FXReplay official white forward-play chevrons on cosmic dark navy background with stardust (for Pro)
 */
export const ProductPhotoLogo: React.FC<ProductPhotoLogoProps> = ({
  productId,
  className = '',
  size = 'md',
}) => {
  const isFXReplay = productId === 'fxreplay-pro';

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-14 h-14 rounded-xl',
    banner: 'w-full h-full rounded-none',
  };

  if (isFXReplay) {
    // Official FXReplay Logo matching Photo 2
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#070D18' }}
        title="FXReplay"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="fxCosmicGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#15243E" />
              <stop offset="50%" stopColor="#0E192D" />
              <stop offset="100%" stopColor="#070D18" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#fxCosmicGrad)" />

          {/* Stardust particles matching Photo 2 */}
          <circle cx="12" cy="18" r="0.8" fill="#FFFFFF" opacity="0.35" />
          <circle cx="28" cy="14" r="0.6" fill="#FFFFFF" opacity="0.4" />
          <circle cx="85" cy="16" r="0.8" fill="#FFFFFF" opacity="0.5" />
          <circle cx="92" cy="38" r="0.6" fill="#FFFFFF" opacity="0.3" />
          <circle cx="18" cy="82" r="0.8" fill="#FFFFFF" opacity="0.4" />
          <circle cx="48" cy="88" r="0.6" fill="#FFFFFF" opacity="0.35" />
          <circle cx="78" cy="84" r="0.75" fill="#FFFFFF" opacity="0.45" />
          <circle cx="88" cy="68" r="0.6" fill="#FFFFFF" opacity="0.3" />
          <circle cx="8" cy="54" r="0.5" fill="#FFFFFF" opacity="0.25" />

          {/* Solid Left Triangle (Play) */}
          <path
            d="M 33 26.5 C 30.8 25.1 27.5 26.7 27.5 29.5 L 27.5 70.5 C 27.5 73.3 30.8 74.9 33 73.5 L 51 52 C 52.2 50.8 52.2 49.2 51 48 Z"
            fill="#FFFFFF"
          />
          {/* Hollow Right Chevron (Fast Forward Replay) */}
          <path
            d="M 50 26.5 C 47.8 25.1 44.5 26.7 44.5 29.5 L 44.5 38.5 C 44.5 40 45.3 41.3 46.7 42.2 L 57.5 49.2 C 58.2 49.6 58.2 50.4 57.5 50.8 L 46.7 57.8 C 45.3 58.7 44.5 60 44.5 61.5 L 44.5 70.5 C 44.5 73.3 47.8 74.9 50 73.5 L 75 52 C 76.2 50.8 76.2 49.2 75 48 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // Official TradingView Logo matching Photo 1 (for TV Premium and TV Essential)
  return (
    <div
      className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none bg-black shadow-2xs ${sizeClasses[size]} ${className}`}
      title="TradingView"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill="#000000" />
        <g transform="translate(10, 16) scale(3.33)">
          <path
            d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};
