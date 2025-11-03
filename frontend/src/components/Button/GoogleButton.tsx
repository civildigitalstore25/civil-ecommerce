import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface GoogleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ text, ...props }) => {
  const { colors } = useAdminTheme();

  return (
    <button
      {...props}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 border rounded-lg font-semibold transition duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
        color: colors.text.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.secondary;
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.primary;
        props.onMouseLeave?.(e);
      }}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      {text}
    </button>
  );
};

export default GoogleButton;
