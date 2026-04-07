import { useNavigate } from "react-router-dom";
import AdminThemeToggle from "../../../components/ThemeToggle/AdminThemeToggle";

const logo = "/softlogo.png";

interface SignupHeaderProps {
  colors: any;
}

export function SignupHeader({ colors }: SignupHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute top-4 right-4">
        <AdminThemeToggle />
      </div>
      <div
        className="py-6 px-6 rounded-t-2xl flex flex-col items-center"
        style={{
          background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
        }}
      >
        <div
          className="p-3 rounded-2xl shadow-md cursor-pointer"
          style={{ backgroundColor: colors.background.primary }}
          onClick={() => navigate("/")}
          title="Go to Home"
        >
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>
        <h1
          className="text-2xl font-bold mt-4"
          style={{ color: colors.text.primary }}
        >
          Create Account
        </h1>
        <p
          className="mt-2 text-sm text-center"
          style={{ color: colors.text.secondary }}
        >
          Join us to access software licenses and downloads
        </p>
      </div>
    </>
  );
}
