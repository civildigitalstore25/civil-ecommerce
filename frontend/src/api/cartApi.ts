import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CartItem as CartItemType, CartSummary } from '../types/cartTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/cart`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CartResponse {
  _id: string;
  user: string;
  items: (CartItemType & { _id: string })[];
  summary: CartSummary;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  licenseType: '1year' | '3year' | 'lifetime';
  quantity?: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get('/');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const response = await api.post('/add', data);
    return response.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<CartResponse> => {
    const response = await api.put(`/item/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<CartResponse> => {
    const response = await api.delete(`/item/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const response = await api.delete('/clear');
    return response.data;
  },
};

export const useCart = () => {
  return useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: !!localStorage.getItem('token'), // Only fetch if user is authenticated
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};