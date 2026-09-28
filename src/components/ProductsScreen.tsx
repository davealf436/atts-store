import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { triggerHaptic } from '../services/telegram';

interface ProductsScreenProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
}

type FilterCategory = 'all' | 'tradingview' | 'journaling' | 'backtesting' | 'subscriptions';

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  products,
  onViewProduct,
  initialSearchQuery = '',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');

  const filters: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: products.length },
    {
      id: 'tradingview',
      label: 'TradingView',
      count: products.filter((p) => p.category === 'tradingview').length,
    },
    {
      id: 'journaling',
      label: 'Journaling',
      count: products.filter((p) => p.category === 'journaling').length,
    },
    {
      id: 'backtesting',
      label: 'Backtesting',
      count: products.filter((p) => p.category === 'backtesting').length,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      count: products.filter((p) => p.category === 'subscriptions').length,
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesFilter = selectedFilter === 'all' || p.category === selectedFilter;
      const matchesSearch =
        initialSearchQuery.trim() === '' ||
        p.name.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(initialSearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, selectedFilter, initialSearchQuery]);

  return (
    <div className="space-y-3 pb-4">
      {/* 1. Products Header: Compact, Strong Typography & Clean Spacing */}
      <div className="pt-0.5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
          Products
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Explore trading tools, journals &amp; digital resources.
        </p>
      </div>

      {/* 2. Category Filters: Compact, Easy to Swipe Horizontally on Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-0.5 px-0.5">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedFilter(filter.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#721428] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/90 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold leading-none ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Products Stack with Existing Style C Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
          <p className="text-sm font-bold text-gray-900 mb-1">No matching tools</p>
          <p className="text-xs text-gray-500 mb-3">
            No tools found under this category filter.
          </p>
          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedFilter('all');
            }}
            className="text-xs font-bold text-[#721428] hover:underline cursor-pointer"
          >
            Show all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 pt-0.5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              ctaVariant="details"
              showPricePlaceholder={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
