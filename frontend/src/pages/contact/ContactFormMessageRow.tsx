import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { ThemeColors, ThemeMode } from "../../contexts/AdminThemeContext";
import type { ContactFormData } from "./contactTypes";
import { contactFormLabelColor } from "./contactFormTheme";

type ContactFormMessageRowProps = {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  colors: ThemeColors;
  theme: ThemeMode;
  isPending: boolean;
};

export function ContactFormMessageRow({
  control,
  errors,
  colors,
  theme,
  isPending,
}: ContactFormMessageRowProps) {
  const err = errors.message;
  const hasError = Boolean(err);

  return (
    <div className="flex flex-col gap-3 flex-1">
      <label
        className="text-sm font-semibold"
        style={{ color: contactFormLabelColor(colors, theme) }}
      >
        Your Message (Optional)
      </label>
      <Controller
        name="message"
        control={control}
        rules={{
          maxLength: {
            value: 1000,
            message: "Message must not exceed 1000 characters",
          },
        }}
        render={({ field }) => (
          <textarea
            value={field.value}
            onChange={field.onChange}
            rows={6}
            disabled={isPending}
            placeholder="Tell us more about your inquiry..."
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
