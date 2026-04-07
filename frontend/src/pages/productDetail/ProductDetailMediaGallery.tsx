import React from "react";
import * as LucideIcons from "lucide-react";
import type { Product } from "../../api/types/productTypes";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  product: Product;
  colors: ThemeColors;
  mediaItems: string[];
  currentMainImage: string;
  onSelectMedia: (item: string) => void;
  isZooming: boolean;
  onZoomEnter: () => void;
  onZoomLeave: () => void;
  onZoomMove: (xPct: number, yPct: number) => void;
  zoomOriginX: number;
  zoomOriginY: number;
};

export const ProductDetailMediaGallery: React.FC<Props> = ({
  product,
  colors,
  mediaItems,
  currentMainImage,
  onSelectMedia,
  isZooming,
  onZoomEnter,
  onZoomLeave,
  onZoomMove,
  zoomOriginX,
  zoomOriginY,
}) => {
  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="aspect-square flex items-center justify-center p-2 lg:p-4">
        {currentMainImage && currentMainImage.startsWith("video:") ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="aspect-video w-full max-w-sm lg:max-w-md rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
              {currentMainImage.replace("video:", "").includes("youtube.com") ||
              currentMainImage.replace("video:", "").includes("youtu.be") ? (
                <iframe
                  src={currentMainImage.replace("video:", "").replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  frameBorder={0}
                  allowFullScreen
                  title="Product Demo Video"
                />
              ) : (
                <video
                  src={currentMainImage.replace("video:", "")}
                  className="w-full h-full"
                  controls
                  title="Product Demo Video"
                />
              )}
            </div>
          </div>
        ) : (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair"
            onMouseEnter={onZoomEnter}
            onMouseLeave={onZoomLeave}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              onZoomMove(x, y);
            }}
          >
            <img
              src={currentMainImage}
              className="max-w-full max-h-full object-contain rounded-lg lg:rounded-xl shadow-lg transition-transform duration-200"
              alt={product.name}
              style={{
                transform: isZooming ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 lg:gap-3 justify-center flex-wrap">
        {mediaItems.map((item, idx) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectMedia(item);
            }}
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 relative"
            style={{
              borderColor:
                item === currentMainImage ? colors.interactive.primary : colors.border.primary,
            }}
            onClick={() => onSelectMedia(item)}
          >
            {item.startsWith("video:") ? (
              <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-purple-600">
                <LucideIcons.Play
                  className="absolute inset-0 m-auto text-white bg-black bg-opacity-50 rounded-full p-1"
                  size={20}
                />
                <div className="text-xs font-semibold text-center text-white absolute bottom-1">Video</div>
              </div>
            ) : (
              <img src={item} className="object-cover w-full h-full" alt={`thumb-${idx}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
