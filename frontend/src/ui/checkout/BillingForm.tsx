import React from "react";
import type { UseFormRegister, FieldErrors, Control, UseFormSetValue } from "react-hook-form";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { CheckoutFormData } from "../../pages/checkout/checkoutTypes";
import { BillingFormPhoneField } from "./BillingFormPhoneField";

interface BillingFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
  colors: ThemeColors;
  setValue: UseFormSetValue<CheckoutFormData>;
}

const BillingForm: React.FC<BillingFormProps> = ({
  register,
  errors,
  control,
  colors,
  setValue,
}) => {
  return (
    <div
      className="space-y-6 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
      }}
    >
      <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: colors.text.primary }}
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full px-4 py-3 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: errors.name ? "#ef4444" : colors.border.primary,
            color: colors.text.primary,
          }}
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <BillingFormPhoneField
        control={control}
        errors={errors}
        colors={colors}
        setValue={setValue}
      />

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: colors.text.primary }}
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: errors.email ? "#ef4444" : colors.border.primary,
            color: colors.text.primary,
          }}
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div
        className="mt-4 p-3 rounded-lg text-sm"
        style={{
          backgroundColor: colors.background.primary,
          color: colors.text.secondary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <p className="leading-relaxed">
          Order confirmation will be sent to your WhatsApp and Email.
        </p>
      </div>
    </div>
  );
};

export default BillingForm;
