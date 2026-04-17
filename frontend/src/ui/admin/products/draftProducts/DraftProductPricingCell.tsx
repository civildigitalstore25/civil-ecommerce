import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { PricingGroup } from "./draftProductPricingGroups";

type DraftProductPricingCellProps = {
  colors: ThemeColors;
  pricingGroups: PricingGroup[];
};

export function DraftProductPricingCell({
  colors,
  pricingGroups,
}: DraftProductPricingCellProps) {
  if (pricingGroups.length === 0) {
    return <span style={{ color: colors.text.secondary }}>N/A</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {pricingGroups.map((group, idx) => (
        <div key={idx}>
          <div
            className="text-xs opacity-75 mb-1"
            style={{ color: colors.text.secondary }}
          >
            {group.title}
          </div>
          {group.lines.map((line, lineIdx) => (
            <div
              key={lineIdx}
              className="flex items-center gap-2 text-sm"
              style={{ color: colors.text.primary }}
            >
              <span className="opacity-75">{line.label}:</span>
              <span className="font-semibold">
                ₹{line.price.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
