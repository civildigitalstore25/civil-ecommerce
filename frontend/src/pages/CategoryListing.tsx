import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useProducts } from '../api/productApi';
import { useUser } from '../api/userQueries';
import { useCartContext } from '../contexts/CartContext';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import Swal from 'sweetalert2';
interface CategoryListingProps {
  limit?: number;
  showCount?: boolean;
}
const CategoryListing: React.FC<CategoryListingProps> = ({ limit, showCount = true }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category") || "";
  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } = useProducts({ category });
  const products = data.products || [];
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();

  const handleAddToCart = async (product: any, licenseType: '1year' = '1year') => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addItem(product, licenseType, 1);
      Swal.fire({
        title: 'Added to Cart!',
        text: `${product.name} has been added to your cart`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add item to cart',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const displayedProducts = limit ? products.slice(0, limit) : products;


  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1
          className="text-3xl font-bold mb-1 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          {category}
        </h1>
        {showCount && (
          <p
            className="text-lg mb-4 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {displayedProducts.length} product
            {displayedProducts.length !== 1 && "s"} found
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedProducts.map((product: any) => (
            <div
              key={product._id}
              className="border rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col hover:scale-[1.02]"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary
              }}
            >
              {/* Image */}
              <div
                className="rounded-xl overflow-hidden h-52 mb-3 cursor-pointer transition-colors duration-200 relative"
                style={{ backgroundColor: colors.background.secondary }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                {/* Best Seller Ribbon */}
                {product.isBestSeller && (
                  <div className="absolute top-3 right-3 z-10 transform transition-all duration-300 hover:scale-110">
                    <div className="relative">
                      {/* Main ribbon */}
                      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-xs font-bold px-4 py-2 rounded-md shadow-2xl border-2 border-white/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-1.5">
                          <Star className="w-3.5 h-3.5 fill-current text-yellow-100 animate-pulse" />
                          <span className="tracking-wide">BEST SELLER</span>
                        </div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-full blur-sm opacity-20 -z-10"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className="text-xs px-2 py-1 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary
                  }}
                >
                  {product.category}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    color: colors.text.secondary
                  }}
                >
                  {product.company}
                </span>
              </div>

              {/* Name */}
              <h2
                className="text-lg font-semibold mb-1 transition-colors duration-200"
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

              {/* Description */}
              <p
                className="text-sm mb-2 line-clamp-2 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {product.description}
              </p>

              {/* Stars & Ratings */}
              <div className="flex items-center text-sm mb-2">
                <span className="text-yellow-400 mr-1">
                  {'★'.repeat(Math.round(product.rating || 4))}{' '}
                </span>
                <span
                  className="transition-colors duration-200"
                  style={{ color: colors.text.accent }}
                >
                  {product.ratingCount ? `(${product.ratingCount})` : ""}
                </span>
              </div>

              {/* Price Block */}
              <div
                className="font-semibold text-xl mb-1 transition-colors duration-200"
                style={{ color: colors.interactive.primary }}
              >
                ₹{product.price1?.toLocaleString()}/<span className="text-sm font-normal">year</span>
              </div>
              <div
                className="text-xs mb-4 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {product.price3 && (
                  <>3-year: ₹{product.price3?.toLocaleString()} • </>
                )}
                {product.priceLifetime && (
                  <>Lifetime: ₹{product.priceLifetime?.toLocaleString()}</>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full border font-medium rounded-lg py-2 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  BUY NOW
                </button>
                <button
                  className="w-full rounded-lg py-2 font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`,
                    color: colors.background.primary
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

export default CategoryListing;
