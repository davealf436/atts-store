import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface ProductsScreenProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
}

type FilterCategory = 'all' | 'tradingview' | 'backtesting';

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
    <div className="space-y-4 pb-6">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Product Catalog
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select a verified trading platform or market simulator.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
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
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors shadow-2xs"
        />
      </div>

      {/* Products Stack */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">No matching tools</p>
          <p className="text-xs text-gray-500 mb-3">
            Try adjusting your search query or reset the filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="text-xs font-semibold text-gray-900 underline"
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
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
