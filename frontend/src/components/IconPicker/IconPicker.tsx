import React, { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { POPULAR_ICONS } from "./iconPickerPopularIcons";

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  placeholder?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconSelect,
  placeholder = "Select an icon",
}) => {
  const { colors } = useAdminTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...Array.from(new Set(POPULAR_ICONS.map((icon) => icon.category)))];
    return cats.sort();
  }, []);

  const filteredIcons = useMemo(() => {
    return POPULAR_ICONS.filter((icon) => {
      const matchesSearch =
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const selectedIconData = POPULAR_ICONS.find((icon) => icon.name === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon;

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 flex items-center gap-2"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      >
        {SelectedIconComponent ? (
          <>
            <SelectedIconComponent className="h-4 w-4" />
            <span>{selectedIcon}</span>
          </>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 ml-auto" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            minWidth: 400,
            maxWidth: 640,
          }}
        >
          <div className="p-3 border-b" style={{ borderColor: colors.border.primary }}>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded focus:ring-1"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-sm border rounded hover:bg-opacity-80"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2 overflow-y-auto max-h-64">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
            >
              {filteredIcons.map((iconData) => {
                const IconComponent = iconData.icon;
                const isSelected = selectedIcon === iconData.name;

                return (
                  <button
                    key={iconData.name}
                    type="button"
                    onClick={() => handleIconSelect(iconData.name)}
                    className="p-2 rounded hover:bg-opacity-80 transition-colors duration-200 flex flex-col items-center gap-1"
                    style={{
                      backgroundColor: isSelected
                        ? colors.interactive.primary + "20"
                        : "transparent",
                      borderColor: isSelected ? colors.interactive.primary : "transparent",
                    }}
                    title={iconData.name}
                  >
                    <IconComponent
                      className="h-5 w-5"
                      style={{
                        color: isSelected ? colors.interactive.primary : colors.text.primary,
                      }}
                    />
                    <span
                      className="text-xs truncate w-full text-center"
                      style={{
                        color: isSelected ? colors.interactive.primary : colors.text.secondary,
                      }}
                    >
                      {iconData.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-4" style={{ color: colors.text.secondary }}>
                No icons found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default IconPicker;
