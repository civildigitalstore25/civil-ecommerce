import type { FormEvent } from "react";
import type { Product } from "../../../../api/types/productTypes";
import type { ProductForm } from "../../../../constants/productFormConstants";
import { swalError, swalFire, swalSuccessBrief } from "../../../../utils/swal";
import { asProductForSave, buildAdminProductSavePayload } from "./buildAdminProductSavePayload";
import { getAdminProductSaveValidationError } from "./validateAdminProductSave";

type UseAddProductModalSaveArgs = {
  newProduct: ProductForm;
  product?: Product | null;
  onSave: (form: Product) => void;
  clearDraft: () => void;
};

export function useAddProductModalSave({
  newProduct,
  product,
  onSave,
  clearDraft,
}: UseAddProductModalSaveArgs) {
  const saveProductData = async (status: string) => {
    const isDraft = status === "draft";
    const {
      productData,
      brandHasCategories,
      freeStartTimeNorm,
      freeEndTimeNorm,
    } = buildAdminProductSavePayload(newProduct, status);

    const validationError = getAdminProductSaveValidationError(
      productData,
      newProduct,
      isDraft,
      brandHasCategories,
      freeStartTimeNorm,
      freeEndTimeNorm,
    );
    if (validationError) {
      await swalError(validationError, "Validation Error");
      return;
    }

    onSave(asProductForSave(productData));

    if (!product) {
      clearDraft();
    }

    if (isDraft) {
      await swalSuccessBrief(
        "Saved as Draft!",
        `"${String(productData.name ?? "Product")}" has been saved as draft.`,
      );
    }
  };

  const handleAddProduct = async (e: FormEvent, asDraft = false) => {
    e.preventDefault();

    if (asDraft) {
      await saveProductData("draft");
      return;
    }

    const isDraftBeingPublished = product?.status === "draft";

    const result = await swalFire({
      title: isDraftBeingPublished
        ? "Publish Draft Product?"
        : product
          ? "Update Product?"
          : "Create New Product?",
      text: isDraftBeingPublished
        ? `Are you sure you want to publish "${newProduct.name}" to Products?`
        : product
          ? `Are you sure you want to update "${newProduct.name}"?`
          : `Are you sure you want to create "${newProduct.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isDraftBeingPublished
        ? "Yes, publish it!"
        : product
          ? "Yes, update it!"
          : "Yes, create it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    });

    if (result.isConfirmed) {
      await saveProductData("active");
    }
  };

  return { handleAddProduct };
}
