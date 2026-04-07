import type { Dispatch, SetStateAction } from "react";
import { BRAND_CATEGORIES, type ProductForm } from "../../../../constants/productFormConstants";

const brandCategories = BRAND_CATEGORIES;

export function useAddProductFormCoreHandlers(
  setNewProduct: Dispatch<SetStateAction<ProductForm>>,
) {
  const handleInputChange = (field: string, value: string) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleBrandChange = (brandValue: string) => {
    const availableCategories = brandCategories[brandValue] || [];
    setNewProduct((prev) => ({
      ...prev,
      brand: brandValue,
      category: availableCategories.length > 0 ? availableCategories[0].value : "",
      ...(brandValue === "ebook"
        ? {
            subscriptionDurations: [],
            subscriptions: [],
            hasLifetime: true,
            lifetimePrice: prev.ebookPriceINR || "",
            lifetimePriceINR: prev.ebookPriceINR || "",
            lifetimePriceUSD: prev.ebookPriceUSD || "",
            hasMembership: false,
            membershipPrice: "",
            membershipPriceINR: "",
            membershipPriceUSD: "",
          }
        : {}),
    }));
  };

  const updateSubscriptionDuration = (
    index: number,
    field: "duration" | "price" | "priceINR" | "priceUSD" | "trialDays",
    value: string,
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptionDurations: prev.subscriptionDurations.map((sub, i) =>
        i === index ? { ...sub, [field]: value } : sub,
      ),
    }));
  };

  const addSubscriptionDuration = () => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptionDurations: [
        ...prev.subscriptionDurations,
        { duration: "", price: "", priceINR: "", priceUSD: "", trialDays: "" },
      ],
    }));
  };

  const removeSubscriptionDuration = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptionDurations: prev.subscriptionDurations.filter((_, i) => i !== index),
    }));
  };

  const updateImageField = (field: "additionalImages", index: number, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addImageField = (field: "additionalImages") => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeImageField = (field: "additionalImages", index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return {
    handleInputChange,
    handleBrandChange,
    updateSubscriptionDuration,
    addSubscriptionDuration,
    removeSubscriptionDuration,
    updateImageField,
    addImageField,
    removeImageField,
  };
}
