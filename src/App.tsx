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
import { initTelegramApp, getInitialTelegramUser } from './services/telegram';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'settings'>('main');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const telegramUser = getInitialTelegramUser();

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

  const handleOpenWallet = () => {
    setCurrentView('main');
    setActiveTab('wallet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col items-center">
      {/* Mobile-first centered frame (320px–430px optimal viewport) */}
      <div className="w-full max-w-md min-h-screen bg-[#F8F9FA] flex flex-col relative sm:border-x sm:border-gray-200/80 sm:shadow-sm">
        {/* Sticky Top Bar with Profile, Dedicated Wallet Button, Notifications, Cart */}
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
          onOpenWallet={handleOpenWallet}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 pb-26 overflow-y-auto">
          {/* Dedicated Profile View */}
          {currentView === 'profile' && (
            <ProfileScreen
              onBack={() => setCurrentView('main')}
              onNavigateToWallet={handleOpenWallet}
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
                  onNavigateToP2P={() => {
                    setActiveTab('p2p');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {activeTab === 'p2p' && <P2PScreen />}

              {activeTab === 'wallet' && (
                <WalletScreen
                  user={telegramUser}
                  onNavigateToShop={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersScreen onBrowseProducts={() => setActiveTab('home')} />
              )}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation (Home · P2P · Wallet · My Orders) */}
        <BottomNav
          activeTab={currentView !== 'main' ? (currentView as any) : activeTab}
          onSelectTab={(tab) => {
            setCurrentView('main');
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
      </div>
    </div>
  );
};

export default App;
