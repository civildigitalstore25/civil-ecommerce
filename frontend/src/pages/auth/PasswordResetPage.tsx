import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppForm } from "../../hooks/useAppForm";
import Swal from "sweetalert2";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { validateResetTokenAPI, resetPasswordAPI } from "../../services/api";
import type { PasswordResetFormData } from "./passwordReset/passwordResetTypes";
import {
  PasswordResetValidatingView,
  PasswordResetInvalidTokenView,
  PasswordResetSuccessView,
} from "./passwordReset/PasswordResetTokenViews";
import { PasswordResetFormSection } from "./passwordReset/PasswordResetFormSection";

export default function PasswordResetPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [tokenValidating, setTokenValidating] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useAppForm<PasswordResetFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setTokenValidating(false);
        return;
      }

      try {
        await validateResetTokenAPI(token);
        setIsValidToken(true);
      } catch (err) {
        console.error("Token validation failed:", err);
        setIsValidToken(false);
      } finally {
        setTokenValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: PasswordResetFormData) => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid reset token",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordAPI({ token, email: data.email, password: data.password });

      setIsPasswordReset(true);

      Swal.fire({
        icon: "success",
        title: "Password Reset Successfully!",
        text: "Your password has been updated. You can now sign in with your new password.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again.";

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

  if (tokenValidating) {
    return <PasswordResetValidatingView colors={colors} />;
  }

  if (!isValidToken) {
    return <PasswordResetInvalidTokenView colors={colors} />;
  }

  if (isPasswordReset) {
    return <PasswordResetSuccessView colors={colors} />;
  }

  return (
    <PasswordResetFormSection
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
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
