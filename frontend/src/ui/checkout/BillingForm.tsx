import React, { useState } from "react";
import type { UseFormRegister, FieldErrors, Control, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
// @ts-ignore
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { CountryData } from "react-phone-input-2";

interface CheckoutFormData {
  name: string;
  whatsapp: string;
  email: string;
  countryCode: string;
}

interface BillingFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  control: Control<CheckoutFormData>;
  colors: any;
  setValue: UseFormSetValue<CheckoutFormData>;
}

const BillingForm: React.FC<BillingFormProps> = ({
  register,
  errors,
  control,
  colors,
  setValue,
}) => {
  const [, setCountryCode] = useState<string>("91");
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
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: colors.text.primary }}
        >
          WhatsApp Number <span className="text-red-500">*</span>
        </label>
        <Controller
          name="whatsapp"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value) => {
              if (!value) return "Phone number is required";
              const digits = value.replace(/\D/g, "");
              if (digits.length < 8 || digits.length > 15) {
                return "Phone number must be 8-15 digits";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <div className="phone-input-wrapper">
              <style>{`
                .phone-input-wrapper .react-tel-input .form-control {
                  width: 100% !important;
                  padding-left: 60px !important;
                  padding-right: 16px !important;
                  padding-top: 10px !important;
                  padding-bottom: 10px !important;
                  border-radius: 0.5rem !important;
                  background-color: ${colors.background.primary} !important;
                  border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                  color: ${colors.text.primary} !important;
                  font-size: 0.875rem !important;
                  outline: none !important;
                  transition: all 0.2s !important;
                }
                .phone-input-wrapper .react-tel-input .form-control:focus {
                  border-color: ${colors.interactive.primary} !important;
                  box-shadow: 0 0 0 2px ${colors.interactive.primary}33 !important;
                }
                .phone-input-wrapper .react-tel-input .flag-dropdown {
                  background-color: ${colors.background.primary} !important;
                  border: none !important;
                  border-radius: 0.5rem !important;
                  padding-left: 8px !important;
                  padding-right: 8px !important;
                }
                .phone-input-wrapper .react-tel-input .flag-dropdown:hover,
                .phone-input-wrapper .react-tel-input .flag-dropdown.open {
                  background-color: ${colors.background.primary} !important;
                }
                .phone-input-wrapper .react-tel-input .selected-flag {
                  background-color: transparent !important;
                  padding: 0 8px !important;
                }
                .phone-input-wrapper .react-tel-input .selected-flag:hover,
                .phone-input-wrapper .react-tel-input .selected-flag.open {
                  background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                }
                .phone-input-wrapper .react-tel-input .country-list {
                  background-color: ${colors.background.primary} !important;
                  border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                  border-radius: 0.5rem !important;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
                  margin-top: 4px !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .country {
                  background-color: ${colors.background.primary} !important;
                  color: ${colors.text.primary} !important;
                  padding: 8px 12px !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .country:hover,
                .phone-input-wrapper .react-tel-input .country-list .country.highlight {
                  background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .country.preferred {
                  background-color: ${colors.background.secondary || 'rgba(0,0,0,0.05)'} !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .search {
                  background-color: ${colors.background.primary} !important;
                  padding: 8px !important;
                  position: sticky !important;
                  top: 0 !important;
                  z-index: 1 !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .search-box {
                  width: 100% !important;
                  padding: 8px 12px !important;
                  border-radius: 0.375rem !important;
                  background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                  border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                  color: ${colors.text.primary} !important;
                  font-size: 0.875rem !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .search-box::placeholder {
                  color: ${colors.text.secondary || '#9ca3af'} !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .search-box:focus {
                  outline: none !important;
                  border-color: ${colors.interactive.primary} !important;
                  box-shadow: 0 0 0 2px ${colors.interactive.primary}33 !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .divider {
                  border-bottom: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                }
                .phone-input-wrapper .react-tel-input .country-list .country-name,
                .phone-input-wrapper .react-tel-input .country-list .dial-code {
                  color: ${colors.text.primary} !important;
                }
              `}</style>
              <PhoneInput
                country={"in"}
                value={field.value}
                onChange={(value: string, data: CountryData) => {
                  field.onChange(value);
                  setValue("whatsapp", value);
                  if (data && typeof data === "object" && "dialCode" in data && data.dialCode) {
                    setCountryCode(data.dialCode);
                    setValue("countryCode", `+${data.dialCode}`);
                  }
                }}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                }}
                containerClass="w-full"
                enableSearch
                disableSearchIcon={false}
                searchPlaceholder="Search country"
                specialLabel=""
                countryCodeEditable={false}
                enableAreaCodes={false}
              />
            </div>
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
