import React from "react";
import type { Product } from "../../api/types/productTypes";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  product: Product;
  colors: ThemeColors;
};

export const ProductDetailActivationVideoSection: React.FC<Props> = ({ product, colors }) => {
  const url = product.activationVideoUrl;
  if (!url) return null;

  return (
    <div className="mt-8 lg:mt-16">
      <div
        className="rounded-xl lg:rounded-2xl p-4 lg:p-8 transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
          <span className="text-xl lg:text-2xl">▶️</span>
          <h2 className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>
            Activation Video Demo
          </h2>
        </div>
        <p className="mb-6" style={{ color: colors.text.secondary }}>
          Watch this step-by-step guide to activate your {product.name} license
        </p>
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          {url.includes("youtube.com") || url.includes("youtu.be") ? (
            <iframe
              src={url.replace("watch?v=", "embed/")}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              title="Activation Video Demo"
            />
          ) : (
            <video src={url} className="w-full h-full" controls title="Activation Video Demo" />
          )}
        </div>
      </div>
    </div>
  );
};
