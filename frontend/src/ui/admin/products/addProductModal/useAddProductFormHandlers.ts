import type { Dispatch, SetStateAction } from "react";
import { BRAND_CATEGORIES, type ProductForm } from "../../../../constants/productFormConstants";

const brandCategories = BRAND_CATEGORIES;

export function useAddProductFormHandlers(
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

  const addFAQ = () => {
    setNewProduct((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  const addFeature = () => {
    setNewProduct((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, { icon: "", title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (
    index: number,
    field: "icon" | "title" | "description",
    value: string,
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    }));
  };

  const addRequirement = () => {
    setNewProduct((prev) => ({
      ...prev,
      systemRequirements: [
        ...prev.systemRequirements,
        { icon: "", title: "", description: "" },
      ],
    }));
  };

  const removeRequirement = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      systemRequirements: prev.systemRequirements.filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (
    index: number,
    field: "icon" | "title" | "description",
    value: string,
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      systemRequirements: prev.systemRequirements.map((requirement, i) =>
        i === index ? { ...requirement, [field]: value } : requirement,
      ),
    }));
  };

  const updateSubscription = (
    index: number,
    field: "duration" | "price" | "priceINR" | "priceUSD",
    value: string,
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((sub, i) =>
        i === index ? { ...sub, [field]: value } : sub,
      ),
    }));
  };

  const addSubscription = () => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptions: [
        ...prev.subscriptions,
        { duration: "Monthly", price: "", priceINR: "", priceUSD: "" },
      ],
    }));
  };

  const removeSubscription = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((_, i) => i !== index),
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
    addFAQ,
    removeFAQ,
    updateFAQ,
    addFeature,
    removeFeature,
    updateFeature,
    addRequirement,
    removeRequirement,
    updateRequirement,
    updateSubscription,
    addSubscription,
    removeSubscription,
  };
}

export type AddProductFormHandlersApi = ReturnType<
  typeof useAddProductFormHandlers
>;
