import { Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import FormButton from "../../../components/Button/FormButton";
import { PasswordResetAuthShell } from "./PasswordResetAuthShell";

export function PasswordResetValidatingView({ colors }: { colors: ThemeColors }) {
  return (
    <PasswordResetAuthShell colors={colors}>
      <div className="p-8 text-center">
        <div
          className="animate-spin mx-auto h-12 w-12 border-4 border-t-transparent rounded-full mb-4"
          style={{
            borderColor: `${colors.interactive.primary}40`,
            borderTopColor: "transparent",
          }}
        />
        <p style={{ color: colors.text.secondary }}>Validating reset link...</p>
      </div>
    </PasswordResetAuthShell>
  );
}

export function PasswordResetInvalidTokenView({ colors }: { colors: ThemeColors }) {
  return (
    <PasswordResetAuthShell colors={colors}>
      <div
        className="py-8 px-6 rounded-t-2xl flex flex-col items-center"
        style={{
          background: `linear-gradient(135deg, ${colors.status.error}20, ${colors.status.error}40)`,
        }}
      >
        <div
          className="p-4 rounded-full shadow-md mb-4"
          style={{ backgroundColor: colors.background.primary }}
        >
          <Lock className="h-12 w-12" style={{ color: colors.status.error }} />
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Invalid Reset Link
        </h1>
        <p
          className="mt-2 text-sm text-center"
          style={{ color: colors.text.secondary }}
        >
          This password reset link is invalid or has expired
        </p>
      </div>

      <div className="p-8 text-center space-y-6">
        <div
          className="border rounded-lg p-4"
          style={{
            backgroundColor: `${colors.status.error}20`,
            borderColor: colors.status.error,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.primary }}>
            The link may have expired or been used already. Please request a new
            password reset.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/forgot-password">
            <FormButton className="w-full">Request New Reset Link</FormButton>
          </Link>
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
    </PasswordResetAuthShell>
  );
}

export function PasswordResetSuccessView({ colors }: { colors: ThemeColors }) {
  return (
    <PasswordResetAuthShell colors={colors}>
      <div
        className="py-8 px-6 rounded-t-2xl flex flex-col items-center"
        style={{
          background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.status.success}40)`,
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
          Password Reset Complete
        </h1>
        <p
          className="mt-2 text-sm text-center"
          style={{ color: colors.text.secondary }}
        >
          Your password has been successfully updated
        </p>
      </div>

      <div className="p-8 text-center space-y-6">
        <div
          className="border rounded-lg p-4"
          style={{
            backgroundColor: `${colors.status.success}20`,
            borderColor: colors.status.success,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.primary }}>
            You can now sign in with your new password. You&apos;ll be redirected
            to the sign in page shortly.
          </p>
        </div>

        <Link to="/signin">
          <FormButton className="w-full">Continue to Sign In</FormButton>
        </Link>
      </div>
    </PasswordResetAuthShell>
  );
}
