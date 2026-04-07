import React from "react";
import { Award, Edit, Eye, Star, Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Product } from "../../../api/types/productTypes";
import ProductTablePricingCell from "./ProductTablePricingCell";

type Props = {
  colors: ThemeColors;
  product: Product;
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
  onToggleBestSeller: (product: Product) => void;
  onToggleOutOfStock: (product: Product) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
};

const ProductTableRow: React.FC<Props> = ({
  colors,
  product,
  selectedProducts,
  onSelectProduct,
  onToggleBestSeller,
  onToggleOutOfStock,
  onView,
  onEdit,
  onDelete,
}) => {
  const pid = product._id;
  if (!pid) return null;

  return (
    <tr
      className="transition-colors duration-200"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <td className="py-4 px-4 text-center">
        <input
          type="checkbox"
          checked={selectedProducts.includes(pid)}
          onChange={() => onSelectProduct(pid)}
          className="rounded"
        />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden relative"
            style={{ backgroundColor: colors.background.accent }}
          >
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div
                className="font-medium truncate"
                style={{ color: colors.text.primary }}
              >
                {product.name}
              </div>
              {product.isBestSeller && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-black">
                  Best Seller
                </span>
              )}
            </div>
            <div
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              v{product.version}
            </div>
            {product.rating && (
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span
                  className="text-xs"
                  style={{ color: colors.text.primary }}
                >
                  {product.rating}
                </span>
                {product.ratingCount && (
                  <span
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    ({product.ratingCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div style={{ color: colors.text.primary }}>
          {product.brand || product.company
            ? (product.brand || product.company).charAt(0).toUpperCase() +
              (product.brand || product.company).slice(1)
            : ""}
        </div>
        {product.company !== product.brand && product.brand && (
          <div
            className="text-xs"
            style={{ color: colors.text.secondary }}
          >
            {product.company
              ? product.company.charAt(0).toUpperCase() +
                product.company.slice(1)
              : ""}
          </div>
        )}
      </td>
      <td className="py-4 px-4">
        <span
          className="inline-block text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: colors.background.accent,
            color: colors.text.primary,
          }}
        >
          {product.category
            ? product.category.charAt(0).toUpperCase() +
              product.category.slice(1)
            : ""}
        </span>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: colors.background.accent,
                  color: colors.text.secondary,
                }}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </td>
      <td className="py-4 px-4">
        <ProductTablePricingCell colors={colors} product={product} />
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-center items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={product.isBestSeller || false}
              onChange={() => onToggleBestSeller(product)}
              className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ accentColor: colors.interactive.primary }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: colors.text.secondary }}
            >
              {product.isBestSeller ? "Yes" : "No"}
            </span>
          </label>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-center items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={product.isOutOfStock || false}
              onChange={() => onToggleOutOfStock(product)}
              className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ accentColor: colors.interactive.primary }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: colors.text.secondary }}
            >
              {product.isOutOfStock ? "Yes" : "No"}
            </span>
          </label>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-yellow-400"
            onClick={() => onView(product)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-green-400"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-red-400"
            onClick={() => onDelete(pid, product.name)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
