import type { Banner, BannerResponse, BannerStats } from '../types/Banner'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (requireAuth = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const bannerApi = {
  // Public endpoints
  getActiveBanners: async (position?: string): Promise<Banner[]> => {
    const url = new URL(`${API_BASE_URL}/banners/active`);
    if (position) {
      url.searchParams.append('position', position);
    }
    
    const response = await fetch(url.toString(), {
      headers: createHeaders(false),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch active banners');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Admin endpoints
  getAllBanners: async (params?: {
    status?: string;
    position?: string;
    bannerType?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BannerResponse> => {
    const url = new URL(`${API_BASE_URL}/banners`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(url.toString(), {
      headers: createHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
    
    return response.json();
  },

  getBannerById: async (id: string): Promise<Banner> => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      headers: createHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch banner');
    }
    
    const result = await response.json();
    return result.data;
  },

  createBanner: async (bannerData: Omit<Banner, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> => {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(bannerData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create banner');
    }
    
    const result = await response.json();
    return result.data;
  },

  updateBanner: async (id: string, bannerData: Partial<Banner>): Promise<Banner> => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(bannerData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update banner');
    }
    
    const result = await response.json();
    return result.data;
  },

  deleteBanner: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete banner');
    }
  },

  bulkUpdateStatus: async (bannerIds: string[], status: string): Promise<{ modifiedCount: number }> => {
    const response = await fetch(`${API_BASE_URL}/banners/bulk-status`, {
      method: 'PATCH',
      headers: createHeaders(),
      body: JSON.stringify({ bannerIds, status }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update banners');
    }
    
    const result = await response.json();
    return result;
  },

  getBannerStats: async (): Promise<BannerStats> => {
    const response = await fetch(`${API_BASE_URL}/banners/stats`, {
      headers: createHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch banner statistics');
    }
    
    const result = await response.json();
    return result.data;
  },
};