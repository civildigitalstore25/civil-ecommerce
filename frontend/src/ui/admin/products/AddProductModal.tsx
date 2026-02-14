import React, { useEffect, useState } from "react";
import IconPicker from "../../../components/IconPicker/IconPicker";
import "./AddProductModal.css";
import type { Product } from "../../../api/types/productTypes";
import Swal from "sweetalert2";
import { Plus, X, Save, HelpCircle, FileText, Clock } from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";
import {
  BRANDS,
  BRAND_CATEGORIES,
  DEFAULT_PRODUCT_FORM,
  type ProductForm
} from "../../../constants/productFormConstants";
import { useProductFormDraft } from "../../../hooks/useProductFormDraft";

// Use imported constants
const brands = BRANDS;
const brandCategories = BRAND_CATEGORIES;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: any) => void;
  product?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSave,
  product,
}) => {
  const { colors, theme } = useAdminTheme();
  const [newProduct, setNewProduct] = useState<ProductForm>({ ...DEFAULT_PRODUCT_FORM });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save hook
  const { clearDraft } = useProductFormDraft(
    newProduct,
    !!product
  );

  // Update last saved time when form changes
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 3100); // Slightly after auto-save interval

      return () => clearTimeout(timer);
    }
  }, [newProduct, open]);

  useEffect(() => {
    if (open) {
      if (product) {
        // Editing existing product - map all fields properly
        console.log("Loading product data:", product);
        const productBrand =
          product.brand || product.company || brands[0].value;
        const availableCategories = brandCategories[productBrand] || [];
        setNewProduct({
          name: product.name || "",
          version: product.version || "",
          longDescription: product.description || product.shortDescription || "",
          detailsDescription: product.detailsDescription || "",
          category:
            product.category ||
            (availableCategories.length > 0
              ? availableCategories[0].value
              : ""),
          brand: productBrand,
          subscriptionDurations:
            product.subscriptionDurations && product.subscriptionDurations.length > 0
              ? product.subscriptionDurations.map((sub) => ({
                duration: sub.duration,
                price: sub.price?.toString() || "",
                priceINR: sub.priceINR?.toString() || "",
                priceUSD: sub.priceUSD?.toString() || "",
                trialDays: sub.trialDays?.toString() || "",
              }))
              : [
                {
                  duration: "1 Year",
                  price: product.price1?.toString() || "",
                  priceINR: product.price1INR?.toString() || "",
                  priceUSD: product.price1USD?.toString() || "",
                },
                ...(product.price3
                  ? [
                    {
                      duration: "3 Year",
                      price: product.price3.toString(),
                      priceINR: product.price3INR?.toString() || "",
                      priceUSD: product.price3USD?.toString() || "",
                    },
                  ]
                  : []),
              ],
          // Map ebook simple prices if present
          ebookPriceINR: product.price1INR?.toString() || product.price1?.toString() || "",
          ebookPriceUSD: product.price1USD?.toString() || "",
          subscriptions:
            product.subscriptions && product.subscriptions.length > 0
              ? product.subscriptions.map((sub) => ({
                duration: sub.duration,
                price: sub.price?.toString() || "",
                priceINR: sub.priceINR?.toString() || "",
                priceUSD: sub.priceUSD?.toString() || "",
              }))
              : [
                {
                  duration: "Monthly",
                  price: "",
                  priceINR: "",
                  priceUSD: "",
                },
              ],
          hasLifetime:
            product.hasLifetime ||
            !!product.priceLifetime ||
            !!product.lifetimePrice,
          lifetimePrice:
            product.lifetimePrice?.toString() ||
            product.priceLifetime?.toString() ||
            "",
          lifetimePriceINR:
            product.lifetimePriceINR?.toString() ||
            product.priceLifetimeINR?.toString() ||
            "",
          lifetimePriceUSD:
            product.lifetimePriceUSD?.toString() ||
            product.priceLifetimeUSD?.toString() ||
            "",
          hasMembership: product.hasMembership || !!product.membershipPrice,
          membershipPrice: product.membershipPrice?.toString() || "",
          membershipPriceINR: product.membershipPriceINR?.toString() || "",
          membershipPriceUSD: product.membershipPriceUSD?.toString() || "",
          strikethroughPriceINR: product.strikethroughPriceINR?.toString() || "",
          strikethroughPriceUSD: product.strikethroughPriceUSD?.toString() || "",
          imageUrl: product.imageUrl || product.image || "",
          additionalImages:
            product.additionalImages && product.additionalImages.length > 0
              ? product.additionalImages
              : [""],
          videoUrl: product.videoUrl || "",
          activationVideoUrl: product.activationVideoUrl || "",
          driveLink: product.driveLink || "",
          status: product.status || "active",
          isBestSeller: product.isBestSeller || false,
          isOutOfStock: product.isOutOfStock || false,
          faqs: product.faqs || [],
          keyFeatures: product.keyFeatures || [],
          systemRequirements: product.systemRequirements || [],
        });
      } else {
        // Reset for new product
        const defaultBrand = brands[0].value;
        const availableCategories = brandCategories[defaultBrand] || [];
        setNewProduct({
          name: "",
          version: "",
          longDescription: "",
          detailsDescription: "",
          category:
            availableCategories.length > 0 ? availableCategories[0].value : "",
          brand: defaultBrand,
          subscriptionDurations: [
            { duration: "1 Year", price: "", priceINR: "", priceUSD: "", trialDays: "" },
          ],
          // Simple ebook price fields
          ebookPriceINR: "",
          ebookPriceUSD: "",
          subscriptions: [
            { duration: "Monthly", price: "", priceINR: "", priceUSD: "" },
          ],
          hasLifetime: false,
          lifetimePrice: "",
          lifetimePriceINR: "",
          lifetimePriceUSD: "",
          hasMembership: false,
          membershipPrice: "",
          membershipPriceINR: "",
          membershipPriceUSD: "",
          strikethroughPriceINR: "",
          strikethroughPriceUSD: "",
          imageUrl: "",
          additionalImages: [""],
          videoUrl: "",
          activationVideoUrl: "",
          driveLink: "",
          status: "active",
          isBestSeller: false,
          isOutOfStock: false,
          faqs: [],
          keyFeatures: [],
          systemRequirements: [],
        });
      }
    }
  }, [open, product]);

  if (!open) return null;

  // Helper functions
  const handleInputChange = (field: string, value: string) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  // Handle brand change and reset category
  const handleBrandChange = (brandValue: string) => {
    const availableCategories = brandCategories[brandValue] || [];
    setNewProduct((prev) => ({
      ...prev,
      brand: brandValue,
      category:
        availableCategories.length > 0 ? availableCategories[0].value : "",
      // If switching to ebook, clear other pricing options to avoid confusion
      ...(brandValue === "ebook"
        ? {
          subscriptionDurations: [],
          subscriptions: [],
          hasLifetime: false,
          lifetimePrice: "",
          lifetimePriceINR: "",
          lifetimePriceUSD: "",
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
      subscriptionDurations: prev.subscriptionDurations.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const updateImageField = (
    field: "additionalImages",
    index: number,
    value: string,
  ) => {
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

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  // Feature management functions
  const addFeature = () => {
    setNewProduct((prev) => ({
      ...prev,
      keyFeatures: [
        ...prev.keyFeatures,
        { icon: "", title: "", description: "" },
      ],
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

  // Requirement management functions
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

  // Subscription management functions (separate from pricing)
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

  const handleAddProduct = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();

    // If saving as draft, skip confirmation
    if (asDraft) {
      await saveProductData('draft');
      return;
    }

    // When clicking "Add Product" button, show appropriate message
    const isDraftBeingPublished = product?.status === 'draft';

    const result = await Swal.fire({
      title: isDraftBeingPublished ? "Publish Draft Product?" : (product ? "Update Product?" : "Create New Product?"),
      text: isDraftBeingPublished
        ? `Are you sure you want to publish "${newProduct.name}" to Products?`
        : product
          ? `Are you sure you want to update "${newProduct.name}"?`
          : `Are you sure you want to create "${newProduct.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isDraftBeingPublished ? "Yes, publish it!" : (product ? "Yes, update it!" : "Yes, create it!"),
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    });

    if (result.isConfirmed) {
      // When clicking "Add Product", always set status to 'active' (not draft)
      await saveProductData('active');
    }
  };

  const saveProductData = async (status: string) => {
    const isDraft = status === 'draft';

    // For drafts, provide default values for required fields to avoid backend validation errors
    const defaultName = newProduct.name || (isDraft ? `Draft Product ${Date.now()}` : '');
    const defaultImage = newProduct.imageUrl || (isDraft ? 'https://via.placeholder.com/400x300?text=No+Image' : '');
    const defaultDescription = newProduct.longDescription || (isDraft ? 'Draft description' : '');
    const defaultBrand = newProduct.brand || brands[0].value;

    // Generate slug from name and version
    const slug = `${defaultName.replace(/\s+/g, "-").toLowerCase()}${newProduct.version ? `-${newProduct.version.toString().toLowerCase()}` : ""}`;
    // If the brand has no categories (e.g., 'ebook'), use the brand as category
    const brandHasCategories = (brandCategories[defaultBrand] || []).length > 0;
    const categoryValue = brandHasCategories ? (newProduct.category || (brandCategories[defaultBrand]?.[0]?.value || defaultBrand)) : defaultBrand;

    // Preserve the raw HTML from the Rich Text Editor for exact display
    const htmlDescription = defaultDescription;
    const htmlDetailsDescription = newProduct.detailsDescription || (isDraft ? '' : '');
    // Also generate Markdown (kept for reference / compatibility)

    // Transform new product structure to match current backend expectations
    const productData = {
      // Basic Information
      name: defaultName,
      version: newProduct.version,
      slug,
      // Store raw HTML so product detail page can render exactly what was entered
      shortDescription: htmlDescription,
      description: htmlDescription,
      detailsDescription: htmlDetailsDescription,
      category: categoryValue,

      // Brand/Company (backward compatibility)
      company: defaultBrand, // For backward compatibility
      brand: defaultBrand, // New field

      // Pricing handling
      // For ebook brand, prefer the simple ebook price fields
      // For drafts, default to 0 if no price is provided
      price1:
        defaultBrand === "ebook"
          ? newProduct.ebookPriceINR
            ? Number(newProduct.ebookPriceINR)
            : (isDraft ? 0 : 0)
          : newProduct.subscriptionDurations[0]?.price
            ? Number(newProduct.subscriptionDurations[0].price)
            : (isDraft ? 0 : 0),
      price3: defaultBrand === "ebook" ? undefined : newProduct.subscriptionDurations[1]?.price
        ? Number(newProduct.subscriptionDurations[1].price)
        : undefined,
      priceLifetime:
        defaultBrand === "ebook"
          ? undefined
          : newProduct.hasLifetime && newProduct.lifetimePrice
            ? Number(newProduct.lifetimePrice)
            : undefined,

      // Dual currency pricing
      price1INR: defaultBrand === "ebook"
        ? newProduct.ebookPriceINR
          ? Number(newProduct.ebookPriceINR)
          : undefined
        : newProduct.subscriptionDurations[0]?.priceINR
          ? Number(newProduct.subscriptionDurations[0].priceINR)
          : undefined,
      price1USD: defaultBrand === "ebook"
        ? newProduct.ebookPriceUSD
          ? Number(newProduct.ebookPriceUSD)
          : undefined
        : newProduct.subscriptionDurations[0]?.priceUSD
          ? Number(newProduct.subscriptionDurations[0].priceUSD)
          : undefined,
      price3INR: defaultBrand === "ebook" ? undefined : newProduct.subscriptionDurations[1]?.priceINR
        ? Number(newProduct.subscriptionDurations[1].priceINR)
        : undefined,
      price3USD: defaultBrand === "ebook" ? undefined : newProduct.subscriptionDurations[1]?.priceUSD
        ? Number(newProduct.subscriptionDurations[1].priceUSD)
        : undefined,
      priceLifetimeINR: defaultBrand === "ebook" ? undefined : newProduct.lifetimePriceINR
        ? Number(newProduct.lifetimePriceINR)
        : undefined,
      priceLifetimeUSD: defaultBrand === "ebook" ? undefined : newProduct.lifetimePriceUSD
        ? Number(newProduct.lifetimePriceUSD)
        : undefined,

      // Subscription durations structure (only from subscriptionDurations, not from subscriptions)
      subscriptionDurations: defaultBrand === "ebook" ? [] : newProduct.subscriptionDurations
        .map((sub) => ({
          duration: sub.duration,
          price: sub.price ? Number(sub.price) : 0,
          priceINR: sub.priceINR ? Number(sub.priceINR) : undefined,
          priceUSD: sub.priceUSD ? Number(sub.priceUSD) : undefined,
          trialDays: sub.trialDays ? Number(sub.trialDays) : undefined,
        }))
        .filter(
          (sub) =>
            sub.price > 0 ||
            (sub.priceINR && sub.priceINR > 0) ||
            (sub.priceUSD && sub.priceUSD > 0),
        ),

      // Keep subscriptions separate (for future use, not displayed in pricing)
      subscriptions: newProduct.subscriptions
        .map((sub) => ({
          duration: sub.duration,
          price: sub.price ? Number(sub.price) : 0,
          priceINR: sub.priceINR ? Number(sub.priceINR) : undefined,
          priceUSD: sub.priceUSD ? Number(sub.priceUSD) : undefined,
        }))
        .filter(
          (sub) =>
            sub.price > 0 ||
            (sub.priceINR && sub.priceINR > 0) ||
            (sub.priceUSD && sub.priceUSD > 0),
        ),

      // Lifetime pricing
      hasLifetime: newProduct.hasLifetime,
      lifetimePrice: newProduct.lifetimePriceINR
        ? Number(newProduct.lifetimePriceINR)
        : newProduct.lifetimePrice
          ? Number(newProduct.lifetimePrice)
          : undefined, // Backward compatibility fallback
      lifetimePriceINR: newProduct.lifetimePriceINR
        ? Number(newProduct.lifetimePriceINR)
        : undefined,
      lifetimePriceUSD: newProduct.lifetimePriceUSD
        ? Number(newProduct.lifetimePriceUSD)
        : undefined,

      // Membership pricing
      hasMembership: newProduct.hasMembership,
      membershipPrice:
        newProduct.hasMembership && newProduct.membershipPriceINR
          ? Number(newProduct.membershipPriceINR)
          : newProduct.hasMembership && newProduct.membershipPrice
            ? Number(newProduct.membershipPrice)
            : undefined, // Backward compatibility fallback
      membershipPriceINR:
        newProduct.hasMembership && newProduct.membershipPriceINR
          ? Number(newProduct.membershipPriceINR)
          : undefined,
      membershipPriceUSD:
        newProduct.hasMembership && newProduct.membershipPriceUSD
          ? Number(newProduct.membershipPriceUSD)
          : undefined,

      // Strikethrough Price (MRP)
      strikethroughPriceINR: newProduct.strikethroughPriceINR
        ? Number(newProduct.strikethroughPriceINR)
        : undefined,
      strikethroughPriceUSD: newProduct.strikethroughPriceUSD
        ? Number(newProduct.strikethroughPriceUSD)
        : undefined,

      // Images
      image: defaultImage, // For backward compatibility
      imageUrl: defaultImage, // New field
      additionalImages: newProduct.additionalImages.filter(
        (img) => img.trim() !== "",
      ),

      // Videos
      videoUrl: newProduct.videoUrl,
      activationVideoUrl: newProduct.activationVideoUrl,

      // Drive Link for downloadable product
      driveLink: newProduct.driveLink,

      // Status and flags
      status: status, // Use the status parameter (either 'active' or 'draft')
      isBestSeller: newProduct.isBestSeller,
      isOutOfStock: newProduct.isOutOfStock,

      // FAQs
      faqs: newProduct.faqs,

      // Structured Features and Requirements
      keyFeatures: newProduct.keyFeatures,
      systemRequirements: newProduct.systemRequirements,
    };

    // Validation - Only validate when not saving as draft
    if (!isDraft && (!productData.name || productData.name.trim() === "" || productData.name.startsWith('Draft Product'))) {
      Swal.fire({
        title: "Validation Error",
        text: "Product Name is required",
        icon: "error",
      });
      return;
    }

    // `version` is optional now; no validation required

    if (!isDraft && (
      !productData.shortDescription ||
      productData.shortDescription.trim() === ""
    )) {
      Swal.fire({
        title: "Validation Error",
        text: "Product Description is required",
        icon: "error",
      });
      return;
    }

    if (!isDraft && (!productData.brand || productData.brand.trim() === "")) {
      Swal.fire({
        title: "Validation Error",
        text: "Product Brand is required",
        icon: "error",
      });
      return;
    }

    // Only require category if the brand actually provides categories
    if (!isDraft && brandHasCategories && (!productData.category || productData.category.trim() === "")) {
      Swal.fire({
        title: "Validation Error",
        text: "Product Category is required",
        icon: "error",
      });
      return;
    }

    if (!isDraft && (!productData.company || productData.company.trim() === "")) {
      Swal.fire({
        title: "Validation Error",
        text: "Company/Brand is required",
        icon: "error",
      });
      return;
    }

    if (!isDraft && (!productData.image || productData.image.trim() === "")) {
      Swal.fire({
        title: "Validation Error",
        text: "Main Product Image is required",
        icon: "error",
      });
      return;
    }

    // Check if we have at least one price (not required for drafts)
    if (!isDraft) {
      const hasValidPrice =
        (productData.price1 && productData.price1 > 0) ||
        (productData.price1INR && productData.price1INR > 0) ||
        (productData.price1USD && productData.price1USD > 0) ||
        (productData.hasLifetime &&
          productData.lifetimePrice &&
          productData.lifetimePrice > 0) ||
        productData.subscriptionDurations.some(
          (sub) =>
            sub.price > 0 ||
            (sub.priceINR && sub.priceINR > 0) ||
            (sub.priceUSD && sub.priceUSD > 0),
        );

      if (!hasValidPrice) {
        Swal.fire({
          title: "Validation Error",
          text: "At least one valid price is required (subscription, lifetime, or membership)",
          icon: "error",
        });
        return;
      }
    }

    console.log("Saving product data:", productData);
    onSave(productData);

    // Clear draft from localStorage after successful save (only if not editing)
    if (!product) {
      clearDraft();
    }

    // Show success message
    if (isDraft) {
      Swal.fire({
        title: "Saved as Draft!",
        text: `"${productData.name || 'Product'}" has been saved as draft.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Success message is now handled in the parent component
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-75">
      <div
        className="relative rounded-xl shadow-xl max-w-4xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh] modal-scroll-container transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-2xl font-bold transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.primary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {product ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-1" style={{ color: colors.text.secondary }}>
            Add a new software product to your catalog with advanced formatting
            options
          </p>
        </div>

        <form onSubmit={handleAddProduct} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., AutoCAD 2025"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Version
                </label>
                <input
                  type="text"
                  value={newProduct.version}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  placeholder="e.g., 2025.1 (optional)"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Long Description
              </label>
              <RichTextEditor
                value={newProduct.longDescription}
                onChange={(val) => handleInputChange("longDescription", val)}
                placeholder="Detailed product description, features, installation and activation instructions..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Details Description
              </label>
              <RichTextEditor
                value={newProduct.detailsDescription}
                onChange={(val) => handleInputChange("detailsDescription", val)}
                placeholder="Detailed product description with images and content (shown in Details tab)..."
                className="w-full"
              />
            </div>
          </div>

          {/* Structured Features */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Key Features (Structured)
            </h2>

            <div className="space-y-4">
              {newProduct.keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Feature {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Icon
                      </label>
                      <IconPicker
                        selectedIcon={feature.icon}
                        onIconSelect={(iconName) =>
                          updateFeature(index, "icon", iconName)
                        }
                        placeholder="Select feature icon"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(index, "title", e.target.value)
                        }
                        placeholder="Feature title"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) =>
                          updateFeature(index, "description", e.target.value)
                        }
                        placeholder="Brief description of the feature"
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFeature}
                className="w-full py-3 border-2 border-dashed rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    colors.interactive.primary;
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border.primary;
                  e.currentTarget.style.color = colors.text.secondary;
                }}
              >
                <Plus size={18} />
                Add Feature
              </button>
            </div>
          </div>

          {/* Structured System Requirements */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              System Requirements (Structured)
            </h2>

            <div className="space-y-4">
              {newProduct.systemRequirements.map((requirement, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Requirement {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Icon
                      </label>
                      <IconPicker
                        selectedIcon={requirement.icon}
                        onIconSelect={(iconName) =>
                          updateRequirement(index, "icon", iconName)
                        }
                        placeholder="Select requirement icon"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={requirement.title}
                        onChange={(e) =>
                          updateRequirement(index, "title", e.target.value)
                        }
                        placeholder="Requirement title"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={requirement.description}
                        onChange={(e) =>
                          updateRequirement(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Requirement details"
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRequirement}
                className="w-full py-3 border-2 border-dashed rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    colors.interactive.primary;
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border.primary;
                  e.currentTarget.style.color = colors.text.secondary;
                }}
              >
                <Plus size={18} />
                Add Requirement
              </button>
            </div>
          </div>

          {/* Brand & Category */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Brand & Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProduct.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.interactive.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border.primary;
                  }}
                  required
                >
                  {brands.map((brand) => (
                    <option key={brand.value} value={brand.value}>
                      {brand.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.interactive.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border.primary;
                  }}
                  required
                  disabled={brandCategories[newProduct.brand]?.length === 0}
                >
                  {brandCategories[newProduct.brand]?.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    brandCategories[newProduct.brand]?.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Status and Flags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Status
                </label>
                <select
                  value={newProduct.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Best Seller
                </label>
                <label className="flex items-center space-x-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={newProduct.isBestSeller || false}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                    style={{
                      accentColor: colors.interactive.primary,
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    Mark as Best Seller
                  </span>
                </label>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Out of Stock
                </label>
                <label className="flex items-center space-x-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={newProduct.isOutOfStock || false}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isOutOfStock: e.target.checked }))}
                    className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                    style={{
                      accentColor: colors.interactive.primary,
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    Mark as Out of Stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Pricing Options
            </h2>

            <div className="space-y-4">

              {/* For ebook brand show simple single-price inputs */}
              {newProduct.brand === 'ebook' ? (
                <div className="p-4 border rounded-lg transition-colors duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                        Price INR (₹)
                      </label>
                      <input
                        type="number"
                        value={newProduct.ebookPriceINR}
                        onChange={(e) => handleInputChange('ebookPriceINR', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                        Price USD ($)
                      </label>
                      <input
                        type="number"
                        value={newProduct.ebookPriceUSD}
                        onChange={(e) => handleInputChange('ebookPriceUSD', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                        style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* existing pricing durations UI for non-ebook brands */
                <div className="space-y-4">
                  <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>Pricing</label>
                  {newProduct.subscriptionDurations.map((sub, index) => (
                    <div key={index} className="p-4 border rounded-lg transition-colors duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>Duration</label>
                          <select value={sub.duration} onChange={(e) => updateSubscriptionDuration(index, 'duration', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }}>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Year">2 Year</option>
                            <option value="3 Year">3 Year</option>
                            <option value="5 Year">5 Year</option>
                            <option value="6 Months">6 Months</option>
                            <option value="Trial Pack">Trial Pack</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>Price INR (₹)</label>
                          <input type="number" value={sub.price} onChange={(e) => updateSubscriptionDuration(index, 'price', e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>Price USD ($)</label>
                          <input type="number" value={sub.priceUSD} onChange={(e) => updateSubscriptionDuration(index, 'priceUSD', e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }} />
                        </div>
                        <div>
                          {typeof sub.duration === 'string' && sub.duration.toLowerCase().includes('trial') && (
                            <>
                              <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>Trial Days</label>
                              <input type="number" value={sub.trialDays || ''} onChange={(e) => updateSubscriptionDuration(index, 'trialDays', e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary, color: colors.text.primary }} />
                            </>
                          )}
                        </div>
                        <div className="flex justify-center md:justify-end">
                          <button type="button" onClick={() => removeSubscriptionDuration(index)} title="Remove pricing duration" className="px-3 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200" style={{ color: colors.status.error, borderColor: colors.status.error }}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addSubscriptionDuration} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200" style={{ color: colors.interactive.primary, borderColor: colors.interactive.primary }}>
                    <Plus className="h-4 w-4" /> Add Duration
                  </button>
                </div>
              )}

              {/* Lifetime, Membership - hide for ebook brand */}
              {newProduct.brand !== 'ebook' && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasLifetime"
                      checked={newProduct.hasLifetime}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          hasLifetime: e.target.checked,
                        }))
                      }
                      className="rounded focus:ring-2 transition-colors duration-200"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.primary,
                        color: colors.interactive.primary,
                      }}
                    />
                    <label
                      htmlFor="hasLifetime"
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Offer Lifetime License
                    </label>
                  </div>
                  {newProduct.hasLifetime && (
                    <div
                      className="space-y-4 p-4 border rounded-lg transition-colors duration-200"
                      style={{
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <h4
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Lifetime Pricing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            Lifetime Price INR (₹)
                          </label>
                          <input
                            type="number"
                            value={newProduct.lifetimePriceINR}
                            onChange={(e) =>
                              handleInputChange("lifetimePriceINR", e.target.value)
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            Lifetime Price USD ($)
                          </label>
                          <input
                            type="number"
                            value={newProduct.lifetimePriceUSD}
                            onChange={(e) =>
                              handleInputChange("lifetimePriceUSD", e.target.value)
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasMembership"
                      checked={newProduct.hasMembership}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          hasMembership: e.target.checked,
                        }))
                      }
                      className="rounded focus:ring-2 transition-colors duration-200"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.primary,
                        color: colors.interactive.primary,
                      }}
                    />
                    <label
                      htmlFor="hasMembership"
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      VIP/Premium Membership Option
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    Premium membership with exclusive benefits and priority support
                  </p>
                  {newProduct.hasMembership && (
                    <div
                      className="space-y-4 p-4 border rounded-lg transition-colors duration-200"
                      style={{
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <h4
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Membership Pricing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            Membership Price INR (₹)
                          </label>
                          <input
                            type="number"
                            value={newProduct.membershipPriceINR}
                            onChange={(e) =>
                              handleInputChange(
                                "membershipPriceINR",
                                e.target.value,
                              )
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            Membership Price USD ($)
                          </label>
                          <input
                            type="number"
                            value={newProduct.membershipPriceUSD}
                            onChange={(e) =>
                              handleInputChange(
                                "membershipPriceUSD",
                                e.target.value,
                              )
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Strikethrough Price (MRP) */}
          <div className="space-y-4">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Strikethrough Price (MRP)
            </h2>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Optional: Add a higher original price to display with strikethrough. This shows the discount/savings to customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  Strikethrough Price INR (₹)
                </label>
                <input
                  type="number"
                  value={newProduct.strikethroughPriceINR}
                  onChange={(e) =>
                    handleInputChange(
                      "strikethroughPriceINR",
                      e.target.value,
                    )
                  }
                  placeholder="Enter original/max price in INR"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  Strikethrough Price USD ($)
                </label>
                <input
                  type="number"
                  value={newProduct.strikethroughPriceUSD}
                  onChange={(e) =>
                    handleInputChange(
                      "strikethroughPriceUSD",
                      e.target.value,
                    )
                  }
                  placeholder="Enter original/max price in USD"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subscription Plans - hide for ebook brand */}
          {newProduct.brand !== 'ebook' && (
            <div className="space-y-6">
              <h2
                className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
                style={{
                  color: colors.text.primary,
                  borderBottomColor: colors.border.primary,
                }}
              >
                Subscription Plans
              </h2>

              <div className="space-y-4">
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Add recurring subscription plans for your software
                </p>

                {/* Subscription Durations */}
                <div className="space-y-4">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    Subscription Plans
                  </label>
                  {newProduct.subscriptions.map((sub, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg transition-colors duration-200"

                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            Duration
                          </label>
                          <select
                            value={sub.duration}
                            onChange={(e) =>
                              updateSubscription(
                                index,
                                "duration",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Semi-Annual">Semi-Annual</option>
                            <option value="Annual">Annual</option>
                            <option value="Weekly">Weekly</option>
                          </select>
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            INR (₹)
                          </label>
                          <input
                            type="number"
                            value={sub.price}
                            onChange={(e) =>
                              updateSubscription(index, "price", e.target.value)
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            USD ($)
                          </label>
                          <input
                            type="number"
                            value={sub.priceUSD || ""}
                            onChange={(e) =>
                              updateSubscription(
                                index,
                                "priceUSD",
                                e.target.value,
                              )
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                            style={{
                              backgroundColor: colors.background.primary,
                              borderColor: colors.border.primary,
                              color: colors.text.primary,
                            }}
                          />
                        </div>
                        <div className="flex justify-center md:justify-end">
                          <button
                            type="button"
                            onClick={() => removeSubscription(index)}
                            title="Remove subscription plan"
                            className="px-3 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
                            style={{
                              color: colors.status.error,
                              borderColor: colors.status.error,
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSubscription}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
                    style={{
                      color: colors.interactive.primary,
                      borderColor: colors.interactive.primary,
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Subscription Plan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Information */}
          <div className="space-y-6">
            <h2
              className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
              style={{
                color: colors.text.primary,
                borderBottomColor: colors.border.primary,
              }}
            >
              Media
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Main Product Image
                </label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"

                  onFocus={(e) => {
                    e.target.style.borderColor = colors.interactive.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border.primary;
                  }}
                  required
                />
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Primary product image displayed in listings and product page
                </p>
              </div>

              <div className="space-y-4">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Additional Images
                </label>
                {newProduct.additionalImages.map((image, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          updateImageField(
                            "additionalImages",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder={`Image ${index + 1} URL - https://example.com/image${index + 1}.jpg`}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"

                        onFocus={(e) => {
                          e.target.style.borderColor =
                            colors.interactive.primary;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.border.primary;
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeImageField("additionalImages", index)
                      }
                      disabled={newProduct.additionalImages.length === 1}
                      className="px-3 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      style={{
                        color: colors.status.error,
                        borderColor: colors.status.error,
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addImageField("additionalImages")}
                  className="flex items-center gap-2 px-4 py-2 text-yellow-400 border border-yellow-600 rounded-lg hover:bg-yellow-900"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </button>
                <p className="text-sm text-gray-400">
                  Additional product screenshots, interface images, or feature
                  highlights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    Product Demo Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newProduct.videoUrl}
                    onChange={(e) =>
                      handleInputChange("videoUrl", e.target.value)
                    }
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.interactive.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border.primary;
                    }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    YouTube, Vimeo, or direct video link for product
                    demonstration
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    Activation Demo Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newProduct.activationVideoUrl}
                    onChange={(e) =>
                      handleInputChange("activationVideoUrl", e.target.value)
                    }
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.interactive.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border.primary;
                    }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    YouTube, Vimeo, or direct video link for activation
                    demonstration
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Google Drive Download Link (Optional)
                </label>
                <input
                  type="url"
                  value={newProduct.driveLink}
                  onChange={(e) =>
                    handleInputChange("driveLink", e.target.value)
                  }
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.interactive.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border.primary;
                  }}
                />
                <p
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  Google Drive shareable link for the downloadable product file. Users will see a download button after purchase.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle
                className="h-5 w-5"
                style={{ color: colors.interactive.primary }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Add common questions and answers to help customers understand your
              product better.
            </p>

            {newProduct.faqs.length > 0 ? (
              <div className="space-y-4">
                {newProduct.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-sm font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          FAQ #{index + 1}
                        </label>
                        <button
                          type="button"
                          onClick={() => removeFAQ(index)}
                          className="p-1 rounded hover:opacity-80 transition-colors duration-200"
                          style={{ color: colors.status.error }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(index, "question", e.target.value)
                          }
                          placeholder="Enter the question"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.primary,
                            color: colors.text.primary,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor =
                              colors.interactive.primary;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.border.primary;
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(index, "answer", e.target.value)
                          }
                          placeholder="Enter the answer"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 min-h-[80px]"
                          style={{
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.primary,
                            color: colors.text.primary,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor =
                              colors.interactive.primary;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.border.primary;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8"
                style={{ color: colors.text.secondary }}
              >
                <HelpCircle
                  className="h-12 w-12 mx-auto mb-4 opacity-50"
                  style={{ color: colors.text.secondary }}
                />
                <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
              </div>
            )}

            <button
              type="button"
              onClick={addFAQ}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
              style={{
                color: colors.interactive.primary,
                borderColor: colors.interactive.primary,
              }}
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>

          {/* Form Actions */}
          <div className="space-y-4">
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                <Clock className="h-4 w-4" />
                <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}

            <div
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t transition-colors duration-200"
              style={{ borderColor: colors.border.primary }}
            >
              <button
                type="button"
                onClick={(e) => handleAddProduct(e, true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                style={{
                  background: colors.background.tertiary,
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.primary}`,
                }}
              >
                <FileText className="h-4 w-4" />
                Save as Draft
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                style={{
                  background: '#00BEF5',
                  color: colors.text.inverse,
                  border: 'none',
                }}
              >
                <Save className="h-4 w-4" />
                {product ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border rounded-lg hover:opacity-80 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                style={{
                  background: theme === "dark"
                    ? 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)'
                    : 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
                  color: colors.text.inverse,
                  border: 'none',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div >
    </div >
  );
};

export default AddProductModal;
