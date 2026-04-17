import { useState, useEffect, type ChangeEvent } from "react";
import { useAppForm } from "../../hooks/useAppForm";
import { useCurrentUser, useUpdateProfile } from "../../api/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import Swal from "sweetalert2";
import { normalizeDuplicateIndiaCountryInPhone } from "../../utils/normalizePhoneNumber";

export function useProfilePage() {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { colors } = useAdminTheme();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useAppForm({
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: normalizeDuplicateIndiaCountryInPhone(user?.phoneNumber || ""),
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        phoneNumber: normalizeDuplicateIndiaCountryInPhone(user.phoneNumber || ""),
      });
      setAvatarPreview((user as { avatarUrl?: string }).avatarUrl || null);
    }
  }, [user, reset]);

  const onSubmit = async (data: { fullName: string; phoneNumber: string }) => {
    const normalizedPhone = normalizeDuplicateIndiaCountryInPhone(
      data.phoneNumber.trim()
    );
    const normalizedUserPhone = normalizeDuplicateIndiaCountryInPhone(
      user?.phoneNumber || ""
    );
    if (data.fullName === user?.fullName && normalizedPhone === normalizedUserPhone) {
      Swal.fire({
        title: "No Changes",
        text: "You haven't made any changes to your profile.",
        icon: "info",
        confirmButtonText: "OK",
        timer: 2000,
      });
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        ...data,
        phoneNumber: normalizedPhone || data.phoneNumber.trim(),
      });
      await refetch();
      setIsEditing(false);
      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        phoneNumber: normalizeDuplicateIndiaCountryInPhone(user.phoneNumber || ""),
      });
    }
    setIsEditing(false);
  };

  return {
    user,
    isLoading,
    error,
    colors,
    isEditing,
    setIsEditing,
    avatarPreview,
    handleAvatarChange,
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    handleCancel,
    updateProfileMutation,
  };
}
