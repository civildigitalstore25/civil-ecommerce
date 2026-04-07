import RelatedProducts from "../../components/RelatedProducts";
import BannerCarousel from "../../ui/admin/banner/BannerCarousel";
import { shareProductDetail } from "./shareProductDetail";
import { ProductDetailActivationVideoSection } from "./ProductDetailActivationVideoSection";
import { ProductDetailMediaGallery } from "./ProductDetailMediaGallery";
import { ProductDetailSeoHelmet } from "./ProductDetailSeoHelmet";
import { ProductDetailTopBar } from "./ProductDetailTopBar";
import { ProductDetailFloatingActions } from "./ProductDetailFloatingActions";
import { ProductDetailPurchasePanel } from "./purchase/ProductDetailPurchasePanel";
import { ProductDetailTabDetails } from "./tabs/ProductDetailTabDetails";
import { ProductDetailTabFaq } from "./tabs/ProductDetailTabFaq";
import { ProductDetailTabFeatures } from "./tabs/ProductDetailTabFeatures";
import { ProductDetailTabRequirements } from "./tabs/ProductDetailTabRequirements";
import { ProductDetailTabs } from "./tabs/ProductDetailTabs";
import { ProductDetailReviewsTab } from "./tabs/ProductDetailReviewsTab";
import type { ProductDetailPageModel } from "./useProductDetailPage";
import type { Product } from "../../api/types/productTypes";

type LoadedModel = ProductDetailPageModel & { product: Product };

interface ProductDetailPageContentProps {
  page: LoadedModel;
}

export function ProductDetailPageContent({ page }: ProductDetailPageContentProps) {
  const {
    product,
    colors,
    user,
    navigate,
    breadcrumbProductName,
    setShowEditModal,
    reviewsUI,
    totalViews,
    soldQuantity,
    isActiveDeal,
    freeOfferSchedule,
    isActiveFreeProduct,
    activeTab,
    setActiveTab,
    renderedTabs,
    setMainImage,
    isZooming,
    setIsZooming,
    zoomPosition,
    setZoomPosition,
    mediaItems,
    currentMainImage,
    cartHook,
    selectedBg,
    selectedOption,
    selectedLicense,
    setSelectedLicense,
    setUserHasSelectedPlan,
    licenseOptions,
    subscriptionOptions,
    lifetimeOptions,
    membershipOptions,
    adminSubscriptionPlans,
    formatPriceWithSymbol,
    enquiryHook,
    actionRef,
    isInCart,
    cartQuantity,
    seoData,
    seoHelmetPriceInr,
    reviewsTabProps,
  } = page;

  return (
    <>
      <ProductDetailSeoHelmet
        seoData={seoData}
        ogImage={product.imageUrl || product.image}
        priceInr={seoHelmetPriceInr}
      />
      <ProductDetailTopBar
        colors={colors}
        categoryTitle={
          product.category.charAt(0).toUpperCase() + product.category.slice(1)
        }
        breadcrumbProductName={breadcrumbProductName}
        showEditButton={user?.role === "admin" || user?.role === "superadmin"}
        onEditClick={() => setShowEditModal(true)}
        onBack={() => navigate(-1)}
      />
      <BannerCarousel page="product" />

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <ProductDetailMediaGallery
            product={product}
            colors={colors}
            mediaItems={mediaItems}
            currentMainImage={currentMainImage}
            onSelectMedia={setMainImage}
            isZooming={isZooming}
            onZoomEnter={() => setIsZooming(true)}
            onZoomLeave={() => setIsZooming(false)}
            onZoomMove={(x, y) => setZoomPosition({ x, y })}
            zoomOriginX={zoomPosition.x}
            zoomOriginY={zoomPosition.y}
          />

          <ProductDetailPurchasePanel
            overview={{
              product,
              colors,
              reviewStats: reviewsUI.reviewStats,
              onShare: (platform: string) =>
                shareProductDetail(platform, product.name),
              totalViews,
              soldQuantity,
            }}
            pricing={{
              pricingRef: cartHook.pricingRef,
              colors,
              selectedBg,
              selectedOption,
              selectedLicense,
              onSelectLicense: (id: string) => {
                setSelectedLicense(id);
                setUserHasSelectedPlan(true);
              },
              licenseOptions,
              subscriptionOptions,
              lifetimeOptions,
              membershipOptions,
              adminSubscriptionPlans,
              formatPriceWithSymbol,
            }}
            dealTimers={{
              isActiveDeal,
              product,
              freeOfferSchedule,
              colors,
            }}
            actions={{
              actionRef,
              colors,
              user,
              onEditClick: () => setShowEditModal(true),
              isOutOfStock: !!product.isOutOfStock,
              isActiveFreeProduct,
              onAddToCart: cartHook.handleAddToCart,
              onBuyNow: cartHook.handleBuyNow,
              isInCart,
              cartQuantity,
              onSiteEnquiry: () => enquiryHook.setShowSiteEnquiryModal(true),
            }}
          />
          <ProductDetailFloatingActions
            colors={colors}
            onShare={(platform: string) =>
              shareProductDetail(platform, product.name)
            }
            onBuyNow={cartHook.handleBuyNow}
            onWhatsAppEnquiry={enquiryHook.openEnquiryModal}
            showStickyCheckout={!product.isOutOfStock}
          />
        </div>

        <ProductDetailActivationVideoSection product={product} colors={colors} />

        <ProductDetailTabs
          colors={colors}
          renderedTabs={renderedTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviewTotalCount={reviewsUI.reviewStats?.totalReviews ?? 0}
        >
          {activeTab === "details" && (
            <ProductDetailTabDetails colors={colors} product={product} />
          )}
          {activeTab === "features" && (
            <ProductDetailTabFeatures colors={colors} product={product} />
          )}
          {activeTab === "requirements" && (
            <ProductDetailTabRequirements colors={colors} product={product} />
          )}
          {activeTab === "reviews" && (
            <ProductDetailReviewsTab
              colors={colors}
              product={product}
              user={user}
              navigate={navigate}
              {...reviewsTabProps}
            />
          )}
          {activeTab === "faq" && (
            <ProductDetailTabFaq colors={colors} product={product} />
          )}
        </ProductDetailTabs>

        <div className="mt-8 lg:mt-16">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2
              className="text-xl lg:text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Related Products
            </h2>
          </div>
          <RelatedProducts currentProduct={product} />
        </div>
      </div>
    </>
  );
}
