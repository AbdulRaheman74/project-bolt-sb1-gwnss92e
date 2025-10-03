// Simple orders hook to call createOrder, getOrders, getOrderById
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useOrders = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.REACT_APP_API_URL || 'http://localhost:6060/api';

  const createOrder = useCallback(async (payload: Record<string, unknown>) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to create order');
    return data;
  }, [API_BASE, token]);

  const getOrders = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/orders/my`, {
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to fetch orders');
    return data;
  }, [API_BASE, token]);

  const getOrderById = useCallback(async (orderId: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to fetch order');
    return data;
  }, [API_BASE, token]);

  return {
    createOrder,
    getOrders,
    getOrderById,
  };
};


