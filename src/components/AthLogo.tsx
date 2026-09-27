import React, { useState } from 'react';
import { triggerHaptic } from '../services/telegram';

interface AthLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AthLogo: React.FC<AthLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
  onClick,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);

  // Pure frameless dimensions - no square borders or boxes
  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9.5 h-9.5',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dimensionClass = typeof size === 'string' && sizeMap[size] ? sizeMap[size] : sizeMap.md;

  const handleClick = () => {
    triggerHaptic('light');
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 500);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label="ATH Logo"
      className={`relative inline-flex items-center justify-center shrink-0 bg-transparent border-0 p-0 cursor-pointer select-none outline-none ${dimensionClass} ${className}`}
    >
      <svg
        viewBox="100 80 810 830"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transform-gpu transition-all duration-300 ease-out select-none drop-shadow-[0_2px_8px_rgba(47,9,78,0.12)] ${
          animated ? 'ath-bird-floating' : ''
        } ${isInteracting ? 'scale-115 -translate-y-1' : ''}`}
        aria-label="ATH Origami Bird Logo"
      >
        <defs>
          {/* Metallic Gold Gradients for 3D Creases */}
          <linearGradient id="athGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDEB9E" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="65%" stopColor="#9C7418" />
            <stop offset="85%" stopColor="#E8CB68" />
            <stop offset="100%" stopColor="#7E5C10" />
          </linearGradient>

          <linearGradient id="athGoldSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF7C7" />
            <stop offset="35%" stopColor="#DEB843" />
            <stop offset="70%" stopColor="#8F6813" />
            <stop offset="100%" stopColor="#E2C25D" />
          </linearGradient>

          {/* Shimmer overlay gradient */}
          <linearGradient id="athShimmerSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8">
              {animated && (
                <animate
                  attributeName="stop-color"
                  values="#D4AF37; #FFF8D6; #AA8022; #D4AF37"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="50%" stopColor="#FFF8D6" stopOpacity="1">
              {animated && (
                <animate
                  attributeName="stop-color"
                  values="#FFF8D6; #AA8022; #D4AF37; #FFF8D6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor="#9C7418" stopOpacity="0.8">
              {animated && (
                <animate
                  attributeName="stop-color"
                  values="#9C7418; #E5C35D; #FFF8D6; #9C7418"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>

          {/* Royal Amethyst Violet Facet Gradients */}
          <linearGradient id="athWingTopGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#2F094E" />
            <stop offset="40%" stopColor="#5E1692" />
            <stop offset="75%" stopColor="#7F24C2" />
            <stop offset="100%" stopColor="#430E6A" />
          </linearGradient>

          <linearGradient id="athWingInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#220638" />
            <stop offset="50%" stopColor="#3C0E62" />
            <stop offset="100%" stopColor="#26073E" />
          </linearGradient>

          <linearGradient id="athRearWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#180327" />
            <stop offset="60%" stopColor="#330A53" />
            <stop offset="100%" stopColor="#4C127A" />
          </linearGradient>

          <linearGradient id="athChestTopGrad" x1="15%" y1="20%" x2="85%" y2="80%">
            <stop offset="0%" stopColor="#380D58" />
            <stop offset="45%" stopColor="#671CA1" />
            <stop offset="80%" stopColor="#8729CE" />
            <stop offset="100%" stopColor="#3B0E5E" />
          </linearGradient>

          <linearGradient id="athChestBotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#23063A" />
            <stop offset="60%" stopColor="#3B0E5F" />
            <stop offset="100%" stopColor="#190429" />
          </linearGradient>

          <linearGradient id="athHeadGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#44116B" />
            <stop offset="60%" stopColor="#621899" />
            <stop offset="100%" stopColor="#2C0947" />
          </linearGradient>

          <linearGradient id="athBeakBotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A0744" />
            <stop offset="100%" stopColor="#150322" />
          </linearGradient>

          <linearGradient id="athTailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2C0846" />
            <stop offset="50%" stopColor="#531685" />
            <stop offset="100%" stopColor="#24063A" />
          </linearGradient>

          <linearGradient id="athTailGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C042D" />
            <stop offset="100%" stopColor="#340954" />
          </linearGradient>

          {/* Specular Radial Glows for high-luster crystalline depth */}
          <radialGradient id="athSpecularWing" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#BF5DFF" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#7E24C2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2F094E" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="athSpecularChest" cx="55%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C96DFF" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#7E24C2" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#380D58" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main Bird Geometry Group */}
        <g id="athBirdBody" className={animated ? 'ath-bird-wings' : ''}>
          {/* Polyhedral Facets */}
          {/* 1. Rear Secondary Wing Plane */}
          <polygon points="142,232 192,118 454,488" fill="url(#athRearWingGrad)" />

          {/* 2. Wing Inner Fold */}
          <polygon points="192,118 365,305 454,488" fill="url(#athWingInnerGrad)" />

          {/* 3. Main Upper Wing Blade */}
          <polygon points="192,118 512,178 454,488" fill="url(#athWingTopGrad)" />
          <polygon
            points="192,118 512,178 454,488"
            fill="url(#athSpecularWing)"
            className={animated ? 'ath-amethyst-pulse' : ''}
            style={{ mixBlendMode: 'screen' }}
          />

          {/* 4. Golden Spine Bevel Strip */}
          <polygon points="512,178 635,380 688,452 454,488" fill="url(#athGoldPrimary)" />

          {/* 5. Chest Keel Top Facet */}
          <polygon points="454,488 688,452 742,642" fill="url(#athChestTopGrad)" />
          <polygon
            points="454,488 688,452 742,642"
            fill="url(#athSpecularChest)"
            className={animated ? 'ath-amethyst-pulse' : ''}
            style={{ mixBlendMode: 'screen' }}
          />

          {/* 6. Chest Lower Facet */}
          <polygon points="454,488 742,642 472,746" fill="url(#athChestBotGrad)" />

          {/* 7. Head Crown & Upper Beak */}
          <polygon points="688,452 822,452 876,552" fill="url(#athHeadGrad)" />

          {/* 8. Head / Beak Throat Notch */}
          <polygon points="876,552 788,552 742,642" fill="url(#athBeakBotGrad)" />

          {/* 9. Tail Main Outer Blade */}
          <polygon points="454,488 472,746 304,888" fill="url(#athTailGrad1)" />

          {/* 10. Tail Rear Flap */}
          <polygon points="472,746 474,804 304,888" fill="url(#athTailGrad2)" />

          {/* Polished Gold Metallic Creases & Wireframe Bevels */}
          {/* Wing Outer Edges & Creases */}
          <line x1="142" y1="232" x2="192" y2="118" stroke="url(#athShimmerSweep)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="142" y1="232" x2="454" y2="488" stroke="url(#athGoldSecondary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="192" y1="118" x2="512" y2="178" stroke="url(#athShimmerSweep)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="192" y1="118" x2="454" y2="488" stroke="url(#athGoldSecondary)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="512" y1="178" x2="454" y2="488" stroke="url(#athGoldPrimary)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

          {/* Spine to Neck Creases */}
          <line x1="512" y1="178" x2="688" y2="452" stroke="url(#athShimmerSweep)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="454" y1="488" x2="688" y2="452" stroke="url(#athGoldSecondary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

          {/* Head & Beak Outlines */}
          <line x1="688" y1="452" x2="822" y2="452" stroke="url(#athGoldPrimary)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="822" y1="452" x2="876" y2="552" stroke="url(#athShimmerSweep)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="876" y1="552" x2="788" y2="552" stroke="url(#athGoldPrimary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="788" y1="552" x2="742" y2="642" stroke="url(#athGoldSecondary)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="688" y1="452" x2="876" y2="552" stroke="url(#athGoldPrimary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Chest Facet Boundaries */}
          <line x1="688" y1="452" x2="742" y2="642" stroke="url(#athShimmerSweep)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="454" y1="488" x2="742" y2="642" stroke="url(#athGoldSecondary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="742" y1="642" x2="472" y2="746" stroke="url(#athGoldPrimary)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="454" y1="488" x2="472" y2="746" stroke="url(#athGoldSecondary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

          {/* Aerodynamic Tail Creases */}
          <line x1="454" y1="488" x2="304" y2="888" stroke="url(#athShimmerSweep)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="472" y1="746" x2="304" y2="888" stroke="url(#athGoldSecondary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="472" y1="746" x2="474" y2="804" stroke="url(#athGoldPrimary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="474" y1="804" x2="304" y2="888" stroke="url(#athShimmerSweep)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};

export const BrandLogo = AthLogo;
