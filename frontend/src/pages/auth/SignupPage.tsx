import { useNavigate, Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useAppForm } from "../../hooks/useAppForm";
import Swal from "sweetalert2";
import { useSignUp, useUserInvalidate } from "../../api/userQueries";
import { saveAuth } from "../../utils/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import PasswordInput from "../../components/Input/PasswordInput";
import PhoneInput from "../../components/Input/PhoneInput";
import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import logo from "../../assets/logo.png";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signUpMutation = useSignUp();
  const { colors } = useAdminTheme();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useAppForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signUpData } = data;
    signUpMutation.mutate(signUpData, {
      onSuccess: (data) => {
        saveAuth({
          token: data.token,
          email: data.user.email,
          role: data.user.role,
          userId: data.user.id,
          fullName: data.user.fullName,
        });
        invalidateUser();
        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || "Signup failed";
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: errorMessage,
        });
      },
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Theme Toggle - positioned in top right */}
      <div className="absolute top-4 right-4">
        <AdminThemeToggle />
      </div>

      <div
        className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Header */}
        <div
          className="py-6 px-6 rounded-t-2xl flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
          }}
        >
          <div
            className="p-3 rounded-2xl shadow-md"
            style={{ backgroundColor: colors.background.primary }}
          >
            <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1
            className="text-2xl font-bold mt-4"
            style={{ color: colors.text.primary }}
          >
            Create Account
          </h1>
          <p
            className="mt-2 text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            Join us to access software licenses and downloads
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <Controller
                name="fullName"
                control={control}
                rules={{
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
                }}
                render={({ field }) => (
                  <FormInput
                    label="Full Name "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your full name"
                    required
                  />
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <FormInput
                    label="Email "
                    type="email"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your email"
                    required
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+\d][0-9\s-]{6,20}$/, // allows +, digits, spaces, dashes
                    message: "Please enter a valid phone number",
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    label="Whatsapp Number"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your phone number"
                    required
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message:
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                }}
                render={({ field }) => (
                  <PasswordInput
                    label="Password "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your password"
                    required
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <PasswordInput
                    label="Confirm Password "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Confirm password"
                    required
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <FormButton
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full"
            >
              {signUpMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </FormButton>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: colors.text.secondary }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium transition-colors duration-200"
              style={{ color: colors.interactive.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
