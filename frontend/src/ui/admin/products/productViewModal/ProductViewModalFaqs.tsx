import React from "react";
import { HelpCircle } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";

type Props = {
  product: Product;
};

export const ProductViewModalFaqs: React.FC<Props> = ({ product }) => {
  if (!product.faqs || product.faqs.length === 0) return null;

  return (
    <div
      className="rounded-lg p-6 mb-8 transition-colors duration-200"
      style={{ backgroundColor: "white" }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
        <HelpCircle className="w-6 h-6 mr-2" style={{ color: "blue" }} />
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {product.faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg p-4 border transition-colors duration-200"
            style={{
              backgroundColor: "white",
              borderColor: "gray",
            }}
          >
            <h4 className="font-medium mb-2" style={{ color: "black" }}>
              {faq.question}
            </h4>
            <p style={{ color: "gray" }}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
