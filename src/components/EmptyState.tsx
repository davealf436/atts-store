import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-12">
      <div className="w-11 h-11 rounded-xl bg-[#FAF0F2] text-[#721428] flex items-center justify-center mb-3.5 border border-[#F0D5DA]">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg bg-[#721428] hover:bg-[#5A0E1E] active:bg-[#470A17] text-white transition-colors shadow-xs active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
