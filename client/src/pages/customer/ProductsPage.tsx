import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../store';
import { setProducts, setCategories, updateFilters, setSortBy, setLoading, setError } from '../../store/slices/productsSlice';
import ProductCard from '../../components/common/ProductCard';
import { Filter, Grid2x2 as Grid, List, ChevronDown, Search } from 'lucide-react';
import { Product, Category } from '../../types';

type BackendProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number | string;
  stock: number | string;
  category?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, categories, filters, sortBy } = useSelector((state: RootState) => state.products);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.VITE_API_URL || 'https://e-comm-backend-server.onrender.com/api';
    const fetchProducts = async (): Promise<void> => {
      try {
        dispatch(setLoading(true));
        const res: Response = await fetch(`${API_BASE}/products`);
        const data: unknown = await res.json();
        if (!res.ok) {
          const msg = (data && typeof data === 'object' && 'message' in data) ? (data as { message?: string }).message : undefined;
          throw new Error(msg || 'Failed to load products');
        }

        // Map backend product to UI Product type
        const SERVER_ORIGIN = API_BASE.replace(/\/(api|API)$/,'');
        const mapped: Product[] = (data as BackendProduct[]).map((p) => ({
          id: String(p._id),
          name: p.name,
          description: p.description || '',
          price: Number(p.price) || 0,
          originalPrice: undefined,
          images: p.image
            ? [`${SERVER_ORIGIN}${String(p.image).startsWith('/') ? '' : '/'}${String(p.image)}`]
            : [],
          category: p.category || 'uncategorized',
          subcategory: undefined,
          rating: 4.2,
          reviewCount: 0,
          inStock: (Number(p.stock) || 0) > 0,
          stockQuantity: Number(p.stock) || 0,
          tags: [],
          brand: '',
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
        }));

        dispatch(setProducts(mapped));

        // Derive categories from products
        const catSet = Array.from(new Set(mapped.map((m) => m.category).filter(Boolean)));
        const derivedCategories: Category[] = catSet.map((c) => ({
          id: String(c),
          name: String(c),
          slug: String(c),
          image: '',
          subcategories: [],
        }));
        dispatch(setCategories(derivedCategories));
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load products';
        dispatch(setError(message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();

    // Listen for refresh events from admin create
    const onRefresh = () => fetchProducts();
    window.addEventListener('products:refresh', onRefresh);
    return () => window.removeEventListener('products:refresh', onRefresh);
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      dispatch(updateFilters({ category }));
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams, dispatch]);

  const handleFilterChange = (key: keyof typeof filters, value: string | number | boolean | string[] | [number, number]) => {
    dispatch(updateFilters({ [key]: value }));
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (key === 'category' && value) {
      newSearchParams.set('category', String(value));
    } else if (key === 'category' && !value) {
      newSearchParams.delete('category');
    }
    setSearchParams(newSearchParams);
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  // Fast memoized filtering and sorting
  const filteredProducts = useMemo(() => products
    .filter((product: Product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.inStock && !product.inStock) return false;
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
      if (filters.rating && product.rating < filters.rating) return false;
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) return false;
      return true;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return a.name.localeCompare(b.name);
      }
    }), [products, filters, sortBy, searchQuery]);

  const isLoading = useSelector((state: RootState) => state.products.loading);

  const availableBrands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              {/* Category Tabs */}
              <div className="hidden md:flex items-center space-x-2 overflow-x-auto">
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className={`px-3 py-1.5 rounded-full text-sm border ${!filters.category ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleFilterChange('category', c.slug)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${filters.category === c.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={filters.category === category.slug}
                        onChange={() => handleFilterChange('category', category.slug)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={(e) => {
                          const newBrands = e.target.checked
                            ? [...filters.brand, brand]
                            : filters.brand.filter(b => b !== brand);
                          handleFilterChange('brand', newBrands);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={filters.rating === 0}
                      onChange={() => handleFilterChange('rating', 0)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* In Stock Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;