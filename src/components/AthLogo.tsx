import React, { useState, useEffect } from 'react';

interface AthLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSlogan?: boolean;
}

export const AthLogo: React.FC<AthLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  // Subtle 1.0s entrance animation on initial mount (0.8–1.2s range requested)
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-10 h-10 text-sm',
  }[size];

  return (
    <div
      className={`relative select-none shrink-0 ${sizeClasses} ${className}`}
      aria-label="Abyssinia Trading Hub Logo"
    >
      {/* Modern ATH Logo Container */}
      <div
        className={`w-full h-full rounded-lg bg-[#721428] text-white flex items-center justify-center font-extrabold tracking-tight border border-[#8C1B34] shadow-xs relative overflow-hidden transition-all duration-1000 ease-out ${
          isAnimating
            ? 'opacity-0 scale-90 translate-y-0.5 shadow-[0_0_15px_rgba(114,20,40,0.3)] animate-[athEntrance_1s_cubic-bezier(0.16,1,0.3,1)_forwards]'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Subtle geometric trading accent - ascending vector facet */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        >
          <path
            d="M0 32L16 12L32 32H0Z"
            fill="white"
          />
        </svg>

        {/* Clean, Modern ATH Monogram Typography */}
        <span className="relative z-10 font-extrabold tracking-tight leading-none text-white font-sans">
          ATH
        </span>

        {/* Ambient micro-light reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30" />
      </div>
    </div>
  );
};
