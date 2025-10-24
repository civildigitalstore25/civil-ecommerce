import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/reviews`,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Review {
    _id: string;
    product: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface ReviewsResponse {
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get reviews for a product
export const getProductReviews = async (productId: string, page = 1, limit = 10): Promise<ReviewsResponse> => {
    const response = await api.get(`/product/${productId}?page=${page}&limit=${limit}`);
    return response.data;
};

// Get review statistics for a product
export const getProductReviewStats = async (productId: string): Promise<ReviewStats> => {
    const response = await api.get(`/product/${productId}/stats`);
    return response.data;
};

// Create a new review
export const createReview = async (productId: string, data: CreateReviewData): Promise<Review> => {
    const response = await api.post(`/product/${productId}`, data);
    return response.data;
};

// Update a review
export const updateReview = async (reviewId: string, data: UpdateReviewData): Promise<Review> => {
    const response = await api.put(`/${reviewId}`, data);
    return response.data;
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
    await api.delete(`/${reviewId}`);
};

// Get all reviews for admin
export const getAllReviews = async (page = 1, limit = 20): Promise<ReviewsResponse> => {
    const response = await api.get(`/admin/all?page=${page}&limit=${limit}`);
    return response.data;
};