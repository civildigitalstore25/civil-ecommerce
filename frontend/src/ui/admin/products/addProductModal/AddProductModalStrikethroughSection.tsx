import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

export type AddProductModalStrikethroughSectionProps = {
  colors: ThemeColors;
  strikethroughPriceINR: string;
  strikethroughPriceUSD: string;
  onStrikethroughInrChange: (value: string) => void;
  onStrikethroughUsdChange: (value: string) => void;
};

export function AddProductModalStrikethroughSection({
  colors,
  strikethroughPriceINR,
  strikethroughPriceUSD,
  onStrikethroughInrChange,
  onStrikethroughUsdChange,
}: AddProductModalStrikethroughSectionProps) {
  return (
    <div className="space-y-4">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Strikethrough Price (MRP)
      </h2>
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Optional: Add a higher original price to display with strikethrough. This shows the discount/savings to
        customers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
            Strikethrough Price INR (₹)
          </label>
          <input
            type="number"
            value={strikethroughPriceINR}
            onChange={(e) => onStrikethroughInrChange(e.target.value)}
            placeholder="Enter original/max price in INR"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
            Strikethrough Price USD ($)
          </label>
          <input
            type="number"
            value={strikethroughPriceUSD}
            onChange={(e) => onStrikethroughUsdChange(e.target.value)}
            placeholder="Enter original/max price in USD"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>
      </div>
    </div>
  );
}
