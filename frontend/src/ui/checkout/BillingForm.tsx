import React from "react";
import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import PhoneInput from "../../components/Input/PhoneInput";

interface CheckoutFormData {
  name: string;
  whatsapp: string;
  email: string;
}

interface BillingFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
  colors: any;
}

const BillingForm: React.FC<BillingFormProps> = ({
  register,
  errors,
  control,
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

      {/* WhatsApp */}
      <div>
        <Controller
          name="whatsapp"
          control={control}
          rules={{
            required: "WhatsApp number is required",
            validate: (value) => {
              if (!value || !value.trim()) {
                return "WhatsApp number is required";
              }

              // Remove all spaces from the value
              const cleaned = value.replace(/\s/g, "");

              // Country code validation rules: [code, min digits, max digits, country name]
              const countryRules: { [key: string]: [number, number, string] } = {
                "+91": [10, 10, "India"], // India: exactly 10 digits
                "+1": [10, 10, "USA/Canada"], // USA/Canada: exactly 10 digits
                "+44": [10, 10, "UK"], // UK: 10 digits
                "+86": [11, 11, "China"], // China: 11 digits
                "+81": [10, 10, "Japan"], // Japan: 10 digits
                "+49": [10, 11, "Germany"], // Germany: 10-11 digits
                "+33": [9, 9, "France"], // France: 9 digits
                "+61": [9, 9, "Australia"], // Australia: 9 digits
                "+971": [9, 9, "UAE"], // UAE: 9 digits
                "+65": [8, 8, "Singapore"], // Singapore: 8 digits
                "+60": [9, 10, "Malaysia"], // Malaysia: 9-10 digits
                "+92": [10, 10, "Pakistan"], // Pakistan: 10 digits
                "+880": [10, 10, "Bangladesh"], // Bangladesh: 10 digits
                "+94": [9, 9, "Sri Lanka"], // Sri Lanka: 9 digits
                "+977": [10, 10, "Nepal"], // Nepal: 10 digits
                "+93": [9, 9, "Afghanistan"], // Afghanistan: 9 digits
              };

              // Find which country code the number starts with
              let matchedCode = null;
              let phoneDigits = "";

              for (const [code, [minDigits, maxDigits, countryName]] of Object.entries(countryRules)) {
                if (cleaned.startsWith(code)) {
                  matchedCode = code;
                  phoneDigits = cleaned.substring(code.length);

                  // Check if phone number contains only digits
                  if (!/^\d+$/.test(phoneDigits)) {
                    return `Phone number must contain only digits`;
                  }

                  // Check exact length requirement
                  if (phoneDigits.length < minDigits) {
                    return `${countryName} phone number must be ${minDigits === maxDigits ? `exactly ${minDigits}` : `at least ${minDigits}`} digits`;
                  }

                  if (phoneDigits.length > maxDigits) {
                    return `${countryName} phone number must be ${minDigits === maxDigits ? `exactly ${maxDigits}` : `at most ${maxDigits}`} digits`;
                  }

                  return true;
                }
              }

              // If no country code matched, return error
              if (!matchedCode) {
                return "Please select a country code from the dropdown";
              }

              return true;
            },
          }}
          render={({ field }) => (
            <PhoneInput
              label="WhatsApp Number"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={true}
              placeholder="Enter WhatsApp number"
              className={`${errors.whatsapp ? "border-red-500" : ""}`}
            />
          )}
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Email */}
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
