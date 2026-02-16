import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import CartItem from "./CartItem";
import CartEmpty from "./CartEmpty";
import { X } from "lucide-react";
import FormButton from "../../components/Button/FormButton";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CartSidebar: React.FC = () => {
  const { items, summary, isCartOpen, closeCart, updateQuantity, removeItem, clearCart, isLoading } =
    useCartContext();
  const navigate = useNavigate();

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear cart!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      clearCart();
      Swal.fire("Cleared!", "Your cart has been cleared.", "success");
    }
  };

  const handleRemoveItem = async (itemId: string, productName: string) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: `Are you sure you want to remove ${productName} from your cart?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      removeItem(itemId);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout", { state: { items, summary } });
  };

  return (
    // Backdrop and drawer
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isCartOpen}
        onClick={() => closeCart()}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer (right side) */}
      <aside
        role="dialog"
        aria-label="Cart drawer"
        className={`fixed right-0 top-0 h-full z-50 transform transition-transform duration-300 shadow-2xl w-[92vw] md:w-[420px] lg:w-[520px] flex flex-col bg-[var(--bg-primary)] border-l border-[var(--border-primary)] pb-15 md:pb-0`}
        style={{ transform: isCartOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Your Cart
            </h3>
            <div className="text-sm text-[var(--text-secondary)]">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm font-medium mr-2 text-[var(--status-error)]"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => closeCart()}
              aria-label="Close cart"
              className="p-2 rounded hover:bg-gray-100/20"

            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <CartEmpty onContinueShopping={() => closeCart()} />
          ) : (
            items.map((it) => (
              <CartItem
                key={it.id}
                item={it}
                onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                onRemoveItem={(id) => handleRemoveItem(id, it.product.name)}
              />
            ))
          )}
        </div>
        {/* Order Summary removed from drawer; persistent bottom bar remains below */}

        {/* Bottom action bar - always visible on drawer */}
        {items.length > 0 && (
          <div className="sticky bottom-0 z-60 p-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-[var(--text-secondary)]">Subtotal ({summary.itemCount} items)</div>
                <div className="text-lg font-bold text-[var(--text-primary)]">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(summary.total)}</div>
              </div>

              <div className="flex-shrink-0 w-40">
                <FormButton
                  variant="primary"
                  className="w-full py-3 text-base"
                  onClick={handleCheckout}
                  disabled={isLoading || summary.itemCount === 0}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </FormButton>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
