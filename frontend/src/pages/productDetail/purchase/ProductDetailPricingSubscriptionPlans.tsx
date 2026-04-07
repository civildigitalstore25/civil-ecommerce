import React from "react";
import type { ProductDetailPlanOption, ProductDetailPricingRowBaseProps } from "./types";

type Props = ProductDetailPricingRowBaseProps & {
  options: ProductDetailPlanOption[];
};

export const ProductDetailPricingSubscriptionPlans: React.FC<Props> = ({
  options,
  colors,
  selectedBg,
  selectedLicense,
  onSelectLicense,
  formatPriceWithSymbol,
}) => {
  if (options.length === 0) return null;

  return (
    <div className="mb-3">
      <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>
        Pricing Plans
      </h4>
      <div className="flex gap-2 overflow-x-auto">
        {options.map((option) => (
          <div
            key={option.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectLicense(option.id);
            }}
            onClick={() => onSelectLicense(option.id)}
            className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[90px] ${selectedLicense === option.id ? "ring-2 ring-offset-2" : ""}`}
            style={{
              borderColor:
                selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
              background:
                selectedLicense === option.id ? selectedBg : colors.background.secondary,
              color: selectedLicense === option.id ? "#fff" : colors.text.primary,
              boxShadow:
                selectedLicense === option.id ? "0 2px 12px 0 rgba(0,0,0,0.10)" : undefined,
            }}
          >
            <div
              className="text-xs font-bold mb-1"
              style={{ color: selectedLicense === option.id ? "#fff" : colors.text.primary }}
            >
              {option.label}
            </div>
            {option.trialDays && (
              <div
                className="text-xs"
                style={{
                  color:
                    selectedLicense === option.id
                      ? "rgba(255,255,255,0.8)"
                      : colors.text.secondary,
                }}
              >
                {option.trialDays} Days
              </div>
            )}
            <div
              className="text-sm font-bold"
              style={{ color: selectedLicense === option.id ? "#fff" : colors.text.primary }}
            >
              {formatPriceWithSymbol(option.priceINR, option.priceUSD)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
