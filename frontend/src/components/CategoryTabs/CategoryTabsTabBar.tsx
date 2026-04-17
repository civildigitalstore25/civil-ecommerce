import React from "react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { CategoryTabConfig } from "./categoryTabsConfig";

interface CategoryTabsTabBarProps {
  tabs: CategoryTabConfig[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  colors: ThemeColors;
}

export function CategoryTabsTabBar({
  tabs,
  activeTab,
  onSelectTab,
  colors,
}: CategoryTabsTabBarProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
              activeTab === tab.id ? "shadow-lg" : "shadow-md"
            }`}
            style={{
              background:
                activeTab === tab.id ? "#0068ff" : colors.background.secondary,
              color: activeTab === tab.id ? "#fff" : colors.text.primary,
              border:
                activeTab === tab.id
                  ? "2px solid #0068ff"
                  : `1.5px solid ${colors.border.primary}`,
            }}
          >
            <div
              className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "rgba(255, 255, 255, 0.2)"
                    : `${tab.color}20`,
              }}
            >
              {tab.image ? (
                <img
                  src={tab.image}
                  alt={tab.label}
                  className="w-3 h-3 md:w-4 md:h-4 object-contain"
                />
              ) : (
                tab.icon &&
                React.createElement(tab.icon, {
                  className: "w-3 h-3 md:w-4 md:h-4",
                  style: {
                    color: activeTab === tab.id ? "#fff" : tab.color,
                  },
                })
              )}
            </div>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
