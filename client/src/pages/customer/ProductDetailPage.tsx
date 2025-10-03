// ProductDetailPage component
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Product } from '../../types';

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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.REACT_APP_API_URL || 'http://localhost:6060/api';
  const SERVER_ORIGIN = API_BASE.replace(/\/(api|API)$/, '');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data: BackendProduct | { message?: string } = await res.json();
        if (!res.ok) throw new Error((data as { message?: string }).message || 'Failed to load product');

        const p = data as BackendProduct;
        const mapped: Product = {
          id: String(p._id),
          name: p.name,
          description: p.description || '',
          price: Number(p.price) || 0,
          originalPrice: undefined,
          images: p.image ? [`${SERVER_ORIGIN}${p.image.startsWith('/') ? '' : '/'}${p.image}`] : [],
          category: p.category || 'uncategorized',
          subcategory: undefined,
          rating: 4.4,
          reviewCount: 0,
          inStock: (Number(p.stock) || 0) > 0,
          stockQuantity: Number(p.stock) || 0,
          tags: [],
          brand: '',
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
        };
        setProduct(mapped);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load product';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [API_BASE, SERVER_ORIGIN, id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: 1 }));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="h-80 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-600">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg shadow p-4">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded" />
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">Category: {product.category}</p>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl font-semibold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-5 py-2.5 rounded text-white ${product.inStock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <span className="text-sm text-gray-600">
                {product.inStock ? `${product.stockQuantity} in stock` : 'Currently unavailable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
