import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShoppingCart, CheckCircle, Shield, Sparkles, Check, Trash2, Zap } from 'lucide-react';
import { triggerHaptic, getInitialTelegramUser } from '../services/telegram';

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
    title: 'P2P Escrow Guarantee',
    description: 'Instant verified escrow channels via Telebirr, CBE & Crypto are operational.',
    time: '4h ago',
    unread: false,
    type: 'system',
  },
];

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const user = getInitialTelegramUser();

  const unreadCount = notifications.filter((n) => n.unread).length;

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

        {/* Right side cluster: Bell Icon + ShoppingCart Icon */}
        <div className="flex items-center gap-2 shrink-0">
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
    </header>
  );
};
