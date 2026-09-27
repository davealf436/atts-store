import React from 'react';
import { Search, ShoppingBag, X } from 'lucide-react';
import { triggerHaptic } from '../services/telegram';
import { AthLogo } from './AthLogo';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  isSearchOpen,
  onToggleSearch,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-colors">
      <div className="max-w-md mx-auto px-4 h-13 flex items-center justify-between gap-3">
        {/* Brand identity: ATH Logo with subtle smooth entrance animation */}
        <div className="flex items-center gap-2.5 min-w-0">
          <AthLogo size="sm" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-none truncate">
              Abyssinia Trading Hub
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-tight mt-0.5 truncate">
              Built for Better Trading.
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search Toggle Icon */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleSearch();
            }}
            className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center transition-colors active:scale-95 ${
              isSearchOpen
                ? 'bg-[#FAF0F2] text-[#721428]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Search products"
            title="Search products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Icon (Top-Bar only) */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenCart();
            }}
            className="relative w-8.5 h-8.5 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="Shopping Cart"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute 1 top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#721428] text-white font-bold text-[10px] flex items-center justify-center leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Inline Search Bar */}
      {isSearchOpen && (
        <div className="max-w-md mx-auto px-4 pb-2.5 pt-0.5 border-t border-gray-100 animate-in fade-in duration-150">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search TradingView, FXReplay..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#721428] focus:ring-1 focus:ring-[#721428] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
