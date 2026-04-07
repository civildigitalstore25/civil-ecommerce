import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { CouponFormPayload } from "./types";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  formData: CouponFormPayload;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
};

const CouponFormDiscountFields: React.FC<Props> = ({
  colors,
  theme,
  formData,
  onChange,
}) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
          Discount Type <span style={{ color: colors.status.error }}>*</span>
        </label>
        <select
          name="discountType"
          value={formData.discountType}
          onChange={onChange}
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
        <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
          Discount Value <span style={{ color: colors.status.error }}>*</span>
        </label>
        <input
          type="number"
          name="discountValue"
          value={formData.discountValue}
          onChange={onChange}
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
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
          Valid From <span style={{ color: colors.status.error }}>*</span>
        </label>
        <input
          type="date"
          name="validFrom"
          value={formData.validFrom}
          onChange={onChange}
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
        <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
          Valid To <span style={{ color: colors.status.error }}>*</span>
        </label>
        <input
          type="date"
          name="validTo"
          value={formData.validTo}
          onChange={onChange}
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
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
        Usage Limit <span style={{ color: colors.status.error }}>*</span>
      </label>
      <input
        type="number"
        name="usageLimit"
        value={formData.usageLimit}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
        style={{
          borderColor: colors.border.primary,
          color: colors.text.primary,
          backgroundColor: colors.background.primary,
        }}
        min={1}
        required
        placeholder="How many times can this coupon be used?"
      />
      <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
        Maximum number of times this coupon can be used. Coupon will automatically deactivate when
        limit is reached.
      </p>
    </div>
  </>
);

export default CouponFormDiscountFields;
