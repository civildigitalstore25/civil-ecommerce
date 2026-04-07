import { Plus, X } from "lucide-react";
import IconPicker from "../../../../components/IconPicker/IconPicker";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Requirement } from "../../../../constants/productFormConstants";

export type AddProductModalSystemRequirementsSectionProps = {
  colors: ThemeColors;
  systemRequirements: Requirement[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: "icon" | "title" | "description",
    value: string,
  ) => void;
};

export function AddProductModalSystemRequirementsSection({
  colors,
  systemRequirements,
  onAdd,
  onRemove,
  onUpdate,
}: AddProductModalSystemRequirementsSectionProps) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        System Requirements (Structured)
      </h2>

      <div className="space-y-4">
        {systemRequirements.map((requirement, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium" style={{ color: colors.text.primary }}>
                Requirement {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                  Icon
                </label>
                <IconPicker
                  selectedIcon={requirement.icon}
                  onIconSelect={(iconName) => onUpdate(index, "icon", iconName)}
                  placeholder="Select requirement icon"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                  Title
                </label>
                <input
                  type="text"
                  value={requirement.title}
                  onChange={(e) => onUpdate(index, "title", e.target.value)}
                  placeholder="Requirement title"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                  Description
                </label>
                <textarea
                  value={requirement.description}
                  onChange={(e) => onUpdate(index, "description", e.target.value)}
                  placeholder="Requirement details"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          style={{
            borderColor: colors.border.primary,
            color: colors.text.secondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.interactive.primary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border.primary;
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <Plus size={18} />
          Add Requirement
        </button>
      </div>
    </div>
  );
}
