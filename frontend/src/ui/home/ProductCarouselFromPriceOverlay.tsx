import type { Product } from "../../api/types/productTypes";
import type { CurrencyContextType } from "../../contexts/CurrencyContext";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import { getMinimumProductPrice } from "../../utils/productPricing";

type Props = {
  colors: Pick<ThemeColors, "background" | "border" | "text">;
  formatPriceWithSymbol: CurrencyContextType["formatPriceWithSymbol"];
  product: Product;
};

export function ProductCarouselFromPriceOverlay({
  colors,
  formatPriceWithSymbol,
  product,
}: Props) {
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
}
