import type { FormEvent } from "react";
import { FileText, Save } from "lucide-react";
import type { ThemeColors, ThemeMode } from "../../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  theme: ThemeMode;
  isUpdateMode: boolean;
  onSaveDraft: (e: FormEvent) => void;
  onClose: () => void;
};

export function AddProductModalStickyFooter({
  colors,
  theme,
  isUpdateMode,
  onSaveDraft,
  onClose,
}: Props) {
  return (
    <div
      className="flex-shrink-0 flex flex-col sm:flex-row gap-4 px-6 py-4 border-t transition-colors duration-200"
      style={{ borderColor: colors.border.primary, backgroundColor: colors.background.secondary }}
    >
      <button
        type="button"
        onClick={onSaveDraft}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
        style={{
          background: "#00BEF5",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        <FileText className="h-4 w-4" />
        Save as Draft
      </button>
      <button
        type="submit"
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
        style={{
          background: "#00BEF5",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        <Save className="h-4 w-4" />
        {isUpdateMode ? "Update Product" : "Add Product"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-6 py-3 border rounded-lg hover:opacity-80 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
              : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
