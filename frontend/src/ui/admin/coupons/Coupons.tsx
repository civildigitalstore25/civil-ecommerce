import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCcw,
  Calendar,
  Users,
  Package,
} from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface Coupon {
  id?: string;
  code: string;
  name: string;
  description?: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Coupons: React.FC = () => {
  const { colors, theme } = useAdminTheme();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBase}/api/coupons`);
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (coupon: Coupon) => {
    try {
      const method = editingCoupon ? "PUT" : "POST";
      const url = editingCoupon
        ? `${apiBase}/api/coupons/${editingCoupon.id}`
        : `${apiBase}/api/coupons`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coupon),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();
      if (editingCoupon)
        setCoupons((prev) =>
          prev.map((c) => (c.id === editingCoupon.id ? data : c)),
        );
      else setCoupons((prev) => [data, ...prev]);
      setShowForm(false);
      setEditingCoupon(null);
      alert(
        editingCoupon
          ? "Coupon updated successfully!"
          : "Coupon created successfully!",
      );
    } catch (err: any) {
      alert("Failed to save coupon: " + err.message);
      throw err;
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = async (coupon: Coupon) => {
    if (
      !window.confirm(
        `Are you sure you want to delete coupon "${coupon.code}"?`,
      )
    )
      return;
    try {
      const res = await fetch(`${apiBase}/api/coupons/${coupon.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      alert("Coupon deleted successfully!");
    } catch (err: any) {
      alert("Failed to delete coupon: " + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (validTo: string): boolean =>
    new Date(validTo) < new Date();

  const getStatusColor = (coupon: Coupon) => {
    if (coupon.status === "Inactive")
      return { bg: colors.status.warning, text: colors.text.primary };
    if (isExpired(coupon.validTo))
      return { bg: colors.status.error, text: colors.text.inverse };
    return { bg: colors.interactive.primary, text: colors.text.primary };
  };

  const getStatusText = (coupon: Coupon) => {
    if (coupon.status === "Inactive") return "INACTIVE";
    if (isExpired(coupon.validTo)) return "EXPIRED";
    return "ACTIVE";
  };

  return (
    <div
      className="p-6 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-semibold"
            style={{ color: colors.interactive.primary }}
          >
            Coupon Management
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
            Manage discount coupons for your store
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded font-medium hover:opacity-90 transition"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse,
          }}
        >
          <Plus size={16} />
          Add Coupon
        </button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Total Coupons
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: colors.text.primary }}
          >
            {coupons.length}
          </p>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Active Coupons
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: colors.status.success }}
          >
            {
              coupons.filter(
                (c) => c.status === "Active" && !isExpired(c.validTo),
              ).length
            }
          </p>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Expired Coupons
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: colors.status.error }}
          >
            {coupons.filter((c) => isExpired(c.validTo)).length}
          </p>
        </div>
      </div>
      {/* Error */}
      {error && (
        <div
          className="mb-4 p-4 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.status.error,
          }}
        >
          <p style={{ color: colors.status.error }}>{error}</p>
          <button
            onClick={fetchCoupons}
            className="mt-2 px-4 py-2 rounded hover:opacity-90 transition"
            style={{
              backgroundColor: colors.status.error,
              color: colors.text.inverse,
            }}
          >
            Retry
          </button>
        </div>
      )}
      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.interactive.primary }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div
                className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-lg border-2 w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-28 md:min-h-32 lg:min-h-36"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.interactive.primary, // Using same border color as coupon cards
                }}
              >
                <div
                  className="mb-3 md:mb-4 p-3 md:p-4 rounded-full"
                  style={{ backgroundColor: colors.background.tertiary }}
                >
                  <Plus
                    size={24}
                    className="md:w-8 md:h-8"
                    style={{ color: colors.text.secondary }}
                  />
                </div>
                <p
                  className="text-base md:text-lg lg:text-xl font-semibold mb-2 md:mb-3 text-center"
                  style={{ color: colors.text.primary }}
                >
                  No coupons found
                </p>
                <p
                  className="text-xs md:text-sm lg:text-base mb-4 md:mb-5 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Create your first coupon to offer discounts to customers
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-md text-xs md:text-sm lg:text-base"
                  style={{
                    backgroundColor: colors.interactive.primary, // Using same color as Add Coupon button
                    color: colors.text.inverse,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.interactive.primaryHover ||
                      colors.interactive.primary;
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.interactive.primary;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Plus size={14} className="md:w-4 md:h-4" />
                  Create Coupon
                </button>
              </div>
            </div>
          ) : (
            coupons.map((coupon) => {
              const statusColor = getStatusColor(coupon);
              const statusText = getStatusText(coupon);
              const discountDisplay =
                coupon.discountType === "Percentage"
                  ? `${coupon.discountValue}% OFF`
                  : `$${coupon.discountValue} OFF`;

              return (
                <div
                  key={coupon.id}
                  className="rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.interactive.primary,
                    borderWidth: "1px",
                  }}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
                        style={{
                          backgroundColor: colors.interactive.primary + "20",
                          color: colors.interactive.primary,
                          borderColor: colors.interactive.primary + "40",
                        }}
                      >
                        {coupon.code}
                      </span>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {coupon.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#fbbf24", color: "#111827" }}
                      >
                        {discountDisplay}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {coupon.description && (
                    <p
                      className="text-sm mb-3"
                      style={{ color: colors.text.primary }}
                    >
                      {coupon.description}
                    </p>
                  )}

                  {/* Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {/* Validity */}
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        style={{ color: colors.text.secondary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Valid: {formatDate(coupon.validFrom)} -{" "}
                        {formatDate(coupon.validTo)}
                      </span>
                    </div>

                    {/* Usage Stats (mock data for now) */}
                    <div className="flex items-center gap-2">
                      <Users
                        size={16}
                        style={{ color: colors.text.secondary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        0/∞ used
                      </span>
                    </div>

                    {/* Min/Max Purchase */}
                    <div className="flex items-center gap-2">
                      <Package
                        size={16}
                        style={{ color: colors.text.secondary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Min: $10
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 rounded-full border hover:opacity-80 transition"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.interactive.primary,
                        borderColor: colors.interactive.primary,
                        borderWidth: "1px",
                      }}
                      title="Edit coupon"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="p-2 rounded-full border hover:opacity-80 transition"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.status.error,
                        borderColor: colors.status.error,
                        borderWidth: "1px",
                      }}
                      title="Delete coupon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      {/* Coupon Form Modal */}
      {showForm && (
        <CouponFormModal
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
          onSave={handleAddCoupon}
          editingCoupon={editingCoupon}
          colors={colors}
          theme={theme}
        />
      )}
    </div>
  );
};

// Coupon Form Modal Component (inline for single-file setup)
const CouponFormModal: React.FC<{
  onClose: () => void;
  onSave: (coupon: any) => Promise<void>;
  editingCoupon: Coupon | null;
  colors: any;
  theme: "light" | "dark";
}> = ({ onClose, onSave, editingCoupon, colors, theme }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "Percentage" as "Percentage" | "Fixed",
    discountValue: 0,
    validFrom: "",
    validTo: "",
    status: "Active" as "Active" | "Inactive",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Save current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Cleanup: restore original overflow when modal closes
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        code: editingCoupon.code,
        name: editingCoupon.name,
        description: editingCoupon.description || "",
        discountType: editingCoupon.discountType,
        discountValue: editingCoupon.discountValue,
        validFrom: editingCoupon.validFrom?.split("T")[0] || "",
        validTo: editingCoupon.validTo?.split("T")[0] || "",
        status: editingCoupon.status,
      });
    }
  }, [editingCoupon]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleGenerateCode = () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      code: `SAVE${random}`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.code.trim()) {
      alert("Coupon code is required");
      return;
    }
    if (!formData.name.trim()) {
      alert("Coupon name is required");
      return;
    }
    if (formData.discountValue <= 0) {
      alert("Discount value must be greater than 0");
      return;
    }
    if (
      formData.discountType === "Percentage" &&
      formData.discountValue > 100
    ) {
      alert("Percentage discount cannot exceed 100");
      return;
    }
    if (!formData.validFrom) {
      alert("Valid From date is required");
      return;
    }
    if (!formData.validTo) {
      alert("Valid To date is required");
      return;
    }
    if (new Date(formData.validFrom) > new Date(formData.validTo)) {
      alert("Valid From date must be before Valid To date");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err) {
      // Error already handled in parent
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
            onClick={onClose}
            className="p-2 rounded transition hover:opacity-80"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.background.tertiary,
            }}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Coupon Code & Generate */}
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2">
              <label
                className="block text-sm mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                Coupon Code{" "}
                <span style={{ color: colors.status.error }}>*</span>
              </label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                }}
                placeholder="e.g., SAVE2024"
                required
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleGenerateCode}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded transition hover:opacity-90 h-[42px]"
                style={{
                  backgroundColor: colors.background.tertiary,
                  color: colors.text.primary,
                }}
              >
                <RefreshCcw size={16} />
                Generate
              </button>
            </div>
          </div>
          {/* Name */}
          <div>
            <label
              className="block text-sm mb-1 font-medium"
              style={{ color: colors.text.primary }}
            >
              Coupon Name <span style={{ color: colors.status.error }}>*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
                backgroundColor: colors.background.primary,
              }}
              placeholder="e.g., Summer Sale 2025"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label
              className="block text-sm mb-1 font-medium"
              style={{ color: colors.text.primary }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
                backgroundColor: colors.background.primary,
              }}
              rows={3}
              placeholder="Enter coupon description..."
            />
          </div>
          {/* Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                Discount Type{" "}
                <span style={{ color: colors.status.error }}>*</span>
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded appearance-none bg-no-repeat bg-right bg-[length:16px] pr-8"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(colors.text.secondary)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                }}
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                Discount Value{" "}
                <span style={{ color: colors.status.error }}>*</span>
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                }}
                min={0}
                step={0.01}
                required
              />
            </div>
          </div>
          {/* Validity Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                Valid From <span style={{ color: colors.status.error }}>*</span>
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  colorScheme: theme,
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                Valid To <span style={{ color: colors.status.error }}>*</span>
              </label>
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  colorScheme: theme,
                }}
                required
              />
            </div>
          </div>
          {/* Status */}
          <div>
            <label
              className="block text-sm mb-1 font-medium"
              style={{ color: colors.text.primary }}
            >
              Status <span style={{ color: colors.status.error }}>*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded appearance-none bg-no-repeat bg-right bg-[length:16px] pr-8"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
                backgroundColor: colors.background.primary,
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(colors.text.secondary)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {/* Buttons */}
          <div
            className="flex justify-end gap-3 pt-4 border-t mt-4"
            style={{ borderColor: colors.border.secondary }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded transition hover:opacity-90"
              style={{
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded font-medium hover:opacity-90 transition disabled:opacity-50"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : editingCoupon
                  ? "Update Coupon"
                  : "Add Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Coupons;
