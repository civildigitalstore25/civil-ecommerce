import React, { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface FormDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

const STYLE_ID = "form-dateinput-hide-native";

const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  required,
  name,
  value,
  onChange,
  min,
  max,
  placeholder,
  ...props
}) => {
  const { colors, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Hide native date picker icon in Chrome/Safari/Edge
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        opacity: 0 !important;
        display: none !important;
        -webkit-appearance: none !important;
      }
      input[type="date"]::-webkit-clear-button,
      input[type="date"]::-webkit-inner-spin-button { display: none !important; }
      input[type="date"] { background-image: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;

    const anyEl = el as any;
    if (typeof anyEl.showPicker === "function") {
      try {
        anyEl.showPicker();
        return;
      } catch {}
    }
    el.focus();
    try {
      el.click();
    } catch {}
  };

  const onIconKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div className="relative w-full">
      <label
        className="block font-medium mb-1 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        {label} {required && <span style={{ color: colors.status.error }}>*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          required={required}
          placeholder={placeholder}
          {...props}
          className="w-full rounded-md px-3 py-2 pr-12 transition-all duration-200 focus:outline-none"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
            borderColor: colors.border.primary,
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

        <span
          role="button"
          aria-label={`${label} - open date picker`}
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={onIconKeyDown}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer flex items-center justify-center p-1.5 rounded-md transition"
          style={{
            backgroundColor: isDark ? "#2D2D2D" : "#F3F4F6",
          }}
        >
          <Calendar
            size={18}
            style={{
              color: isDark ? "#FACC15" : "#6B7280",
            }}
          />
        </span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          input::placeholder {
            color: ${colors.text.accent};
            opacity: 0.7;
          }
        `
      }} />
    </div>
  );
};

export default FormDateInput;