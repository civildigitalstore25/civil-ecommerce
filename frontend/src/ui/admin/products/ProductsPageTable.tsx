import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Product } from "../../../api/types/productTypes";
import ProductTableRow from "./ProductTableRow";

type Props = {
  colors: ThemeColors;
  products: Product[];
  selectedProducts: string[];
  onSelectAll: () => void;
  onSelectProduct: (id: string) => void;
  onToggleBestSeller: (product: Product) => void;
  onToggleOutOfStock: (product: Product) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
};

const ProductsPageTable: React.FC<Props> = ({
  colors,
  products,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onToggleBestSeller,
  onToggleOutOfStock,
  onView,
  onEdit,
  onDelete,
}) => (
  <div
    className="overflow-hidden transition-colors duration-200"
    style={{ backgroundColor: colors.background.secondary }}
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead
          className="border-b transition-colors duration-200"
          style={{ borderBottomColor: colors.border.primary }}
        >
          <tr>
            <th
              className="text-center py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                onChange={onSelectAll}
                className="rounded"
              />
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Product
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Brand
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Category
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Pricing
            </th>
            <th
              className="text-center py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Best Seller
            </th>
            <th
              className="text-center py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Out of Stock
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y transition-colors duration-200"
          style={{ borderColor: colors.border.secondary }}
        >
          {products.map((product) => (
            <ProductTableRow
              key={product._id ?? product.name}
              colors={colors}
              product={product}
              selectedProducts={selectedProducts}
              onSelectProduct={onSelectProduct}
              onToggleBestSeller={onToggleBestSeller}
              onToggleOutOfStock={onToggleOutOfStock}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductsPageTable;
