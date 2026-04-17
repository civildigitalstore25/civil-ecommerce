import React from "react";
import type { ProductDetailPlanOption, ProductDetailPricingRowBaseProps } from "./types";

type Props = ProductDetailPricingRowBaseProps & {
  options: ProductDetailPlanOption[];
};

export const ProductDetailPricingLicensePlans: React.FC<Props> = ({
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
        License Plans
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
            className={`flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[100px] ${selectedLicense === option.id ? "ring-2 ring-offset-2" : ""}`}
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
              {option.label.replace(" License", "")}
            </div>
            {option.badge && (
              <div
                className="text-xs px-1 py-0.5 rounded font-bold mb-1"
                style={{
                  backgroundColor:
                    option.badge === "Most Popular" ? "#3b82f6" : "#f59e0b",
                  color: colors.background.primary,
                  fontSize: "10px",
                }}
              >
                {option.badge}
              </div>
            )}
            <div
              className="text-sm font-bold"
              style={{ color: selectedLicense === option.id ? "#fff" : colors.text.primary }}
            >
              {option.isDeal && option.originalPriceINR ? (
                <div className="flex flex-col gap-1">
                  <div className="text-xs line-through opacity-70">
                    {formatPriceWithSymbol(option.originalPriceINR, option.originalPriceUSD ?? 0)}
                  </div>
                  <div
                    className="font-bold"
                    style={{
                      color: selectedLicense === option.id ? "#ffeb3b" : colors.status.warning,
                    }}
                  >
                    {formatPriceWithSymbol(option.priceINR, option.priceUSD)}
                  </div>
                </div>
              ) : (
                formatPriceWithSymbol(option.priceINR, option.priceUSD)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
