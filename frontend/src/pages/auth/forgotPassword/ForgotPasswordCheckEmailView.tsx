import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import AdminThemeToggle from "../../../components/ThemeToggle/AdminThemeToggle";
import FormButton from "../../../components/Button/FormButton";

interface ForgotPasswordCheckEmailViewProps {
  colors: ThemeColors;
  sentEmail: string;
  onResend: () => void;
}

export function ForgotPasswordCheckEmailView({
  colors,
  sentEmail,
  onResend,
}: ForgotPasswordCheckEmailViewProps) {
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
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div
          className="py-8 px-6 rounded-t-2xl flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
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
            style={{ color: colors.text.secondary }}
          >
            {sentEmail}
          </p>
        </div>

        <div className="p-8 text-center space-y-6">
          <div
            className="border rounded-lg p-4"
            style={{
              backgroundColor: `${colors.status.info}20`,
              borderColor: colors.status.info,
            }}
          >
            <Mail
              className="h-8 w-8 mx-auto mb-2"
              style={{ color: colors.status.info }}
            />
            <p className="text-sm" style={{ color: colors.text.primary }}>
              Please check your email inbox (and spam folder) for the password
              reset link.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Didn't receive the email?
            </p>

            <FormButton
              type="button"
              onClick={onResend}
              className="w-half lg:rounded-[10px]"
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
