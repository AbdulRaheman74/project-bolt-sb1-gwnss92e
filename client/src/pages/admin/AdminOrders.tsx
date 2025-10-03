// AdminOrders component
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Package, User, Calendar, DollarSign, MapPin, CreditCard, Eye } from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  qty: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingInfo: {
    address?: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders: React.FC = () => {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.VITE_API_URL || 'https://e-comm-backend-server.onrender.com/api';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admins/orders`, {
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      setSuccess(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh the list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      setError(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin, fetchOrders]);

  if (!isAuthenticated || !isAdmin) {
    return <div className="p-6">Only admins can view orders.</div>;
  }

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 text-red-700 bg-red-50">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">×</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded border border-green-200 text-green-700 bg-green-50">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-2 text-green-500 hover:text-green-700">×</button>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow border">
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Customer Info */}
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Shipping Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.shippingInfo.city}, {order.shippingInfo.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={`${API_BASE.replace('/api', '')}${item.product.image}`}
                          alt={item.product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty} × ${item.product.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.product.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Status Update Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'shipped')}
                          disabled={updatingOrderId === order._id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            updatingOrderId === order._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {updatingOrderId === order._id ? 'Updating...' : 'Mark as Shipped'}
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          disabled={updatingOrderId === order._id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            updatingOrderId === order._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {updatingOrderId === order._id ? 'Updating...' : 'Mark as Delivered'}
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-lg">
                          Order Completed
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Last updated: {formatDate(order.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
