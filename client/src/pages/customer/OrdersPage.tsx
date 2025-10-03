// OrdersPage component
import React, { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { Package, Calendar, DollarSign, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  qty: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered';
  shippingInfo: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

const OrdersPage: React.FC = () => {
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch orders';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow">
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {item.product && typeof item.product === 'object' ? (
                            <>
                              <img
                                className="h-12 w-12 rounded object-cover"
                                src={`http://localhost:6060${item.product.image}`}
                                alt={item.product.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.qty} × ${item.product.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                ${(item.qty * item.product.price).toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Product information unavailable
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.qty}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      {/* Total */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Total
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {order.paymentMethod}
                        </p>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingInfo.street && `${order.shippingInfo.street}, `}{order.shippingInfo.city}{order.shippingInfo.state && `, ${order.shippingInfo.state}`} {order.shippingInfo.zipCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingInfo.country}
                        </p>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => {
                          // You can implement a modal or navigate to order details
                          console.log('View order details:', order._id);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
