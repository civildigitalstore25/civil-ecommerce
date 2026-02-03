import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useCartContext } from "../contexts/CartContext";
import { CartItem, CartSummary, CartEmpty } from "../ui/Cart";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import RelatedProducts from "../components/RelatedProducts";
import Swal from "sweetalert2";
import { getCartSEO } from "../utils/seo";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, summary, isLoading, removeItem, updateQuantity, clearCart } =
    useCartContext();
  const { colors } = useAdminTheme();

  const handleCheckout = () => {
    // Navigate to checkout page (to be implemented)
    navigate("/checkout", {
      state: { items, summary },
    });
  };

  const handleContinueShopping = () => {
    navigate("/"); // Navigate to home page
  };
  
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
  
  const seoData = getCartSEO();

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
        </Helmet>
        <div
          className="min-h-screen transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: colors.interactive.primary }}
            ></div>
            <p
              className="mt-4 transition-colors duration-200"
              style={{ color: colors.text.secondary }}
            >
              Loading your cart...
            </p>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div
      className="min-h-screen transition-colors duration-200 pt-16 sm:pt-20"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                Shopping Cart
              </h1>
              <p
                className="mt-1 text-sm sm:text-base transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {items.length > 0
                  ? `${summary.itemCount} item${summary.itemCount !== 1 ? "s" : ""} in your cart`
                  : "Your cart is empty"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                style={{ color: colors.status.error }}
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <CartEmpty onContinueShopping={handleContinueShopping} />
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="w-full lg:col-span-2 space-y-3 sm:space-y-4">
              <div
                className="rounded-lg sm:rounded-xl border p-3 sm:p-6 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <h2
                  className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Cart Items ({items.length})
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={() =>
                        handleRemoveItem(item.id, item.product.name)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary Sidebar - Fixed for mobile */}
            <div className="w-full lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
              <CartSummary
                summary={summary}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Related Products */}
        {items.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="mb-6">
              <h2
                className="text-xl sm:text-2xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                You might also like
              </h2>
            </div>
            <RelatedProducts currentProduct={items[0]?.product} limit={4} />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CartPage;