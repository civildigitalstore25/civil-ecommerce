import EnquiryModal from "../../components/EnquiryModal";
import AddProductModal from "../../ui/admin/products/AddProductModal";
import { ProductDetailWhatsAppEnquiryModal } from "./ProductDetailWhatsAppEnquiryModal";
import {
  ProductDetailReplyTypeModal,
  ProductDetailReviewTypeModal,
} from "./ProductDetailReviewReplyTypeModals";
import type { ProductDetailPageModel } from "./useProductDetailPage";
import type { Product } from "../../api/types/productTypes";

type LoadedModel = ProductDetailPageModel & { product: Product };

interface ProductDetailModalsProps {
  page: LoadedModel;
}

export function ProductDetailModals({ page }: ProductDetailModalsProps) {
  const {
    product,
    colors,
    user,
    formatPriceWithSymbol,
    selectedOption,
    enquiryHook,
    showEditModal,
    setShowEditModal,
    handleEditProduct,
    showReviewTypeModal,
    setShowReviewTypeModal,
    showReplyTypeModal,
    setShowReplyTypeModal,
    handleReviewTypeSelect,
    handleReplyTypeSelect,
  } = page;

  return (
    <>
      <ProductDetailWhatsAppEnquiryModal
        open={enquiryHook.showEnquiryModal}
        onClose={enquiryHook.closeEnquiryModal}
        colors={colors}
        product={product}
        selectedOption={selectedOption}
        formatPriceWithSymbol={formatPriceWithSymbol}
        enquiryMessage={enquiryHook.enquiryMessage}
        onEnquiryMessageChange={enquiryHook.setEnquiryMessage}
        isCustomMessage={enquiryHook.isCustomMessage}
        onSetCustomMessage={enquiryHook.setIsCustomMessage}
        onRevertToDefaultMessage={enquiryHook.revertEnquiryToDefaultMessage}
        textareaRef={enquiryHook.enquiryTextareaRef}
        onSubmit={enquiryHook.handleEnquirySubmit}
      />

      <EnquiryModal
        isOpen={enquiryHook.showSiteEnquiryModal}
        onClose={() => enquiryHook.setShowSiteEnquiryModal(false)}
        product={{
          _id: product._id!,
          name: product.name,
          image: product.image,
          version: product.version,
        }}
      />

      {(user?.role === "admin" || user?.role === "superadmin") && (
        <AddProductModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProduct}
          product={product}
        />
      )}

      <ProductDetailReviewTypeModal
        open={showReviewTypeModal}
        onClose={() => setShowReviewTypeModal(false)}
        colors={colors}
        onSelectAsAdmin={() => handleReviewTypeSelect(false)}
        onSelectAsAnonymousUser={() => handleReviewTypeSelect(true)}
      />
      <ProductDetailReplyTypeModal
        reviewId={showReplyTypeModal}
        onClose={() => setShowReplyTypeModal(null)}
        colors={colors}
        onSelectAsAdmin={() => {
          const rid = showReplyTypeModal;
          if (rid) handleReplyTypeSelect(rid, false);
        }}
        onSelectAsAnonymousUser={() => {
          const rid = showReplyTypeModal;
          if (rid) handleReplyTypeSelect(rid, true);
        }}
      />
    </>
  );
}
