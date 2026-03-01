import React from "react";

interface BlogCategoryTagProps {
  category: string;
  className?: string;
}

/**
 * Solid app-color category pill (no gradient).
 */
export function BlogCategoryTag({ category, className = "" }: BlogCategoryTagProps): React.ReactElement {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ${className}`}
    >
      {category}
    </span>
  );
}
