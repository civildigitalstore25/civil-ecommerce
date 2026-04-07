import { CheckCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { PasswordStrengthResult } from "./passwordResetValidation";

type Props = {
  colors: ThemeColors;
  passwordValidation: PasswordStrengthResult;
};

export function PasswordStrengthChecklist({
  colors,
  passwordValidation,
}: Props) {
  const rows: { ok: boolean; label: string }[] = [
    { ok: passwordValidation.minLength, label: "At least 8 characters" },
    { ok: passwordValidation.hasUpper, label: "One uppercase letter" },
    { ok: passwordValidation.hasLower, label: "One lowercase letter" },
    { ok: passwordValidation.hasNumber, label: "One number" },
    { ok: passwordValidation.hasSpecial, label: "One special character" },
  ];

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <h4 className="text-sm font-medium mb-3" style={{ color: colors.text.primary }}>
        Password Requirements:
      </h4>
      <div className="space-y-2">
        {rows.map(({ ok, label }) => (
          <div
            key={label}
            className={`flex items-center text-xs ${ok ? "text-green-600" : "text-gray-500"}`}
          >
            <CheckCircle
              className={`h-3 w-3 mr-2 ${ok ? "text-green-500" : "text-gray-400"}`}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
