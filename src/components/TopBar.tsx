import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  ShoppingCart, 
  Shield, 
  Sparkles, 
  Check, 
  Trash2, 
  Zap, 
  User, 
  Settings, 
  ChevronRight, 
  Search, 
  X,
  ArrowRight
} from 'lucide-react';
import { triggerHaptic, getInitialTelegramUser } from '../services/telegram';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductPhotoLogo } from './ProductPhotoLogo';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'promo' | 'stock' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'TradingView Stock Refilled',
    description: 'TradingView Premium & Essential plans are active with instant Telegram delivery.',
    time: '15m ago',
    unread: true,
    type: 'stock',
  },
  {
    id: 'notif-2',
    title: 'Exclusive Weekend Offer',
    description: 'Special 20% discount on FXReplay Pro 1-year licenses is active today.',
    time: '1h ago',
    unread: true,
    type: 'promo',
  },
  {
    id: 'notif-3',
    title: 'P2P Trading Verified',
    description: 'Instant verified channels via Telebirr, CBE & Crypto are operational.',
    time: '4h ago',
    unread: false,
    type: 'system',
  },
];

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  onOpenProfile,
  onOpenSettings,
  onSelectProduct,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const user = getInitialTelegramUser();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Filter products for global search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isProfileOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isNotificationsOpen]);

  const handleMarkAllAsRead = () => {
    triggerHaptic('light');
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearNotifications = () => {
    triggerHaptic('light');
    setNotifications([]);
  };

  const handleToggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-colors">
      <div className="max-w-md mx-auto px-3.5 h-13 flex items-center justify-between gap-2.5">
        {/* 1. Profile pill badge on the left (Avatar initial + Current name) */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsNotificationsOpen(false);
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
            <span className="text-xs font-bold text-gray-900 tracking-tight truncate max-w-[85px] xs:max-w-[105px]">
              {user.first_name || 'Dave'}
            </span>
          </button>

          {/* Profile Menu Popover with Profile and Settings */}
          {isProfileOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 select-none">
              {/* User Identity Mini Banner */}
              <div className="px-2.5 py-2 mb-1.5 border-b border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#721428] text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#721428]/20 shrink-0">
                  {user.first_name?.[0]?.toUpperCase() || 'D'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user.first_name} {user.last_name || ''}
                  </p>
                  <p className="text-[10.5px] text-gray-400 truncate">
                    {user.username ? `@${user.username}` : 'ATH Member'}
                  </p>
                </div>
              </div>

              {/* Two Clean Options: Profile and Settings */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setIsProfileOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#FAF0F2] text-gray-800 hover:text-[#721428] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-200/80 group-hover:border-[#F0D5DA] flex items-center justify-center text-gray-600 group-hover:text-[#721428] transition-colors">
                      <User className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-bold">Profile</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#721428] transition-colors" />
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setIsProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#FAF0F2] text-gray-800 hover:text-[#721428] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-200/80 group-hover:border-[#F0D5DA] flex items-center justify-center text-gray-600 group-hover:text-[#721428] transition-colors">
                      <Settings className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-bold">Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#721428] transition-colors" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side cluster: Search Icon + Bell Icon + ShoppingCart Icon */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 1. Global Search Icon */}
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsProfileOpen(false);
              setIsNotificationsOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200/80 transition-all active:scale-95 shrink-0 cursor-pointer"
            aria-label="Search Tools & Products"
            title="Search Tools & Products"
          >
            <Search className="w-4.5 h-4.5 stroke-[1.8]" />
          </button>

          {/* 2. Bell Icon Feature */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsProfileOpen(false);
                setIsNotificationsOpen((prev) => !prev);
              }}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border ${
                isNotificationsOpen
                  ? 'bg-[#FAF0F2] text-[#721428] border-[#721428]/40 shadow-xs'
                  : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-200/80'
              }`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#721428] ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Popover */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 xs:w-80 bg-white rounded-2xl shadow-xl border border-gray-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Popover Header */}
                <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-semibold bg-[#FAF0F2] text-[#721428] px-1.5 py-0.5 rounded-full border border-[#F0D5DA]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10.5px] font-medium text-[#721428] hover:text-[#520c1c] flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-[#FAF0F2] transition-colors"
                        title="Mark all as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearNotifications}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200/60 transition-colors"
                        title="Clear all"
                        aria-label="Clear all notifications"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-xs">
                      <p className="font-semibold text-gray-600">All caught up!</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">No new announcements or alerts.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleNotification(item.id)}
                        className={`p-3 flex items-start gap-2.5 transition-colors cursor-pointer ${
                          item.unread ? 'bg-[#FAF0F2]/40 hover:bg-[#FAF0F2]/70' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === 'stock'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : item.type === 'promo'
                              ? 'bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}
                        >
                          {item.type === 'stock' ? (
                            <Zap className="w-3.5 h-3.5" />
                          ) : item.type === 'promo' ? (
                            <Sparkles className="w-3.5 h-3.5" />
                          ) : (
                            <Shield className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {item.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#721428] shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. ShoppingCart Icon on the far right */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsProfileOpen(false);
              setIsNotificationsOpen(false);
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

      {/* Global Quick-Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-20 animate-in fade-in duration-150"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-gray-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search Tools"
          >
            {/* Search Input Bar */}
            <div className="p-3 border-b border-gray-100 flex items-center gap-2.5">
              <Search className="w-4.5 h-4.5 text-[#721428] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, journals, licenses..."
                className="flex-1 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                  aria-label="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                Done
              </button>
            </div>

            {/* Quick Suggestions Chips (when no input) */}
            {!searchQuery.trim() && (
              <div className="p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Quick Searches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['TradingView', 'FXReplay', 'Abyssinia Journal', 'Telegram Premium', 'Backtesting'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-xs font-medium text-gray-700 hover:text-[#721428] transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results List */}
            {searchQuery.trim() && (
              <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p className="text-xs font-bold text-gray-700">No matching tools</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      No results found for "{searchQuery}".
                    </p>
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setIsSearchOpen(false);
                        onSelectProduct?.(product);
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#FAF0F2]/60 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ProductPhotoLogo productId={product.id} size="sm" className="border border-gray-200 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9.5px] font-bold text-[#721428] uppercase tracking-wider">
                              {product.brand}
                            </span>
                            {product.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#721428] transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-[10.5px] text-gray-500 truncate">
                            {product.startingPricePlaceholder}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#721428] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
