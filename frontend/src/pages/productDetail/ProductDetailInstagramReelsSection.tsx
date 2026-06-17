import React from "react";
import type { Product } from "../../api/types/productTypes";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  product: Product;
  colors: ThemeColors;
};

/**
 * Resolves a YouTube URL (Shorts or regular) to a clean embed URL
 * with autoplay, muted (required for autoplay), loop, and no related videos.
 */
function resolveYouTubeEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;

  // YouTube Shorts: https://youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch?.[1]) {
    const id = shortsMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&loop=1&playlist=${id}&controls=1`;
  }

  // Regular YouTube: watch?v=ID or youtu.be/ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch?.[1]) {
    const id = watchMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&loop=1&playlist=${id}&controls=1`;
  }

  // Already an embed URL — just append autoplay params
  if (url.includes("youtube.com/embed/")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}autoplay=1&mute=1&rel=0`;
  }

  return null;
}

export const ProductDetailInstagramReelsSection: React.FC<Props> = ({ product, colors }) => {
  // Field is still called instagramReels in DB but now stores YouTube URLs
  const rawReels = product.instagramReels;
  if (!rawReels || rawReels.length === 0) return null;

  const validReels = rawReels
    .map((url) => ({ url, embedUrl: resolveYouTubeEmbedUrl(url) }))
    .filter((r) => r.embedUrl !== null) as { url: string; embedUrl: string }[];

  if (validReels.length === 0) return null;

  return (
    <div className="mt-8 lg:mt-16">
      <div
        className="rounded-xl lg:rounded-2xl p-4 lg:p-8 transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Section header */}
        <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
          <span className="text-xl lg:text-2xl">🎬</span>
          <h2
            className="text-xl lg:text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Sample Videos
          </h2>
        </div>

        {/* Videos row — always 4-column grid regardless of count (1, 2, 3 or 4) */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4"
          style={{
            border: `2px solid ${colors.border.primary}`,
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {validReels.map((reel, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                aspectRatio: "9 / 16",
                overflow: "hidden",
                borderRadius: "12px",
                backgroundColor: "#000",
              }}
            >
              {/* YouTube embed — clean player, no social bar */}
              <iframe
                src={reel.embedUrl}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                frameBorder={0}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                title={`Sample Video ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Dot indicators — one per video */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {validReels.map((_, i) => (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.interactive.primary }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
