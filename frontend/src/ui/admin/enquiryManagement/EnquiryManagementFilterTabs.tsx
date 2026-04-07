import type { ThemeColors } from "../../../contexts/AdminThemeContext";

const FILTERS = ["all", "pending", "replied", "closed"] as const;

type Props = {
  colors: ThemeColors;
  filterStatus: string;
  onFilterChange: (status: string) => void;
};

export function EnquiryManagementFilterTabs({
  colors,
  filterStatus,
  onFilterChange,
}: Props) {
  return (
    <div
      className="inline-flex rounded-lg p-1"
      style={{
        backgroundColor: colors.background.accent,
        border: `1px solid ${colors.border.primary}`,
      }}
    >
      {FILTERS.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onFilterChange(status)}
          className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize"
          style={{
            backgroundColor:
              filterStatus === status
                ? colors.interactive.primary
                : "transparent",
            color:
              filterStatus === status ? "#ffffff" : colors.text.secondary,
          }}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
