import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useSignIn, useUserInvalidate } from "../../api/userQueries";
import { saveAuth } from "../../utils/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import GoogleButton from "../../components/Button/GoogleButton";
import PasswordInput from "../../components/Input/PasswordInput";
import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import logo from "../../assets/logo.png";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signInMutation = useSignIn();
  const { colors } = useAdminTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    signInMutation.mutate(
      { email, password },
      {
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
            title: "Login Successful!",
            text: "Welcome back to our platform!",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });

          navigate("/");
        },
        onError: (err: any) => {
          const errorMessage =
            err.response?.data?.message || "Something went wrong";
          setError(errorMessage);

          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorMessage,
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        },
      },
    );
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
            Welcome Back
          </h1>
          <p
            className="mt-2 text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            Sign in to access your software licenses and downloads
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm mb-4"
              style={{
                backgroundColor: `${colors.status.error}20`,
                borderColor: colors.status.error,
                color: colors.status.error,
                border: `1px solid ${colors.status.error}`,
              }}
            >
              {error}
            </div>
          )}

          {/* Google Login */}
          <GoogleButton
            text="Continue with Google"
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
              }/api/auth/google`;
            }}
          />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div
              className="flex-grow border-t"
              style={{ borderColor: colors.border.primary }}
            ></div>
            <span
              className="mx-4 text-sm"
              style={{ color: colors.text.secondary }}
            >
              Or continue with email
            </span>
            <div
              className="flex-grow border-t"
              style={{ borderColor: colors.border.primary }}
            ></div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email "
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <div className="space-y-2">
              <PasswordInput
                label="Password "
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    color: colors.interactive.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.interactive.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.interactive.primary;
                  }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <FormButton
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full"
            >
              {signInMutation.isPending ? "Signing in..." : "Sign In"}
            </FormButton>
          </form>

          <p
            className="mt-8 text-center text-sm"
            style={{ color: colors.text.secondary }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium transition-colors duration-200"
              style={{ color: colors.interactive.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
