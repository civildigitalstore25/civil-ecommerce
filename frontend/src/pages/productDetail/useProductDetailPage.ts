import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetail } from "../../api/productApi";
import { useCartContext } from "../../contexts/CartContext";
import { useUser } from "../../api/userQueries";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { getProductSEO } from "../../utils/seo";
import { findProductDetailBySlug } from "./resolveProductFromSlug";
import {
  getProductDetailAdminSubscriptionPlans,
  getProductDetailPricingOptions,
} from "./productDetailPricingOptions";
import { getProductDetailCartLicenseType } from "./productDetailCartLicense";
import { useProductDetailReviews } from "./useProductDetailReviews";
import { useProductDetailEnquiry } from "./useProductDetailEnquiry";
import { useProductDetailTracking } from "./useProductDetailTracking";
import { useProductDetailDealFree } from "./useProductDetailDealFree";
import { useProductDetailCart } from "./useProductDetailCart";
import { useProductDetailTabs, useProductDetailEdit } from "./useProductDetailTabsEdit";
import { normalizeProductDetailBreadcrumbName } from "./normalizeProductDetailBreadcrumbName";

export function useProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: productList, isLoading } = useProductDetail();
  const product = findProductDetailBySlug(slug, productList);

  const [selectedLicense, setSelectedLicense] = useState<string>("yearly");
  const [userHasSelectedPlan, setUserHasSelectedPlan] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { addItem, isItemInCart, getItemQuantity } = useCartContext();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const actionRef = useRef<HTMLDivElement | null>(null);

  const breadcrumbProductName = normalizeProductDetailBreadcrumbName(
    product?.name || "",
  );

  const selectedBg =
    (colors && colors.interactive && colors.interactive.primary) ||
    colors?.interactive?.secondary ||
    colors?.background?.accent ||
    "#10b981";

  const reviewsUI = useProductDetailReviews(product?._id, user, navigate);
  const {
    showReviewTypeModal,
    setShowReviewTypeModal,
    showReplyTypeModal,
    setShowReplyTypeModal,
    handleReviewTypeSelect,
    handleReplyTypeSelect,
    ...reviewsTabProps
  } = reviewsUI;

  const { totalViews, soldQuantity } = useProductDetailTracking(product?._id);
  const { isActiveDeal, freeOfferSchedule, isActiveFreeProduct } =
    useProductDetailDealFree(product);
  const { activeTab, setActiveTab, renderedTabs } = useProductDetailTabs(product);
  const { showEditModal, setShowEditModal, handleEditProduct } =
    useProductDetailEdit(product);

  const pricingOptions = getProductDetailPricingOptions(product, {
    isActiveDeal,
    isActiveFreeProduct,
    freeOfferSchedule,
  });
  const adminSubscriptionPlans = getProductDetailAdminSubscriptionPlans(product);
  const allPricingOptions = [...pricingOptions, ...adminSubscriptionPlans];
  const selectedOption =
    allPricingOptions.find((opt) => opt.id === selectedLicense) ||
    allPricingOptions[0];

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

  const enquiryHook = useProductDetailEnquiry({
    product,
    selectedOption,
    formatPriceWithSymbol,
    colors,
  });

  const cartHook = useProductDetailCart({
    product,
    slug,
    selectedOption,
    selectedLicense,
    userHasSelectedPlan,
    user,
    colors,
    addItem,
    isItemInCart,
  });

  useEffect(() => {
    if (allPricingOptions.length > 0 && !selectedOption) {
      setSelectedLicense(allPricingOptions[0].id);
      if (allPricingOptions.length === 1) {
        setUserHasSelectedPlan(true);
      }
    } else if (allPricingOptions.length === 1) {
      setUserHasSelectedPlan(true);
    }
  }, [allPricingOptions, selectedOption]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // ignore
    }
  }, [slug]);

  const mainImageUrl = product?.imageUrl || product?.image;
  const additionalImages =
    product?.additionalImages?.filter((img: string) => img && img.trim() !== "") ||
    [];
  const images = mainImageUrl
    ? [mainImageUrl, ...additionalImages].filter((img) => img)
    : additionalImages.filter((img) => img);

  const mediaItems = [...images];
  if (product?.videoUrl) {
    mediaItems.push(`video:${product.videoUrl}`);
  }

  const currentMainImage = mainImage || mainImageUrl || "";

  const cartLicenseType = getProductDetailCartLicenseType(
    selectedLicense,
    selectedOption,
  );

  const isInCart = product
    ? isItemInCart(product._id!, cartLicenseType)
    : false;
  const cartQuantity = product
    ? getItemQuantity(product._id!, cartLicenseType)
    : 0;

  const seoData = product
    ? getProductSEO({
        name: product.name,
        category: product.category,
        company: product.company,
        shortDescription:
          product.shortDescription || product.description?.substring(0, 155),
        price: selectedOption?.priceINR || product.price1INR || product.price1 || 0,
      })
    : null;

  const seoHelmetPriceInr =
    (selectedOption?.priceINR || product?.price1INR || product?.price1) ||
    undefined;

  return {
    isLoading,
    product,
    colors,
    user,
    navigate,
    formatPriceWithSymbol,
    selectedLicense,
    setSelectedLicense,
    userHasSelectedPlan,
    setUserHasSelectedPlan,
    mainImage,
    setMainImage,
    isZooming,
    setIsZooming,
    zoomPosition,
    setZoomPosition,
    actionRef,
    breadcrumbProductName,
    selectedBg,
    reviewsUI,
    showReviewTypeModal,
    setShowReviewTypeModal,
    showReplyTypeModal,
    setShowReplyTypeModal,
    handleReviewTypeSelect,
    handleReplyTypeSelect,
    reviewsTabProps,
    totalViews,
    soldQuantity,
    isActiveDeal,
    freeOfferSchedule,
    isActiveFreeProduct,
    activeTab,
    setActiveTab,
    renderedTabs,
    showEditModal,
    setShowEditModal,
    handleEditProduct,
    selectedOption,
    licenseOptions,
    subscriptionOptions,
    lifetimeOptions,
    membershipOptions,
    adminSubscriptionPlans,
    enquiryHook,
    cartHook,
    mediaItems,
    currentMainImage,
    isInCart,
    cartQuantity,
    seoData,
    seoHelmetPriceInr,
  };
}

export type ProductDetailPageModel = ReturnType<typeof useProductDetailPage>;
