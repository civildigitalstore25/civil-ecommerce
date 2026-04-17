import type { ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";
import type { IMenu, CreateMenuDTO } from "../../../api/menuApi";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

interface MenuManagementAddFormProps {
  colors: ThemeColors;
  formData: CreateMenuDTO;
  parentOptions: IMenu[];
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export function MenuManagementAddForm({
  colors,
  formData,
  parentOptions,
  onInputChange,
  onSubmit,
  onCancel,
}: MenuManagementAddFormProps) {
  return (
    <div
      className="mb-6 p-6 rounded-lg border"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
          Add New Menu
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
          />
        </div>

        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
            placeholder="lowercase-with-hyphens"
          />
        </div>

        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Type
          </label>
          <select
            name="type"
            value={formData.type ?? "category"}
            onChange={onInputChange}
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
          >
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
            <option value="brand">Brand</option>
          </select>
        </div>

        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Parent Menu
          </label>
          <select
            name="parentId"
            value={formData.parentId || ""}
            onChange={onInputChange}
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((menu) => (
              <option key={menu._id} value={menu._id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order ?? 0}
            onChange={onInputChange}
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
            min={0}
          />
        </div>

        <div>
          <label
            className="block mb-2 font-semibold"
            style={{ color: colors.text.primary }}
          >
            Icon (optional)
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={onInputChange}
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: colors.border.primary }}
            placeholder="lucide-icon-name"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive ?? true}
            onChange={onInputChange}
            className="w-4 h-4"
          />
          <label className="font-semibold" style={{ color: colors.text.primary }}>
            Active
          </label>
        </div>

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "#fff",
            }}
          >
            Create Menu
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-semibold border transition-colors"
            style={{
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
