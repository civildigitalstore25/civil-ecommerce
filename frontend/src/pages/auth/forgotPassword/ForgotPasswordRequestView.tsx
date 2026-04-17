import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import AdminThemeToggle from "../../../components/ThemeToggle/AdminThemeToggle";
import FormButton from "../../../components/Button/FormButton";
import FormInput from "../../../components/Input/FormInput";
import type { ForgotPasswordFormData } from "./forgotPasswordTypes";

const logo = "/softlogo.png";

interface ForgotPasswordRequestViewProps {
  colors: ThemeColors;
  control: Control<ForgotPasswordFormData>;
  errors: FieldErrors<ForgotPasswordFormData>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function ForgotPasswordRequestView({
  colors,
  control,
  errors,
  isLoading,
  onSubmit,
}: ForgotPasswordRequestViewProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="absolute top-4 right-4">
        <AdminThemeToggle />
      </div>

      <div
        className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <div
          className="py-6 px-6 rounded-t-2xl flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
          }}
        >
          <div
            className="p-3 rounded-2xl shadow-md cursor-pointer"
            style={{ backgroundColor: colors.background.primary }}
            onClick={() => navigate("/")}
            title="Go to Home"
          >
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h1
            className="text-2xl font-bold mt-4"
            style={{ color: colors.text.primary }}
          >
            Forgot Password?
          </h1>
          <p
            className="mt-2 text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            No worries! Enter your email and we'll send you reset instructions
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm transition-colors"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.secondary;
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
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
                    label="Email Address"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your email address"
                    style={{
                      background: colors.background.primary,
                      color: colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <FormButton type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Reset Instructions
                </span>
              )}
            </FormButton>
          </form>

          <div className="mt-8 p-4 rounded-lg">
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              What happens next?
            </h3>
            <ul
              className="text-sm space-y-1"
              style={{ color: colors.text.secondary }}
            >
              <li>• We'll send a secure link to your email</li>
              <li>• Click the link to create a new password</li>
              <li>• The link expires in 10 minutes for security</li>
            </ul>
          </div>

          <p
            className="mt-8 text-center text-sm"
            style={{ color: colors.text.secondary }}
          >
            Remember your password?{" "}
            <Link
              to="/signin"
              className="font-medium transition-colors"
              style={{ color: colors.interactive.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
