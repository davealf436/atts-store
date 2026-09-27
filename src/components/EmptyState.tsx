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
    <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mb-4 ring-1 ring-gray-200/80">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
