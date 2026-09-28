import React, { useState, useEffect } from 'react';
import { NavigationTab, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { P2PScreen } from './components/P2PScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WalletComingSoonModal } from './components/WalletComingSoonModal';
import { initTelegramApp } from './services/telegram';
import { Wallet } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'settings'>('main');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize Telegram WebApp viewport & safe-area config
  useEffect(() => {
    initTelegramApp();
  }, []);

  // Cart Management
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col items-center">
      {/* Mobile-first centered frame (320px–430px optimal viewport) */}
      <div className="w-full max-w-md min-h-screen bg-[#F8F9FA] flex flex-col relative sm:border-x sm:border-gray-200/80 sm:shadow-sm">
        {/* Sticky Top Bar (Never contains bottom nav cart) */}
        <TopBar
          cartCount={cartTotalCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProfile={() => {
            setCurrentView('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSettings={() => {
            setCurrentView('settings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 pb-26 overflow-y-auto">
          {/* Dedicated Profile View */}
          {currentView === 'profile' && (
            <ProfileScreen
              onBack={() => setCurrentView('main')}
              onNavigateToOrders={() => {
                setCurrentView('main');
                setActiveTab('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Dedicated Settings View */}
          {currentView === 'settings' && (
            <SettingsScreen
              onBack={() => setCurrentView('main')}
            />
          )}

          {/* Main Tab Views */}
          {currentView === 'main' && (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  products={PRODUCTS}
                  onViewProduct={(product) => setSelectedProduct(product)}
                  onAddToCart={handleAddToCart}
                  onNavigateToProducts={() => setActiveTab('products')}
                  onNavigateToP2P={() => setActiveTab('p2p')}
                />
              )}

              {activeTab === 'products' && (
                <ProductsScreen
                  products={PRODUCTS}
                  onViewProduct={(product) => setSelectedProduct(product)}
                  onAddToCart={handleAddToCart}
                  initialSearchQuery={searchQuery}
                />
              )}

              {activeTab === 'p2p' && <P2PScreen />}

              {activeTab === 'wallet' && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF0F2] border border-[#F0D5DA] flex items-center justify-center text-[#721428] shadow-xs mb-3">
                    <Wallet className="w-7 h-7 stroke-[1.8]" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F2] text-[#721428] border border-[#F0D5DA] text-[10px] font-extrabold tracking-wider uppercase mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#721428] animate-pulse" />
                    <span>Coming Soon</span>
                  </span>
                  <h2 className="text-lg font-bold text-stone-900 tracking-tight mb-1">ATH Wallet</h2>
                  <p className="text-xs text-stone-600 max-w-xs mb-4">
                    Direct crypto balances and automated settlements are currently in development.
                  </p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 rounded-lg bg-[#721428] hover:bg-[#5A0E1E] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Return to Home
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <OrdersScreen onBrowseProducts={() => setActiveTab('products')} />
              )}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation (Home, Products, P2P, Wallet, My Orders) */}
        <BottomNav
          activeTab={currentView !== 'main' ? (currentView as any) : isWalletModalOpen ? 'wallet' : activeTab}
          onSelectTab={(tab) => {
            setCurrentView('main');
            if (tab === 'wallet') {
              setIsWalletModalOpen(true);
              return;
            }
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Wallet Coming Soon Modal */}
        <WalletComingSoonModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />

        {/* Product Detail Modal / Sheet */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBrowseProducts={() => {
            setIsCartOpen(false);
            setActiveTab('products');
          }}
        />
      </div>
    </div>
  );
};

export default App;
