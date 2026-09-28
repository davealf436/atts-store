import React from 'react';

interface ProductPhotoLogoProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
}

/**
 * Renders the exact official brandmark photos & vector artwork:
 * - TradingView: official white monogram on solid jet-black background
 * - FXReplay: official white forward-play chevrons on cosmic dark navy background with stardust
 * - Abyssinia Journal: signature deep burgundy trade ledger with gold & white candlestick crest
 * - Backtesting Journal: analytical midnight blueprint with historical chart replay metrics
 * - Notion Template Journal: iconic Notion stylized "N" minimalist mark
 */
export const ProductPhotoLogo: React.FC<ProductPhotoLogoProps> = ({
  productId,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-14 h-14 rounded-xl',
    banner: 'w-full h-full rounded-none',
  };

  // 1. Abyssinia Journal Official Brand Mark
  if (productId === 'abyssinia-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#28060F' }}
        title="Abyssinia Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="athJournalGrad" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#721428" />
              <stop offset="60%" stopColor="#3F0914" />
              <stop offset="100%" stopColor="#22040B" />
            </radialGradient>
            <linearGradient id="goldAcc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#E6B325" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#athJournalGrad)" />

          {/* Subtle grid ledger lines */}
          <line x1="20" y1="28" x2="80" y2="28" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="20" y1="48" x2="80" y2="48" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="20" y1="68" x2="80" y2="68" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />

          {/* Open Journal Book Icon */}
          <path
            d="M 50 34 C 44 30 32 30 24 33 L 24 72 C 32 69 44 69 50 73 C 56 69 68 69 76 72 L 76 33 C 68 30 56 30 50 34 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="50" y1="34" x2="50" y2="73" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left page: Candlesticks */}
          <line x1="33" y1="42" x2="33" y2="60" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" />
          <rect x="31" y="46" width="4" height="9" fill="url(#goldAcc)" rx="0.5" />
          
          <line x1="41" y1="38" x2="41" y2="56" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" />
          <rect x="39" y="41" width="4" height="10" fill="#FFFFFF" rx="0.5" />

          {/* Right page: Trading Hub Checklist lines */}
          <line x1="57" y1="42" x2="69" y2="42" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.9" />
          <line x1="57" y1="50" x2="67" y2="50" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="57" y1="58" x2="64" y2="58" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.5" />

          {/* Mini Gold Crest Star */}
          <circle cx="50" cy="24" r="2.5" fill="url(#goldAcc)" />
        </svg>
      </div>
    );
  }

  // 2. Backtesting Journal Brand Mark
  if (productId === 'backtesting-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#0B1326' }}
        title="Backtesting Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="backtestGrad" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#172A4D" />
              <stop offset="60%" stopColor="#0E1B33" />
              <stop offset="100%" stopColor="#081020" />
            </radialGradient>
            <linearGradient id="cyanLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#backtestGrad)" />

          {/* Coordinate grid lines */}
          <line x1="18" y1="78" x2="82" y2="78" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="22" x2="18" y2="78" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />

          {/* Historical backtest histogram columns */}
          <rect x="25" y="58" width="5.5" height="20" rx="1" fill="#38BDF8" fillOpacity="0.75" />
          <rect x="35" y="44" width="5.5" height="34" rx="1" fill="#38BDF8" fillOpacity="0.9" />
          <rect x="45" y="52" width="5.5" height="26" rx="1" fill="#94A3B8" fillOpacity="0.6" />
          <rect x="55" y="34" width="5.5" height="44" rx="1" fill="#38BDF8" />
          <rect x="65" y="40" width="5.5" height="38" rx="1" fill="#38BDF8" fillOpacity="0.85" />
          <rect x="75" y="26" width="5.5" height="52" rx="1" fill="#10B981" />

          {/* Profit Expectancy Curve */}
          <path
            d="M 20 66 Q 38 52, 50 42 T 78 22"
            fill="none"
            stroke="url(#cyanLine)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Replay Target checkmark badge */}
          <circle cx="78" cy="22" r="4.5" fill="#10B981" />
          <path d="M 76 22 L 77.5 23.5 L 80.5 20.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // 3. Notion Template Journal Brand Mark (Official Minimalist N Icon)
  if (productId === 'notion-template-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#191919' }}
        title="Notion Template Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#191919" />

          {/* Ambient subtle glow */}
          <circle cx="50" cy="50" r="35" fill="#FFFFFF" fillOpacity="0.04" />

          {/* Notion Minimalist "N" logo mark */}
          <g transform="translate(23, 20) scale(0.54)">
            {/* Notion Book Shape */}
            <path
              d="M 4.4 12 C 4.4 7.6 8 4 12.4 4 L 83.6 4 C 88 4 91.6 7.6 91.6 12 L 91.6 88 C 91.6 92.4 88 96 83.6 96 L 12.4 96 C 8 96 4.4 92.4 4.4 88 Z"
              fill="#FFFFFF"
            />
            {/* Inner Black Cutout */}
            <path
              d="M 12 10 L 84 10 C 86.2 10 88 11.8 88 14 L 88 86 C 88 88.2 86.2 90 84 90 L 12 90 C 9.8 90 8 88.2 8 86 L 8 14 C 8 11.8 9.8 10 12 10 Z"
              fill="#191919"
            />
            {/* White Notion "N" Letterform */}
            <path
              d="M 23 26 C 26 25.5 30 24 33 23 L 64 23 C 67 24 67.5 25.5 65.5 29 L 41 68 L 65 68 C 68.5 68 70 69 70 72 C 70 75 68.5 76 65 76 L 31 76 C 27.5 76 26.5 74 28.5 70.5 L 53 32 L 33 32 C 29.5 32 28 31 28 28.5 C 28 26.5 28.5 26 23 26 Z"
              fill="#FFFFFF"
            />
            {/* Top right fold hint */}
            <path d="M 64 23 L 73 34 L 64 34 Z" fill="#FFFFFF" fillOpacity="0.3" />
          </g>
        </svg>
      </div>
    );
  }

  // 4. Official FXReplay Logo (for FXReplay Pro)
  if (productId === 'fxreplay-pro') {
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

          {/* Stardust particles */}
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

  // 5. Official TradingView Logo (for TV Premium and TV Essential)
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
