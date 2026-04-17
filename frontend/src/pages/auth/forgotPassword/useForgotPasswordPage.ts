import { useState } from "react";
import { useAppForm } from "../../../hooks/useAppForm";
import Swal from "sweetalert2";
import { forgotPasswordAPI } from "../../../services/api";
import type { ForgotPasswordFormData } from "./forgotPasswordTypes";

export function useForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useAppForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await forgotPasswordAPI({ email: data.email });

      setSentEmail(data.email);
      setIsEmailSent(true);

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Please check your email for password reset instructions.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : "Failed to send reset email. Please try again.";

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
    setSentEmail("");
    reset();
  };

  return {
    isLoading,
    isEmailSent,
    sentEmail,
    handleSubmit,
    control,
    errors,
    onSubmit,
    handleResendEmail,
  };
}
