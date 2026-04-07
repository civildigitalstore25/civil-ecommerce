import { useState, useCallback } from "react";
import { useCreateUser } from "../../../../api/userApi";
import Swal from "sweetalert2";
import type { UserFormData } from "./types";
import { emptyUserFormData } from "./types";

export function useAddUserModalForm(onClose: () => void) {
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState<UserFormData>(emptyUserFormData);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const resetForm = useCallback(() => {
    setFormData(emptyUserFormData);
    setErrors({});
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: keyof UserFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) =>
        prev[field] ? { ...prev, [field]: undefined } : prev,
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        await createUserMutation.mutateAsync({
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim() || undefined,
          role: formData.role,
          password: formData.password,
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User created successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        resetForm();
        onClose();
      } catch (error: unknown) {
        const axiosLike = error as {
          response?: { data?: { message?: string } };
        };
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            axiosLike.response?.data?.message || "Failed to create user",
        });
      }
    },
    [
      createUserMutation,
      formData,
      onClose,
      resetForm,
      validateForm,
    ],
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleClose,
    createUserMutation,
  };
}
