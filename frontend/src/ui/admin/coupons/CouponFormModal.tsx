import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Coupon, CouponFormPayload, ProductOption } from "./types";
import { getCouponApiBase } from "./couponApiBase";
import CouponFormBasicFields from "./CouponFormBasicFields";
import CouponFormDiscountFields from "./CouponFormDiscountFields";
import CouponFormProductsSection from "./CouponFormProductsSection";
import CouponFormStatusFooter from "./CouponFormStatusFooter";
import { validateCouponFormPayload } from "./couponFormValidation";

const emptyForm = (): CouponFormPayload => ({
  code: "",
  name: "",
  description: "",
  discountType: "Percentage",
  discountValue: 0,
  validFrom: "",
  validTo: "",
  usageLimit: 1,
  status: "Active",
  applicableProductIds: [],
});

type Props = {
  onClose: () => void;
  onSave: (coupon: CouponFormPayload) => Promise<void>;
  editingCoupon: Coupon | null;
  colors: ThemeColors;
  theme: "light" | "dark";
};

const CouponFormModal: React.FC<Props> = ({
  onClose,
  onSave,
  editingCoupon,
  colors,
  theme,
}) => {
  const [formData, setFormData] = useState<CouponFormPayload>(emptyForm);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const productsByCategory = useMemo(() => {
    const map = new Map<string, ProductOption[]>();
    for (const p of products) {
      const cat = (p.category || "").trim() || "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    const sortedCategories = Array.from(map.keys()).sort((a, b) =>
      a === "Uncategorized" ? 1 : b === "Uncategorized" ? -1 : a.localeCompare(b),
    );
    return sortedCategories.map((cat) => ({ category: cat, products: map.get(cat)! }));
  }, [products]);

  const categoryNames = useMemo(
    () => productsByCategory.map((g) => g.category),
    [productsByCategory],
  );

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${getCouponApiBase()}/api/products?limit=500`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      }
    };
    void fetchProducts();
  }, []);

  useEffect(() => {
    if (editingCoupon) {
      const ids = (editingCoupon.applicableProductIds || []).map((p) =>
        typeof p === "object" && p !== null && "_id" in p ? String(p._id) : String(p),
      );
      setFormData({
        code: editingCoupon.code,
        name: editingCoupon.name,
        description: editingCoupon.description || "",
        discountType: editingCoupon.discountType,
        discountValue: editingCoupon.discountValue,
        validFrom: editingCoupon.validFrom?.split("T")[0] || "",
        validTo: editingCoupon.validTo?.split("T")[0] || "",
        usageLimit: editingCoupon.usageLimit || 1,
        status: editingCoupon.status,
        applicableProductIds: ids,
      });
    } else {
      setFormData(emptyForm());
    }
  }, [editingCoupon]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleGenerateCode = () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData((prev) => ({ ...prev, code: `SAVE${random}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateCouponFormPayload(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch {
      // Parent handles errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl p-6 rounded-lg shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded transition hover:opacity-80"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
                  : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
              color: colors.text.inverse,
              border: "none",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CouponFormBasicFields
            colors={colors}
            theme={theme}
            formData={formData}
            onChange={handleChange}
            onGenerateCode={handleGenerateCode}
          />
          <CouponFormDiscountFields colors={colors} theme={theme} formData={formData} onChange={handleChange} />
          <CouponFormProductsSection
            colors={colors}
            formData={formData}
            setFormData={setFormData}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categoryNames={categoryNames}
            productsByCategory={productsByCategory}
            allProducts={products}
          />
          <CouponFormStatusFooter
            colors={colors}
            theme={theme}
            formData={formData}
            onChange={handleChange}
            onClose={onClose}
            isSubmitting={isSubmitting}
            isEditing={!!editingCoupon}
          />
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
