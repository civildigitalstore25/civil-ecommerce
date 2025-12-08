import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useProducts } from "../../api/productApi";
import { useUser } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import Swal from "sweetalert2";

interface FeaturedProductsProps {
  limit?: number;
  showCount?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  limit = 6,
  showCount = false,
}) => {
  // Fetch all products (no category filter - for homepage featured products)
  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts({});
  const products = data.products || [];
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();

  const handleAddToCart = async (
    product: any,
    licenseType: "1year" = "1year",
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product, licenseType, 1);
      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
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

  // Limit the number of products displayed (for featured section)
  const displayedProducts = products.slice(0, limit);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <div className="transition-colors duration-200 w-full">
      <div className="w-full pt-0 pb-3 md:py-6 px-0">
        {showCount && (
          <p
            className="text-sm md:text-lg mb-2 md:mb-4 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {displayedProducts.length} featured product
            {displayedProducts.length !== 1 && "s"}
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-8">
          {displayedProducts.map((product: any) => (
            <div
              key={product._id}
              className="rounded-none md:rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-3 md:p-5 flex flex-col hover:scale-[1.02]"
              style={{
                backgroundColor: colors.background.primary,
                aspectRatio: '1 / 1', // Make card square
                width: '100%', // Full width in grid cell
                maxWidth: '400px', // Optional: limit max width for large screens
                margin: '0 auto', // Center in grid cell
              }}
            >
              {/* Image */}
              <div
                className="rounded-lg md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
                style={{ backgroundColor: colors.background.secondary }}
                onClick={() => {
                  const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;
                  navigate(`/product/${slug}`);
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                {/* Best Seller Ribbon */}
                {product.isBestSeller && (
                  <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 transform transition-all duration-300 hover:scale-110">
                    <div className="relative">
                      {/* Main ribbon */}
                      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border md:border-2 border-white/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-0.5 md:space-x-1.5">
                          <Star className="w-2 h-2 md:w-3.5 md:h-3.5 fill-current text-yellow-100 animate-pulse" />
                          <span className="tracking-wide hidden md:inline">BEST SELLER</span>
                          <span className="tracking-wide md:hidden">BEST</span>
                        </div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-full blur-sm opacity-20 -z-10"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 md:gap-2 mb-1 md:mb-2">
                <span
                  className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary,
                  }}
                >
                  {product.category}
                </span>
                <span
                  className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    color: colors.text.secondary,
                  }}
                >
                  {product.company}
                </span>
              </div>

              {/* Name */}
              <h2
                className="text-xs md:text-lg font-semibold mb-0.5 md:mb-1 transition-colors duration-200 line-clamp-2"
                style={{ color: colors.text.primary }}
              >
                {product.name}
                {product.version && (
                  <span
                    className="font-normal transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                  >
                    ({product.version})
                  </span>
                )}
              </h2>

              {/* Stars & Ratings */}
              <div className="flex items-center text-[10px] md:text-sm mb-1 md:mb-2">
                <span className="text-yellow-400 mr-0.5 md:mr-1">
                  {"★".repeat(Math.round(product.rating || 4))}{" "}
                </span>
                <span
                  className="transition-colors duration-200"
                  style={{ color: colors.text.accent }}
                >
                  {product.ratingCount ? `(${product.ratingCount})` : ""}
                </span>
              </div>



              {/* Actions */}
              <div className="flex flex-col gap-1 md:gap-2 mt-auto">
                <button
                  onClick={() => {
                    const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;
                    navigate(`/product/${slug}`);
                  }}
                  className="w-full border font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  BUY NOW
                </button>
                <button
                  className="w-full rounded-md md:rounded-lg py-1 md:py-2 font-semibold text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`,
                    color: colors.background.primary,
                  }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
