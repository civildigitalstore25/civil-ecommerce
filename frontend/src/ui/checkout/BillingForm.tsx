import React from "react";
import FormInput from "../../components/Input/FormInput";

interface BillingFormProps {
  formData: { name: string; whatsapp: string; email: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colors: any;
}

const BillingForm: React.FC<BillingFormProps> = ({
  formData,
  handleChange,
  colors,
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

      {/* Name */}
      <FormInput
        label="Full Name"
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
      />

      {/* WhatsApp */}
      <FormInput
        label="WhatsApp Number"
        name="whatsapp"
        type="tel"
        required
        value={formData.whatsapp}
        onChange={handleChange}
        placeholder="Enter 10-digit WhatsApp number"
      />

      {/* Email */}
      <FormInput
        label="Email Address"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
      />

      {/* Info Note */}
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
