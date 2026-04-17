import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import { SigninPageHeader } from "./signin/SigninPageHeader";
import { SigninPageForm } from "./signin/SigninPageForm";
import { useSigninPage } from "./signin/useSigninPage";

export default function SigninPage() {
  const {
    navigate,
    colors,
    control,
    errors,
    handleSubmit,
    onSubmit,
    signInMutation,
  } = useSigninPage();

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
          border: `1px solid ${colors.border?.primary || "#e5e7eb"}`,
        }}
      >
        <SigninPageHeader colors={colors} navigate={navigate} />
        <SigninPageForm
          colors={colors}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isPending={signInMutation.isPending}
        />
      </div>
    </div>
  );
}
