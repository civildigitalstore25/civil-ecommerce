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
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="mb-4 md:mb-8">
      <div
        className="sm:hidden rounded-xl border p-2 shadow-sm"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="relative flex items-center gap-2">
          <div
            className="pointer-events-none flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${activeTabConfig.color}20`,
              color: activeTabConfig.color,
            }}
          >
            {activeTabConfig.image ? (
              <img
                src={activeTabConfig.image}
                alt=""
                className="h-4 w-4 object-contain"
              />
            ) : (
              activeTabConfig.icon &&
              React.createElement(activeTabConfig.icon, {
                className: "h-4 w-4",
              })
            )}
          </div>

          <select
            aria-label="Select brand"
            value={activeTab}
            onChange={(event) => onSelectTab(event.target.value)}
            className="h-11 w-full appearance-none rounded-lg border bg-transparent px-3 pr-9 text-sm font-semibold outline-none"
            style={{
              color: colors.text.primary,
              borderColor: colors.border.primary,
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>

          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: colors.text.secondary }}
          >
            ▼
          </span>
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-2 md:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
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
