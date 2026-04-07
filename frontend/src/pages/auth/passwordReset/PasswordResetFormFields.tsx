import { CheckCircle, Eye, EyeOff, Mail } from "lucide-react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import FormInput from "../../../components/Input/FormInput";
import { PasswordStrengthChecklist } from "./PasswordStrengthChecklist";
import { validatePasswordStrength } from "./passwordResetValidation";
import type { PasswordResetFormData } from "./passwordResetTypes";

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
};

export function PasswordResetFormFields({
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
}: Props) {
  const passwordValidation = validatePasswordStrength(password);

  return (
    <>
      <div className="relative">
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
              className={`pl-10 ${errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : email && !errors.email
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
                }`}
            />
          )}
        />
        <div className="absolute left-3 top-10 pointer-events-none">
          <Mail
            className="h-5 w-5"
            style={{
              color: errors.email
                ? colors.status.error
                : email && !errors.email
                  ? colors.status.success
                  : colors.text.secondary,
            }}
          />
        </div>
        {email && !errors.email && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <CheckCircle
              className="h-5 w-5"
              style={{ color: colors.status.success }}
            />
          </div>
        )}
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: (value) => {
              const validation = validatePasswordStrength(value);
              if (!validation.isValid) {
                return "Password does not meet security requirements";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <FormInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter your new password"
              className="pr-10"
            />
          )}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="relative">
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field }) => (
            <FormInput
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={field.value}
              onChange={field.onChange}
              placeholder="Confirm your new password"
              className={`pr-10 ${errors.confirmPassword
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : confirmPassword &&
                  password === confirmPassword &&
                  password
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
                }`}
            />
          )}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {password && (
        <PasswordStrengthChecklist
          colors={colors}
          passwordValidation={passwordValidation}
        />
      )}

      {confirmPassword && (
        <div
          className="text-sm flex items-center"
          style={{
            color:
              password === confirmPassword
                ? colors.status.success
                : colors.status.error,
          }}
        >
          <CheckCircle
            className="h-4 w-4 mr-2"
            style={{
              color:
                password === confirmPassword
                  ? colors.status.success
                  : colors.status.error,
            }}
          />
          {password === confirmPassword
            ? "Passwords match"
            : "Passwords do not match"}
        </div>
      )}
    </>
  );
}
