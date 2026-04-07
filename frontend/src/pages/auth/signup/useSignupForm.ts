import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSignUp, useUserInvalidate } from "../../../api/userQueries";
import { saveAuth } from "../../../utils/auth";
import type { SignupFormData } from "./signupFormValidation";

export function useSignupForm() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signUpMutation = useSignUp();
  const [countryCode, setCountryCode] = useState<string>("91");

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signUpData } = data;

    let phone = data.phoneNumber;
    let cc = countryCode;

    if (phone.startsWith("+")) {
      const match = phone.match(/^\+(\d{1,4})/);
      if (match) {
        cc = match[1];
        phone = phone.replace(/^\+\d{1,4}/, "");
      }
    }

    const submitData = {
      ...signUpData,
      phoneNumber: phone.trim(),
      countryCode: `+${cc}`,
    };

    signUpMutation.mutate(submitData, {
      onSuccess: (data) => {
        saveAuth({
          token: data.token,
          email: data.user.email,
          role: data.user.role,
          userId: data.user.id,
          fullName: data.user.fullName,
        });
        invalidateUser();
        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || "Signup failed";
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: errorMessage,
        });
      },
    });
  };

  return {
    countryCode,
    setCountryCode,
    onSubmit,
    signUpMutation,
  };
}
