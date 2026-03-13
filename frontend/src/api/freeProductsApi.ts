import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getActiveFreeProducts = async () => {
  const { data } = await axios.get(`${API_URL}/api/free-products/active`);
  return data;
};

export const useActiveFreeProducts = () => {
  return useQuery({
    queryKey: ['activeFreeProducts'],
    queryFn: getActiveFreeProducts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
