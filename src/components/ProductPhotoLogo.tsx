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

  // 1. Abyssinia Journal (matching Image 1: 3D Origami Purple & Gold Bird on pure white background)
  if (productId === 'abyssinia-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#FFFFFF' }}
        title="Abyssinia Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#FFFFFF" />
          <defs>
            {/* Rich multi-stop metallic gold stroke gradient */}
            <linearGradient id="goldOrigami" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#B38728" />
              <stop offset="100%" stopColor="#FDF0CD" />
            </linearGradient>

            {/* Facet gradients for amethyst/purple polygon facets matching Image 1 */}
            <linearGradient id="purpleFacet1" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#300A52" />
              <stop offset="100%" stopColor="#55157E" />
            </linearGradient>

            <linearGradient id="purpleFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A1373" />
              <stop offset="100%" stopColor="#6C1E9D" />
            </linearGradient>

            <linearGradient id="purpleFacet3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#250642" />
              <stop offset="100%" stopColor="#3B0C5E" />
            </linearGradient>

            <linearGradient id="purpleFacet4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5E1B8C" />
              <stop offset="100%" stopColor="#8A2BB8" />
            </linearGradient>

            <linearGradient id="purpleFacet5" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#1E0533" />
              <stop offset="100%" stopColor="#2F094E" />
            </linearGradient>
          </defs>

          {/* Geometric 3D Origami Amethyst & Gold Bird */}
          <g transform="translate(6, 4) scale(0.88)">
            {/* Rear secondary wing flare */}
            <polygon
              points="14,24 33,37 28,24"
              fill="url(#purpleFacet3)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Tail feathers - lower facet pointing down */}
            <polygon
              points="45,72 32,87 46,79"
              fill="url(#purpleFacet5)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Tail main flank */}
            <polygon
              points="45,49 32,87 45,72"
              fill="url(#purpleFacet1)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Back wing top facet */}
            <polygon
              points="20,12 48,17 45,49"
              fill="url(#purpleFacet1)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Back wing secondary facet */}
            <polygon
              points="20,12 45,49 28,24"
              fill="url(#purpleFacet2)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Main torso diamond (faceted breast) */}
            <polygon
              points="48,17 66,43 45,72 45,49"
              fill="url(#purpleFacet2)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Lower chest highlight facet */}
            <polygon
              points="66,43 73,55 58,68 45,72"
              fill="url(#purpleFacet4)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Central chest shadow facet */}
            <polygon
              points="48,17 66,43 45,49"
              fill="url(#purpleFacet3)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Head and beak facet */}
            <polygon
              points="66,43 78,43 85,53 73,55"
              fill="url(#purpleFacet1)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Beak lower return */}
            <polygon
              points="78,43 85,53 76,53"
              fill="url(#purpleFacet5)"
              stroke="url(#goldOrigami)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Backtesting Journal (matching Image 2: White 3-Bar Chart with Upward Trend Arrow on solid black)
  if (productId === 'backtesting-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#000000' }}
        title="Backtesting Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#000000" />

          {/* White 3-Column Chart & Breakout Arrow matching Image 2 */}
          <g fill="#FFFFFF" transform="translate(2, 2)">
            {/* Left Bar (Short) with slanted roof */}
            <polygon points="33,56 40.5,52 40.5,43 33,47" />

            {/* Middle Bar (Tall) with slanted roof */}
            <polygon points="44,57 51.5,53 51.5,30 44,34" />

            {/* Right Bar (Medium) with slanted roof */}
            <polygon points="55,54 62.5,50 62.5,36 55,40" />

            {/* Upward Breakout Zig-zag Arrow Path */}
            <polygon points="29,62.5 43.5,53.5 51,66 67,52.5 65.5,47.5 74.5,49.5 70.5,58 68,54.5 51,68 43.5,56 31.5,63.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. Notion Template Journal (matching Image 3: 3D Notion Cube + "Notion" text on pure white)
  if (productId === 'notion-template-journal') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#FFFFFF' }}
        title="Notion Template Journal"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#FFFFFF" />

          {/* 3D Notion Cube on Left + Wordmark "Notion" on Right matching Image 3 */}
          <g transform="translate(6, 32)">
            {/* 3D Isometric Notion Cube */}
            <g transform="scale(0.38)">
              {/* Outer Cube Outline / Left Black Face */}
              <path
                d="M 15 28 L 47 10 C 49 9 52 9 54 10 L 86 28 C 88 29 89 31 89 33 L 89 74 C 89 77 87 79 84 81 L 52 98 C 50 99 47 99 45 98 L 13 81 C 10 79 9 77 9 74 L 9 33 C 9 31 11 29 15 28 Z"
                fill="#000000"
              />
              {/* Top Isometric Face */}
              <polygon
                points="17,31 50,14 83,31 50,47"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Front Right Face (White with black 'N') */}
              <polygon
                points="50,48 85,32 85,73 50,89"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Iconic Serif 'N' inside front face */}
              <path
                d="M 57 58 C 59 57.5 61 56.5 63 56 L 76 50 C 78 51 78 52 77 54 L 66 73 L 76 68 C 78 68 79 69 79 70 C 79 72 78 72 76 73 L 62 80 C 60 80 59.5 79 60.5 77 L 72 58 L 62 63 C 60 63 59 62 59 61 Z"
                fill="#000000"
              />
            </g>

            {/* "Notion" Wordmark in Black */}
            <text
              x="42"
              y="28"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="700"
              fontSize="23"
              fill="#000000"
              letterSpacing="-0.6"
            >
              Notion
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. Telegram Premium Official Brandmark (matching uploaded Image 1)
  if (productId === 'telegram-premium') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#24A1DE' }}
        title="Telegram Premium"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#24A1DE" />
          {/* Telegram airplane silhouette in pure white */}
          <path
            d="M 77.5 26.8 C 76.5 26.1 74 27 71.8 28.1 L 18 51.4 C 15.5 52.4 15.4 54.2 17.8 55 L 31.8 59.4 L 64.5 38.4 C 66 37.4 67.2 38 66 39.1 L 39.5 63.1 L 38.5 76.9 C 40 76.9 40.8 76.1 41.7 75.2 L 49.8 67.4 L 66 79.4 C 69 81.1 71 80.1 71.8 76.7 L 81.8 29.7 C 82.5 26.3 80.5 24.9 77.5 26.8 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // 5. Google AI Official Brandmark (matching uploaded Image 2)
  if (productId === 'google-ai') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xs ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#FFFFFF' }}
        title="Google AI"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="100" height="100" fill="#FFFFFF" />
          <defs>
            {/* Smooth 4-point star spark outline with rounded tips */}
            <clipPath id="googleSparkClip">
              <path
                d="M 47.8 11.2 C 48.8 9.6 51.2 9.6 52.2 11.2 C 54.2 30.5 69.5 45.8 88.8 47.8 C 90.4 48.8 90.4 51.2 88.8 52.2 C 69.5 54.2 54.2 69.5 52.2 88.8 C 51.2 90.4 48.8 90.4 47.8 88.8 C 45.8 69.5 30.5 54.2 11.2 52.2 C 9.6 51.2 9.6 48.8 11.2 47.8 C 30.5 45.8 45.8 30.5 47.8 11.2 Z"
              />
            </clipPath>

            {/* Gradient layers for Red, Yellow, Green, Blue matching Image 2 */}
            <radialGradient id="gSparkRed" cx="50%" cy="16%" r="58%">
              <stop offset="0%" stopColor="#EA4335" />
              <stop offset="45%" stopColor="#EA4335" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#EA4335" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="gSparkYellow" cx="16%" cy="50%" r="58%">
              <stop offset="0%" stopColor="#FBBC05" />
              <stop offset="45%" stopColor="#FBBC05" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FBBC05" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="gSparkGreen" cx="50%" cy="84%" r="58%">
              <stop offset="0%" stopColor="#34A853" />
              <stop offset="45%" stopColor="#34A853" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#34A853" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="gSparkBlue" cx="78%" cy="50%" r="62%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="55%" stopColor="#4285F4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Spark shape filled with blended chromatic gradient */}
          <g clipPath="url(#googleSparkClip)">
            {/* Core blue fill */}
            <rect width="100" height="100" fill="#4285F4" />
            {/* Red top glow */}
            <rect width="100" height="100" fill="url(#gSparkRed)" />
            {/* Yellow left glow */}
            <rect width="100" height="100" fill="url(#gSparkYellow)" />
            {/* Green bottom glow */}
            <rect width="100" height="100" fill="url(#gSparkGreen)" />
            {/* Blue right accent glow */}
            <rect width="100" height="100" fill="url(#gSparkBlue)" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. Official FXReplay Logo (for FXReplay Pro)
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
