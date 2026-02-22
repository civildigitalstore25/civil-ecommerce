import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get all active deals
export const getActiveDeals = async () => {
  const response = await axios.get(`${API_URL}/api/deals/active`);
  return response.data;
};

// Check if a specific product has an active deal
export const checkProductDeal = async (productId: string) => {
  const response = await axios.get(`${API_URL}/api/deals/check/${productId}`);
  return response.data;
};

// React Query hook for active deals
export const useActiveDeals = () => {
  return useQuery({
    queryKey: ['activeDeals'],
    queryFn: getActiveDeals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// React Query hook for checking product deal
export const useProductDeal = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['productDeal', productId],
    queryFn: () => productId ? checkProductDeal(productId) : null,
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
