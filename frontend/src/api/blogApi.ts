import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  BlogFormData,
  BlogsResponse,
  BlogResponse,
  BlogCategoriesResponse,
  BlogTagsResponse,
} from "./types/blogTypes";
import { getAuth } from "../utils/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Blog API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Public Hooks

// Get all blogs with filters
export const useBlogs = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  order?: string;
}) => {
  return useQuery<BlogsResponse>({
    queryKey: ["blogs", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/blogs", { params });
      return data;
    },
  });
};

// Get single blog by slug
export const useBlogBySlug = (slug: string) => {
  return useQuery<BlogResponse>({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blogs/slug/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

// Get featured blogs
export const useFeaturedBlogs = (limit: number = 5) => {
  return useQuery<BlogsResponse>({
    queryKey: ["featuredBlogs", limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blogs/featured?limit=${limit}`);
      return data;
    },
  });
};

// Get blog categories
export const useBlogCategories = () => {
  return useQuery<BlogCategoriesResponse>({
    queryKey: ["blogCategories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/blogs/categories");
      return data;
    },
  });
};

// Get popular tags
export const usePopularTags = () => {
  return useQuery<BlogTagsResponse>({
    queryKey: ["blogTags"],
    queryFn: async () => {
      const { data } = await apiClient.get("/blogs/tags");
      return data;
    },
  });
};

// Admin Hooks

// Get blog by ID (for editing)
export const useBlogById = (id: string) => {
  return useQuery<BlogResponse>({
    queryKey: ["blogById", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blogs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, BlogFormData>({
    mutationFn: async (blogData: BlogFormData) => {
      const { data } = await apiClient.post("/blogs", blogData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

// Update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, { id: string; data: Partial<BlogFormData> }>({
    mutationFn: async ({ id, data: blogData }) => {
      const { data } = await apiClient.put(`/blogs/${id}`, blogData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogById", variables.id] });
    },
  });
};

// Delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
