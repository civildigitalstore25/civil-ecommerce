import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/enquiries`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Enquiry {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
    image: string;
  };
  productName?: string;
  productImage?: string;
  subject: string;
  message: string;
  status: "pending" | "replied" | "closed";
  adminReply?: string;
  repliedBy?: {
    _id: string;
    fullName: string;
  };
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryData {
  productId?: string;
  subject: string;
  message: string;
}

export interface EnquiriesResponse {
  success: boolean;
  data: {
    enquiries: Enquiry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats?: {
      pending: number;
      replied: number;
      closed: number;
    };
  };
}

export interface EnquiryResponse {
  success: boolean;
  data: Enquiry;
  message?: string;
}

// Create a new enquiry
export const createEnquiry = async (
  data: CreateEnquiryData
): Promise<Enquiry> => {
  try {
    const response = await api.post<EnquiryResponse>("/", data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create enquiry");
    }
    throw error;
  }
};

// Get all enquiries (Admin)
export const getAllEnquiries = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<EnquiriesResponse["data"]> => {
  try {
    const response = await api.get<EnquiriesResponse>("/", { params });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch enquiries");
    }
    throw error;
  }
};

// Get user's enquiries
export const getUserEnquiries = async (params?: {
  page?: number;
  limit?: number;
}): Promise<EnquiriesResponse["data"]> => {
  try {
    const response = await api.get<EnquiriesResponse>("/my-enquiries", { params });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch enquiries");
    }
    throw error;
  }
};

// Get single enquiry
export const getEnquiry = async (id: string): Promise<Enquiry> => {
  try {
    const response = await api.get<EnquiryResponse>(`/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch enquiry");
    }
    throw error;
  }
};

// Reply to enquiry (Admin)
export const replyToEnquiry = async (
  id: string,
  reply: string
): Promise<Enquiry> => {
  try {
    const response = await api.post<EnquiryResponse>(`/${id}/reply`, { reply });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send reply");
    }
    throw error;
  }
};

// Update enquiry status (Admin)
export const updateEnquiryStatus = async (
  id: string,
  status: "pending" | "replied" | "closed"
): Promise<Enquiry> => {
  try {
    const response = await api.patch<EnquiryResponse>(`/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update status");
    }
    throw error;
  }
};

// Delete enquiry (Admin)
export const deleteEnquiry = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete enquiry");
    }
    throw error;
  }
};
