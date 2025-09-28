// Mock data for development - replace with API calls in production
import { Product, Category, User, Order } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    subcategories: ['T-Shirts', 'Jeans', 'Dresses', 'Jackets']
  },
  {
    id: '2',
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    subcategories: ['Sneakers', 'Boots', 'Sandals', 'Formal']
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    subcategories: ['Bags', 'Jewelry', 'Watches', 'Belts']
  },
  {
    id: '4',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras']
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg'
    ],
    category: 'clothing',
    subcategory: 'T-Shirts',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockQuantity: 50,
    tags: ['cotton', 'casual', 'comfortable'],
    brand: 'StyleCo',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Running Sneakers',
    description: 'High-performance running shoes with advanced cushioning technology.',
    price: 129.99,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
    ],
    category: 'shoes',
    subcategory: 'Sneakers',
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    stockQuantity: 25,
    tags: ['running', 'athletic', 'comfortable'],
    brand: 'SportMax',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Leather Handbag',
    description: 'Elegant leather handbag with multiple compartments and adjustable strap.',
    price: 89.99,
    originalPrice: 109.99,
    images: [
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg'
    ],
    category: 'accessories',
    subcategory: 'Bags',
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    stockQuantity: 15,
    tags: ['leather', 'elegant', 'spacious'],
    brand: 'LuxeBags',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    images: [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
    ],
    category: 'electronics',
    subcategory: 'Headphones',
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 30,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    brand: 'AudioTech',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern fit and vintage wash.',
    price: 79.99,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    category: 'clothing',
    subcategory: 'Jackets',
    rating: 4.4,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 20,
    tags: ['denim', 'classic', 'versatile'],
    brand: 'DenimCo',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '6',
    name: 'Smart Watch',
    description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life.',
    price: 299.99,
    originalPrice: 349.99,
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg'
    ],
    category: 'electronics',
    subcategory: 'Watches',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 12,
    tags: ['smartwatch', 'fitness', 'technology'],
    brand: 'TechWear',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ecommerce.com',
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
    isBlocked: false,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    isAdmin: false,
    isBlocked: false,
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2024-01-02T10:00:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      {
        id: '1',
        product: mockProducts[0],
        quantity: 2,
        selectedSize: 'M'
      },
      {
        id: '2',
        product: mockProducts[1],
        quantity: 1,
        selectedSize: '42'
      }
    ],
    subtotal: 189.97,
    shipping: 9.99,
    tax: 15.20,
    total: 215.16,
    status: 'shipped',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  }
];