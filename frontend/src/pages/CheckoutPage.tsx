import BillingForm from "../ui/checkout/BillingForm";
import OrderSummary from "../ui/checkout/OrderSummary";
import { CheckoutSavedAddresses } from "./checkout/CheckoutSavedAddresses";
import { CheckoutPageHelmet } from "./checkout/CheckoutPageHelmet";
import { useCheckoutPage } from "./checkout/useCheckoutPage";

const CheckoutPage = () => {
  const page = useCheckoutPage();

  return (
    <>
      <CheckoutPageHelmet
        title={page.seoData.title}
        description={page.seoData.description}
        keywords={page.seoData.keywords}
      />
      <div
        className="min-h-screen py-10 px-4 sm:px-6 md:px-12 pt-20"
        style={{ backgroundColor: page.colors.background.primary }}
      >
        <h1
          className="text-3xl font-bold mb-8 text-center mt-5"
          style={{ color: page.colors.text.primary }}
        >
          Checkout
        </h1>

        <form
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
          onSubmit={page.handleSubmit(page.handlePlaceOrder)}
        >
          <div className="space-y-6">
            {!page.loadingAddresses && (
              <CheckoutSavedAddresses
                savedAddresses={page.savedAddresses}
                selectedAddressId={page.selectedAddressId}
                colors={page.colors}
                onSelectAddress={page.handleSelectAddress}
                onDeleteAddress={page.handleDeleteAddress}
              />
            )}

            <BillingForm
              register={page.register}
              errors={page.errors}
              control={page.control}
              colors={page.colors}
              setValue={page.setValue}
            />
          </div>
          <OrderSummary
            cartItems={page.cartItems}
            summary={{
              subtotal: page.summary.subtotal,
              discount: page.discount,
              total: page.summary.subtotal - page.discount,
              itemCount: page.summary.itemCount,
            }}
            colors={page.colors}
            normalizePrice={page.normalizePrice}
            formatPriceWithSymbol={page.formatPriceWithSymbol}
            isProcessing={page.isProcessing}
            couponCode={page.couponCode}
            setCouponCode={page.setCouponCode}
            applyCoupon={page.applyCoupon}
          />
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
