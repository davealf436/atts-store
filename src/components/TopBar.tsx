import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, X, CheckCircle, Shield } from 'lucide-react';
import { triggerHaptic, getInitialTelegramUser } from '../services/telegram';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = getInitialTelegramUser();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-colors">
      <div className="max-w-md mx-auto px-3.5 h-13 flex items-center justify-between gap-2.5">
        {/* 1. Profile pill badge on the left (Avatar initial + Current name) */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsProfileOpen((prev) => !prev);
            }}
            className={`h-9 pl-1.5 pr-2.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95 border ${
              isProfileOpen
                ? 'bg-[#FAF0F2] border-[#721428]/40 shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200/90 shadow-2xs'
            }`}
            aria-label="User Profile"
            title={`${user.first_name || 'User'} Profile`}
          >
            {/* Avatar circle with initial in deep burgundy */}
            <div className="w-6.5 h-6.5 rounded-full bg-[#721428] text-white font-extrabold text-[11.5px] flex items-center justify-center ring-2 ring-[#721428]/15 shrink-0">
              {(user.first_name?.[0] || 'D').toUpperCase()}
            </div>

            {/* Current user name in bold white-burgundy theme */}
            <span className="text-xs font-bold text-gray-900 tracking-tight truncate max-w-[72px] xs:max-w-[95px]">
              {user.first_name || 'Dave'}
            </span>
          </button>

          {/* Compact Profile Card Popover */}
          {isProfileOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5 mb-2.5 pb-2.5 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#721428] text-white font-bold text-sm flex items-center justify-center ring-2 ring-[#721428]/20 shrink-0">
                  {user.first_name?.[0]?.toUpperCase() || 'D'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user.first_name} {user.last_name || ''}
                    </p>
                    <CheckCircle className="w-3.5 h-3.5 text-[#721428] shrink-0" />
                  </div>
                  {user.username && (
                    <p className="text-[11px] text-gray-500 truncate">
                      @{user.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-200/70">
                <span className="flex items-center gap-1 text-[10.5px] font-medium text-gray-700">
                  <Shield className="w-3.5 h-3.5 text-[#721428]" />
                  <span>ATH Member</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  ID: {user.id}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right side cluster: Medium-width search bar + ShoppingCart icon */}
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          {/* 2. Medium-width search bar toward the right */}
          <div className="relative w-full max-w-[210px] sm:max-w-[240px]">
            <Search
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.8}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50/90 hover:bg-gray-100/80 focus:bg-white border border-gray-200/90 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#721428] focus:ring-1 focus:ring-[#721428] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* 3. ShoppingCart icon on the far right */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenCart();
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200/80 transition-all active:scale-95 shrink-0"
            aria-label="Your Cart"
            title="Your Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5 text-[#721428]" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-4 px-1 rounded-full bg-[#721428] text-white font-bold text-[9.5px] flex items-center justify-center leading-none shadow-xs border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
