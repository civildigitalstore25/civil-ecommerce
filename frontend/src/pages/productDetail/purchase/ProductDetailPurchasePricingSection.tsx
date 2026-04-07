import React from "react";
import type { ProductDetailPurchasePricingSectionProps } from "./types";
import { ProductDetailPricingAdminSubscriptions } from "./ProductDetailPricingAdminSubscriptions";
import { ProductDetailPricingLicensePlans } from "./ProductDetailPricingLicensePlans";
import { ProductDetailPricingLifetimeBlock } from "./ProductDetailPricingLifetimeBlock";
import { ProductDetailPricingMembershipBlock } from "./ProductDetailPricingMembershipBlock";
import { ProductDetailPricingSubscriptionPlans } from "./ProductDetailPricingSubscriptionPlans";

const rowBase = (
  p: ProductDetailPurchasePricingSectionProps,
) => ({
  colors: p.colors,
  selectedBg: p.selectedBg,
  selectedLicense: p.selectedLicense,
  onSelectLicense: p.onSelectLicense,
  formatPriceWithSymbol: p.formatPriceWithSymbol,
});

export const ProductDetailPurchasePricingSection: React.FC<
  ProductDetailPurchasePricingSectionProps
> = (props) => {
  const {
    pricingRef,
    colors,
    selectedOption,
    licenseOptions,
    subscriptionOptions,
    lifetimeOptions,
    membershipOptions,
    adminSubscriptionPlans,
  } = props;
  const base = rowBase(props);

  return (
    <div
      ref={pricingRef}
      className="rounded-lg lg:rounded-xl p-3 lg:p-4 transition-colors duration-200 mt-4"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-base lg:text-lg font-bold" style={{ color: colors.text.primary }}>
          Choose Your Access
        </h3>
        {selectedOption?.badge && (
          <span
            className="px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: "#10b981",
              color: colors.background.primary,
            }}
          >
            {selectedOption.badge}
          </span>
        )}
      </div>

      <ProductDetailPricingLicensePlans {...base} options={licenseOptions} />
      <ProductDetailPricingSubscriptionPlans {...base} options={subscriptionOptions} />
      <ProductDetailPricingLifetimeBlock {...base} options={lifetimeOptions} />
      <ProductDetailPricingMembershipBlock {...base} options={membershipOptions} />
      <ProductDetailPricingAdminSubscriptions {...base} options={adminSubscriptionPlans} />
    </div>
  );
};
