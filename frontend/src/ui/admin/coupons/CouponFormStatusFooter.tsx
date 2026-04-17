import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { CouponFormPayload } from "./types";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  formData: CouponFormPayload;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
};

const CouponFormStatusFooter: React.FC<Props> = ({
  colors,
  theme,
  formData,
  onChange,
  onClose,
  isSubmitting,
  isEditing,
}) => (
  <>
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
        Status <span style={{ color: colors.status.error }}>*</span>
      </label>
      <select
        name="status"
        value={formData.status}
        onChange={onChange}
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
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
              : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded font-medium hover:opacity-90 transition disabled:opacity-50"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
              : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        {isSubmitting ? "Saving..." : isEditing ? "Update Coupon" : "Add Coupon"}
      </button>
    </div>
  </>
);

export default CouponFormStatusFooter;
