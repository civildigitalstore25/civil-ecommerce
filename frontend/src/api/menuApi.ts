import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface IMenu {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  icon?: string;
  type: 'category' | 'subcategory' | 'brand';
  children?: IMenu[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuDTO {
  name: string;
  slug: string;
  parentId?: string | null;
  order?: number;
  isActive?: boolean;
  icon?: string;
  type?: 'category' | 'subcategory' | 'brand';
}

// Get all menus in hierarchical structure
export const getAllMenus = async (includeInactive: boolean = false) => {
  const response = await axios.get(`${API_URL}/api/menus`, {
    params: { includeInactive: includeInactive ? 'true' : 'false' },
  });
  return response.data;
};

// Get single menu by ID
export const getMenuById = async (id: string) => {
  const response = await axios.get(`${API_URL}/api/menus/${id}`);
  return response.data;
};

// Get menus by parent ID
export const getMenusByParent = async (parentId: string | 'root', includeInactive: boolean = false) => {
  const response = await axios.get(`${API_URL}/api/menus/parent/${parentId}`, {
    params: { includeInactive: includeInactive ? 'true' : 'false' },
  });
  return response.data;
};

// Create new menu (admin only)
export const createMenu = async (menuData: CreateMenuDTO) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/api/menus`, menuData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
