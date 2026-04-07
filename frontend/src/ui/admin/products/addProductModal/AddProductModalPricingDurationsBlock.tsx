import { Plus, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { SubscriptionDuration } from "../../../../constants/productFormConstants";

export type AddProductModalPricingDurationsBlockProps = {
  colors: ThemeColors;
  subscriptionDurations: SubscriptionDuration[];
  onUpdateDuration: (
    index: number,
    field: "duration" | "price" | "priceINR" | "priceUSD" | "trialDays",
    value: string,
  ) => void;
  onRemoveDuration: (index: number) => void;
  onAddDuration: () => void;
};

export function AddProductModalPricingDurationsBlock({
  colors,
  subscriptionDurations,
  onUpdateDuration,
  onRemoveDuration,
  onAddDuration,
}: AddProductModalPricingDurationsBlockProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
        Pricing
      </label>
      {subscriptionDurations.map((sub, index) => (
        <div key={index} className="p-4 border rounded-lg transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                Duration
              </label>
              <select
                value={sub.duration}
                onChange={(e) => onUpdateDuration(index, "duration", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Months">6 Months</option>
                <option value="Trial Pack">Trial Pack</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                Price INR (₹)
              </label>
              <input
                type="number"
                value={sub.price}
                onChange={(e) => onUpdateDuration(index, "price", e.target.value)}
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
                Price USD ($)
              </label>
              <input
                type="number"
                value={sub.priceUSD}
                onChange={(e) => onUpdateDuration(index, "priceUSD", e.target.value)}
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
              {typeof sub.duration === "string" && sub.duration.toLowerCase().includes("trial") && (
                <>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Trial Days
                  </label>
                  <input
                    type="number"
                    value={sub.trialDays || ""}
                    onChange={(e) => onUpdateDuration(index, "trialDays", e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex justify-center md:justify-end">
              <button
                type="button"
                onClick={() => onRemoveDuration(index)}
                title="Remove pricing duration"
                className="px-3 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
                style={{ color: colors.status.error, borderColor: colors.status.error }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddDuration}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
        style={{ color: colors.interactive.primary, borderColor: colors.interactive.primary }}
      >
        <Plus className="h-4 w-4" /> Add Duration
      </button>
    </div>
  );
}
