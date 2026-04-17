import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

export type AddProductModalPricingEbookBlockProps = {
  colors: ThemeColors;
  hasLifetime: boolean;
  lifetimePriceINR: string;
  lifetimePriceUSD: string;
  onHasLifetimeChange: (checked: boolean) => void;
  onLifetimeInrChange: (value: string) => void;
  onLifetimeUsdChange: (value: string) => void;
};

export function AddProductModalPricingEbookBlock({
  colors,
  hasLifetime,
  lifetimePriceINR,
  lifetimePriceUSD,
  onHasLifetimeChange,
  onLifetimeInrChange,
  onLifetimeUsdChange,
}: AddProductModalPricingEbookBlockProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasLifetimeEbook"
          checked={hasLifetime}
          onChange={(e) => onHasLifetimeChange(e.target.checked)}
          className="rounded focus:ring-2 transition-colors duration-200"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.primary,
            color: colors.interactive.primary,
          }}
        />
        <label
          htmlFor="hasLifetimeEbook"
          className="text-sm font-medium"
          style={{ color: colors.text.secondary }}
        >
          Offer Lifetime License
        </label>
      </div>

      {hasLifetime && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
              Lifetime Price INR (₹)
            </label>
            <input
              type="number"
              value={lifetimePriceINR}
              onChange={(e) => onLifetimeInrChange(e.target.value)}
              placeholder="0.00"
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
              Lifetime Price USD ($)
            </label>
            <input
              type="number"
              value={lifetimePriceUSD}
              onChange={(e) => onLifetimeUsdChange(e.target.value)}
              placeholder="0.00"
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
      )}
    </div>
  );
}
