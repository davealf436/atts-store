import React, { useState, useEffect } from 'react';
import { NavigationTab, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { P2PScreen } from './components/P2PScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { initTelegramApp } from './services/telegram';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 pb-26 overflow-y-auto">
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

          {activeTab === 'orders' && (
            <OrdersScreen onBrowseProducts={() => setActiveTab('products')} />
          )}
        </main>

        {/* Fixed Bottom Navigation (Strictly Home, Products, P2P, My Orders) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
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
