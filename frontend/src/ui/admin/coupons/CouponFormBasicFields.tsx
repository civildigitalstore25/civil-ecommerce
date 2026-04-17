import React from "react";
import { RefreshCcw } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { CouponFormPayload } from "./types";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  formData: CouponFormPayload;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onGenerateCode: () => void;
};

const CouponFormBasicFields: React.FC<Props> = ({
  colors,
  theme,
  formData,
  onChange,
  onGenerateCode,
}) => (
  <>
    <div className="grid grid-cols-3 gap-2 items-end">
      <div className="col-span-2">
        <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
          Coupon Code <span style={{ color: colors.status.error }}>*</span>
        </label>
        <input
          name="code"
          value={formData.code}
          onChange={onChange}
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
          onClick={onGenerateCode}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded transition hover:opacity-90 h-[42px]"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
                : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
            color: colors.text.inverse,
            border: "none",
          }}
        >
          <RefreshCcw size={16} />
          Generate
        </button>
      </div>
    </div>
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
        Coupon Name <span style={{ color: colors.status.error }}>*</span>
      </label>
      <input
        name="name"
        value={formData.name}
        onChange={onChange}
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
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
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
  </>
);

export default CouponFormBasicFields;
