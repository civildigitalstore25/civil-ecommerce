import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import { forgotPasswordAPI } from "../../services/api";
import logo from "../../assets/logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { colors } = useAdminTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // API call to send password reset email
      await forgotPasswordAPI({ email });

      setIsEmailSent(true);

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Please check your email for password reset instructions.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail("");
  };

  if (isEmailSent) {
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
            className="py-8 px-6 rounded-t-2xl flex flex-col items-center"
            style={{
              background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`
            }}
          >
            <div
              className="p-4 rounded-full shadow-md mb-4"
              style={{ backgroundColor: colors.background.primary }}
            >
              <CheckCircle
                className="h-12 w-12"
                style={{ color: colors.status.success }}
              />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Check Your Email
            </h1>
            <p
              className="mt-2 text-sm text-center"
              style={{ color: colors.text.secondary }}
            >
              We've sent password reset instructions to
            </p>
            <p
              className="font-medium text-sm mt-1"
              style={{ color: colors.interactive.primary }}
            >
              {email}
            </p>
          </div>

          {/* Body */}
          <div className="p-8 text-center space-y-6">
            <div
              className="border rounded-lg p-4"
              style={{
                backgroundColor: `${colors.status.info}20`,
                borderColor: colors.status.info
              }}
            >
              <Mail
                className="h-8 w-8 mx-auto mb-2"
                style={{ color: colors.status.info }}
              />
              <p
                className="text-sm"
                style={{ color: colors.text.primary }}
              >
                Please check your email inbox (and spam folder) for the password reset link.
              </p>
            </div>

            <div className="space-y-4">
              <p
                className="text-sm"
                style={{ color: colors.text.secondary }}
              >
                Didn't receive the email?
              </p>

              <FormButton
                type="button"
                onClick={handleResendEmail}
                className="w-full"
              >
                Resend Email
              </FormButton>
            </div>

            <div
              className="pt-4 border-t"
              style={{ borderColor: colors.border.primary }}
            >
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
          </div>
        </div>
      </div>
    );
  }

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
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`
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
            Forgot Password?
          </h1>
          <p
            className="mt-2 text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            No worries! Enter your email and we'll send you reset instructions
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Back to Sign In Link */}
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

          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm mb-6"
              style={{
                backgroundColor: `${colors.status.error}20`,
                borderColor: colors.status.error,
                color: colors.status.error,
                border: `1px solid ${colors.status.error}`
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />

            <FormButton
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

          {/* Additional Info */}
          <div
            className="mt-8 p-4 rounded-lg"
            style={{ backgroundColor: colors.background.tertiary }}
          >
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