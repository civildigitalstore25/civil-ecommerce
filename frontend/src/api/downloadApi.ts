import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DownloadResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    productName: string;
    productVersion: string;
    fileName: string;
    message: string;
  };
  message?: string;
}

// Get secure download URL for a purchased product
// Uses the /secure endpoint which streams through server (users never see Drive link)
export const getProductDownloadUrl = async (orderId: string, productId: string): Promise<DownloadResponse> => {
  try {
    // Use the secure endpoint that streams through our server
    const secureUrl = `${API_BASE_URL}/api/download/${orderId}/${productId}/secure`;
    
    return {
      success: true,
      data: {
        downloadUrl: secureUrl,
        productName: '',
        productVersion: '',
        fileName: 'download',
        message: 'Download link generated'
      }
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get download link');
  }
};

// Stream download (alternative method)
export const streamProductDownload = async (orderId: string, productId: string) => {
  try {
    const response = await api.get(`/download/${orderId}/${productId}/stream`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download product');
  }
};
