import React, { useEffect, useState } from "react";
import "./AddProductModal.css";
import type { Product } from "../../../api/types/productTypes";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import { AddProductModalStickyFooter } from "./addProductModal/AddProductModalStickyFooter";
import { AddProductModalHeader } from "./addProductModal/AddProductModalHeader";
import { AddProductModalFormSections } from "./addProductModal/AddProductModalFormSections";
import type { ProductForm } from "../../../constants/productFormConstants";
import { useProductFormDraft } from "../../../hooks/useProductFormDraft";
import {
  createEmptyProductFormForNew,
  mapProductToProductForm,
} from "./addProductModal/mapProductToProductForm";
import { useAddProductFormHandlers } from "./addProductModal/useAddProductFormHandlers";
import { useAddProductModalSave } from "./addProductModal/useAddProductModalSave";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: Product) => void;
  product?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSave,
  product,
}) => {
  const { colors, theme } = useAdminTheme();
  const [newProduct, setNewProduct] = useState<ProductForm>(() =>
    createEmptyProductFormForNew(),
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { clearDraft } = useProductFormDraft(newProduct, !!product);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 3100);

      return () => clearTimeout(timer);
    }
  }, [newProduct, open]);

  useEffect(() => {
    if (open) {
      if (product) {
        setNewProduct(mapProductToProductForm(product));
      } else {
        setNewProduct(createEmptyProductFormForNew());
      }
    }
  }, [open, product]);

  const formHandlers = useAddProductFormHandlers(setNewProduct);

  const { handleAddProduct } = useAddProductModalSave({
    newProduct,
    product,
    onSave,
    clearDraft,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-75">
      <div
        className="relative flex flex-col rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <AddProductModalHeader
          colors={colors}
          isEditMode={!!product}
          onClose={onClose}
        />

        <form onSubmit={handleAddProduct} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 modal-scroll-container">
            <AddProductModalFormSections
              colors={colors}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              lastSaved={lastSaved}
              {...formHandlers}
            />
          </div>

          <AddProductModalStickyFooter
            colors={colors}
            theme={theme}
            isUpdateMode={!!product}
            onSaveDraft={(e) => handleAddProduct(e, true)}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
