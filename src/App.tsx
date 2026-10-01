import React, { useState, useEffect } from 'react';
import { NavigationTab, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { P2PScreen } from './components/P2PScreen';
import { WalletScreen } from './components/WalletScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { initTelegramApp, getInitialTelegramUser } from './services/telegram';

export const App: React.FC = () => {
  const getInitialTab = (): NavigationTab => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'wallet') return 'wallet';
      if (hash === 'orders') return 'orders';
      if (hash === 'home') return 'home';
      if (hash === 'p2p') return 'p2p';
    }
    return 'p2p';
  };

  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'settings'>('main');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const telegramUser = getInitialTelegramUser();

  // Initialize Telegram WebApp viewport & safe-area config, and sync hash
  useEffect(() => {
    initTelegramApp();

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'wallet' || hash === 'p2p' || hash === 'orders' || hash === 'home') {
        setCurrentView('main');
        setActiveTab(hash as NavigationTab);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentView('main');
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleOpenWallet = () => {
    handleSelectTab('wallet');
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col items-center">
      {/* Mobile-first centered frame (320px–430px optimal viewport) */}
      <div className="w-full max-w-md min-h-screen bg-[#F8F9FA] flex flex-col relative sm:border-x sm:border-gray-200/80 sm:shadow-sm">
        {/* Sticky Top Bar with Profile, Notifications, Cart */}
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
              onNavigateToWallet={handleOpenWallet}
              onNavigateToOrders={() => handleSelectTab('orders')}
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
                  onNavigateToP2P={() => handleSelectTab('p2p')}
                />
              )}

              {activeTab === 'p2p' && (
                <P2PScreen
                  user={telegramUser}
                  onNavigateToWallet={() => handleSelectTab('wallet')}
                />
              )}

              {activeTab === 'wallet' && (
                <WalletScreen
                  user={telegramUser}
                  onNavigateToShop={() => handleSelectTab('home')}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersScreen onBrowseProducts={() => handleSelectTab('home')} />
              )}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation (Home · P2P · Wallet · My Orders) */}
        <BottomNav
          activeTab={currentView !== 'main' ? (currentView as any) : activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* Product Detail Modal / Sheet */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Drawer with Instant Wallet Checkout */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBrowseProducts={() => {
            setIsCartOpen(false);
            setActiveTab('home');
          }}
          onClearCart={() => setCartItems([])}
          onNavigateToWallet={handleOpenWallet}
          onViewOrders={() => {
            setCurrentView('main');
            setActiveTab('orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Global Bottom Notification Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;
