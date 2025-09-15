export interface User {
  _id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  total: number;
}