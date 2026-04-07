import type { ChangeEvent } from "react";
import type { Banner } from "../../../../types/Banner";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import FormInput from "../../../../components/Input/FormInput";
import FormDateInput from "../../../../components/Input/FormDateInput";

interface BannerFormFieldsProps {
  formData: Banner;
  colors: ThemeColors;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

export function BannerFormFields({
  formData,
  colors,
  onChange,
}: BannerFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          label="Title"
          required
          name="title"
          value={formData.title}
          onChange={onChange}
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
          onChange={onChange}
          placeholder="Shop Now"
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 transition"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>

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
          onChange={onChange}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormDateInput
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={onChange}
          required
        />
        <FormDateInput
          label="End Date"
          name="endDate"
          value={formData.endDate}
          onChange={onChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Position</label>
          <select
            name="position"
            value={formData.position}
            onChange={onChange}
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
            onChange={onChange}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          label="Priority"
          type="number"
          name="priority"
          value={formData.priority}
          onChange={onChange}
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
            onChange={onChange}
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
    </div>
  );
}
