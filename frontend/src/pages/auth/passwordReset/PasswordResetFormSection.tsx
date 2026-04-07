import type { BaseSyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { type Control, type FieldErrors } from "react-hook-form";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import FormButton from "../../../components/Button/FormButton";
import { PasswordResetAuthShell } from "./PasswordResetAuthShell";
import { PasswordResetFormFields } from "./PasswordResetFormFields";
import type { PasswordResetFormData } from "./passwordResetTypes";

const logo = "/softlogo.png";

type Props = {
  colors: ThemeColors;
  control: Control<PasswordResetFormData>;
  errors: FieldErrors<PasswordResetFormData>;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  isLoading: boolean;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void;
};

export function PasswordResetFormSection({
  colors,
  control,
  errors,
  email,
  password,
  confirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <PasswordResetAuthShell colors={colors}>
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
          Reset Your Password
        </h1>
        <p
          className="mt-2 text-sm text-center"
          style={{ color: colors.text.secondary }}
        >
          Verify your email and create a strong, secure password for your account
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
          <PasswordResetFormFields
            colors={colors}
            control={control}
            errors={errors}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />

          <FormButton
            type="submit"
            disabled={isLoading}
            className="w-full disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Resetting Password...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Lock className="h-5 w-5 mr-2" />
                Reset Password
              </span>
            )}
          </FormButton>
        </form>

        <div
          className="mt-8 p-4 rounded-lg"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: colors.text.primary }}
          >
            Security Tips:
          </h3>
          <ul
            className="text-sm space-y-1"
            style={{ color: colors.text.secondary }}
          >
            <li>• Use a unique password you haven&apos;t used before</li>
            <li>• Consider using a password manager</li>
            <li>• Don&apos;t share your password with anyone</li>
            <li>• Make sure the email matches your account email</li>
          </ul>
        </div>

        <p
          className="mt-8 text-center text-sm"
          style={{ color: colors.text.secondary }}
        >
          Need help?{" "}
          <Link
            to="/contact"
            className="font-medium transition-colors"
            style={{ color: colors.interactive.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.interactive.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.interactive.primary;
            }}
          >
            Contact Support
          </Link>
        </p>
      </div>
    </PasswordResetAuthShell>
  );
}
