import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { ForgotPasswordCheckEmailView } from "./forgotPassword/ForgotPasswordCheckEmailView";
import { ForgotPasswordRequestView } from "./forgotPassword/ForgotPasswordRequestView";
import { useForgotPasswordPage } from "./forgotPassword/useForgotPasswordPage";

export default function ForgotPasswordPage() {
  const { colors } = useAdminTheme();
  const {
    isLoading,
    isEmailSent,
    sentEmail,
    handleSubmit,
    control,
    errors,
    onSubmit,
    handleResendEmail,
  } = useForgotPasswordPage();

  if (isEmailSent) {
    return (
      <ForgotPasswordCheckEmailView
        colors={colors}
        sentEmail={sentEmail}
        onResend={handleResendEmail}
      />
    );
  }

  return (
    <ForgotPasswordRequestView
      colors={colors}
      control={control}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
