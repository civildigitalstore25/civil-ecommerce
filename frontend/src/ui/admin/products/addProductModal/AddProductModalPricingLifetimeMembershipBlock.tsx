import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

export type AddProductModalPricingLifetimeMembershipBlockProps = {
  colors: ThemeColors;
  hasLifetime: boolean;
  lifetimePriceINR: string;
  lifetimePriceUSD: string;
  hasMembership: boolean;
  membershipPriceINR: string;
  membershipPriceUSD: string;
  onHasLifetimeChange: (checked: boolean) => void;
  onLifetimeInrChange: (value: string) => void;
  onLifetimeUsdChange: (value: string) => void;
  onHasMembershipChange: (checked: boolean) => void;
  onMembershipInrChange: (value: string) => void;
  onMembershipUsdChange: (value: string) => void;
};

export function AddProductModalPricingLifetimeMembershipBlock({
  colors,
  hasLifetime,
  lifetimePriceINR,
  lifetimePriceUSD,
  hasMembership,
  membershipPriceINR,
  membershipPriceUSD,
  onHasLifetimeChange,
  onLifetimeInrChange,
  onLifetimeUsdChange,
  onHasMembershipChange,
  onMembershipInrChange,
  onMembershipUsdChange,
}: AddProductModalPricingLifetimeMembershipBlockProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasLifetime"
          checked={hasLifetime}
          onChange={(e) => onHasLifetimeChange(e.target.checked)}
          className="rounded focus:ring-2 transition-colors duration-200"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.primary,
            color: colors.interactive.primary,
          }}
        />
        <label htmlFor="hasLifetime" className="text-sm font-medium" style={{ color: colors.text.secondary }}>
          Offer Lifetime License
        </label>
      </div>
      {hasLifetime && (
        <div
          className="space-y-4 p-4 border rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h4 className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            Lifetime Pricing
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasMembership"
          checked={hasMembership}
          onChange={(e) => onHasMembershipChange(e.target.checked)}
          className="rounded focus:ring-2 transition-colors duration-200"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.primary,
            color: colors.interactive.primary,
          }}
        />
        <label htmlFor="hasMembership" className="text-sm font-medium" style={{ color: colors.text.secondary }}>
          VIP/Premium Membership Option
        </label>
      </div>
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Premium membership with exclusive benefits and priority support
      </p>
      {hasMembership && (
        <div
          className="space-y-4 p-4 border rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h4 className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            Membership Pricing
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                Membership Price INR (₹)
              </label>
              <input
                type="number"
                value={membershipPriceINR}
                onChange={(e) => onMembershipInrChange(e.target.value)}
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
                Membership Price USD ($)
              </label>
              <input
                type="number"
                value={membershipPriceUSD}
                onChange={(e) => onMembershipUsdChange(e.target.value)}
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
        </div>
      )}
    </>
  );
}
