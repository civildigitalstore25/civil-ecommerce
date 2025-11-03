import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API functions (can be used outside React components)
export const authApi = {
  signUp: async (
    email: string,
    password: string,
    fullName?: string,
    phoneNumber?: string,
  ): Promise<AuthResponse> => {
    const response = await api.post("/register", {
      email,
      password,
      fullName,
      phoneNumber,
    });
    return response.data;
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/logout");
  },

  googleAuth: (): void => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },
  updateProfile: async (data: {
    fullName?: string;
    phoneNumber?: string;
  }): Promise<User> => {
    const response = await api.put("/profile", data);
    return response.data;
  },
};

// React Query hooks
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
      phoneNumber,
    }: {
      email: string;
      password: string;
      fullName?: string;
      phoneNumber?: string;
    }) => authApi.signUp(email, password, fullName, phoneNumber),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: (failureCount, error: any) => {
      // Don't retry if it's an authentication error (401)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear(); // Optional: clear all queries on logout
    },
    onError: () => {
      // Still clear local data even if the server logout fails
      localStorage.removeItem("token");
      queryClient.setQueryData(["currentUser"], null);
    },
  });
};

// Add to auth.ts
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { fullName?: string; phoneNumber?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error: any) => {
      // Show error message
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
};
// Optional: Hook for checking authentication status
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error,
  };
};
