"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerApi = void 0;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};
// Helper function to create headers
const createHeaders = (requireAuth = true) => {
    const headers = {
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
exports.bannerApi = {
    // Public endpoints
    getActiveBanners: async (position) => {
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
    getAllBanners: async (params) => {
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
    getBannerById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
            headers: createHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch banner');
        }
        const result = await response.json();
        return result.data;
    },
    createBanner: async (bannerData) => {
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
    updateBanner: async (id, bannerData) => {
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
    deleteBanner: async (id) => {
        const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
            method: 'DELETE',
            headers: createHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete banner');
        }
    },
    bulkUpdateStatus: async (bannerIds, status) => {
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
    getBannerStats: async () => {
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
