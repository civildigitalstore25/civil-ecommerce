import { Eye, Edit, Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Product } from "../../../../api/types/productTypes";
import { buildDraftProductPricingGroups } from "./draftProductPricingGroups";
import { DraftProductPricingCell } from "./DraftProductPricingCell";

type DraftProductsTableRowProps = {
  product: Product;
  colors: ThemeColors;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export function DraftProductsTableRow({
  product,
  colors,
  onView,
  onEdit,
  onDelete,
}: DraftProductsTableRowProps) {
  const pricingGroups = buildDraftProductPricingGroups(product);

  return (
    <tr
      className="transition-colors duration-200 hover:opacity-80"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium" style={{ color: colors.text.primary }}>
              {product.name}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {product.version}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4" style={{ color: colors.text.primary }}>
        {product.category}
      </td>
      <td className="px-6 py-4" style={{ color: colors.text.primary }}>
        {product.brand || product.company}
      </td>
      <td className="px-6 py-4">
        <DraftProductPricingCell
          colors={colors}
          pricingGroups={pricingGroups}
        />
      </td>
      <td className="px-6 py-4 text-sm" style={{ color: colors.text.secondary }}>
        {product.createdAt
          ? new Date(product.createdAt).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(product)}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${colors.status.info}20`,
              color: colors.status.info,
            }}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${colors.status.warning}20`,
              color: colors.status.warning,
            }}
            title="Edit & Publish"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${colors.status.error}20`,
              color: colors.status.error,
            }}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
