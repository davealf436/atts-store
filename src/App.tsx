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
import { ProductPage } from './components/ProductPage';
import { CategoryPage, CategoryId } from './components/CategoryPage';
import { SubscriptionPlansPage, SubscriptionFamily } from './components/SubscriptionPlansPage';
import { AthTerminalLoader } from './components/AthTerminalLoader';
import { TelegramAuthError } from './components/TelegramAuthError';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { initTelegramApp, getInitialTelegramUser, triggerNotificationHaptic } from './services/telegram';
import { getAuthState, getAuthError, subscribeToAuth, AuthState } from './services/auth';
import { canAddToCart } from './services/stock';
import { toast } from './services/toast';

export const App: React.FC = () => {
  const getInitialTab = (): NavigationTab => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'wallet') return 'wallet';
      if (hash === 'orders') return 'orders';
      if (hash === 'p2p') return 'p2p';
      if (hash === 'home') return 'home';
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'settings' | 'product' | 'category' | 'plans'>('main');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedPlansFamily, setSelectedPlansFamily] = useState<SubscriptionFamily | null>(null);
  const [returnView, setReturnView] = useState<'main' | 'category' | 'plans'>('main');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(getAuthState);
  const [authError, setAuthError] = useState<string | null>(getAuthError);

  const telegramUser = getInitialTelegramUser();

  // Listen for backend Telegram authentication status
  useEffect(() => {
    setAuthState(getAuthState());
    setAuthError(getAuthError());
    const unsubscribe = subscribeToAuth((state, _account, error) => {
      setAuthState(state);
      setAuthError(error);
    });
    return unsubscribe;
  }, []);

  // Initialize Telegram WebApp viewport & safe-area config, and sync hash
  useEffect(() => {
    initTelegramApp();

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'wallet' || hash === 'p2p' || hash === 'orders' || hash === 'home') {
        setCurrentView('main');
        setSelectedProduct(null);
        setSelectedCategory(null);
        setSelectedPlansFamily(null);
        setActiveTab(hash as NavigationTab);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentView('main');
    setSelectedProduct(null);
    setSelectedCategory(null);
    setSelectedPlansFamily(null);
    setReturnView('main');
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Management with Available Stock Protection
  const handleAddToCart = (product: Product) => {
    const rootId = product.parentProductId || product.id;
    const existing = cartItems.find((item) => item.product.id === product.id);
    const currentQty = existing?.quantity || 0;
    const stockCheck = canAddToCart(rootId, currentQty, 1);

    if (!stockCheck.allowed) {
      triggerNotificationHaptic('error');
      toast.warning('Stock Limit', stockCheck.message || 'Cannot add more items than available in stock.');
      return;
    }

    setCartItems((prev) => {
      const match = prev.find((item) => item.product.id === product.id);
      if (match) {
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

    const item = cartItems.find((i) => i.product.id === productId);
    if (item && quantity > item.quantity) {
      const rootId = item.product.parentProductId || item.product.id;
      const stockCheck = canAddToCart(rootId, item.quantity, quantity - item.quantity);
      if (!stockCheck.allowed) {
        triggerNotificationHaptic('error');
        toast.warning('Stock Limit', stockCheck.message || 'Cannot exceed available stock.');
        return;
      }
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

  // If Telegram authentication failed, show clean ATH error state
  if (hasInitialized && authState === 'error') {
    return (
      <TelegramAuthError
        errorMessage={authError || undefined}
        onRetrySuccess={() => {
          setAuthState('authenticated');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col items-center">
      {/* Premium Full-Screen ATH Terminal Initialization Animation */}
      {!hasInitialized && (
        <AthTerminalLoader onInitialized={() => setHasInitialized(true)} />
      )}

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
        <main className={`flex-1 p-3.5 overflow-y-auto ${currentView === 'product' ? 'pb-16' : 'pb-26'}`}>
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

          {/* Dedicated Category Page View */}
          {currentView === 'category' && selectedCategory && (
            <CategoryPage
              categoryId={selectedCategory}
              onBack={() => {
                setCurrentView('main');
                setSelectedCategory(null);
                setReturnView('main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewProduct={(product) => {
                setSelectedProduct(product);
                setReturnView('category');
                setCurrentView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Dedicated Subscription Plans Page */}
          {currentView === 'plans' && selectedPlansFamily && (
            <SubscriptionPlansPage
              family={selectedPlansFamily}
              products={PRODUCTS}
              onBack={() => {
                setCurrentView('main');
                setSelectedPlansFamily(null);
                setReturnView('main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewProduct={(product) => {
                setSelectedProduct(product);
                setReturnView('plans');
                setCurrentView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Dedicated Product Page View */}
          {currentView === 'product' && selectedProduct && (
            <ProductPage
              product={selectedProduct}
              onBack={() => {
                if (returnView === 'plans' && selectedPlansFamily) {
                  setCurrentView('plans');
                } else if (returnView === 'category' && selectedCategory) {
                  setCurrentView('category');
                } else {
                  setCurrentView('main');
                  setSelectedCategory(null);
                  setSelectedPlansFamily(null);
                }
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {/* Main Tab Views */}
          {currentView === 'main' && (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  products={PRODUCTS}
                  onViewProduct={(product) => {
                    setSelectedProduct(product);
                    setReturnView('main');
                    setCurrentView('product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={handleAddToCart}
                  onNavigateToP2P={() => handleSelectTab('p2p')}
                  onSelectCategory={(categoryId) => {
                    setSelectedCategory(categoryId);
                    setCurrentView('category');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenPlans={(family) => {
                    setSelectedPlansFamily(family);
                    setCurrentView('plans');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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

        {/* Fixed Bottom Navigation (Home · P2P · Wallet · My Orders) - hidden on dedicated product page so Add to Cart bar has full focus */}
        {currentView !== 'product' && (
          <BottomNav
            activeTab={currentView === 'category' || currentView === 'plans' ? 'home' : (currentView !== 'main' ? (currentView as any) : activeTab)}
            onSelectTab={handleSelectTab}
          />
        )}

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
