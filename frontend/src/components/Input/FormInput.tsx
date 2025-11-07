import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, required, ...props }) => {
  const { colors } = useAdminTheme();

  return (
    <div>
      <label
        className="block font-medium mb-1 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        {label}
        {required && <span style={{ color: colors.status.error }}>*</span>}
      </label>
      <input
        {...props}
        required={required}
        className={`w-full border p-2 rounded transition-all duration-200 focus:ring-2 focus:outline-none ${props.className || ""}`}
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.interactive.primary;
          e.target.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border.primary;
          e.target.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          input::placeholder {
            color: ${colors.text.accent};
            opacity: 0.7;
          }
        `,
        }}
      />
    </div>
  );
};

export default FormInput;
