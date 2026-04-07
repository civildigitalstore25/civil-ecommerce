import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

const logo = "/softlogo.png";

type SigninPageHeaderProps = {
  colors: ThemeColors;
  navigate: NavigateFunction;
};

export function SigninPageHeader({ colors, navigate }: SigninPageHeaderProps) {
  return (
    <div
      className="py-6 px-6 rounded-t-2xl flex flex-col items-center"
      style={{
        background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
      }}
    >
      <button
        type="button"
        className="p-3 rounded-2xl shadow-md cursor-pointer border-0"
        style={{ backgroundColor: colors.background.primary }}
        onClick={() => navigate("/")}
        title="Go to Home"
      >
        <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
      </button>
      <h1
        className="text-2xl font-bold mt-4"
        style={{ color: colors.text.primary }}
      >
        Welcome Back
      </h1>
      <p
        className="mt-2 text-sm text-center"
        style={{ color: colors.text.secondary }}
      >
        Sign in to access your software licenses and downloads
      </p>
    </div>
  );
}
