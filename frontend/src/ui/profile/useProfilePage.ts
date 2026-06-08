import { useState, useEffect, type ChangeEvent } from "react";
import { useAppForm } from "../../hooks/useAppForm";
import { useCurrentUser, useUpdateProfile } from "../../api/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import Swal from "sweetalert2";
import { normalizeDuplicateIndiaCountryInPhone } from "../../utils/normalizePhoneNumber";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export function useProfilePage() {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const { colors } = useAdminTheme();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
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
      setAvatarPreview(user.avatarUrl || null);
      setPendingAvatarFile(null);
    }
  }, [user, reset]);

  const onSubmit = async (data: { fullName: string; phoneNumber: string }) => {
    const normalizedPhone = normalizeDuplicateIndiaCountryInPhone(
      data.phoneNumber.trim()
    );
    const normalizedUserPhone = normalizeDuplicateIndiaCountryInPhone(
      user?.phoneNumber || ""
    );
    const nameChanged = data.fullName !== user?.fullName;
    const phoneChanged = normalizedPhone !== normalizedUserPhone;
    const avatarChanged = pendingAvatarFile !== null;

    if (!nameChanged && !phoneChanged && !avatarChanged) {
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
      let avatarUrl: string | undefined;
      if (pendingAvatarFile) {
        avatarUrl = await readFileAsDataUrl(pendingAvatarFile);
      }

      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        phoneNumber: normalizedPhone || data.phoneNumber.trim(),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      });
      await refetch();
      setPendingAvatarFile(null);
      setIsEditing(false);
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
      setAvatarPreview(user.avatarUrl || null);
      setPendingAvatarFile(null);
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
