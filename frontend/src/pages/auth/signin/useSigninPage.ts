import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSignIn, useUserInvalidate } from "../../../api/userQueries";
import { saveAuth } from "../../../utils/auth";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import { useAppForm } from "../../../hooks/useAppForm";
import type { SigninFormData } from "./signinTypes";

export function useSigninPage() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signInMutation = useSignIn();
  const { colors } = useAdminTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SigninFormData) => {
    signInMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          saveAuth({
            token: res.token,
            email: res.user.email,
            role: res.user.role,
            userId: res.user.id,
            fullName: res.user.fullName,
          });
          invalidateUser();

          void Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back to our platform!",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });

          navigate("/");
        },
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Something went wrong";

          void Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: message,
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        },
      },
    );
  };

  return {
    navigate,
    colors,
    control,
    errors,
    handleSubmit,
    onSubmit,
    signInMutation,
  };
}
