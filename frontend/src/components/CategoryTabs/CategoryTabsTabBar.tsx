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

      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-3 md:gap-15 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className="flex flex-col items-center justify-center px-2 md:px-4 py-3 md:py-4 font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 min-w-[80px] md:min-w-[130px] relative"
            style={{
              background: "transparent",
              color: activeTab === tab.id ? "#0068ff" : colors.text.primary,
              border: "none",
            }}
          >
            <div
              className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 mb-2"
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? `${tab.color}20`
                    : `${tab.color}10`,
              }}
            >
              {tab.image ? (
                <img
                  src={tab.image}
                  alt={tab.label}
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
                />
              ) : (
                tab.icon &&
                React.createElement(tab.icon, {
                  className: "w-5 h-5 md:w-6 md:h-6",
                  style: {
                    color: tab.color,
                  },
                })
              )}
            </div>
            <span className="leading-tight">{tab.label}</span>
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: "60%",
                  backgroundColor: "#0068ff",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

