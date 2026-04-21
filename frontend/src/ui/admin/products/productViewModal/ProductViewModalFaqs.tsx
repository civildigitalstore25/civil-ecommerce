import React from "react";
import { HelpCircle } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
};

export const ProductViewModalFaqs: React.FC<Props> = ({ product }) => {
  const t = useProductViewModalTheme();

  if (!product.faqs || product.faqs.length === 0) return null;

  return (
    <div
      className="rounded-lg p-6 mb-8 border transition-colors duration-200"
      style={{ ...t.surface, borderColor: t.borderColor }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
        <HelpCircle className="w-6 h-6 mr-2" style={t.accentIcon} />
        Frequently asked questions
      </h3>
      <div className="space-y-4">
        {product.faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg p-4 border transition-colors duration-200"
            style={{ ...t.surface, borderColor: t.borderColor }}
          >
            <h4 className="font-medium mb-2" style={t.heading}>
              {faq.question}
            </h4>
            <p style={t.body}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
