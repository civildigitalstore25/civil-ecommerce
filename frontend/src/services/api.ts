const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`;

// Forgot Password API
export const forgotPasswordAPI = async (data: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send reset email");
  }

  return response.json();
};

// Validate Reset Token API
export const validateResetTokenAPI = async (token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/validate-reset-token/${token}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid reset token");
  }

  return response.json();
};

// Reset Password API - Updated to include email
export const resetPasswordAPI = async (data: {
  token: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password/${data.token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  return response.json();
};
