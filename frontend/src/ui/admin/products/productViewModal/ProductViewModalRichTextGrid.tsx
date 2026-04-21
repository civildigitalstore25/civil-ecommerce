import React from "react";
import { ListChecks, Monitor, Package, ScrollText, Zap } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { ProductViewModalRichContent } from "./ProductViewModalRichContent";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
};

export const ProductViewModalRichTextGrid: React.FC<Props> = ({ product }) => {
  const t = useProductViewModalTheme();
  const cardClass = "rounded-lg p-6 border transition-colors duration-200";

  const desc = product.description?.trim() ?? "";
  const details = product.detailsDescription?.trim() ?? "";
  const hasSeparateDetails = Boolean(desc) && Boolean(details);
  const primaryDescription = hasSeparateDetails ? desc : desc || details;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className={cardClass} style={{ ...t.surface, borderColor: t.borderColor }}>
        <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
          <Package className="w-6 h-6 mr-2" />
          Description
        </h3>
        <ProductViewModalRichContent htmlContent={primaryDescription} />
      </div>

      {hasSeparateDetails && (
        <div className={cardClass} style={{ ...t.surface, borderColor: t.borderColor }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
            <ScrollText className="w-6 h-6 mr-2" />
            Additional details
          </h3>
          <ProductViewModalRichContent htmlContent={product.detailsDescription} />
        </div>
      )}

      {product.overallFeatures && (
        <div className={cardClass} style={{ ...t.surface, borderColor: t.borderColor }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
            <Zap className="w-6 h-6 mr-2" />
            Features
          </h3>
          <ProductViewModalRichContent htmlContent={product.overallFeatures} />
        </div>
      )}

      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <div className={cardClass} style={{ ...t.surface, borderColor: t.borderColor }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
            <ListChecks className="w-6 h-6 mr-2" />
            Key features
          </h3>
          <ul className="space-y-3">
            {product.keyFeatures.map((f, index) => (
              <li key={index} className="border rounded-lg p-3" style={{ borderColor: t.borderColor }}>
                <div className="font-medium" style={t.heading}>
                  {f.title}
                </div>
                {f.description && (
                  <p className="text-sm mt-1" style={t.muted}>
                    {f.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.requirements && (
        <div className={cardClass} style={{ ...t.surfaceMuted, borderColor: t.borderColor }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
            <Monitor className="w-6 h-6 mr-2" />
            System requirements
          </h3>
          <ProductViewModalRichContent htmlContent={product.requirements} />
        </div>
      )}

      {product.systemRequirements && product.systemRequirements.length > 0 && (
        <div className={cardClass} style={{ ...t.surfaceMuted, borderColor: t.borderColor }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
            <Monitor className="w-6 h-6 mr-2" />
            System requirements (structured)
          </h3>
          <ul className="space-y-3">
            {product.systemRequirements.map((r, index) => (
              <li key={index} className="border rounded-lg p-3" style={{ borderColor: t.borderColor }}>
                <div className="font-medium" style={t.heading}>
                  {r.title}
                </div>
                {r.description && (
                  <p className="text-sm mt-1" style={t.muted}>
                    {r.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
