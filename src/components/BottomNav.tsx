import React from 'react';
import { Home, ArrowLeftRight, Wallet, ReceiptText } from 'lucide-react';
import { NavigationTab } from '../types';
import { triggerHaptic } from '../services/telegram';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'p2p', label: 'P2P', icon: ArrowLeftRight },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'orders', label: 'My Orders', icon: ReceiptText },
  ];

  return (
    <div className="fixed bottom-3.5 inset-x-0 z-40 pointer-events-none flex justify-center px-2 pb-safe">
      {/* Floating Navigation Surface: Refined slightly rounded rectangle (not a large pill) */}
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className="pointer-events-auto w-full max-w-[420px] bg-white/98 backdrop-blur-md border border-gray-200/90 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] px-1 py-1 grid grid-cols-4 items-center gap-0.5 transition-all duration-150"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center h-12 rounded-lg transition-all select-none active:scale-[0.97] focus-visible:outline-none ${
                isActive
                  ? 'bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA]/80 shadow-2xs font-bold'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#721428] stroke-[2.4]' : 'text-gray-400 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[9.5px] xs:text-[10px] tracking-tight mt-0.5 leading-none transition-colors truncate px-0.5 ${
                  isActive ? 'text-[#721428]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
