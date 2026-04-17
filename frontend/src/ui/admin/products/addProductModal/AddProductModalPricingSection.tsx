import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { SubscriptionDuration } from "../../../../constants/productFormConstants";
import { AddProductModalPricingDurationsBlock } from "./AddProductModalPricingDurationsBlock";
import { AddProductModalPricingEbookBlock } from "./AddProductModalPricingEbookBlock";
import { AddProductModalPricingLifetimeMembershipBlock } from "./AddProductModalPricingLifetimeMembershipBlock";

export type AddProductModalPricingSectionProps = {
  colors: ThemeColors;
  brand: string;
  hasLifetime: boolean;
  lifetimePriceINR: string;
  lifetimePriceUSD: string;
  hasMembership: boolean;
  membershipPriceINR: string;
  membershipPriceUSD: string;
  subscriptionDurations: SubscriptionDuration[];
  onHasLifetimeChange: (checked: boolean) => void;
  onLifetimeInrChange: (value: string) => void;
  onLifetimeUsdChange: (value: string) => void;
  onHasMembershipChange: (checked: boolean) => void;
  onMembershipInrChange: (value: string) => void;
  onMembershipUsdChange: (value: string) => void;
  onUpdateDuration: (
    index: number,
    field: "duration" | "price" | "priceINR" | "priceUSD" | "trialDays",
    value: string,
  ) => void;
  onRemoveDuration: (index: number) => void;
  onAddDuration: () => void;
};

export function AddProductModalPricingSection({
  colors,
  brand,
  hasLifetime,
  lifetimePriceINR,
  lifetimePriceUSD,
  hasMembership,
  membershipPriceINR,
  membershipPriceUSD,
  subscriptionDurations,
  onHasLifetimeChange,
  onLifetimeInrChange,
  onLifetimeUsdChange,
  onHasMembershipChange,
  onMembershipInrChange,
  onMembershipUsdChange,
  onUpdateDuration,
  onRemoveDuration,
  onAddDuration,
}: AddProductModalPricingSectionProps) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Pricing Options
      </h2>

      <div className="space-y-4">
        {brand === "ebook" ? (
          <AddProductModalPricingEbookBlock
            colors={colors}
            hasLifetime={hasLifetime}
            lifetimePriceINR={lifetimePriceINR}
            lifetimePriceUSD={lifetimePriceUSD}
            onHasLifetimeChange={onHasLifetimeChange}
            onLifetimeInrChange={onLifetimeInrChange}
            onLifetimeUsdChange={onLifetimeUsdChange}
          />
        ) : (
          <AddProductModalPricingDurationsBlock
            colors={colors}
            subscriptionDurations={subscriptionDurations}
            onUpdateDuration={onUpdateDuration}
            onRemoveDuration={onRemoveDuration}
            onAddDuration={onAddDuration}
          />
        )}

        {brand !== "ebook" && (
          <AddProductModalPricingLifetimeMembershipBlock
            colors={colors}
            hasLifetime={hasLifetime}
            lifetimePriceINR={lifetimePriceINR}
            lifetimePriceUSD={lifetimePriceUSD}
            hasMembership={hasMembership}
            membershipPriceINR={membershipPriceINR}
            membershipPriceUSD={membershipPriceUSD}
            onHasLifetimeChange={onHasLifetimeChange}
            onLifetimeInrChange={onLifetimeInrChange}
            onLifetimeUsdChange={onLifetimeUsdChange}
            onHasMembershipChange={onHasMembershipChange}
            onMembershipInrChange={onMembershipInrChange}
            onMembershipUsdChange={onMembershipUsdChange}
          />
        )}
      </div>
    </div>
  );
}
