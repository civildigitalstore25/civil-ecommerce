import type { ReactNode } from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import AdminThemeToggle from "../../../components/ThemeToggle/AdminThemeToggle";

type Props = {
  colors: ThemeColors;
  children: ReactNode;
};

export function PasswordResetAuthShell({ colors, children }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="absolute top-4 right-4">
        <AdminThemeToggle />
      </div>
      <div
        className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {children}
      </div>
    </div>
  );
}
