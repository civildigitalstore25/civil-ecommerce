import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const contactApi = axios.create({
  baseURL: `${API_BASE_URL}/api/contact`,
});

// Add token to requests for authenticated endpoints
contactApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmissionsResponse {
  contacts: ContactSubmission[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// API functions
export const contactApiFunctions = {
  submitContactForm: async (
    data: ContactFormData,
  ): Promise<{ message: string; success: boolean }> => {
    const response = await contactApi.post("/submit", data);
    return response.data;
  },

  getContactSubmissions: async (options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ContactSubmissionsResponse> => {
    const params = new URLSearchParams();
    const search = options?.search ?? "";
    if (search) params.set("search", search);
    if (options?.page !== undefined && options?.limit !== undefined) {
      params.set("page", String(options.page));
      params.set("limit", String(options.limit));
    }
    const qs = params.toString();
    const response = await contactApi.get(`/submissions${qs ? `?${qs}` : ""}`);
    return response.data;
  },
};

// React Query hooks
export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: contactApiFunctions.submitContactForm,
    onSuccess: (data) => {
      // Show success message
      Swal.fire({
        title: "Success!",
        text: data.message || "Your message has been sent successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error: any) => {
      // Show error message
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
};

export const useContactSubmissions = (options?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["contactSubmissions", options],
    queryFn: () => contactApiFunctions.getContactSubmissions(options),
    enabled: !!localStorage.getItem("token"), // Only fetch if user is authenticated
    retry: (failureCount, error: any) => {
      // Don't retry if it's an authentication error (401) or forbidden (403)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });
};
