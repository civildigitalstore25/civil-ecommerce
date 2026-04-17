import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWelcomeLead } from "../../api/leadApi";
import type { WelcomeLeadData } from "../../api/leadApi";
import { getWelcomePopupFieldErrors } from "./welcomePopupValidation";
import { parseWelcomeLeadSubmitError } from "./welcomePopupSubmitError";
import type { WelcomePopupFieldErrors } from "./welcomePopupTypes";

const WELCOME_COMPLETED_KEY = "welcomePopupCompleted";
const WELCOME_DISCOUNT_KEY = "welcomeDiscountCode";

export function useWelcomePopup(onClose: () => void) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WelcomeLeadData>({
    name: "",
    email: "",
    whatsappNumber: "",
  });
  const [errors, setErrors] = useState<WelcomePopupFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    const newErrors = getWelcomePopupFieldErrors(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof WelcomePopupFieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const response = await createWelcomeLead(formData);
      if (response.success) {
        setDiscountCode(response.data.discountCode);
        setDiscountValue(response.data.discountValue);
        setValidUntil(new Date(response.data.validUntil));
        setIsSuccess(true);
        localStorage.setItem(WELCOME_COMPLETED_KEY, "true");
        localStorage.setItem(WELCOME_DISCOUNT_KEY, response.data.discountCode);
      }
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      const parsed = parseWelcomeLeadSubmitError(error);
      setGeneralError(parsed.message);
      if (parsed.completeWelcomePopup) {
        localStorage.setItem(WELCOME_COMPLETED_KEY, "true");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleShopNow = () => {
    onClose();
    navigate("/");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSuccess) {
      onClose();
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    discountCode,
    discountValue,
    validUntil,
    isCopied,
    generalError,
    handleChange,
    handleSubmit,
    handleCopyCode,
    handleShopNow,
    handleOverlayClick,
  };
}
