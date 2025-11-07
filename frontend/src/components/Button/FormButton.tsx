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
        background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`,
        color: colors.background.primary,
        border: "none",
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
        if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = colors.background.secondary;
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (variant === "secondary") {
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
