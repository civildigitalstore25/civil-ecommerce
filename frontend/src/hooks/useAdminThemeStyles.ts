import { useAdminTheme } from "../contexts/AdminThemeContext";
import type { CSSProperties } from "react";

export const useAdminThemeStyles = () => {
  const { colors, theme } = useAdminTheme();

  // Common style generators
  const cardStyle = (
    variant: "primary" | "secondary" = "secondary",
  ): CSSProperties => ({
    backgroundColor:
      variant === "primary"
        ? colors.background.primary
        : colors.background.secondary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
    transition: "all 0.2s ease-in-out",
  });

  const inputStyle = (): CSSProperties => ({
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
    transition: "all 0.2s ease-in-out",
  });

  const buttonStyle = (
    variant: "primary" | "secondary" | "danger" = "primary",
  ): CSSProperties => {
    const baseStyle: CSSProperties = {
      transition: "all 0.2s ease-in-out",
      border: "1px solid",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.interactive.primary,
          borderColor: colors.interactive.primary,
          color: colors.text.inverse,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: colors.status.error,
          borderColor: colors.status.error,
          color: colors.text.inverse,
        };
      default:
        return baseStyle;
    }
  };

  const modalStyle = (): CSSProperties => ({
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
  });

  const headerStyle = (): CSSProperties => ({
    backgroundColor: colors.background.tertiary,
    borderBottomColor: colors.border.primary,
    color: colors.text.primary,
  });

  const tableStyle = (): CSSProperties => ({
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
  });

  const tableRowStyle = (isHovered: boolean = false): CSSProperties => ({
    backgroundColor: isHovered ? colors.background.accent : "transparent",
    borderBottomColor: colors.border.secondary,
    color: colors.text.primary,
    transition: "background-color 0.2s ease-in-out",
  });

  const statusBadgeStyle = (
    status: "success" | "warning" | "error" | "info",
  ): CSSProperties => ({
    backgroundColor: colors.status[status],
    color: colors.text.inverse,
    transition: "all 0.2s ease-in-out",
  });

  // CSS custom properties for dynamic styling
  const cssVariables = {
    "--admin-bg-primary": colors.background.primary,
    "--admin-bg-secondary": colors.background.secondary,
    "--admin-bg-tertiary": colors.background.tertiary,
    "--admin-bg-accent": colors.background.accent,
    "--admin-text-primary": colors.text.primary,
    "--admin-text-secondary": colors.text.secondary,
    "--admin-text-accent": colors.text.accent,
    "--admin-text-inverse": colors.text.inverse,
    "--admin-border-primary": colors.border.primary,
    "--admin-border-secondary": colors.border.secondary,
    "--admin-border-accent": colors.border.accent,
    "--admin-interactive-primary": colors.interactive.primary,
    "--admin-interactive-primary-hover": colors.interactive.primaryHover,
    "--admin-focus-color": colors.interactive.primary,
    "--admin-success": colors.status.success,
    "--admin-warning": colors.status.warning,
    "--admin-error": colors.status.error,
    "--admin-info": colors.status.info,
  } as CSSProperties;

  return {
    colors,
    theme,
    cardStyle,
    inputStyle,
    buttonStyle,
    modalStyle,
    headerStyle,
    tableStyle,
    tableRowStyle,
    statusBadgeStyle,
    cssVariables,
  };
};

// Utility functions for common patterns
export const getThemeAwareClassName = (
  baseClass: string,
  theme: "light" | "dark",
): string => {
  const themeClass = theme === "light" ? "admin-light" : "admin-dark";
  return `${baseClass} ${themeClass}`;
};

export const combineStyles = (
  ...styles: (CSSProperties | undefined)[]
): CSSProperties => {
  return styles
    .filter((style): style is CSSProperties => style !== undefined)
    .reduce(
      (combined, style) => ({ ...combined, ...style }),
      {} as CSSProperties,
    );
};
