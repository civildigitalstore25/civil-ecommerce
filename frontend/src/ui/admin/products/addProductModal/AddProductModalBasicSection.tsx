import RichTextEditor from "../../../../components/RichTextEditor/RichTextEditor";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import { normalizeSlug } from "../../../../utils/slug/normalizeSlug";
import { productSlugFromNameVersion } from "../../../../utils/slug/productSlugFromNameVersion";

export type AddProductModalBasicSectionProps = {
  colors: ThemeColors;
  name: string;
  version: string;
  slug: string;
  longDescription: string;
  detailsDescription: string;
  onInputChange: (field: string, value: string) => void;
};

function previewProductSlug(name: string, version: string, slug: string): string {
  if (slug.trim()) return normalizeSlug(slug);
  if (name.trim()) return productSlugFromNameVersion(name, version);
  return "your-product-slug";
}

export function AddProductModalBasicSection({
  colors,
  name,
  version,
  slug,
  longDescription,
  detailsDescription,
  onInputChange,
}: AddProductModalBasicSectionProps) {
  const slugPreview = previewProductSlug(name, version, slug);

  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="e.g., AutoCAD 2025"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Version
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => onInputChange("version", e.target.value)}
            placeholder="e.g., 2025.1 (optional)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            URL slug <span className="opacity-70">(optional)</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onInputChange("slug", e.target.value)}
            placeholder="e.g., reinforced-concrete-structures-analysis-and-design"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
          <p className="text-xs" style={{ color: colors.text.secondary }}>
            Leave blank to auto-generate from product name and version. Preview:{" "}
            <span className="font-mono">/product/{slugPreview}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
          Long Description <span className="opacity-70">(optional)</span>
        </label>
        <RichTextEditor
          value={longDescription}
          onChange={(val) => onInputChange("longDescription", val)}
          placeholder="Detailed product description, features, installation and activation instructions..."
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
          Details Description <span className="opacity-70">(optional)</span>
        </label>
        <RichTextEditor
          value={detailsDescription}
          onChange={(val) => onInputChange("detailsDescription", val)}
          placeholder="Detailed product description with images and content (shown in Details tab)..."
          className="w-full"
          editorMaxHeight="300px"
        />
      </div>
    </div>
  );
}
