import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = "primary",
  ...props
}) => {
  const { colors } = useAdminTheme();

  const baseClasses =
    "px-4 py-2 rounded font-semibold transition-all duration-200 hover:scale-[1.02]";

  const getButtonStyles = () => {
    if (variant === "primary") {
      return {
        background: colors.interactive.primary,
        color: colors.text.inverse,
        border: "none",
        boxShadow: `0 2px 8px ${colors.interactive.primary}22`,
      };
    } else {
      return {
        backgroundColor: "transparent",
        color: colors.text.primary,
        border: `2px solid ${colors.border.primary}`,
      };
    }
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${props.className || ""}`}
      style={{
        ...getButtonStyles(),
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.background = colors.interactive.primaryHover;
        } else if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = colors.background.secondary;
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.background = colors.interactive.primary;
        } else if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = "transparent";
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
};

export default FormButton;
