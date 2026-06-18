import { Youtube, Plus, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

const YT_RED = "#FF0000";

type Props = {
  colors: ThemeColors;
  instagramReels: string[];
  onReelChange: (index: number, value: string) => void;
  onAddReel: () => void;
  onRemoveReel: (index: number) => void;
};

/**
 * Resolves a YouTube URL to a clean embed URL for the admin preview.
 */
function resolveYouTubeEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;

  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0&controls=1`;
  }

  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&controls=1`;
  }

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  return null;
}

export function AddProductModalInstagramReelsSection({
  colors,
  instagramReels,
  onReelChange,
  onAddReel,
  onRemoveReel,
}: Props) {
  const canAdd = instagramReels.length < 4;
  const canRemove = instagramReels.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Youtube className="h-5 w-5" style={{ color: YT_RED }} />
        <h3 className="text-base font-semibold" style={{ color: colors.text.primary }}>
          Sample Videos — YouTube (Optional, up to 4)
        </h3>
      </div>

      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Paste YouTube Short or regular YouTube video URLs. These will appear as a portrait video
        row on the product detail page.{" "}
        <span style={{ color: YT_RED }} className="font-medium">
          Tip: Upload your Instagram Reels to YouTube Shorts for the best result.
        </span>
      </p>

      <div className="space-y-3">
        {instagramReels.map((reel, index) => {
          const embedUrl = resolveYouTubeEmbedUrl(reel);
          return (
            <div key={index} className="space-y-2">
              <div className="flex gap-2 items-center">
                {/* Number badge */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: YT_RED }}
                >
                  {index + 1}
                </div>

                {/* URL input */}
                <div className="flex-1">
                  <input
                    type="url"
                    value={reel}
                    onChange={(e) => onReelChange(index, e.target.value)}
                    placeholder={
                      index === 0
                        ? "https://youtube.com/shorts/ABC123xyz"
                        : `https://youtube.com/shorts/VIDEO${index + 1}`
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = YT_RED;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border.primary;
                    }}
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveReel(index)}
                  disabled={!canRemove}
                  className="p-2 border rounded-lg hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                  style={{
                    color: colors.status.error,
                    borderColor: colors.status.error,
                  }}
                  title="Remove video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Inline preview — portrait aspect ratio */}
              {embedUrl && (
                <div
                  className="ml-8 rounded-lg overflow-hidden border"
                  style={{
                    borderColor: colors.border.primary,
                    aspectRatio: "9 / 16",
                    maxWidth: "160px",
                    position: "relative",
                    backgroundColor: "#000",
                  }}
                >
                  <iframe
                    src={embedUrl}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    frameBorder={0}
                    allowFullScreen
                    title={`Video ${index + 1} preview`}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add video button */}
      <button
        type="button"
        onClick={onAddReel}
        disabled={!canAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          color: canAdd ? YT_RED : colors.text.secondary,
          borderColor: canAdd ? YT_RED : colors.border.primary,
          backgroundColor: "transparent",
        }}
      >
        <Plus className="h-4 w-4" />
        Add Video {!canAdd && "(max 4 reached)"}
      </button>
    </div>
  );
}
