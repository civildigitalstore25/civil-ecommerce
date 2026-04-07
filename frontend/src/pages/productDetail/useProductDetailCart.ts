import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { Product } from "../../api/types/productTypes";
import { getProductDetailCartLicenseType } from "./productDetailCartLicense";

interface UseProductDetailCartProps {
  product: Product | undefined;
  slug: string | undefined;
  selectedOption: any;
  selectedLicense: string;
  userHasSelectedPlan: boolean;
  user: any;
  colors: any;
  addItem: any;
  isItemInCart: any;
}

export function useProductDetailCart({
  product,
  slug,
  selectedOption,
  selectedLicense,
  userHasSelectedPlan,
  user,
  colors,
  addItem,
  isItemInCart,
}: UseProductDetailCartProps) {
  const navigate = useNavigate();
  const pricingRef = useRef<HTMLDivElement | null>(null);

  const handleAddToCart = async () => {
    if (!userHasSelectedPlan || !selectedOption) {
      await Swal.fire({
        title: "Select Pricing Plan",
        text: "Please select a pricing plan before adding to cart",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: colors.interactive.primary,
      });
      return;
    }

    if (!user) {
      navigate("/login", { state: { returnTo: `/product/${slug}` } });
      return;
    }

    const cartLicenseType = getProductDetailCartLicenseType(
      selectedLicense,
      selectedOption
    );

    const isInCart = product ? isItemInCart(product._id!, cartLicenseType) : false;

    if (isInCart) {
      Swal.fire({
        title: "Already in Cart",
        text: `${product?.name} is already in your cart with ${selectedOption?.label} license`,
        icon: "info",
        confirmButtonText: "View Cart",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
      return;
    }

    if (
      product &&
      selectedOption &&
      (selectedOption.priceINR > 0 || selectedOption.priceUSD > 0 || selectedOption.id === "free")
    ) {
      try {
        const productWithSelectedPrice = {
          ...product,
          _selectedPlanDetails: {
            planId: selectedOption.id,
            planLabel: selectedOption.label,
            planPrice: selectedOption.priceINR,
            planType: selectedOption.type,
          },
        };

        if (cartLicenseType === "1year") {
          productWithSelectedPrice.price1INR = selectedOption.priceINR;
          productWithSelectedPrice.price1 = selectedOption.priceINR;
        } else if (cartLicenseType === "3year") {
          productWithSelectedPrice.price3INR = selectedOption.priceINR;
          productWithSelectedPrice.price3 = selectedOption.priceINR;
        } else if (cartLicenseType === "lifetime") {
          productWithSelectedPrice.lifetimePriceINR = selectedOption.priceINR;
          productWithSelectedPrice.priceLifetime = selectedOption.priceINR;
        }

        const subscriptionPlanDetails = {
          planId: selectedOption.id,
          planLabel: selectedOption.label,
          planType: selectedOption.type ?? "yearly",
        };

        await addItem(
          productWithSelectedPrice,
          cartLicenseType,
          1,
          subscriptionPlanDetails
        );

        Swal.fire({
          title: "Added to Cart!",
          text: `${product.name} has been added to your cart with ${selectedOption.label}`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Cart",
          cancelButtonText: "Continue Shopping",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/cart");
          }
        });
      } catch (error) {
        console.error("Add to cart error:", error);
        Swal.fire(
          "Error",
          "Failed to add item to cart. Please try again.",
          "error"
        );
      }
    } else {
      Swal.fire("Error", "Please select a valid pricing option.", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!userHasSelectedPlan || !selectedOption) {
      if (pricingRef.current) {
        pricingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setTimeout(async () => {
        await Swal.fire({
          title: "Select Pricing Plan",
          text: "Please select a pricing plan before proceeding",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: colors.interactive.primary,
        });
      }, 500);

      return;
    }

    if (!user) {
      navigate("/signin", { state: { returnTo: `/product/${slug}` } });
      return;
    }

    const cartItem = {
      _id: product?._id,
      product: {
        _id: product?._id,
        name: product?.name,
        imageUrl: product?.imageUrl || product?.image,
        brand: product?.brand || product?.company,
      },
      licenseType: getProductDetailCartLicenseType(selectedLicense, selectedOption),
      quantity: 1,
      price: selectedOption.priceINR,
      priceUSD: selectedOption.priceUSD,
      totalPrice: selectedOption.priceINR,
      subscriptionPlanDetails: {
        planId: selectedOption.id,
        planLabel: selectedOption.label,
        planType: selectedOption.type,
      },
    };

    navigate("/checkout", {
      state: {
        items: [cartItem],
        summary: {
          subtotal: selectedOption.priceINR,
          discount: 0,
          total: selectedOption.priceINR,
          itemCount: 1,
        },
      },
    });
  };

  return {
    pricingRef,
    handleAddToCart,
    handleBuyNow,
  };
}
