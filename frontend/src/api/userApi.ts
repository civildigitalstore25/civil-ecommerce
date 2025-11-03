import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UsersResponse } from "./types/userTypes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get("/", { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  createUser: async (userData: {
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: "user" | "admin";
    password: string;
  }): Promise<User> => {
    const response = await api.post("/", userData);
    return response.data;
  },

  updateUser: async (
    id: string,
    data: { role?: string; isActive?: boolean },
  ): Promise<User> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { role?: string; isActive?: boolean };
    }) => userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      email: string;
      fullName: string;
      phoneNumber?: string;
      role: "user" | "admin";
      password: string;
    }) => userApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
