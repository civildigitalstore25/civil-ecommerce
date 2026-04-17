export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
}

export const signupFormValidation = {
  fullName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 50,
      message: "Name must not exceed 50 characters",
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: "Name can only contain letters and spaces",
    },
  },
  email: {
    required: "Email address is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  phoneNumber: {
    required: "Phone number is required",
    validate: (value: string) => {
      if (!value) return "Phone number is required";
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        return "Phone number must be 8-15 digits";
      }
      return true;
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: "Password must contain uppercase, lowercase, number, and special character",
    },
  },
  confirmPassword: (password: string) => ({
    required: "Please confirm your password",
    validate: (value: string) => value === password || "Passwords do not match",
  }),
};

export const signupFormDefaults: SignupFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phoneNumber: "",
  countryCode: "+91",
};
