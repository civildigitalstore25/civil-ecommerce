import { Plus } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type Props = { colors: ThemeColors; onAddDraft: () => void };

export function DraftProductsPageHeader({ colors, onAddDraft }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1
          className="text-2xl font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Draft Products
        </h1>
        <p
          className="text-sm mt-1 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Manage your draft products before publishing
        </p>
      </div>
      <button
        type="button"
        onClick={onAddDraft}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg text-white"
        style={{
          backgroundColor: colors.status.success,
        }}
      >
        <Plus className="w-5 h-5" />
        Add New Draft
      </button>
    </div>
  );
}
