import React, { useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem as CartItemType } from "../../types/cartTypes";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import Swal from "sweetalert2";

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

  // Refs for direct DOM manipulation
  const quantityDisplayRef = useRef<HTMLSpanElement>(null);
  const totalPriceRef = useRef<HTMLDivElement>(null);
  const decreaseButtonRef = useRef<HTMLButtonElement>(null);

  // Store current quantity in ref to avoid re-renders
  const currentQuantityRef = useRef(item.quantity);

  // Update refs when item changes from external sources (initial load, etc.)
  useEffect(() => {
    currentQuantityRef.current = item.quantity;
    if (quantityDisplayRef.current) {
      quantityDisplayRef.current.textContent = item.quantity.toString();
    }
    if (totalPriceRef.current) {
      totalPriceRef.current.textContent = formatPriceWithSymbol(
        item.totalPrice,
      );
    }
    if (decreaseButtonRef.current) {
      decreaseButtonRef.current.disabled = item.quantity <= 1;
    }
  }, [item.quantity, item.totalPrice, formatPriceWithSymbol]);

  // Direct DOM update function - NO STATE CHANGE
  const updateUIDirectly = useCallback(
    (newQuantity: number) => {
      const newTotalPrice = newQuantity * item.price;

      // Update quantity display
      if (quantityDisplayRef.current) {
        quantityDisplayRef.current.textContent = newQuantity.toString();
      }

      // Update total price display
      if (totalPriceRef.current) {
        totalPriceRef.current.textContent =
          formatPriceWithSymbol(newTotalPrice);
      }

      // Update decrease button state
      if (decreaseButtonRef.current) {
        decreaseButtonRef.current.disabled = newQuantity <= 1;
      }

      // Update the ref
      currentQuantityRef.current = newQuantity;
    },
    [item.price, formatPriceWithSymbol],
  );

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity < 1) return;

      if (newQuantity > 10) {
        Swal.fire(
          "Maximum Quantity",
          "You can only add up to 10 of this item",
          "warning",
        );
        return;
      }

      // Update UI immediately without re-render
      updateUIDirectly(newQuantity);

      // Call API in background (this might cause parent re-render, but this component won't)
      onUpdateQuantity(item.id, newQuantity);
    },
    [item.id, onUpdateQuantity, updateUIDirectly],
  );

  const handleIncrease = useCallback(() => {
    handleQuantityChange(currentQuantityRef.current + 1);
  }, [handleQuantityChange]);

  const handleDecrease = useCallback(() => {
    handleQuantityChange(currentQuantityRef.current - 1);
  }, [handleQuantityChange]);

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  const getLicenseBadgeStyle = (
    licenseType: string,
    subscriptionPlan?: any,
  ) => {
    // If subscription plan details are available, use plan-specific styling
    if (subscriptionPlan && subscriptionPlan.planType) {
      switch (subscriptionPlan.planType) {
        case "admin-subscription":
          return {
            backgroundColor: `${colors.interactive.primary}20`,
            color: colors.interactive.primary,
          };
        case "subscription":
          return {
            backgroundColor: `${colors.status.success}20`,
            color: colors.status.success,
          };
        case "membership":
          return {
            backgroundColor: `${colors.interactive.secondary}20`,
            color: colors.interactive.secondary,
          };
        case "lifetime":
          return {
            backgroundColor: `${colors.interactive.secondary}20`,
            color: colors.interactive.secondary,
          };
        default:
          return {
            backgroundColor: `${colors.interactive.primary}20`,
            color: colors.interactive.primary,
          };
      }
    }

    // Otherwise, use generic license styling
    switch (licenseType) {
      case "1year":
        return {
          backgroundColor: `${colors.interactive.primary}20`,
          color: colors.interactive.primary,
        };
      case "3year":
        return {
          backgroundColor: `${colors.status.success}20`,
          color: colors.status.success,
        };
      case "lifetime":
        return {
          backgroundColor: `${colors.interactive.secondary}20`,
          color: colors.interactive.secondary,
        };
      default:
        return {
          backgroundColor: colors.background.secondary,
          color: colors.text.secondary,
        };
    }
  };

  const getLicenseLabel = (licenseType: string, subscriptionPlan?: any) => {
    // If subscription plan details are available, use them
    if (subscriptionPlan && subscriptionPlan.planLabel) {
      return subscriptionPlan.planLabel;
    }

    // Otherwise, use generic license labels
    switch (licenseType) {
      case "1year":
        return "1 Year License";
      case "3year":
        return "3 Year License";
      case "lifetime":
        return "Lifetime License";
      default:
        return "License";
    }
  };

  return (
    <div
      className="rounded-lg sm:rounded-xl border p-3 sm:p-6 hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 flex sm:block justify-center">
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

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header: Title and Remove Button */}
          <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm sm:text-lg font-semibold truncate transition-colors duration-200"
                style={{ color: colors.text.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  if (item.product._id) {
                    navigate(`/product/${item.product._id}`);
                  }
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                {item.product.name}
              </h3>
              <p
                className="text-xs sm:text-sm transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {item.product.company}
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

          {/* License Type Badge */}
          <div className="mb-2 sm:mb-3">
            <span
              className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-colors duration-200"
              style={getLicenseBadgeStyle(
                item.licenseType,
                item.subscriptionPlan,
              )}
            >
              {getLicenseLabel(item.licenseType, item.subscriptionPlan)}
            </span>
          </div>

          {/* Product Description */}
          <p
            className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {item.product.description}
          </p>

          {/* Bottom Section: Quantity and Price */}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            {/* Quantity Controls */}
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
                  className="p-2 transition-colors disabled:opacity-50"
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
                  className="px-4 py-2 font-medium min-w-[3rem] text-center transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-2 transition-colors"
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

            {/* Price */}
            <div className="flex-shrink-0 sm:text-right">
              <p
                className="text-xs font-medium mb-1 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Price
              </p>
              <div
                ref={totalPriceRef}
                className="text-lg sm:text-xl font-bold transition-colors duration-200"
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