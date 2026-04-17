import React from "react";
import type { Product } from "../../../../api/types/productTypes";

type Props = {
  product: Product;
  allImages: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
};

export const ProductViewModalGallery: React.FC<Props> = ({
  product,
  allImages,
  selectedImageIndex,
  onSelectImage,
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: "lightgray" }}>
        <img
          src={allImages[selectedImageIndex] || product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                selectedImageIndex === index ? "border-yellow-500" : "border-gray-600"
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
