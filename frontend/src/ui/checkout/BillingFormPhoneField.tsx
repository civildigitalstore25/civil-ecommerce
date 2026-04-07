import { useState } from "react";
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
// @ts-ignore — react-phone-input-2 typings not wired in this project
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { CountryData } from "react-phone-input-2";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { CheckoutFormData } from "../../pages/checkout/checkoutTypes";
import { buildBillingPhoneInputThemeCss } from "./buildBillingPhoneInputThemeCss";

type BillingFormPhoneFieldProps = {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  colors: ThemeColors;
  setValue: UseFormSetValue<CheckoutFormData>;
};

export function BillingFormPhoneField({
  control,
  errors,
  colors,
  setValue,
}: BillingFormPhoneFieldProps) {
  const [, setCountryCode] = useState<string>("91");

  return (
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
            <style>{buildBillingPhoneInputThemeCss(colors)}</style>
            <PhoneInput
              country="in"
              value={field.value}
              onChange={(value: string, data: CountryData) => {
                field.onChange(value);
                setValue("whatsapp", value);
                if (
                  data &&
                  typeof data === "object" &&
                  "dialCode" in data &&
                  data.dialCode
                ) {
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
  );
}
