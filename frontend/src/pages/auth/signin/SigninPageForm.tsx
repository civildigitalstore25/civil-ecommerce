import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import FormButton from "../../../components/Button/FormButton";
import FormInput from "../../../components/Input/FormInput";
import GoogleButton from "../../../components/Button/GoogleButton";
import PasswordInput from "../../../components/Input/PasswordInput";
import type { SigninFormData } from "./signinTypes";

const googleAuthUrl = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
}/api/auth/google`;

type SigninPageFormProps = {
  colors: ThemeColors;
  control: Control<SigninFormData>;
  errors: FieldErrors<SigninFormData>;
  handleSubmit: UseFormHandleSubmit<SigninFormData>;
  onSubmit: (data: SigninFormData) => void;
  isPending: boolean;
};

export function SigninPageForm({
  colors,
  control,
  errors,
  handleSubmit,
  onSubmit,
  isPending,
}: SigninPageFormProps) {
  return (
    <div className="p-8">
      <GoogleButton
        text="Continue with Google"
        onClick={() => {
          window.location.href = googleAuthUrl;
        }}
      />

      <div className="flex items-center my-6">
        <div
          className="flex-grow border-t"
          style={{ borderColor: colors.border.primary }}
        />
        <span
          className="mx-4 text-sm"
          style={{ color: colors.text.secondary }}
        >
          Or continue with email
        </span>
        <div
          className="flex-grow border-t"
          style={{ borderColor: colors.border.primary }}
        />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="you@example.com"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <FormButton
          type="submit"
          disabled={isPending}
          className="w-full"
          style={{
            background: colors.interactive.primary,
            color: colors.text.inverse,
            border: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              colors.interactive.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.interactive.primary;
          }}
        >
          {isPending ? "Signing in..." : "Sign In"}
        </FormButton>
      </form>

      <p
        className="mt-8 text-center text-sm"
        style={{ color: colors.text.secondary }}
      >
        Don&apos;t have an account?{" "}
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
  );
}
