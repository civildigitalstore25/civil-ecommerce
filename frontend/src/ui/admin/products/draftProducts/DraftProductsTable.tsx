import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Product } from "../../../../api/types/productTypes";
import AdminPagination from "../../components/AdminPagination";
import { DraftProductsTableLoading } from "./DraftProductsTableLoading";
import { DraftProductsTableEmpty } from "./DraftProductsTableEmpty";
import { DraftProductsTableRow } from "./DraftProductsTableRow";

type Props = {
  colors: ThemeColors;
  isLoading: boolean;
  products: Product[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export function DraftProductsTable({
  colors,
  isLoading,
  products,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden border transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      {isLoading ? (
        <DraftProductsTableLoading colors={colors} />
      ) : products.length === 0 ? (
        <DraftProductsTableEmpty colors={colors} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.text.secondary,
                }}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: colors.border.primary }}
              >
                {products.map((product) => (
                  <DraftProductsTableRow
                    key={product._id}
                    product={product}
                    colors={colors}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="px-6 py-4 border-t transition-colors duration-200"
            style={{ borderColor: colors.border.primary }}
          >
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
