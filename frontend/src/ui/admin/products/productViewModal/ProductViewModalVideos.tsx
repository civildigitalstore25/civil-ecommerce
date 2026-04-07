import React from "react";
import { Play } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";

type Props = {
  product: Product;
};

export const ProductViewModalVideos: React.FC<Props> = ({ product }) => {
  if (!product.videoUrl && !product.activationVideoUrl) return null;

  return (
    <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: "lightgray" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
        <Play className="w-6 h-6 mr-2" />
        Videos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.videoUrl && (
          <div>
            <h4 className="font-medium mb-2" style={{ color: "gray" }}>
              Product Demo
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden" style={{ backgroundColor: "white" }}>
              <iframe
                src={product.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title="Product Demo"
              />
            </div>
          </div>
        )}
        {product.activationVideoUrl && (
          <div>
            <h4 className="font-medium mb-2" style={{ color: "gray" }}>
              Activation Guide
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden" style={{ backgroundColor: "white" }}>
              <iframe
                src={product.activationVideoUrl}
                className="w-full h-full"
                allowFullScreen
                title="Activation Guide"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
