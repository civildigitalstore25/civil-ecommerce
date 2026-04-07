import { Plus } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

interface BannerAdminHeaderProps {
  colors: ThemeColors;
  onAdd: () => void;
}

export function BannerAdminHeader({ colors, onAdd }: BannerAdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-6 gap-3">
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Banner Management
        </h1>
        <div
          className="w-20 h-1 rounded-full"
          style={{ backgroundColor: colors.interactive.primary }}
        />
        <p
          className="mt-1 text-sm sm:text-base"
          style={{ color: colors.text.secondary }}
        >
          Create & manage promotional banners
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-md transition w-full sm:w-auto justify-center"
        style={{
          background: "#0068ff",
          color: "#fff",
          border: "none",
        }}
      >
        <Plus size={20} /> Add Banner
      </button>
    </div>
  );
}
