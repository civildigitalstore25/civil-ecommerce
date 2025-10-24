import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { CartItem, CartSummary, CartEmpty } from '../ui/Cart';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import Swal from 'sweetalert2';
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, summary, isLoading, removeItem, updateQuantity, clearCart } = useCartContext();
  const { colors } = useAdminTheme();

  const handleCheckout = () => {
    // Navigate to checkout page (to be implemented)
    navigate('/checkout', {
      state: { items, summary }
    });
  };

  const handleContinueShopping = () => {
    navigate('/'); // Navigate to home page
  };
  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove all items from your cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear cart!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      clearCart();
      Swal.fire('Cleared!', 'Your cart has been cleared.', 'success');
    }
  };

  const handleRemoveItem = async (itemId: string, productName: string) => {
    const result = await Swal.fire({
      title: 'Remove Item?',
      text: `Are you sure you want to remove ${productName} from your cart?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      removeItem(itemId);
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                Shopping Cart
              </h1>
              <p
                className="mt-1 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {items.length > 0
                  ? `${summary.itemCount} item${summary.itemCount !== 1 ? 's' : ''} in your cart`
                  : 'Your cart is empty'
                }
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="font-medium text-sm transition-all duration-200 hover:scale-105"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="rounded-xl border p-6 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary
                }}
              >
                <h2
                  className="text-xl font-semibold mb-6 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Cart Items ({items.length})
                </h2>

                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={() => handleRemoveItem(item.id, item.product.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Cart Features */}
              <div
                className="rounded-xl border p-6 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Cart Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.status.success + '20' }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: colors.status.success }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        Instant Download
                      </h4>
                      <p
                        className="text-xs transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        Get your software immediately
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.interactive.primary + '20' }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: colors.interactive.primary }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        Genuine License
                      </h4>
                      <p
                        className="text-xs transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        100% authentic software
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.status.warning + '20' }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: colors.status.warning }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        24/7 Support
                      </h4>
                      <p
                        className="text-xs transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        Expert help when you need it
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary
                summary={summary}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Recently Viewed or Recommendations */}
        {items.length > 0 && (
          <div className="mt-12">
            <div
              className="rounded-xl border p-6 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                You might also like
              </h3>
              <div className="text-center py-8">
                <p
                  className="mb-4 transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                >
                  Recommendations will be shown here based on your cart items
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="font-medium transition-colors duration-200"
                  style={{ color: colors.interactive.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.interactive.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.interactive.primary;
                  }}
                >
                  Browse more software →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
