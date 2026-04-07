import type { WelcomeLeadData } from "../../api/leadApi";
import type { WelcomePopupFieldErrors } from "./welcomePopupTypes";

export function getWelcomePopupFieldErrors(
  formData: WelcomeLeadData,
): WelcomePopupFieldErrors {
  const newErrors: WelcomePopupFieldErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    newErrors.name = "Name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!formData.whatsappNumber.trim()) {
    newErrors.whatsappNumber = "WhatsApp number is required";
  } else if (
    !phoneRegex.test(formData.whatsappNumber.replace(/[\s-]/g, ""))
  ) {
    newErrors.whatsappNumber =
      "Please enter a valid phone number (10-15 digits)";
  }

  return newErrors;
}
