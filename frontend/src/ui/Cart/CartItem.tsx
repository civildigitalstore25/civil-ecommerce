import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem as CartItemType } from "../../types/cartTypes";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  getLicenseBadgeStyle,
  getLicenseLabel,
} from "./cartItemLicenseDisplay";
import { useCartItemQuantityDom } from "./useCartItemQuantityDom";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const navigate = useNavigate();

  const {
    quantityDisplayRef,
    totalPriceRef,
    decreaseButtonRef,
    handleIncrease,
    handleDecrease,
  } = useCartItemQuantityDom({
    item,
    formatPriceWithSymbol,
    onUpdateQuantity,
  });

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  return (
    <div
      className="rounded-lg sm:rounded-xl border p-3 sm:p-6 hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex flex-row flex-wrap items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-md sm:rounded-lg overflow-hidden transition-colors duration-200"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm sm:text-lg font-semibold truncate transition-colors duration-200"
                style={{
                  color: colors.text.primary,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  if (item.product._id) {
                    navigate(`/product/${item.product._id}`);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                {item.product.name}
              </h3>
              <p
                className="text-xs sm:text-sm transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {item.product.company
                  ? item.product.company.charAt(0).toUpperCase() +
                    item.product.company.slice(1)
                  : ""}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="hover:scale-110 transition-all duration-200 flex-shrink-0"
              style={{ color: colors.text.accent }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.status.error;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.accent;
              }}
              aria-label="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-2 sm:mb-3">
            <span
              className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-colors duration-200"
              style={getLicenseBadgeStyle(
                colors,
                item.licenseType,
                item.subscriptionPlan,
              )}
            >
              {getLicenseLabel(item.licenseType, item.subscriptionPlan)}
            </span>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <p
                className="text-xs font-medium mb-2 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Quantity
              </p>
              <div
                className="inline-flex items-center border rounded-lg transition-colors duration-200"
                style={{ borderColor: colors.border.primary }}
              >
                <button
                  ref={decreaseButtonRef}
                  onClick={handleDecrease}
                  className="p-1 sm:p-2 transition-colors disabled:opacity-50"
                  style={{ color: colors.text.primary }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor =
                        colors.interactive.secondaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  disabled={item.quantity <= 1}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span
                  ref={quantityDisplayRef}
                  className="px-3 py-1 text-sm font-medium min-w-[2.25rem] text-center transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 sm:p-2 transition-colors"
                  style={{ color: colors.text.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.interactive.secondaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 sm:text-right">
              <p
                className="text-xs font-medium mb-1 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Price
              </p>
              <div
                ref={totalPriceRef}
                className="text-base sm:text-xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                {formatPriceWithSymbol(item.totalPrice)}
              </div>
              <div
                className="text-xs sm:text-sm transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {formatPriceWithSymbol(item.price)} each
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
