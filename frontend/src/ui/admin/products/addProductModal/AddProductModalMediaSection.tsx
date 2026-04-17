import { Plus, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  imageUrl: string;
  additionalImages: string[];
  videoUrl: string;
  activationVideoUrl: string;
  driveLink: string;
  onImageUrlChange: (value: string) => void;
  onAdditionalImageChange: (index: number, value: string) => void;
  onRemoveAdditionalImage: (index: number) => void;
  onAddAdditionalImage: () => void;
  onVideoUrlChange: (value: string) => void;
  onActivationVideoUrlChange: (value: string) => void;
  onDriveLinkChange: (value: string) => void;
};

export function AddProductModalMediaSection({
  colors,
  imageUrl,
  additionalImages,
  videoUrl,
  activationVideoUrl,
  driveLink,
  onImageUrlChange,
  onAdditionalImageChange,
  onRemoveAdditionalImage,
  onAddAdditionalImage,
  onVideoUrlChange,
  onActivationVideoUrlChange,
  onDriveLinkChange,
}: Props) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Media
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Main Product Image
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            onFocus={(e) => {
              e.target.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.primary;
            }}
            required
          />
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Primary product image displayed in listings and product page
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Additional Images
          </label>
          {additionalImages.map((image, index) => (
            <div key={index} className="flex gap-4 items-center">
              <div className="flex-1">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => onAdditionalImageChange(index, e.target.value)}
                  placeholder={`Image ${index + 1} URL - https://example.com/image${index + 1}.jpg`}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.interactive.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border.primary;
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveAdditionalImage(index)}
                disabled={additionalImages.length === 1}
                className="px-3 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                style={{
                  color: colors.status.error,
                  borderColor: colors.status.error,
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddAdditionalImage}
            className="flex items-center gap-2 px-4 py-2 text-yellow-400 border border-yellow-600 rounded-lg hover:bg-yellow-900"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </button>
          <p className="text-sm text-gray-400">
            Additional product screenshots, interface images, or feature highlights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
              Product Demo Video URL (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.interactive.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border.primary;
              }}
            />
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              YouTube, Vimeo, or direct video link for product demonstration
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
              Activation Demo Video URL (Optional)
            </label>
            <input
              type="url"
              value={activationVideoUrl}
              onChange={(e) => onActivationVideoUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.interactive.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border.primary;
              }}
            />
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              YouTube, Vimeo, or direct video link for activation demonstration
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Google Drive Download Link (Optional)
          </label>
          <input
            type="url"
            value={driveLink}
            onChange={(e) => onDriveLinkChange(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.primary;
            }}
          />
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Google Drive shareable link for the downloadable product file. Users will see a download button after
            purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
