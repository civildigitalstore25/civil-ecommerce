import type { Product } from "../../api/types/productTypes";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { NavigateFunction } from "react-router-dom";
import { getMinimumProductPrice } from "../../utils/productPricing";

interface RelatedProductCardProps {
  product: Product;
  colors: ThemeColors;
  interactiveTint: string;
  formatPriceWithSymbol: (inr: number, usd?: number) => string;
  navigate: NavigateFunction;
  onAddToCart: (product: Product) => void;
}

function productSlug(product: Product): string {
  const versionPart = product.version?.trim()
    ? `-${product.version.toString().trim().toLowerCase()}`
    : "";
  return `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
}

export function RelatedProductCard({
  product,
  colors,
  interactiveTint,
  formatPriceWithSymbol,
  navigate,
  onAddToCart,
}: RelatedProductCardProps) {
  const slug = productSlug(product);

  return (
    <div
      className="group flex-shrink-0 w-[260px] md:w-[280px] snap-start rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02] border"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div
        className="rounded-lg md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={() => navigate(`/product/${slug}`)}
      >
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
        />

        {(() => {
          const min = getMinimumProductPrice(product);
          if (!min) return null;
          const label = formatPriceWithSymbol(min.priceINR, min.priceUSD);
          return (
            <div className="absolute inset-x-2 bottom-2 flex justify-center pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
              <div
                className="text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm"
                style={{
                  backgroundColor: colors.background.primary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary,
                }}
              >
                From {label}
              </div>
            </div>
          );
        })()}

        {product.isBestSeller && (
          <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 transform transition-all duration-300 hover:scale-110">
            <div className="relative">
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border md:border-2 border-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-0.5 md:space-x-1.5">
                  <span className="tracking-wide hidden md:inline">
                    BEST SELLER
                  </span>
                  <span className="tracking-wide md:hidden">BEST</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-full blur-sm opacity-20 -z-10" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 md:gap-2 mb-1 md:mb-2">
        <span
          className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: interactiveTint,
            color:
              typeof colors.interactive.primary === "string" &&
              colors.interactive.primary.startsWith("linear-gradient")
                ? colors.interactive.secondary
                : colors.interactive.primary,
          }}
        >
          {product.category
            ? product.category.charAt(0).toUpperCase() +
              product.category.slice(1)
            : ""}
        </span>
        <span
          className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.secondary,
          }}
        >
          {(() => {
            const brandOrCompany = product.company || product.brand || "";
            return brandOrCompany
              ? brandOrCompany.charAt(0).toUpperCase() +
                  brandOrCompany.slice(1)
              : "";
          })()}
        </span>
      </div>

      <h2
        className="text-xs md:text-lg font-semibold mb-0.5 md:mb-1 transition-colors duration-200 line-clamp-2"
        style={{ color: colors.text.primary }}
      >
        {product.name}
        {product.version && (
          <span
            className="font-normal transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {" "}
            ({product.version})
          </span>
        )}
      </h2>

      <div className="flex flex-col gap-1 md:gap-2 mt-auto">
        <button
          type="button"
          onClick={() => navigate(`/product/${slug}`)}
          className="w-full border font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
          style={{
            borderColor: colors.border.primary,
            color: colors.text.primary,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          View Details
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
