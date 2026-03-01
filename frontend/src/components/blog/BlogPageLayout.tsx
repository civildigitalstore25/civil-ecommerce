import React from "react";

interface BlogPageLayoutProps {
  children: React.ReactNode;
  /** Max width class (e.g. max-w-5xl, max-w-7xl) */
  maxWidth?: "5xl" | "7xl";
}

export function BlogPageLayout({
  children,
  maxWidth = "7xl",
}: BlogPageLayoutProps): React.ReactElement {
  const maxWidthClass = maxWidth === "5xl" ? "max-w-5xl" : "max-w-7xl";

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pt-24 pb-12 px-2 md:px-4 bg-[#f9fafb]`}
    >
      <div className={`${maxWidthClass} mx-auto`}>{children}</div>
    </div>
  );
}
