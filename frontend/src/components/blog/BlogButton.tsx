import React from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "outline" | "danger";

interface BlogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  to?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-sm",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600",
  outline:
    "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white",
  danger:
    "bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

export function BlogButton({
  variant = "primary",
  children,
  className = "",
  to,
  ...props
}: BlogButtonProps): React.ReactElement {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if (to != null) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
