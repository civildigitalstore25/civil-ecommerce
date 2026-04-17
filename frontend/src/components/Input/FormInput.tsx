import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  /** Inside the input row only, vertically centered (e.g. leading icon). */
  startAdornment?: React.ReactNode;
  /** Inside the input row only, vertically centered (e.g. password visibility toggle). */
  endAdornment?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  required,
  startAdornment,
  endAdornment,
  className = "",
  ...props
}) => {
  const { colors } = useAdminTheme();

  const hasAdornmentRow = Boolean(startAdornment || endAdornment);
  const inputClassName = `w-full border p-2 rounded transition-all duration-200 focus:ring-2 focus:outline-none ${startAdornment ? "pl-10 " : ""}${endAdornment ? "pr-11 " : ""}${className}`;

  const inputEl = (
    <input
      {...props}
      required={required}
      className={inputClassName.trim()}
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
  );

  return (
    <div>
      <label
        className="block font-medium mb-1 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        {label}
        {required && <span style={{ color: colors.status.error }}>*</span>}
      </label>
      {hasAdornmentRow ? (
        <div className="relative">
          {startAdornment ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex items-center pl-3">
              {startAdornment}
            </span>
          ) : null}
          {inputEl}
          {endAdornment}
        </div>
      ) : (
        inputEl
      )}
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
