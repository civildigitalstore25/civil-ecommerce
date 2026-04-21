import React from "react";
import { Play } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { resolveProductVideoPlayer } from "../../../../utils/resolveProductVideoPlayer";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
};

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const player = resolveProductVideoPlayer(url);
  if (!player) return null;

  if (player.kind === "iframe") {
    return (
      <iframe
        src={player.src}
        className="w-full h-full border-0"
        allow={player.allow}
        allowFullScreen
        title={title}
        loading="lazy"
      />
    );
  }

  return (
    <video src={player.src} className="w-full h-full bg-black object-contain" controls playsInline title={title} />
  );
}

export const ProductViewModalVideos: React.FC<Props> = ({ product }) => {
  const t = useProductViewModalTheme();

  if (!product.videoUrl && !product.activationVideoUrl) return null;

  const frameStyle: React.CSSProperties = {
    ...t.surface,
    borderColor: t.borderColor,
  };

  return (
    <div
      className="rounded-lg p-6 mb-8 border transition-colors duration-200"
      style={{ ...t.surfaceMuted, borderColor: t.borderColor }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
        <Play className="w-6 h-6 mr-2" />
        Videos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.videoUrl && (
          <div>
            <h4 className="font-medium mb-2" style={t.muted}>
              Product demo
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden border" style={frameStyle}>
              <VideoEmbed url={product.videoUrl} title="Product demo" />
            </div>
          </div>
        )}
        {product.activationVideoUrl && (
          <div>
            <h4 className="font-medium mb-2" style={t.muted}>
              Activation guide
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden border" style={frameStyle}>
              <VideoEmbed url={product.activationVideoUrl} title="Activation guide" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
