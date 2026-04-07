import React, { useEffect, useMemo, useState } from "react";
import FormButton from "../../../components/Button/FormButton";
import type { ProductViewModalProps } from "./types/ProductViewModal";
import { getProductViewModalAllImages } from "./productViewModal/productViewModalImages";
import { ProductViewModalFaqs } from "./productViewModal/ProductViewModalFaqs";
import { ProductViewModalGallery } from "./productViewModal/ProductViewModalGallery";
import { ProductViewModalHeader } from "./productViewModal/ProductViewModalHeader";
import { ProductViewModalMetadata } from "./productViewModal/ProductViewModalMetadata";
import { ProductViewModalPricingSection } from "./productViewModal/ProductViewModalPricingSection";
import { ProductViewModalRichTextGrid } from "./productViewModal/ProductViewModalRichTextGrid";
import { ProductViewModalSummaryPanel } from "./productViewModal/ProductViewModalSummaryPanel";
import { ProductViewModalVideos } from "./productViewModal/ProductViewModalVideos";
import "./AddProductModal.css";

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  const allImages = useMemo(
    () => (product ? getProductViewModalAllImages(product) : []),
    [product],
  );

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200"
        style={{ backgroundColor: "white" }}
      >
        <ProductViewModalHeader product={product} onClose={onClose} />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProductViewModalGallery
              product={product}
              allImages={allImages}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
            />
            <ProductViewModalSummaryPanel product={product} />
          </div>

          <ProductViewModalVideos product={product} />
          <ProductViewModalRichTextGrid product={product} />
          <ProductViewModalPricingSection product={product} />
          <ProductViewModalFaqs product={product} />
          <ProductViewModalMetadata product={product} />
        </div>

        <div
          className="sticky bottom-0 border-t px-6 py-4 flex justify-end transition-colors duration-200"
          style={{
            backgroundColor: "white",
            borderColor: "gray",
          }}
        >
          <FormButton type="button" variant="primary" onClick={onClose}>
            Close
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
