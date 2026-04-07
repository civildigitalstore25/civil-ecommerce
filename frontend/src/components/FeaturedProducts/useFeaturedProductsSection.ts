import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useProducts } from "../../api/productApi";
import { useUser } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { filterFeaturedProductsForStorefront } from "./filterFeaturedProductsForStorefront";
import {
  getFeaturedProductsBadgeTextColor,
  getFeaturedProductsInteractiveTint,
} from "./featuredProductsInteractiveTint";

export function useFeaturedProductsSection(limit: number) {
  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts({});
  const products = data.products || [];
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();

  const interactiveTint = getFeaturedProductsInteractiveTint(colors);
  const badgeTextColor = getFeaturedProductsBadgeTextColor(colors);

  const handleAddToCart = async (
    product: Parameters<typeof addItem>[0],
    licenseType: "1year" = "1year",
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product, licenseType, 1);
      void Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch {
      void Swal.fire({
        title: "Error",
        text: "Failed to add item to cart",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const visibleProducts = filterFeaturedProductsForStorefront(products);
  const displayedProducts = visibleProducts.slice(0, limit);

  return {
    displayedProducts,
    colors,
    interactiveTint,
    badgeTextColor,
    navigate,
    handleAddToCart,
  };
}
