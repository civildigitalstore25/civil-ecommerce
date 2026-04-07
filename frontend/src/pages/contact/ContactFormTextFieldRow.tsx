import { Controller } from "react-hook-form";
import type { Control, FieldErrors, RegisterOptions } from "react-hook-form";
import type { ThemeColors, ThemeMode } from "../../contexts/AdminThemeContext";
import type { ContactFormData } from "./contactTypes";
import { contactFormLabelColor } from "./contactFormTheme";

type TextFieldKey = "name" | "email" | "subject";

type ContactFormTextFieldRowProps = {
  name: TextFieldKey;
  control: Control<ContactFormData>;
  rules: RegisterOptions<ContactFormData, TextFieldKey>;
  label: string;
  placeholder: string;
  type?: string;
  errors: FieldErrors<ContactFormData>;
  colors: ThemeColors;
  theme: ThemeMode;
  isPending: boolean;
};

export function ContactFormTextFieldRow({
  name,
  control,
  rules,
  label,
  placeholder,
  type = "text",
  errors,
  colors,
  theme,
  isPending,
}: ContactFormTextFieldRowProps) {
  const err = errors[name];
  const hasError = Boolean(err);

  return (
    <div className="flex flex-col gap-3">
      <label
        className="text-sm font-semibold"
        style={{ color: contactFormLabelColor(colors, theme) }}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            type={type}
            value={field.value}
            onChange={field.onChange}
            disabled={isPending}
            placeholder={placeholder}
            className={`rounded-lg border-2 px-5 py-3 focus:ring disabled:cursor-not-allowed disabled:opacity-70 ${hasError ? "border-red-500" : ""}`}
            style={{
              backgroundColor: colors.background.primary,
              borderColor: hasError ? "#ef4444" : colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = hasError
                ? "#ef4444"
                : colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = hasError
                ? "#ef4444"
                : colors.border.primary;
            }}
          />
        )}
      />
      {err && <p className="text-red-500 text-sm">{err.message}</p>}
    </div>
  );
}
