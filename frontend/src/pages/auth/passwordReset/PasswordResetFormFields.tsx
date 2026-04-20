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
              className={`${errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : email && !errors.email
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
                }`}
              startAdornment={
                <Mail
                  className="h-5 w-5 shrink-0"
                  style={{
                    color: errors.email
                      ? colors.status.error
                      : email && !errors.email
                        ? colors.status.success
                        : colors.text.secondary,
                  }}
                  aria-hidden
                />
              }
              endAdornment={
                email && !errors.email ? (
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-hidden
                  >
                    <CheckCircle
                      className="h-5 w-5 shrink-0"
                      style={{ color: colors.status.success }}
                    />
                  </span>
                ) : undefined
              }
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

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
              endAdornment={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 z-10 flex cursor-pointer items-center px-3 transition-colors"
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
                    <EyeOff className="h-5 w-5 shrink-0" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5 shrink-0" aria-hidden />
                  )}
                </button>
              }
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
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
              className={`${errors.confirmPassword
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : confirmPassword &&
                    password === confirmPassword &&
                    password
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
                }`}
              endAdornment={
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-0 z-10 flex cursor-pointer items-center px-3 transition-colors"
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
                    <EyeOff className="h-5 w-5 shrink-0" aria-hidden />
                  ) : (
                    <Eye className="h-5 w-5 shrink-0" aria-hidden />
                  )}
                </button>
              }
            />
          )}
        />
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
