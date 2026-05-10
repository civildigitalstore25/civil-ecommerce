import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface BlogCategoryTagProps {
  category: string;
  className?: string;
}

/**
 * Category pill using theme tokens (readable in light and dark mode).
 */
export function BlogCategoryTag({ category, className = "" }: BlogCategoryTagProps): React.ReactElement {
  const { colors } = useAdminTheme();

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${className}`}
      style={{
        backgroundColor: `${colors.interactive.primary}20`,
        color: colors.interactive.primary,
      }}
    >
      {category}
    </span>
  );
}
