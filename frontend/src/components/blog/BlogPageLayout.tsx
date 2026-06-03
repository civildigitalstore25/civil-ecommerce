import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface BlogPageLayoutProps {
  children: React.ReactNode;
  /** Max width class (e.g. max-w-5xl, max-w-7xl) */
  maxWidth?: "5xl" | "7xl";
}

export function BlogPageLayout({
  children,
  maxWidth = "7xl",
}: BlogPageLayoutProps): React.ReactElement {
  const { colors } = useAdminTheme();
  const maxWidthClass = maxWidth === "5xl" ? "max-w-5xl" : "max-w-7xl";

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-24 pb-16 px-3 sm:px-5 md:px-6"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      <div className={`${maxWidthClass} mx-auto`}>{children}</div>
    </div>
  );
}
