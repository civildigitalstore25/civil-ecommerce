import { Star } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import { getMinimumProductPrice } from "../../utils/productPricing";
import { buildFeaturedProductSlug } from "./buildFeaturedProductSlug";

type FeaturedProductCardProps = {
  product: any;
  colors: ThemeColors;
  interactiveTint: string;
  badgeTextColor: string;
  formatPriceWithSymbol: (inr: number, usd: number) => string;
  navigate: NavigateFunction;
  onAddToCart: (product: any) => void;
};

export function FeaturedProductCard({
  product,
  colors,
  interactiveTint,
  badgeTextColor,
  formatPriceWithSymbol,
  navigate,
  onAddToCart,
}: FeaturedProductCardProps) {
  return (
    <div
      className="group rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02]"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        border: `1.5px solid ${colors.border.primary}`,
      }}
    >
      <div
        className="rounded-md md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={() => {
          navigate(`/product/${buildFeaturedProductSlug(product)}`);
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
        />

        {(() => {
          const min = getMinimumProductPrice(product);
          if (!min) return null;
          const label = formatPriceWithSymbol(
            min.priceINR ?? 0,
            min.priceUSD ?? 0,
          );
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
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border border-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-0.5 md:space-x-1.5">
                  <Star className="w-2 h-2 md:w-3.5 md:h-3.5 fill-current text-yellow-100 animate-pulse" />
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

      <div className="flex flex-wrap gap-1 md:gap-2 mb-1.5 md:mb-2">
        <span
          className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200 font-medium"
          style={{
            backgroundColor: interactiveTint,
            color: badgeTextColor,
          }}
        >
          {product.category
            ? product.category.charAt(0).toUpperCase() +
              product.category.slice(1)
            : ""}
        </span>
        <span
          className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200 font-medium"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.secondary,
          }}
        >
          {product.company
            ? product.company.charAt(0).toUpperCase() +
              product.company.slice(1)
            : ""}
        </span>
      </div>

      <h2
        className="text-[11px] md:text-lg font-semibold mb-1 md:mb-1 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]"
        style={{ color: colors.text.primary }}
      >
        {product.name}
        {product.version && (
          <span
            className="font-normal ml-1 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            ({product.version})
          </span>
        )}
      </h2>

      <div className="flex flex-col gap-1.5 md:gap-2 mt-auto">
        <button
          type="button"
          className="w-full font-bold rounded-md md:rounded-lg py-1.5 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
          style={{
            ...(product.isOutOfStock
              ? {
                  background: colors.background.accent,
                  color: colors.status.error,
                  border: `1px solid ${colors.status.error}`,
                  cursor: "not-allowed",
                }
              : {
                  background: "#0068ff",
                  color: "#fff",
                  border: "1.5px solid #0068ff",
                }),
          }}
          onMouseEnter={(e) => {
            if (!product.isOutOfStock) {
              e.currentTarget.style.background = colors.interactive.primaryHover;
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            if (!product.isOutOfStock) {
              e.currentTarget.style.background = "#0068ff";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onClick={() => onAddToCart(product)}
          disabled={product.isOutOfStock}
        >
          {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
