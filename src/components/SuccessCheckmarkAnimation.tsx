import React from 'react';

interface SuccessCheckmarkAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'burgundy';
  title?: string;
  subtitle?: string;
}

export const SuccessCheckmarkAnimation: React.FC<SuccessCheckmarkAnimationProps> = ({
  size = 'md',
  color = 'emerald',
  title,
  subtitle,
}) => {
  const isEmerald = color === 'emerald';

  const strokeColor = isEmerald ? '#059669' : '#721428';
  const circleBg = isEmerald ? 'bg-emerald-50 border-emerald-200' : 'bg-[#FAF0F2] border-[#F0D5DA]';

  const dimensions = {
    sm: { box: 'w-10 h-10', svg: 40, strokeWidth: 3 },
    md: { box: 'w-14 h-14', svg: 56, strokeWidth: 3.5 },
    lg: { box: 'w-18 h-18', svg: 72, strokeWidth: 4 },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center text-center animate-success-popup">
      {/* Animated Checkmark Circle */}
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing ambient ripple ring */}
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
            isEmerald ? 'bg-emerald-400' : 'bg-[#8A1A32]'
          }`}
          style={{ animationDuration: '1.8s', animationIterationCount: 1 }}
        />

        <div
          className={`relative ${dimensions.box} rounded-full flex items-center justify-center border shadow-xs transition-transform duration-300 ${circleBg}`}
        >
          <svg
            className="w-full h-full p-2.5"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circle stroke */}
            <circle
              className="animate-checkmark-circle"
              cx="26"
              cy="26"
              r="23"
              stroke={strokeColor}
              strokeWidth={dimensions.strokeWidth}
              strokeLinecap="round"
            />
            {/* Checkmark Path */}
            <path
              className="animate-checkmark-check"
              d="M14.5 27.5L22 35L37.5 18"
              stroke={strokeColor}
              strokeWidth={dimensions.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Optional Title & Subtitle with staggered subtle fade-in */}
      {title && (
        <h4 className="text-sm font-bold text-gray-900 mt-2.5 tracking-tight transition-opacity duration-300 animate-in fade-in-50">
          {title}
        </h4>
      )}
      {subtitle && (
        <p className="text-xs text-stone-500 mt-0.5 max-w-[240px] leading-relaxed transition-opacity duration-300 animate-in fade-in-50">
          {subtitle}
        </p>
      )}
    </div>
  );
};
