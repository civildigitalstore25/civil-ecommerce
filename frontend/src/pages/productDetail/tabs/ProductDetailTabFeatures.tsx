import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailRichText } from "../ProductDetailRichText";
import { renderProductDetailLucideIcon } from "../renderProductDetailLucideIcon";
import { PRODUCT_DETAIL_DEFAULT_FEATURES } from "./defaultFeaturePlaceholders";

type ProductDetailTabFeaturesProps = {
  colors: ThemeColors;
  product: Product;
};

export function ProductDetailTabFeatures({
  colors,
  product,
}: ProductDetailTabFeaturesProps) {
  return (
    <div>
      <h3
        className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6"
        style={{ color: colors.text.primary }}
      >
        Key Features
      </h3>
      <p
        className="mb-6 lg:mb-8 text-sm lg:text-base"
        style={{ color: colors.text.secondary }}
      >
        Comprehensive overview of {product.name} capabilities and tools
      </p>

      {product.keyFeatures && product.keyFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {product.keyFeatures.map((feature: { icon?: string; title?: string; description?: string }, index: number) => (
            <div
              key={index}
              className="rounded-xl lg:rounded-2xl p-4 lg:p-6 border transition-colors duration-200 shadow"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="text-yellow-400 flex-shrink-0">
                  {renderProductDetailLucideIcon(
                    feature.icon ?? "Check",
                    "w-5 h-5 lg:w-6 lg:h-6"
                  )}
                </div>
                <h4
                  className="text-lg lg:text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {feature.title}
                </h4>
              </div>
              <ProductDetailRichText
                colors={colors}
                htmlContent={feature.description || ""}
                className="text-sm lg:text-base"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCT_DETAIL_DEFAULT_FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-colors duration-200 shadow"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center gap-3 mb-4">
                {renderProductDetailLucideIcon(f.icon, f.iconClass)}
                <h4
                  className="text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {f.title}
                </h4>
              </div>
              <p style={{ color: colors.text.secondary }}>{f.description}</p>
            </div>
          ))}
        </div>
      )}

      <div
        className="mt-8 rounded-2xl p-6 transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <h4
          className="text-xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Product Information
        </h4>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ color: colors.text.secondary }}
        >
          <div>
            <span
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              Category:
            </span>
            <span className="ml-2 capitalize">
              {product.category?.replace("-", " ")}
            </span>
          </div>
          <div>
            <span
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              Brand:
            </span>
            <span className="ml-2">{product.brand || product.company}</span>
          </div>
          <div>
            <span className="text-orange-400 font-medium">Version:</span>
            <span className="ml-2">{product.version}</span>
          </div>
          {product.status && (
            <div>
              <span className="text-orange-400 font-medium">Status:</span>
              <span
                className={`ml-2 capitalize ${product.status === "active" ? "text-green-400" : "text-yellow-400"}`}
              >
                {product.status}
              </span>
            </div>
          )}
          {product.isBestSeller && (
            <div>
              <span className="text-orange-400 font-medium">Badge:</span>
              <span className="ml-2 text-yellow-400">⭐ Best Seller</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
