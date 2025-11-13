import React, { useState } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface PhoneInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
}

// List of common country codes
const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
    label,
    name,
    value,
    onChange,
    required = false,
    placeholder = "Enter phone number",
    className = "",
}) => {
    const { colors } = useAdminTheme();

    // Extract country code and phone number from the value
    const getInitialValues = () => {
        if (!value) return { countryCode: "+91", phoneNumber: "" };

        // Find matching country code from the start of the value
        const matchedCode = countryCodes.find(cc => value.startsWith(cc.code));

        if (matchedCode) {
            return {
                countryCode: matchedCode.code,
                phoneNumber: value.substring(matchedCode.code.length).trim(),
            };
        }

        // Default to +91 if no match found but there's a value
        return { countryCode: "+91", phoneNumber: value };
    };

    const [countryCode, setCountryCode] = useState(getInitialValues().countryCode);
    const [phoneNumber, setPhoneNumber] = useState(getInitialValues().phoneNumber);

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountryCode = e.target.value;
        setCountryCode(newCountryCode);

        // Create a synthetic event with the combined value
        const syntheticEvent = {
            target: {
                name: name,
                value: phoneNumber ? `${newCountryCode}${phoneNumber}` : "",
            },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
        setPhoneNumber(newPhoneNumber);

        // Create a synthetic event with the combined value
        const syntheticEvent = {
            target: {
                name: name,
                value: newPhoneNumber ? `${countryCode}${newPhoneNumber}` : "",
            },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
    };

    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={className}>
            {label && (
                <label
                    className="block font-medium mb-1 transition-colors duration-200"
                    style={{ color: colors.text.primary }}
                >
                    {label}
                    {required && (
                        <span style={{ color: colors.status.error }}>*</span>
                    )}
                </label>
            )}
            <div
                className="w-full border rounded transition-all duration-200 flex items-stretch overflow-hidden"
                style={{
                    backgroundColor: colors.background.primary,
                    borderColor: isFocused ? colors.interactive.primary : colors.border.primary,
                    boxShadow: isFocused ? `0 0 0 2px ${colors.interactive.primary}40` : "none",
                }}
            >
                {/* Country Code Dropdown - Inline */}
                <select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="border-r p-2 focus:outline-none transition-all duration-200"
                    style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary,
                        color: colors.text.primary,
                        minWidth: "85px",
                        maxWidth: "85px",
                        cursor: "pointer",
                    }}
                >
                    {countryCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                            {cc.flag} {cc.code}
                        </option>
                    ))}
                </select>

                {/* Phone Number Input - Same Box */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    required={required}
                    className="flex-1 p-2 focus:outline-none transition-all duration-200"
                    style={{
                        backgroundColor: colors.background.primary,
                        color: colors.text.primary,
                        border: "none",
                    }}
                />
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
          input[type="tel"]::placeholder {
            color: ${colors.text.accent};
            opacity: 0.7;
          }
          select option {
            background-color: ${colors.background.primary};
            color: ${colors.text.primary};
          }
        `,
                }}
            />
        </div>
    );
};

export default PhoneInput;
