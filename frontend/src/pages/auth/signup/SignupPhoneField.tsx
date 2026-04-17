import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { CountryData } from "react-phone-input-2";
// @ts-ignore
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getPhoneInputStyles } from "./phoneInputStyles";
import type { SignupFormData } from "./signupFormValidation";
import { signupFormValidation } from "./signupFormValidation";

interface SignupPhoneFieldProps {
  control: Control<SignupFormData>;
  errors: any;
  colors: any;
  onCountryCodeChange: (dialCode: string) => void;
  setValue: any;
}

export function SignupPhoneField({
  control,
  errors,
  colors,
  onCountryCodeChange,
  setValue,
}: SignupPhoneFieldProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: colors.text.primary }}
      >
        WhatsApp Number <span className="text-red-500">*</span>
      </label>
      <Controller
        name="phoneNumber"
        control={control}
        rules={signupFormValidation.phoneNumber}
        render={({ field }) => (
          <div className="phone-input-wrapper">
            <style>{getPhoneInputStyles(colors)}</style>
            <PhoneInput
              country={"in"}
              value={field.value}
              onChange={(value: string, data: CountryData) => {
                field.onChange(value);
                setValue("phoneNumber", value);
                if (data && typeof data === "object" && "dialCode" in data && data.dialCode) {
                  onCountryCodeChange(data.dialCode);
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
      {errors.phoneNumber && (
        <p className="text-red-500 text-sm mt-1">
          {errors.phoneNumber.message}
        </p>
      )}
    </div>
  );
}
