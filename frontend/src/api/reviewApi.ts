import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/reviews`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Review {
  _id: string;
  product: string | {
    _id: string;
    name: string;
    slug: string;
  };
  user: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
  anonymousName?: string;
  createdBy?: string;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  comment: string;
  isAnonymous?: boolean;
  anonymousName?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
  isAnonymous?: boolean;
  anonymousName?: string;
  createdAt?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  createdAt?: string;
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
export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10,
): Promise<ReviewsResponse> => {
  const response = await api.get(
    `/product/${productId}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

// Get review statistics for a product
export const getProductReviewStats = async (
  productId: string,
): Promise<ReviewStats> => {
  const response = await api.get(`/product/${productId}/stats`);
  return response.data;
};

// Create a new review
export const createReview = async (
  productId: string,
  data: CreateReviewData,
): Promise<Review> => {
  const response = await api.post(`/product/${productId}`, data);
  return response.data;
};

// Update a review
export const updateReview = async (
  reviewId: string,
  data: UpdateReviewData,
): Promise<Review> => {
  const response = await api.put(`/${reviewId}`, data);
  return response.data;
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/${reviewId}`);
};

// Get all reviews for admin (with search and filters)
export const getAllReviews = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: string;
    dateFilter?: string;
  },
): Promise<ReviewsResponse> => {
  const { page, limit, search = "", rating = "", dateFilter = "all" } = params || {};
  const queryParams: Record<string, string> = {};
  if (page !== undefined && limit !== undefined) {
    queryParams.page = String(page);
    queryParams.limit = String(limit);
  }
  if (search?.trim()) queryParams.search = search.trim();
  if (rating) queryParams.rating = rating;
  if (dateFilter && dateFilter !== "all") queryParams.dateFilter = dateFilter;
  const searchParams = new URLSearchParams(queryParams);
  const qs = searchParams.toString();
  const response = await api.get(`/admin/all${qs ? `?${qs}` : ""}`);
  return response.data;
};

// Add a reply to a review
export const addReplyToReview = async (
  reviewId: string,
  data: {
    comment: string;
    isAnonymous?: boolean;
    anonymousName?: string;
  }
): Promise<Review> => {
  const response = await api.post(`/${reviewId}/reply`, data);
  return response.data;
};

// Update a reply
export const updateReply = async (
  reviewId: string,
  replyId: string,
  data: {
    comment: string;
  }
): Promise<Review> => {
  const response = await api.put(`/${reviewId}/reply/${replyId}`, data);
  return response.data;
};

// Delete a reply
export const deleteReply = async (
  reviewId: string,
  replyId: string
): Promise<void> => {
  await api.delete(`/${reviewId}/reply/${replyId}`);
};
// Get recent reviews across all products (for testimonials)
export const getRecentReviews = async (limit = 21): Promise<{ reviews: Review[]; total: number }> => {
  const response = await api.get(`/recent?limit=${limit}`);
  return response.data;
};