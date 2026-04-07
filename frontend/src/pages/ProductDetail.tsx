import React from "react";
import { useProductDetailPage } from "./productDetail/useProductDetailPage";
import { ProductDetailPageContent } from "./productDetail/ProductDetailPageContent";
import { ProductDetailModals } from "./productDetail/ProductDetailModals";

const ProductDetail: React.FC = () => {
  const page = useProductDetailPage();
  const { colors, isLoading, product } = page;

  if (isLoading) {
    return (
      <div
        className="text-center py-20 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="text-center py-20 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        Product not found.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <ProductDetailPageContent page={{ ...page, product }} />
      <ProductDetailModals page={{ ...page, product }} />
    </div>
  );
};

export default ProductDetail;
