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

  getContactSubmissions: async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<ContactSubmissionsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await contactApi.get(`/submissions?${params}`);
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

export const useContactSubmissions = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["contactSubmissions", page, limit, search],
    queryFn: () =>
      contactApiFunctions.getContactSubmissions(page, limit, search),
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
