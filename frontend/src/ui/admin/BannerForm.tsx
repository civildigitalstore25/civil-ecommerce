import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormInput from "../../components/Input/FormInput";
import FormDateInput from "../../components/Input/FormDateInput";
import type { Banner } from "../../types/Banner";

interface BannerFormProps {
  banner?: Banner | null;
  onClose: () => void;
  onSubmit: (data: Banner) => void | Promise<void>;
}

const BannerForm: React.FC<BannerFormProps> = ({
  banner,
  onClose,
  onSubmit,
}) => {
  const { colors, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState<Banner>({
    title: "",
    description: "",
    ctaButtonText: "Shop Now",
    ctaButtonLink: "",
    startDate: "",
    endDate: "",
    position: "Home Page Only",
    bannerType: "Normal",
    priority: 1,
    status: "Active",
    backgroundColor: "",
    textColor: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (banner) {
      setFormData({
        ...banner,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().split("T")[0]
          : "",
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [banner]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill required fields!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
      style={{ color: colors.text.primary }}
    >
      <div
        className="w-full md:w-11/12 lg:w-5/6 max-h-[90vh] rounded-xl shadow-2xl overflow-auto my-auto"
        style={{
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          border: `2px solid ${isDark ? "#555" : "#FFD700"}`,
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold relative pb-2">
            {banner ? "Edit Banner" : "Create Banner"}
            <span
              className="absolute left-0 bottom-0 w-12 h-1 rounded"
              style={{ backgroundColor: "#FACC15" }}
            ></span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X size={26} style={{ color: colors.text.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter banner title"
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition"
              style={{
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            />
            <FormInput
              label="CTA Button Text"
              name="ctaButtonText"
              value={formData.ctaButtonText}
              onChange={handleChange}
              placeholder="Shop Now"
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition"
              style={{
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block font-medium mb-1"
              style={{ color: colors.text.primary }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full p-2 rounded transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.interactive.primary;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border.primary;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormDateInput
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <FormDateInput
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Position & Banner Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-yellow-400 transition"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                <option>Home Page Only</option>
                <option>Product Page</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Banner Type</label>
              <select
                name="bannerType"
                value={formData.bannerType}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-yellow-400 transition"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                <option>Normal</option>
                <option>Festival</option>
                <option>Flash Sale</option>
                <option>Seasonal</option>
              </select>
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Priority"
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min={1}
              max={10}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition"
              style={{
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            />
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-yellow-400 transition"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              style={{
                backgroundColor: isDark ? "#374151" : "#E5E7EB",
                color: isDark ? "#F9FAFB" : "#111827",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold transition"
              style={{ backgroundColor: "#FACC15", color: "#111827" }}
            >
              {banner ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;
