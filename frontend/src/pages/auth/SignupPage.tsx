import { Link } from "react-router-dom";
import { useAppForm } from "../../hooks/useAppForm";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import { SignupHeader } from "./signup/SignupHeader";
import { SignupFormFields, SignupPasswordFields } from "./signup/SignupFormFields";
import { SignupPhoneField } from "./signup/SignupPhoneField";
import { useSignupForm } from "./signup/useSignupForm";
import type { SignupFormData } from "./signup/signupFormValidation";
import { signupFormDefaults } from "./signup/signupFormValidation";

export default function SignupPage() {
  const { colors } = useAdminTheme();
  const { setCountryCode, onSubmit, signUpMutation } = useSignupForm();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useAppForm<SignupFormData>({
    defaultValues: signupFormDefaults,
  });

  const password = watch("password");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border?.primary || '#e5e7eb'}`,
        }}
      >
        <SignupHeader colors={colors} />

        <div className="p-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <SignupFormFields control={control} errors={errors} />

            <SignupPhoneField
              control={control}
              errors={errors}
              colors={colors}
              onCountryCodeChange={setCountryCode}
              setValue={setValue}
            />

            <SignupPasswordFields control={control} errors={errors} password={password} />

            <FormButton
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full"
            >
              {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
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