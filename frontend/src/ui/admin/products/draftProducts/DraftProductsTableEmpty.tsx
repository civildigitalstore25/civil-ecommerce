import { FileText } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

export function DraftProductsTableEmpty({ colors }: { colors: ThemeColors }) {
  return (
    <div className="p-8 text-center">
      <FileText
        className="w-16 h-16 mx-auto mb-4 opacity-50"
        style={{ color: colors.text.secondary }}
      />
      <p
        className="text-lg font-medium"
        style={{ color: colors.text.primary }}
      >
        No draft products found
      </p>
      <p className="mt-2" style={{ color: colors.text.secondary }}>
        Create a new draft to get started
      </p>
    </div>
  );
}
