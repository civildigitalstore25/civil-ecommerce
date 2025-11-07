export interface AuthData {
  token: string;
  email: string;
  role: string;
  userId?: string;
  fullName?: string;
}

export const saveAuth = (authData: AuthData): void => {
  localStorage.setItem("token", authData.token);
  localStorage.setItem("email", authData.email);
  localStorage.setItem("role", authData.role);
  if (authData.userId) {
    localStorage.setItem("userId", authData.userId);
  }
  if (authData.fullName) {
    localStorage.setItem("fullName", authData.fullName);
  }
};

export const getAuth = (): AuthData | null => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");

  if (!token || !email || !role) {
    return null;
  }

  return {
    token,
    email,
    role,
    userId: userId || undefined,
    fullName: fullName || undefined,
  };
};

export const clearAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("fullName");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const isAdmin = (user?: any): boolean => {
  // Check if user object is provided and has admin role
  if (user && user.role === "admin") {
    return true;
  }

  // Fallback to localStorage check
  return localStorage.getItem("role") === "admin";
};
