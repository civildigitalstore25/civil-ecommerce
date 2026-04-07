import React from "react";
import { Building2, ExternalLink, Star, Tag } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { ProductViewModalRichContent } from "./ProductViewModalRichContent";

type Props = {
  product: Product;
};

function displayBrand(product: Product): string {
  const raw = product.brand || product.company || "";
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function displayCategory(product: Product): string {
  const raw = product.category || "";
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export const ProductViewModalSummaryPanel: React.FC<Props> = ({ product }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold" style={{ color: "black" }}>
          {product.name}
        </h3>
        <p className="text-lg mt-1" style={{ color: "gray" }}>
          Version {product.version}
        </p>
        {product.shortDescription && <ProductViewModalRichContent htmlContent={product.shortDescription} />}
      </div>

      {(product.rating || (product.tags && product.tags.length > 0)) && (
        <div className="space-y-3">
          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    style={{
                      color: star <= product.rating! ? "gold" : "gray",
                      fill: star <= product.rating! ? "gold" : "none",
                    }}
                  />
                ))}
              </div>
              <span style={{ color: "gray" }}>{product.rating}</span>
              {product.ratingCount && (
                <span style={{ color: "gray" }}>({product.ratingCount} reviews)</span>
              )}
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: "lightgray",
                    color: "black",
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg p-4" style={{ backgroundColor: "white" }}>
        <h4 className="text-lg font-semibold mb-3 flex items-center" style={{ color: "black" }}>
          <Building2 className="w-5 h-5 mr-2" />
          Brand & Category
        </h4>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium" style={{ color: "gray" }}>
              Brand:
            </span>
            <span className="ml-2" style={{ color: "black" }}>
              {displayBrand(product)}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium" style={{ color: "gray" }}>
              Category:
            </span>
            <span
              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm"
              style={{
                backgroundColor: "lightblue",
                color: "black",
              }}
            >
              {displayCategory(product)}
            </span>
          </div>
          {product.driveLink && (
            <div>
              <span className="text-sm font-medium" style={{ color: "gray" }}>
                Download Link:
              </span>
              <a
                href={product.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:underline inline-flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Drive Link
              </a>
            </div>
          )}
          <div>
            <span className="text-sm font-medium" style={{ color: "gray" }}>
              Stock Status:
            </span>
            <span
              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: product.isOutOfStock ? "#fee2e2" : "#d1fae5",
                color: product.isOutOfStock ? "#991b1b" : "#065f46",
              }}
            >
              {product.isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
