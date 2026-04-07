import { FileText } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type Props = { colors: ThemeColors; totalDrafts: number };

export function DraftProductsStatsCard({ colors, totalDrafts }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8 relative">
      <div
        className="relative overflow-hidden rounded-xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium opacity-75"
              style={{ color: colors.text.secondary }}
            >
              Total Draft Products
            </p>
            <p
              className="text-3xl font-bold mt-2"
              style={{ color: colors.text.primary }}
            >
              {totalDrafts}
            </p>
            <p
              className="text-xs mt-1 opacity-60"
              style={{ color: colors.text.secondary }}
            >
              Not yet published
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${colors.status.warning}20` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.status.warning }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
