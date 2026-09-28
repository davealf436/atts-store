import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';

interface ProductsScreenProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
}

type FilterCategory = 'all' | 'tradingview' | 'backtesting' | 'journaling' | 'subscriptions';

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  products,
  onViewProduct,
  onAddToCart,
  initialSearchQuery = '',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const filters: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Tools', count: products.length },
    {
      id: 'tradingview',
      label: 'TradingView',
      count: products.filter((p) => p.category === 'tradingview').length,
    },
    {
      id: 'backtesting',
      label: 'Backtesting',
      count: products.filter((p) => p.category === 'backtesting').length,
    },
    {
      id: 'journaling',
      label: 'Journaling',
      count: products.filter((p) => p.category === 'journaling').length,
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
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, selectedFilter, searchQuery]);

  return (
    <div className="space-y-3.5 pb-4">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          Product Catalog
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select a verified trading platform or market simulator to view specs and options.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#721428] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/90 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#5A0E1E] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by name, brand, or feature..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#721428] focus:ring-1 focus:ring-[#721428] transition-colors shadow-2xs"
        />
      </div>

      {/* Products Stack with Style C Mixed Cards */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-1">No matching tools</p>
          <p className="text-xs text-gray-500 mb-3">
            Try adjusting your search query or reset the filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="text-xs font-bold text-[#721428] underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
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
