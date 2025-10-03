// Simple orders hook to call createOrder, getOrders, getOrderById
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useOrders = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const API_BASE = (import.meta as unknown as { env: Record<string, string | undefined> }).env?.VITE_API_URL || 'https://e-comm-backend-server.onrender.com/api';
  console.log('API_BASE:', API_BASE);


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
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
  
      const res = await fetch(`${API_BASE}/orders/my`, { headers });
  
      const data = await res.json().catch(() => null); // agar JSON parse fail ho jaye
      if (!res.ok) throw new Error(data?.message || `Failed with status ${res.status}`);
  
      return data;
    } catch (err) {
      console.error('getOrders error:', err);
      throw err; // ya custom error handle
    }
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


