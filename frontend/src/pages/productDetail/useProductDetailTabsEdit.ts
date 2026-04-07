import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useUpdateProduct } from "../../api/productApi";
import type { Product } from "../../api/types/productTypes";
import type { ProductDetailTabKey } from "./tabs/tabTypes";

export function useProductDetailTabs(product: Product | undefined) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabKey>("details");
  const [renderedTabs, setRenderedTabs] = useState<ProductDetailTabKey[]>([
    "features",
    "requirements",
    "reviews",
    "faq",
    "details",
  ]);

  useEffect(() => {
    const hasFeatures = !!(product && product.keyFeatures && product.keyFeatures.length > 0);
    const hasRequirements = !!(product && product.systemRequirements && product.systemRequirements.length > 0);
    const hasDetails = !!(product && product.detailsDescription && product.detailsDescription.trim() !== "");

    const tabs: ProductDetailTabKey[] = [];
    if (hasDetails) tabs.push("details");
    if (hasFeatures) tabs.push("features");
    if (hasRequirements) tabs.push("requirements");
    tabs.push("reviews", "faq");

    setRenderedTabs(tabs);

    if (product && !tabs.includes(activeTab)) {
      setActiveTab(tabs.includes("details") ? "details" : tabs[0]);
    }
  }, [product, activeTab]);

  return { activeTab, setActiveTab, renderedTabs };
}

export function useProductDetailEdit(product: Product | undefined) {
  const [showEditModal, setShowEditModal] = useState(false);
  const updateProductMutation = useUpdateProduct();

  const handleEditProduct = (productData: any) => {
    const pid = product?._id ?? (product as { id?: string })?.id;
    if (!pid) return;

    updateProductMutation.mutate(
      {
        id: String(pid),
        updatedProduct: productData,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
          setShowEditModal(false);
          window.location.reload();
        },
        onError: (error: any) => {
          console.error("Update product error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response?.data?.message || "Failed to update product",
          });
        },
      }
    );
  };

  return {
    showEditModal,
    setShowEditModal,
    handleEditProduct,
  };
}
