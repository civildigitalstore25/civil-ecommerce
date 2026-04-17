import { useSubmitContactForm } from "../../api/contactApi";
import { useAppForm } from "../../hooks/useAppForm";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { getContactSEO } from "../../utils/seo";
import type { ContactFormData } from "./contactTypes";

export function useContactPage() {
  const submitContactForm = useSubmitContactForm();
  const { colors, theme } = useAdminTheme();
  const seoData = getContactSEO();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useAppForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactForm.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return {
    colors,
    theme,
    seoData,
    control,
    errors,
    isPending: submitContactForm.isPending,
    onFormSubmit: handleSubmit(onSubmit),
  };
}
