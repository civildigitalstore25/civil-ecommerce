import { Plus, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { SubscriptionDuration } from "../../../../constants/productFormConstants";

export type AddProductModalAdminSubscriptionsSectionProps = {
  colors: ThemeColors;
  subscriptions: SubscriptionDuration[];
  onUpdate: (
    index: number,
    field: "duration" | "price" | "priceINR" | "priceUSD",
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
};

export function AddProductModalAdminSubscriptionsSection({
  colors,
  subscriptions,
  onUpdate,
  onRemove,
  onAdd,
}: AddProductModalAdminSubscriptionsSectionProps) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Subscription Plans
      </h2>

      <div className="space-y-4">
        <p className="text-sm" style={{ color: colors.text.secondary }}>
          Add recurring subscription plans for your software
        </p>

        <div className="space-y-4">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Subscription Plans
          </label>
          {subscriptions.map((sub, index) => (
            <div key={index} className="p-4 rounded-lg transition-colors duration-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    Duration
                  </label>
                  <select
                    value={sub.duration}
                    onChange={(e) => onUpdate(index, "duration", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                    INR (₹)
                  </label>
                  <input
                    type="number"
                    value={sub.price}
                    onChange={(e) => onUpdate(index, "price", e.target.value)}
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
                    USD ($)
                  </label>
                  <input
                    type="number"
                    value={sub.priceUSD || ""}
                    onChange={(e) => onUpdate(index, "priceUSD", e.target.value)}
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
                <div className="flex justify-center md:justify-end">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    title="Remove subscription plan"
                    className="px-3 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
                    style={{
                      color: colors.status.error,
                      borderColor: colors.status.error,
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
            style={{
              color: colors.interactive.primary,
              borderColor: colors.interactive.primary,
            }}
          >
            <Plus className="h-4 w-4" />
            Add Subscription Plan
          </button>
        </div>
      </div>
    </div>
  );
}
