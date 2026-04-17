import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type ProductDetailReviewsCustomDateRowProps = {
  colors: ThemeColors;
  reviewsLength: number;
  dateFilter: string;
  customStartDate: string | null;
  setCustomStartDate: (v: string | null) => void;
  customEndDate: string | null;
  setCustomEndDate: (v: string | null) => void;
};

export function ProductDetailReviewsCustomDateRow({
  colors,
  reviewsLength,
  dateFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: ProductDetailReviewsCustomDateRowProps) {
  if (dateFilter !== "custom" || reviewsLength === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-6">
      <input
        type="date"
        value={customStartDate || ""}
        onChange={(e) => setCustomStartDate(e.target.value || null)}
        className="px-3 py-1.5 rounded-lg border text-sm"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      />
      <span className="text-sm" style={{ color: colors.text.secondary }}>
        to
      </span>
      <input
        type="date"
        value={customEndDate || ""}
        onChange={(e) => setCustomEndDate(e.target.value || null)}
        className="px-3 py-1.5 rounded-lg border text-sm"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      />
    </div>
  );
}
