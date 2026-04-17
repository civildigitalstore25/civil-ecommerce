import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailRichText } from "../ProductDetailRichText";
import { renderProductDetailLucideIcon } from "../renderProductDetailLucideIcon";
import { PRODUCT_DETAIL_DEFAULT_REQUIREMENTS } from "./defaultRequirementPlaceholders";

type ProductDetailTabRequirementsProps = {
  colors: ThemeColors;
  product: Product;
};

export function ProductDetailTabRequirements({
  colors,
  product,
}: ProductDetailTabRequirementsProps) {
  return (
    <div>
      <h3
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text.primary }}
      >
        System Requirements
      </h3>
      <p className="mb-8" style={{ color: colors.text.secondary }}>
        Minimum system specifications for {product.name}
      </p>

      {product.systemRequirements && product.systemRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.systemRequirements.map(
            (
              requirement: {
                icon?: string;
                title?: string;
                description?: string;
              },
              index: number
            ) => (
              <div
                key={index}
                className="rounded-2xl p-6 border transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-400">
                    {renderProductDetailLucideIcon(
                      requirement.icon ?? "Monitor",
                      "w-6 h-6"
                    )}
                  </div>
                  <h4
                    className="text-xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {requirement.title}
                  </h4>
                </div>
                <ProductDetailRichText
                  colors={colors}
                  htmlContent={requirement.description || ""}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCT_DETAIL_DEFAULT_REQUIREMENTS.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl p-6 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center gap-3 mb-4">
                {renderProductDetailLucideIcon(r.icon, r.iconClass)}
                <h4
                  className="text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {r.title}
                </h4>
              </div>
              <p style={{ color: colors.text.secondary }}>{r.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
