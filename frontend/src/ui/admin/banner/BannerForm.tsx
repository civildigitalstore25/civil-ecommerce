import React, { useState, useEffect, type ChangeEvent } from "react";
import { X } from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import type { Banner } from "../../../types/Banner";
import { createEmptyBannerForm, bannerToFormState } from "./bannerForm/initialBannerFormState";
import { BannerFormFields } from "./bannerForm/BannerFormFields";

interface BannerFormProps {
  banner?: Banner | null;
  onClose: () => void;
  onSubmit: (data: Banner) => void | Promise<void>;
}

const BannerForm: React.FC<BannerFormProps> = ({ banner, onClose, onSubmit }) => {
  const { colors, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState<Banner>(createEmptyBannerForm);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (banner) {
      setFormData(bannerToFormState(banner));
    } else {
      setFormData(createEmptyBannerForm());
    }
  }, [banner]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

  const gradient =
    theme === "dark"
      ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
      : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)";

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
          border: `2px solid ${isDark ? "#555" : "#49D6FE"}`,
          padding: "2rem",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold relative pb-2">
            {banner ? "Edit Banner" : "Create Banner"}
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
          <BannerFormFields
            formData={formData}
            colors={colors}
            onChange={handleChange}
          />

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
              style={{
                background: gradient,
                color: colors.text.inverse,
                border: "none",
              }}
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
