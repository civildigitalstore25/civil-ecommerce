import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type AddProductModalHeaderProps = {
  colors: ThemeColors;
  isEditMode: boolean;
  onClose: () => void;
};

export function AddProductModalHeader({
  colors,
  isEditMode,
  onClose,
}: AddProductModalHeaderProps) {
  return (
    <div
      className="flex-shrink-0 px-6 pt-6 pb-4 border-b"
      style={{ borderColor: colors.border.primary }}
    >
      <div className="flex items-start justify-between pr-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-1" style={{ color: colors.text.secondary }}>
            Add a new software product to your catalog with advanced formatting
            options
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl font-bold transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.primary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
