import React from "react";
import * as LucideIcons from "lucide-react";
import type { ProductDetailPurchaseActionsBlockProps } from "./types";

export const ProductDetailPurchaseActionsBlock: React.FC<
  ProductDetailPurchaseActionsBlockProps
> = ({
  actionRef,
  colors,
  user,
  onEditClick,
  isOutOfStock,
  isActiveFreeProduct,
  onAddToCart,
  onBuyNow,
  isInCart,
  cartQuantity,
  onSiteEnquiry,
}) => {
  return (
    <div ref={actionRef} className="mt-4">
      {user?.role === "admin" && (
        <button
          type="button"
          onClick={onEditClick}
          className="w-full font-bold py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow mb-3"
          style={{
            background: "#FF6B35",
            color: "#fff",
            border: "1.5px solid #FF6B35",
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FF5722";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FF6B35";
            e.currentTarget.style.color = "#fff";
          }}
        >
          <LucideIcons.Edit size={20} />
          Edit Product
        </button>
      )}
      {isOutOfStock ? (
        <div
          className="w-full font-bold py-4 rounded-lg text-center text-lg"
          style={{
            background: colors.background.accent,
            color: colors.status.error,
            border: `2px solid ${colors.status.error}`,
          }}
        >
          Out of Stock
        </div>
      ) : (
        <>
          <div className="hidden lg:block space-y-2">
            <div className="flex gap-2">
              {!isActiveFreeProduct && (
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="flex-1 font-bold py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow"
                  style={{
                    background: colors.interactive.primary,
                    color: "#fff",
                    border: `1.5px solid ${colors.interactive.primary}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.interactive.primaryHover;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.interactive.primary;
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  <LucideIcons.ShoppingCart size={20} />
                  {isInCart ? `In Cart (${cartQuantity})` : "Add to Cart"}
                </button>
              )}
              <button
                type="button"
                onClick={onBuyNow}
                className="flex-1 border font-bold py-2.5 lg:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow"
                style={{
                  border: `1.5px solid ${colors.interactive.primary}`,
                  color: "#fff",
                  background: colors.interactive.primary,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.interactive.primaryHover;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.interactive.primary;
                  e.currentTarget.style.color = "#fff";
                }}
              >
                <LucideIcons.Zap size={20} />
                Buy Now
              </button>
            </div>
            <button
              type="button"
              onClick={onSiteEnquiry}
              className="w-full font-bold py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow"
              style={{
                background: colors.interactive.primary,
                color: "#fff",
                border: `1.5px solid ${colors.interactive.primary}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.interactive.primaryHover;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.interactive.primary;
                e.currentTarget.style.color = "#fff";
              }}
            >
              <LucideIcons.MessageSquare size={20} />
              Enquiry
            </button>
            <h5
              className="text-small text-center pt-1 font-bold"
              style={{ color: colors.text.secondary }}
            >
              Instant Download Available in My Orders Page After Purchase.
            </h5>
          </div>

          <div
            className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-2 py-3 border-t shadow-lg"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              position: "fixed",
              bottom: "64px",
              left: 0,
              right: 0,
            }}
          >
            <p className="font-bold" style={{ color: colors.text.secondary }}>
              Instant download in My Orders page after purchase.
            </p>
            <div className="flex gap-1.5">
              {!isActiveFreeProduct && (
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="flex-1 font-bold py-2.5 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center gap-1"
                  style={{
                    background: colors.interactive.primary,
                    color: "#fff",
                    border: `1.5px solid ${colors.interactive.primary}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  }}
                >
                  <LucideIcons.ShoppingCart size={16} />
                  <span className="whitespace-nowrap">{isInCart ? "In Cart" : "Add"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onBuyNow}
                className="flex-1 font-bold py-2.5 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center gap-1"
                style={{
                  background: colors.interactive.primary,
                  color: "#fff",
                  border: `1.5px solid ${colors.interactive.primary}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                <LucideIcons.Zap size={16} />
                <span className="whitespace-nowrap">Buy Now</span>
              </button>
              <button
                type="button"
                onClick={onSiteEnquiry}
                className="flex-1 font-bold py-2.5 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center gap-1"
                style={{
                  background: colors.interactive.primary,
                  color: "#fff",
                  border: `1.5px solid ${colors.interactive.primary}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                <LucideIcons.MessageSquare size={16} />
                <span className="whitespace-nowrap">Enquiry</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
