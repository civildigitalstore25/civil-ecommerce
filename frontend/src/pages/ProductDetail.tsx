import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetail } from "../api/productApi";
import { useCartContext } from "../contexts/CartContext";
import { useUser } from "../api/userQueries";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import RelatedProducts from "../components/RelatedProducts";
import {
  getProductReviews,
  getProductReviewStats,
  createReview,
  updateReview,
  deleteReview,
  type Review,
  type ReviewStats,
} from "../api/reviewApi";
import BannerCarousel from "../ui/admin/banner/BannerCarousel";
import Swal from "sweetalert2";
import * as LucideIcons from "lucide-react";

// Enhanced FAQ Item Component
interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  colors: any;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  index,
  colors,
}) => {
  const [isOpen, setIsOpen] = useState(index === 0); // First item open by default

  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: isOpen
          ? colors.interactive.primary
          : colors.border.primary,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between group transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
            style={{
              backgroundColor: isOpen
                ? colors.interactive.primary
                : colors.background.primary,
              color: isOpen ? colors.background.primary : colors.text.secondary,
            }}
          >
            {index + 1}
          </div>
          <h4 className="text-lg font-semibold group-hover:opacity-80">
            {question}
          </h4>
        </div>
        <div
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: colors.interactive.primary }}
        >
          <LucideIcons.ChevronDown size={24} />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div
            className="pl-12 border-l-2 transition-colors duration-200"
            style={{ borderColor: colors.interactive.primary + "30" }}
          >
            <p
              className="leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Parse slug to get product name and version
  let productName = "";
  let productVersion = "";
  if (slug) {
    // Split by last hyphen for version (assuming version does not contain hyphens)
    const lastHyphen = slug.lastIndexOf("-");
    if (lastHyphen !== -1) {
      productName = slug.substring(0, lastHyphen).replace(/-/g, " ");
      productVersion = slug.substring(lastHyphen + 1);
    } else {
      productName = slug.replace(/-/g, " ");
    }
  }

  // You may need to update useProductDetail to support fetching by name+version, or filter after fetching all products
  // For now, try to fetch all products and filter (replace with API call if available)
  const { data: productList, isLoading } = useProductDetail(); // Assume this returns all products if no param
  const product = productList?.find(
    (p: any) =>
      p.name?.toLowerCase().replace(/\s+/g, " ") === productName.toLowerCase() &&
      (productVersion ? p.version?.toString().toLowerCase() === productVersion.toLowerCase() : true)
  );
  const [selectedLicense, setSelectedLicense] = useState<string>("yearly");
  const [userHasSelectedPlan, setUserHasSelectedPlan] = useState(false); // Track manual selection
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "features" | "requirements" | "reviews" | "faq"
  >("features");
  const { addItem, isItemInCart, getItemQuantity } = useCartContext();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  // Review-related state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");

  // Helper function to render Lucide icons dynamically
  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} size={24} />;
    }
    // Fallback to a default icon if the specified icon doesn't exist
    return <LucideIcons.Check className={className} size={24} />;
  };

  // Load reviews when component mounts or product changes
  useEffect(() => {
    if (product?._id) {
      loadReviews(product._id);
      loadReviewStats(product._id);
    }
  }, [product?._id]);

  // Load reviews for the product
  const loadReviews = async (productId: string) => {
    if (!productId) return;
    try {
      setReviewsLoading(true);
      const response = await getProductReviews(productId);
      setReviews(response.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load review statistics
  const loadReviewStats = async (productId: string) => {
    if (!productId) return;
    try {
      const stats = await getProductReviewStats(productId);
      setReviewStats(stats);
    } catch (error) {
      console.error("Error loading review stats:", error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to post a review",
        icon: "info",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      Swal.fire("Error", "Please enter a comment", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReview) {
        await updateReview(editingReview._id, reviewForm);
        Swal.fire("Success", "Review updated successfully", "success");
      } else {
        await createReview(product._id!, reviewForm);
        Swal.fire("Success", "Review posted successfully", "success");
      }

      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      setEditingReview(null);
      loadReviews(product._id);
      loadReviewStats(product._id);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to submit review",
        "error",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle review editing
  const handleEditReview = (review: Review) => {
    console.log("handleEditReview called");
    console.log("user:", user);
    console.log("user.id:", user?.id);
    console.log("review.user._id:", review.user._id);
    console.log("user.role:", user?.role);
    console.log(
      "Comparison result:",
      user?.id !== review.user._id,
      user?.role !== "admin",
    );

    // Temporarily allow all edits for debugging
    // if (!user || (user.id !== review.user._id && user.role !== 'admin')) {
    //   Swal.fire('Error', 'You can only edit your own reviews', 'error');
    //   return;
    // }
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment });
    setShowReviewForm(true);
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    const result = await Swal.fire({
      title: "Delete Review",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteReview(reviewId);
      Swal.fire("Success", "Review deleted successfully", "success");
      loadReviews(product._id);
      loadReviewStats(product._id);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete review",
        "error",
      );
    }
  };

  // Get all available pricing options
  const getAllPricingOptions = () => {
    if (!product) return [];

    const options = [];

    // Add subscription durations if available (main pricing options)
    if (
      product.subscriptionDurations &&
      product.subscriptionDurations.length > 0
    ) {
      product.subscriptionDurations.forEach((sub: any, index: number) => {
        if (
          (sub.price && sub.price > 0) ||
          (sub.priceINR && sub.priceINR > 0) ||
          (sub.priceUSD && sub.priceUSD > 0)
        ) {
          options.push({
            id: `subscription-${index}`,
            label: sub.duration,
            priceINR: sub.priceINR || sub.price || 0,
            priceUSD: sub.priceUSD || (sub.price ? sub.price / 83 : 0),
            type: "subscription",
            badge: sub.duration.toLowerCase().includes("1")
              ? "Most Popular"
              : sub.duration.toLowerCase().includes("3")
                ? "Save 30%"
                : null,
            savings: null,
          });
        }
      });
    } else {
      // Fallback to legacy pricing structure
      if (
        (product.price1 && product.price1 > 0) ||
        (product.price1INR && product.price1INR > 0)
      ) {
        options.push({
          id: "yearly",
          label: "1 Year License",
          priceINR: product.price1INR || product.price1 || 0,
          priceUSD:
            product.price1USD || (product.price1 ? product.price1 / 83 : 0),
          type: "yearly",
          badge: "Most Popular",
          savings: null,
        });
      }

      if (
        (product.price3 && product.price3 > 0) ||
        (product.price3INR && product.price3INR > 0)
      ) {
        options.push({
          id: "3year",
          label: "3 Year License",
          priceINR: product.price3INR || product.price3 || 0,
          priceUSD:
            product.price3USD || (product.price3 ? product.price3 / 83 : 0),
          type: "3year",
          badge: "Save 30%",
          savings: null,
        });
      }
    }

    // Add lifetime option if available
    const lifetimePrice =
      product.lifetimePriceINR ||
      product.priceLifetime ||
      product.lifetimePrice ||
      0;
    if (lifetimePrice > 0) {
      const yearlyPrice =
        options.find(
          (opt) => opt.type === "yearly" || opt.type === "subscription",
        )?.priceINR || 0;
      const threeYearTotal = yearlyPrice * 3;
      const savings =
        threeYearTotal > lifetimePrice ? threeYearTotal - lifetimePrice : 0;

      options.push({
        id: "lifetime",
        label: "Lifetime Access",
        priceINR: lifetimePrice,
        priceUSD: product.lifetimePriceUSD || lifetimePrice / 83,
        type: "lifetime",
        badge: "Best Value",
        savings: savings > 0 ? `Save ₹${savings.toLocaleString()}` : null,
      });
    }

    // Add membership option if available
    const membershipPrice =
      product.membershipPriceINR || product.membershipPrice || 0;
    if (membershipPrice > 0) {
      options.push({
        id: "membership",
        label: "Membership",
        priceINR: membershipPrice,
        priceUSD: product.membershipPriceUSD || membershipPrice / 83,
        type: "membership",
        badge: "Premium Access",
        savings: null,
      });
    }

    return options;
  };

  // Get admin subscription plans separately
  const getAdminSubscriptionPlans = () => {
    if (!product || !product.subscriptions) return [];

    return product.subscriptions
      .filter(
        (sub: any) =>
          (sub.price && sub.price > 0) ||
          (sub.priceINR && sub.priceINR > 0) ||
          (sub.priceUSD && sub.priceUSD > 0),
      )
      .map((sub: any, index: number) => ({
        id: `admin-subscription-${index}`,
        label: sub.duration,
        priceINR: sub.priceINR || sub.price || 0,
        priceUSD: sub.priceUSD || (sub.price ? sub.price / 83 : 0),
        type: "admin-subscription",
        badge: sub.duration.toLowerCase().includes("monthly")
          ? "Flexible"
          : sub.duration.toLowerCase().includes("annual")
            ? "Best Deal"
            : null,
        savings: null,
      }));
  };

  const pricingOptions = getAllPricingOptions();
  const adminSubscriptionPlans = getAdminSubscriptionPlans();
  const allPricingOptions = [...pricingOptions, ...adminSubscriptionPlans];
  const selectedOption =
    allPricingOptions.find((opt) => opt.id === selectedLicense) ||
    allPricingOptions[0];

  // Group pricing options by type
  const licenseOptions = pricingOptions.filter(
    (opt) => opt.type === "yearly" || opt.type === "3year",
  );
  const subscriptionOptions = pricingOptions.filter(
    (opt) => opt.type === "subscription",
  );
  const lifetimeOptions = pricingOptions.filter(
    (opt) => opt.type === "lifetime",
  );
  const membershipOptions = pricingOptions.filter(
    (opt) => opt.type === "membership",
  );

  React.useEffect(() => {
    if (allPricingOptions.length > 0 && !selectedOption) {
      setSelectedLicense(allPricingOptions[0].id);
    }
  }, [allPricingOptions, selectedOption]);

  // Early returns after all hooks are defined to avoid hook order violations
  if (isLoading)
    return (
      <div
        className="text-center py-20 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        Loading...
      </div>
    );

  if (!product)
    return (
      <div
        className="text-center py-20 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        Product not found.
      </div>
    );

  // Images - prioritize imageUrl over image field, and handle additional images
  const mainImageUrl = product.imageUrl || product.image;
  const additionalImages =
    product.additionalImages?.filter((img: string) => img && img.trim() !== "") || [];
  const images = [mainImageUrl, ...additionalImages].filter((img) => img);

  // Include demo video as part of media gallery
  const mediaItems = [...images];
  if (product.videoUrl) {
    mediaItems.push(`video:${product.videoUrl}`);
  }

  const currentMainImage = mainImage || mainImageUrl;

  // Cart functionality
  const handleAddToCart = async () => {
    // Check if user has manually selected a pricing plan
    if (!userHasSelectedPlan || !selectedOption) {
      await Swal.fire({
        title: "Select Pricing Plan",
        text: "Please select a pricing plan before adding to cart",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: colors.interactive.primary,
      });
      return;
    }

    if (!user) {
      // Redirect to login if user is not authenticated
      navigate("/login", { state: { returnTo: `/product/${slug}` } });
      return;
    }

    // Convert license types for cart compatibility
    const getCartLicenseType = (): "1year" | "3year" | "lifetime" => {
      // Handle lifetime license
      if (selectedLicense === "lifetime") return "lifetime";

      // Handle main subscription/pricing options
      if (
        selectedLicense === "yearly" ||
        selectedLicense.includes("subscription-0")
      )
        return "1year";
      if (
        selectedLicense === "3year" ||
        selectedLicense.includes("subscription-1")
      )
        return "3year";

      // Handle admin subscription plans and membership
      if (
        selectedLicense.includes("admin-subscription-") ||
        selectedLicense === "membership"
      ) {
        const selectedPlan = selectedOption;
        if (selectedPlan) {
          // Map by duration text to supported cart license types
          const duration = selectedPlan.label.toLowerCase();
          if (duration.includes("3") && duration.includes("year"))
            return "3year";
          if (
            (duration.includes("1") && duration.includes("year")) ||
            duration.includes("annual")
          )
            return "1year";
          // For monthly subscriptions, memberships, and other types, map to 1year as default
          return "1year";
        }
      }

      // Default fallback
      return "1year";
    };

    const cartLicenseType = getCartLicenseType();

    if (isInCart) {
      Swal.fire({
        title: "Already in Cart",
        text: `${product.name} is already in your cart with ${selectedOption?.label} license`,
        icon: "info",
        confirmButtonText: "View Cart",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
      return;
    }

    if (
      product &&
      selectedOption &&
      (selectedOption.priceINR > 0 || selectedOption.priceUSD > 0)
    ) {
      try {
        // Create a temporary product object with the selected subscription plan price
        // This ensures the backend uses the correct price for the selected plan
        const productWithSelectedPrice = {
          ...product,
          // Store selected plan details for backend processing
          _selectedPlanDetails: {
            planId: selectedOption.id,
            planLabel: selectedOption.label,
            planPrice: selectedOption.priceINR,
            planType: selectedOption.type,
          },
        };

        // Temporarily override pricing based on selected option
        if (cartLicenseType === "1year") {
          productWithSelectedPrice.price1INR = selectedOption.priceINR;
          productWithSelectedPrice.price1 = selectedOption.priceINR;
        } else if (cartLicenseType === "3year") {
          productWithSelectedPrice.price3INR = selectedOption.priceINR;
          productWithSelectedPrice.price3 = selectedOption.priceINR;
        } else if (cartLicenseType === "lifetime") {
          productWithSelectedPrice.lifetimePriceINR = selectedOption.priceINR;
          productWithSelectedPrice.priceLifetime = selectedOption.priceINR;
        }

        console.log("Adding to cart:", {
          product: product.name,
          selectedOption,
          cartLicenseType,
          price: selectedOption.priceINR,
        });

        // Create subscription plan details to pass to cart
        const subscriptionPlanDetails = {
          planId: selectedOption.id,
          planLabel: selectedOption.label,
          planType: selectedOption.type,
        };

        await addItem(
          productWithSelectedPrice,
          cartLicenseType,
          1,
          subscriptionPlanDetails,
        );
        Swal.fire({
          title: "Added to Cart!",
          text: `${product.name} has been added to your cart with ${selectedOption.label}`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Cart",
          cancelButtonText: "Continue Shopping",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/cart");
          }
        });
      } catch (error) {
        console.error("Add to cart error:", error);
        Swal.fire(
          "Error",
          "Failed to add item to cart. Please try again.",
          "error",
        );
      }
    } else {
      console.warn("Cannot add to cart:", {
        product: !!product,
        selectedOption,
        selectedLicense,
        cartLicenseType,
      });
      Swal.fire("Error", "Please select a valid pricing option.", "error");
    }
  };

  const getCartLicenseTypeForCheck = (): "1year" | "3year" | "lifetime" => {
    // Handle lifetime license
    if (selectedLicense === "lifetime") return "lifetime";

    // Handle main subscription/pricing options
    if (
      selectedLicense === "yearly" ||
      selectedLicense.includes("subscription-0")
    )
      return "1year";
    if (
      selectedLicense === "3year" ||
      selectedLicense.includes("subscription-1")
    )
      return "3year";

    // Handle admin subscription plans and membership
    if (
      selectedLicense.includes("admin-subscription-") ||
      selectedLicense === "membership"
    ) {
      const selectedPlan = selectedOption;
      if (selectedPlan) {
        // Map by duration text to supported cart license types
        const duration = selectedPlan.label.toLowerCase();
        if (duration.includes("3") && duration.includes("year")) return "3year";
        if (
          (duration.includes("1") && duration.includes("year")) ||
          duration.includes("annual")
        )
          return "1year";
        // For monthly subscriptions, memberships, and other types, map to 1year as default
        return "1year";
      }
    }

    // Default fallback
    return "1year";
  };

  // Buy Now functionality
  // Buy Now functionality
  const handleBuyNow = async () => {
    // Check if user has manually selected a pricing plan
    if (!userHasSelectedPlan || !selectedOption) {
      await Swal.fire({
        title: "Select Pricing Plan",
        text: "Please select a pricing plan before proceeding",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: colors.interactive.primary,
      });
      return;
    }

    if (!user) {
      // Redirect to login if user is not authenticated
      navigate("/signin", { state: { returnTo: `/product/${slug}` } });
      return;
    }

    // Create a cart item for the selected product
    const cartItem = {
      _id: product._id,
      product: {
        _id: product._id,
        name: product.name,
        imageUrl: product.imageUrl || product.image,
        brand: product.brand || product.company,
      },
      licenseType: getCartLicenseTypeForCheck(),
      quantity: 1,
      price: selectedOption.priceINR,
      priceUSD: selectedOption.priceUSD,
      totalPrice: selectedOption.priceINR,
      subscriptionPlanDetails: {
        planId: selectedOption.id,
        planLabel: selectedOption.label,
        planType: selectedOption.type,
      },
    };

    // Navigate to checkout with the single product
    navigate("/checkout", {
      state: {
        items: [cartItem],
        summary: {
          subtotal: selectedOption.priceINR,
          discount: 0,
          total: selectedOption.priceINR,
          itemCount: 1,
        },
      },
    });
  };

  // Handle Enquiry
  const handleEnquirySubmit = () => {
    if (!enquiryMessage.trim()) {
      Swal.fire({
        title: "Message Required",
        text: "Please enter your enquiry message",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: colors.interactive.primary,
      });
      return;
    }

    // Format message for WhatsApp
    const productName = product.name;
    const productLink = window.location.href;
    const message = `Hi, I'm interested in ${productName}.\n\nMy Enquiry:\n${enquiryMessage}\n\nProduct Link: ${productLink}`;

    // WhatsApp number (country code +91 prefixed, no plus)
    const whatsappNumber = "919042993986";

    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Close modal and reset message
    setShowEnquiryModal(false);
    setEnquiryMessage("");

    // Show success message
    Swal.fire({
      title: "Redirecting to WhatsApp",
      text: "Your enquiry will be sent via WhatsApp",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const cartLicenseType = getCartLicenseTypeForCheck();
  const isInCart = product
    ? isItemInCart(product._id!, cartLicenseType)
    : false;
  const cartQuantity = product
    ? getItemQuantity(product._id!, cartLicenseType)
    : 0;
  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      {/* Back Button and Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2 lg:py-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm overflow-x-auto"
            style={{ color: colors.text.secondary }}
          >
            <span>Home</span>
            <span>{">"}</span>
            <span>{product.category}</span>
            <span>{">"}</span>
            <span style={{ color: colors.interactive.primary }}>
              {product.name}
            </span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.background.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.accent;
              e.currentTarget.style.color = colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.secondary;
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <LucideIcons.ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>
      {/* Product Page Banner */}
      <BannerCarousel page="product" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Side - Product Gallery */}
          <div className="space-y-3 lg:space-y-4">
            {/* Main Media Display */}
            <div className="aspect-square flex items-center justify-center p-2 lg:p-4">
              {currentMainImage && currentMainImage.startsWith("video:") ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="aspect-video w-full max-w-sm lg:max-w-md rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
                    {currentMainImage
                      .replace("video:", "")
                      .includes("youtube.com") ||
                      currentMainImage
                        .replace("video:", "")
                        .includes("youtu.be") ? (
                      <iframe
                        src={currentMainImage
                          .replace("video:", "")
                          .replace("watch?v=", "embed/")}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Product Demo Video"
                      />
                    ) : (
                      <video
                        src={currentMainImage.replace("video:", "")}
                        className="w-full h-full"
                        controls
                        title="Product Demo Video"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={currentMainImage}
                  className="max-w-full max-h-full object-contain rounded-lg lg:rounded-xl shadow-lg"
                  alt={product.name}
                />
              )}
            </div>

            {/* Media Thumbnails */}
            <div className="flex gap-2 lg:gap-3 justify-center flex-wrap">
              {mediaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 relative"
                  style={{
                    borderColor:
                      item === currentMainImage
                        ? colors.interactive.primary
                        : colors.border.primary,
                  }}
                  onClick={() => setMainImage(item)}
                >
                  {item.startsWith("video:") ? (
                    <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-purple-600">
                      <LucideIcons.Play
                        className="absolute inset-0 m-auto text-white bg-black bg-opacity-50 rounded-full p-1"
                        size={20}
                      />
                      <div className="text-xs font-semibold text-center text-white absolute bottom-1">
                        Video
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item}
                      className="object-cover w-full h-full"
                      alt={`thumb-${idx}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Brand Badge */}
            <div className="flex items-center gap-2 lg:gap-3">
              <span
                className="px-2 py-1 lg:px-3 lg:py-1 rounded-lg text-xs lg:text-sm font-bold transition-colors duration-200"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.background.primary,
                }}
              >
                {product.brand || product.company}
              </span>
              <span
                style={{ color: colors.interactive.primary }}
                className="text-sm"
              >
                {product.version}
              </span>
            </div>

            {/* Product Title */}
            <h1
              className="text-2xl lg:text-4xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {"★".repeat(4)}
                <span style={{ color: colors.text.secondary }}>☆</span>
              </div>
              <span style={{ color: colors.text.primary }}>4.9 (2,341)</span>
            </div>

            {/* Description */}
            <p
              className="text-base lg:text-lg leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              {product.shortDescription}
            </p>

            {/* License Selection */}
            <div
              className="rounded-lg lg:rounded-xl p-3 lg:p-4 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3
                  className="text-base lg:text-lg font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Choose Your Access
                </h3>
                {selectedOption?.badge && (
                  <span
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{
                      backgroundColor: "#10b981",
                      color: colors.background.primary,
                    }}
                  >
                    {selectedOption.badge}
                  </span>
                )}
              </div>

              {/* License Plans Section - Small boxes in a row */}
              {licenseOptions.length > 0 && (
                <div className="mb-3">
                  <h4
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    License Plans
                  </h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {licenseOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setSelectedLicense(option.id);
                          setUserHasSelectedPlan(true);
                        }}
                        className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[100px] ${selectedLicense === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          borderColor:
                            selectedLicense === option.id
                              ? colors.interactive.primary
                              : colors.border.primary,
                          background: selectedLicense === option.id
                            ? `linear-gradient(120deg, ${colors.interactive.primary} 60%, ${colors.interactive.primaryHover} 100%)`
                            : colors.background.secondary,
                          color: selectedLicense === option.id ? '#fff' : colors.text.primary,
                          boxShadow: selectedLicense === option.id ? '0 2px 12px 0 rgba(0,0,0,0.10)' : undefined,
                        }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {option.label.replace(" License", "")}
                        </div>
                        {option.badge && (
                          <div
                            className="text-xs px-1 py-0.5 rounded font-bold mb-1"
                            style={{
                              backgroundColor:
                                option.badge === "Most Popular"
                                  ? "#3b82f6"
                                  : "#f59e0b",
                              color: colors.background.primary,
                              fontSize: "10px",
                            }}
                          >
                            {option.badge}
                          </div>
                        )}
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatPriceWithSymbol(
                            option.priceINR,
                            option.priceUSD,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Plans Section - Small boxes in a row */}
              {subscriptionOptions.length > 0 && (
                <div className="mb-3">
                  <h4
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Pricing Plans
                  </h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {subscriptionOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setSelectedLicense(option.id);
                          setUserHasSelectedPlan(true);
                        }}
                        className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[90px] ${selectedLicense === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          borderColor:
                            selectedLicense === option.id
                              ? colors.interactive.primary
                              : colors.border.primary,
                          background: selectedLicense === option.id
                            ? `linear-gradient(120deg, ${colors.interactive.primary} 60%, ${colors.interactive.primaryHover} 100%)`
                            : colors.background.secondary,
                          color: selectedLicense === option.id ? '#fff' : colors.text.primary,
                          boxShadow: selectedLicense === option.id ? '0 2px 12px 0 rgba(0,0,0,0.10)' : undefined,
                        }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {option.label}
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatPriceWithSymbol(
                            option.priceINR,
                            option.priceUSD,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifetime License Section - Small box */}
              {lifetimeOptions.length > 0 && (
                <div className="mb-3">
                  <h4
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Lifetime Access
                  </h4>
                  <div className="flex gap-2">
                    {lifetimeOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setSelectedLicense(option.id);
                          setUserHasSelectedPlan(true);
                        }}
                        className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[120px] ${selectedLicense === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          borderColor:
                            selectedLicense === option.id
                              ? colors.interactive.primary
                              : colors.border.primary,
                          background: selectedLicense === option.id
                            ? `linear-gradient(120deg, ${colors.interactive.primary} 60%, ${colors.interactive.primaryHover} 100%)`
                            : colors.background.secondary,
                          color: selectedLicense === option.id ? '#fff' : colors.text.primary,
                          boxShadow: selectedLicense === option.id ? '0 2px 12px 0 rgba(0,0,0,0.10)' : undefined,
                        }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {option.label}
                        </div>
                        <div
                          className="text-xs px-1 py-0.5 rounded font-bold mb-1"
                          style={{
                            backgroundColor: "#10b981",
                            color: colors.background.primary,
                            fontSize: "10px",
                          }}
                        >
                          Best Value
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatPriceWithSymbol(
                            option.priceINR,
                            option.priceUSD,
                          )}
                        </div>
                        {option.savings && (
                          <div className="text-xs text-green-400 mt-1">
                            {option.savings}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Membership Section - Small box */}
              {membershipOptions.length > 0 && (
                <div className="mb-3">
                  <h4
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Premium Membership
                  </h4>
                  <div className="flex gap-2">
                    {membershipOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setSelectedLicense(option.id);
                          setUserHasSelectedPlan(true);
                        }}
                        className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[110px] ${selectedLicense === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          borderColor:
                            selectedLicense === option.id
                              ? colors.interactive.primary
                              : colors.border.primary,
                          background: selectedLicense === option.id
                            ? `linear-gradient(120deg, ${colors.interactive.primary} 60%, ${colors.interactive.primaryHover} 100%)`
                            : colors.background.secondary,
                          color: selectedLicense === option.id ? '#fff' : colors.text.primary,
                          boxShadow: selectedLicense === option.id ? '0 2px 12px 0 rgba(0,0,0,0.10)' : undefined,
                        }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {option.label}
                        </div>
                        <div
                          className="text-xs px-1 py-0.5 rounded font-bold mb-1"
                          style={{
                            backgroundColor: "#f59e0b",
                            color: colors.background.primary,
                            fontSize: "10px",
                          }}
                        >
                          Premium
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatPriceWithSymbol(
                            option.priceINR,
                            option.priceUSD,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Subscription Plans */}
              {adminSubscriptionPlans.length > 0 && (
                <div className="mb-3">
                  <h4
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.text.secondary }}
                  >
                    Subscription Plans
                  </h4>
                  <div className="flex gap-2">
                    {adminSubscriptionPlans.map((option: any) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          setSelectedLicense(option.id);
                          setUserHasSelectedPlan(true);
                        }}
                        className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[110px] ${selectedLicense === option.id ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          borderColor:
                            selectedLicense === option.id
                              ? colors.interactive.primary
                              : colors.border.primary,
                          background: selectedLicense === option.id
                            ? `linear-gradient(120deg, ${colors.interactive.primary} 60%, ${colors.interactive.primaryHover} 100%)`
                            : colors.background.secondary,
                          color: selectedLicense === option.id ? '#fff' : colors.text.primary,
                          boxShadow: selectedLicense === option.id ? '0 2px 12px 0 rgba(0,0,0,0.10)' : undefined,
                        }}
                      >
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {option.label}
                        </div>
                        {option.badge && (
                          <div
                            className="text-xs px-1 py-0.5 rounded font-bold mb-1"
                            style={{
                              backgroundColor:
                                option.badge === "Flexible"
                                  ? "#10b981"
                                  : "#3b82f6",
                              color: colors.background.primary,
                              fontSize: "10px",
                            }}
                          >
                            {option.badge}
                          </div>
                        )}
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {formatPriceWithSymbol(
                            option.priceINR,
                            option.priceUSD,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Option Summary */}
              {pricingOptions.length > 1 && selectedOption && (
                <div
                  className="rounded-lg p-3 text-center transition-colors duration-200"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  <div
                    className="text-lg lg:text-2xl font-bold mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {formatPriceWithSymbol(
                      selectedOption.priceINR,
                      selectedOption.priceUSD,
                    )}
                  </div>
                  <p
                    className="text-xs lg:text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {selectedOption.label} • GST Included
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full font-bold py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow"
                style={{
                  background: colors.interactive.primary,
                  color: '#fff',
                  border: `1.5px solid ${colors.interactive.primary}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.interactive.primaryHover;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.interactive.primary;
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <LucideIcons.ShoppingCart size={20} />
                {isInCart ? `In Cart (${cartQuantity})` : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full border font-bold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow"
                style={{
                  border: `1.5px solid ${colors.interactive.primary}`,
                  color: '#fff',
                  background: colors.interactive.primary,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.interactive.primaryHover;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.interactive.primary;
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <LucideIcons.Zap size={20} />
                Buy Now
              </button>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="w-full border font-medium py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow"
                style={{
                  border: `1.5px solid ${colors.interactive.primary}`,
                  color: '#fff',
                  background: colors.interactive.primary,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.interactive.primaryHover;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.interactive.primary;
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <LucideIcons.MessageSquare size={20} />
                Request Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* Keep only Activation Video if it exists separately */}
        {product.activationVideoUrl && (
          <div className="mt-8 lg:mt-16">
            <div
              className="rounded-xl lg:rounded-2xl p-4 lg:p-8 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <span className="text-xl lg:text-2xl">▶️</span>
                <h2
                  className="text-xl lg:text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Activation Video Demo
                </h2>
              </div>
              <p className="mb-6" style={{ color: colors.text.secondary }}>
                Watch this step-by-step guide to activate your {product.name}{" "}
                license
              </p>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                {product.activationVideoUrl.includes("youtube.com") ||
                  product.activationVideoUrl.includes("youtu.be") ? (
                  <iframe
                    src={product.activationVideoUrl.replace(
                      "watch?v=",
                      "embed/",
                    )}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title="Activation Video Demo"
                  />
                ) : (
                  <video
                    src={product.activationVideoUrl}
                    className="w-full h-full"
                    controls
                    title="Activation Video Demo"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className="mt-8 lg:mt-16">
          {/* Tab Navigation */}
          <div
            className="border-b"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex gap-4 lg:gap-8 overflow-x-auto scrollbar-hide">
              {[
                { key: "features", label: "Features" },
                { key: "requirements", label: "System" },
                {
                  key: "reviews",
                  label: `Reviews (${reviewStats?.totalReviews || 0})`,
                },
                { key: "faq", label: "FAQ" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className="py-3 lg:py-4 px-1 lg:px-2 font-medium transition-colors duration-200 border-b-2 whitespace-nowrap text-sm lg:text-base flex-shrink-0"
                  style={{
                    borderColor:
                      activeTab === tab.key
                        ? colors.interactive.primary
                        : "transparent",
                    color:
                      activeTab === tab.key
                        ? colors.interactive.primary
                        : colors.text.secondary,
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.color = colors.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-4 lg:py-8">
            {activeTab === "features" && (
              <div>
                <h3
                  className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6"
                  style={{ color: colors.text.primary }}
                >
                  Key Features
                </h3>
                <p
                  className="mb-6 lg:mb-8 text-sm lg:text-base"
                  style={{ color: colors.text.secondary }}
                >
                  Comprehensive overview of {product.name} capabilities and
                  tools
                </p>

                {/* Show structured features if available */}
                {product.keyFeatures && product.keyFeatures.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {product.keyFeatures.map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl lg:rounded-2xl p-4 lg:p-6 border transition-colors duration-200 shadow"
                        style={{
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary,
                        }}
                      >
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                          <div className="text-yellow-400 flex-shrink-0">
                            {renderIcon(feature.icon, "w-5 h-5 lg:w-6 lg:h-6")}
                          </div>
                          <h4
                            className="text-lg lg:text-xl font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {feature.title}
                          </h4>
                        </div>
                        <p
                          className="text-sm lg:text-base"
                          style={{ color: colors.text.secondary }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default features if no structured or rich text features data */}
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Check", "text-green-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Advanced 2D Drafting
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Precise drafting tools with automated workflows
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Zap", "text-orange-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          3D Modeling & Visualization
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Create stunning 3D models with photorealistic rendering
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Users", "text-blue-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Cloud Collaboration
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Real-time collaboration with team members worldwide
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Shield", "text-purple-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Industry-Specific Toolsets
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Specialized tools for architecture, engineering, and
                        construction
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Smartphone", "text-yellow-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Mobile & Web Access
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Access your designs anywhere with mobile and web apps
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200 shadow"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Lock", "text-red-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Enhanced Security
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Enterprise-grade security features and compliance
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional product info */}
                <div
                  className="mt-8 rounded-2xl p-6 transition-colors duration-200"
                  style={{ backgroundColor: colors.background.secondary }}
                >
                  <h4
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    Product Information
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    style={{ color: colors.text.secondary }}
                  >
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: colors.interactive.primary }}
                      >
                        Category:
                      </span>
                      <span className="ml-2 capitalize">
                        {product.category?.replace("-", " ")}
                      </span>
                    </div>
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: colors.interactive.primary }}
                      >
                        Brand:
                      </span>
                      <span className="ml-2">
                        {product.brand || product.company}
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-400 font-medium">
                        Version:
                      </span>
                      <span className="ml-2">{product.version}</span>
                    </div>
                    {product.status && (
                      <div>
                        <span className="text-orange-400 font-medium">
                          Status:
                        </span>
                        <span
                          className={`ml-2 capitalize ${product.status === "active" ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {product.status}
                        </span>
                      </div>
                    )}
                    {product.isBestSeller && (
                      <div>
                        <span className="text-orange-400 font-medium">
                          Badge:
                        </span>
                        <span className="ml-2 text-yellow-400">
                          ⭐ Best Seller
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.text.primary }}
                >
                  System Requirements
                </h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  Minimum system specifications for {product.name}
                </p>

                {/* Show structured requirements if available */}
                {product.systemRequirements &&
                  product.systemRequirements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.systemRequirements.map((requirement: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-2xl p-6 border transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-blue-400">
                            {renderIcon(requirement.icon, "w-6 h-6")}
                          </div>
                          <h4
                            className="text-xl font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {requirement.title}
                          </h4>
                        </div>
                        <p style={{ color: colors.text.secondary }}>
                          {requirement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default requirements if no structured or rich text requirements data */}
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Monitor", "text-blue-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Operating System
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Windows 10/11 (64-bit) or macOS 10.15+
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Cpu", "text-green-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Processor
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Intel Core i5 or equivalent AMD processor (2.5GHz or
                        higher)
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("MemoryStick", "text-purple-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Memory (RAM)
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        8 GB RAM minimum (16 GB recommended for optimal
                        performance)
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Gamepad2", "text-orange-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Graphics Card
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        DirectX 11 or DirectX 12 compatible graphics card with
                        1GB VRAM
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("HardDrive", "text-yellow-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Storage Space
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        7 GB free disk space for installation
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon("Wifi", "text-cyan-400 w-6 h-6")}
                        <h4
                          className="text-xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Internet Connection
                        </h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Broadband internet connection required for activation
                        and cloud features
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.text.primary }}
                >
                  Customer Reviews
                </h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  What users are saying about {product.name}
                </p>

                {/* Review Statistics */}
                {reviewStats && (
                  <div
                    className="rounded-2xl p-6 mb-8 transition-colors duration-200"
                    style={{ backgroundColor: colors.background.secondary }}
                  >
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <div
                          className="text-3xl font-bold"
                          style={{ color: colors.interactive.primary }}
                        >
                          {reviewStats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex text-yellow-400 mb-1">
                          {"★".repeat(Math.floor(reviewStats.averageRating))}
                          {"☆".repeat(
                            5 - Math.floor(reviewStats.averageRating),
                          )}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {reviewStats.totalReviews} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div
                            key={star}
                            className="flex items-center gap-2 mb-1"
                          >
                            <span className="text-sm w-8">{star}★</span>
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingDistribution[star as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100 : 0}%`,
                                  backgroundColor: colors.interactive.primary,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm w-8">
                              {
                                reviewStats.ratingDistribution[
                                star as keyof typeof reviewStats.ratingDistribution
                                ]
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Write Review Button */}
                {!showReviewForm && (
                  <div className="mb-8">
                    {user ? (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                        style={{
                          backgroundColor: colors.interactive.primary,
                          color: colors.background.primary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.interactive.primaryHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.interactive.primary;
                        }}
                      >
                        Write a Review
                      </button>
                    ) : (
                      <div
                        className="rounded-2xl p-6 transition-colors duration-200"
                        style={{ backgroundColor: colors.background.secondary }}
                      >
                        <h4
                          className="text-xl font-bold mb-4"
                          style={{ color: colors.text.primary }}
                        >
                          Write a Review
                        </h4>
                        <p
                          className="mb-4"
                          style={{ color: colors.text.secondary }}
                        >
                          Please login to share your experience with this
                          product.
                        </p>
                        <button
                          onClick={() => navigate("/signin")}
                          className="font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                          style={{
                            backgroundColor: colors.interactive.primary,
                            color: colors.background.primary,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.interactive.primaryHover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.interactive.primary;
                          }}
                        >
                          Login to Review
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && user && (
                  <div
                    className="rounded-2xl p-6 mb-8 transition-colors duration-200"
                    style={{ backgroundColor: colors.background.secondary }}
                  >
                    <h4
                      className="text-xl font-bold mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      {editingReview ? "Edit Review" : "Write a Review"}
                    </h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label
                          className="block mb-2 font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          Rating
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewForm((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className="text-2xl transition-colors"
                              style={{
                                color:
                                  star <= reviewForm.rating
                                    ? "#fbbf24"
                                    : colors.text.secondary,
                              }}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          Comment
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          className="w-full p-3 rounded-lg border transition-colors"
                          style={{
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.primary,
                            color: colors.text.primary,
                          }}
                          rows={4}
                          placeholder="Share your experience with this product..."
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          style={{
                            backgroundColor: colors.interactive.primary,
                            color: colors.background.primary,
                          }}
                        >
                          {submittingReview
                            ? "Submitting..."
                            : editingReview
                              ? "Update Review"
                              : "Post Review"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setEditingReview(null);
                            setReviewForm({ rating: 5, comment: "" });
                          }}
                          className="font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background.primary,
                            color: colors.text.primary,
                            border: `1px solid ${colors.border.primary}`,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                        style={{ borderColor: colors.interactive.primary }}
                      ></div>
                      <p
                        className="mt-2"
                        style={{ color: colors.text.secondary }}
                      >
                        Loading reviews...
                      </p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div
                      className="rounded-2xl p-8 text-center transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <p style={{ color: colors.text.secondary }}>
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-2xl p-6 transition-colors duration-200"
                        style={{ backgroundColor: colors.background.secondary }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: colors.interactive.primary,
                                color: colors.background.primary,
                              }}
                            >
                              {review.user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5
                                className="font-bold"
                                style={{ color: colors.text.primary }}
                              >
                                {review.user.fullName}
                              </h5>
                              <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                  {"★".repeat(review.rating)}
                                  {"☆".repeat(5 - review.rating)}
                                </div>
                                <span
                                  className="text-sm"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {user &&
                            (user.id === review.user._id ||
                              user.role === "admin") && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-sm px-3 py-1 rounded transition-colors"
                                  style={{
                                    color: colors.interactive.primary,
                                    backgroundColor: colors.background.primary,
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-sm px-3 py-1 rounded transition-colors"
                                  style={{
                                    color: "#ef4444",
                                    backgroundColor: colors.background.primary,
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                        </div>
                        <p
                          className="mb-4"
                          style={{ color: colors.text.secondary }}
                        >
                          {review.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{ color: colors.text.primary }}
                >
                  Frequently Asked Questions
                </h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  Get answers to common questions about {product.name}
                </p>

                <div className="space-y-4">
                  {product.faqs && product.faqs.length > 0 ? (
                    product.faqs.map((faq: any, index: number) => (
                      <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        index={index}
                        colors={colors}
                      />
                    ))
                  ) : (
                    <>
                      <FAQItem
                        question="How do I activate my license?"
                        answer="After purchase, you'll receive an email with your license key and activation instructions. You can also watch our activation video demo above for step-by-step guidance. The process typically takes just a few minutes and requires an internet connection for initial activation."
                        index={0}
                        colors={colors}
                      />
                      <FAQItem
                        question="What's the difference between Yearly and Lifetime licenses?"
                        answer="Yearly licenses provide access for 12 months with all updates and support included. Lifetime licenses give you permanent access with no expiration date and all future updates, making them the most cost-effective option for long-term users. Both license types include full technical support."
                        index={1}
                        colors={colors}
                      />
                      <FAQItem
                        question="Do you provide technical support?"
                        answer="Yes! We provide comprehensive technical support for all licensed users. Our support team is available via email, live chat, and phone during business hours (9 AM - 6 PM EST, Monday-Friday). We also have an extensive knowledge base and video tutorials available 24/7."
                        index={2}
                        colors={colors}
                      />
                      <FAQItem
                        question="Can I use this on multiple devices?"
                        answer="Your license allows installation on up to 3 devices for personal use, as long as you're the primary user. For commercial or team use with multiple users, please contact us for multi-user licensing options. We offer volume discounts for businesses and educational institutions."
                        index={3}
                        colors={colors}
                      />
                      <FAQItem
                        question="What are the system requirements?"
                        answer="Please check the 'Requirements' tab above for detailed system specifications. Generally, you'll need a modern operating system (Windows 10/11 or macOS 10.15+), at least 8GB RAM, and a compatible graphics card. For optimal performance, we recommend 16GB RAM and a dedicated graphics card."
                        index={4}
                        colors={colors}
                      />
                      <FAQItem
                        question="Is there a money-back guarantee?"
                        answer="Yes, we offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied with your purchase, contact our support team within 30 days for a full refund. The software must be uninstalled from all devices to process the refund."
                        index={5}
                        colors={colors}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8 lg:mt-16">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2
              className="text-xl lg:text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Related Products
            </h2>
          </div>
          <RelatedProducts currentProduct={product} limit={4} />
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setShowEnquiryModal(false)}
        >
          <div
            className="max-w-lg w-full rounded-2xl p-6 shadow-2xl"
            style={{
              backgroundColor: colors.background.secondary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Send Enquiry
              </h3>
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="p-2 rounded-lg transition-colors duration-200"
                style={{
                  color: colors.text.secondary,
                  backgroundColor: colors.background.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.accent;
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.primary;
                  e.currentTarget.style.color = colors.text.secondary;
                }}
              >
                <LucideIcons.X size={24} />
              </button>
            </div>

            {/* Product Info */}
            <div
              className="mb-6 p-4 rounded-xl"
              style={{ backgroundColor: colors.background.primary }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl || product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain rounded-lg"
                />
                <div>
                  <h4
                    className="font-bold text-lg"
                    style={{ color: colors.text.primary }}
                  >
                    {product.name}
                  </h4>
                  {selectedOption && (
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {selectedOption.label} -{" "}
                      {formatPriceWithSymbol(
                        selectedOption.priceINR,
                        selectedOption.priceUSD,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Your Message
              </label>
              <textarea
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
                placeholder="Type your enquiry here..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 resize-none"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.interactive.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border.primary;
                }}
              />
              <p
                className="text-xs mt-2"
                style={{ color: colors.text.secondary }}
              >
                This message will be sent to our WhatsApp: +91 9042993986
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="flex-1 py-3 rounded-xl font-medium transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.primary;
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEnquirySubmit}
                className="flex-1 py-3 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#20BA5A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#25D366";
                }}
              >
                <LucideIcons.MessageCircle size={20} />
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
