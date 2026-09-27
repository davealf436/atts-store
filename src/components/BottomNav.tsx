import React from 'react';
import { Home, Layers, ArrowLeftRight, Package } from 'lucide-react';
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
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'p2p', label: 'P2P', icon: ArrowLeftRight },
    { id: 'orders', label: 'My Orders', icon: Package },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 pb-safe shadow-xs">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-15 px-2">
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
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors select-none active:scale-95 group focus-visible:outline-none"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'text-gray-900 stroke-[2.4]'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-gray-900 font-semibold' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-gray-900 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
