import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailRichText } from "../ProductDetailRichText";

type ProductDetailTabDetailsProps = {
  colors: ThemeColors;
  product: Product;
};

export function ProductDetailTabDetails({
  colors,
  product,
}: ProductDetailTabDetailsProps) {
  return (
    <div>
      <h3
        className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6"
        style={{ color: colors.text.primary }}
      >
        Product Details
      </h3>
      <div
        className="rounded-xl lg:rounded-2xl p-4 lg:p-6 border transition-colors duration-200 overflow-hidden"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .product-details-content table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 1rem 0;
                      font-size: 0.875rem;
                      overflow-x: auto;
                      display: block;
                    }
                    .product-details-content table thead {
                      background-color: ${colors.background.tertiary || colors.background.accent};
                    }
                    .product-details-content table th,
                    .product-details-content table td {
                      padding: 0.75rem;
                      text-align: left;
                      border: 1px solid ${colors.border.primary};
                      color: ${colors.text.primary} !important;
                    }
                    .product-details-content table th {
                      font-weight: 600;
                      color: ${colors.text.primary} !important;
                    }
                    .product-details-content table tbody tr:hover {
                      background-color: transparent;
                    }
                    .product-details-content h1,
                    .product-details-content h2,
                    .product-details-content h3,
                    .product-details-content h4,
                    .product-details-content h5,
                    .product-details-content h6 {
                      color: ${colors.text.primary} !important;
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                      font-weight: 600;
                    }
                    .product-details-content p,
                    .product-details-content li,
                    .product-details-content span,
                    .product-details-content div {
                      color: ${colors.text.secondary} !important;
                    }
                    .product-details-content strong,
                    .product-details-content b {
                      color: ${colors.text.primary} !important;
                      font-weight: 600;
                    }
                    .product-details-content ul,
                    .product-details-content ol {
                      padding-left: 1.5rem;
                      margin: 1rem 0;
                    }
                    .product-details-content a {
                      color: ${colors.interactive.primary} !important;
                      text-decoration: underline;
                    }
                    @media (max-width: 768px) {
                      .product-details-content table {
                        font-size: 0.75rem;
                      }
                      .product-details-content table th,
                      .product-details-content table td {
                        padding: 0.5rem;
                      }
                    }
                  `,
          }}
        />
        <div className="product-details-content">
          <ProductDetailRichText
            colors={colors}
            htmlContent={product.detailsDescription || ""}
            className="text-sm lg:text-base"
          />
        </div>
      </div>
    </div>
  );
}
