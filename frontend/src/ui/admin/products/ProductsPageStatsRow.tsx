import React from "react";
import { CheckCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type StatTone = "warning" | "success" | "info" | "error";

type StatDef = {
  label: string;
  value: number;
  subtitle: string;
  tone: StatTone;
  icon: "box" | "check" | "draft" | "inactive";
};

const ICONS: Record<StatDef["icon"], () => React.ReactNode> = {
  box: () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  check: () => <CheckCircle className="w-5 h-5 text-white" />,
  draft: () => (
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  inactive: () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

type Props = {
  colors: ThemeColors;
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  inactiveProducts: number;
  exportOpen: boolean;
  setExportOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  onExportExcel: () => Promise<void>;
  onExportJSON: () => Promise<void>;
};

const ProductsPageStatsRow: React.FC<Props> = ({
  colors,
  totalProducts,
  activeProducts,
  draftProducts,
  inactiveProducts,
  exportOpen,
  setExportOpen,
  onExportExcel,
  onExportJSON,
}) => {
  const toneColor = (t: StatTone) => colors.status[t];

  const stats: StatDef[] = [
    {
      label: "Total Products",
      value: totalProducts,
      subtitle: "+100% active",
      tone: "warning",
      icon: "box",
    },
    {
      label: "Active Products",
      value: activeProducts,
      subtitle: "Ready for sale",
      tone: "success",
      icon: "check",
    },
    {
      label: "Draft Products",
      value: draftProducts,
      subtitle: "Work in progress",
      tone: "info",
      icon: "draft",
    },
    {
      label: "Inactive Products",
      value: inactiveProducts,
      subtitle: "Not available",
      tone: "error",
      icon: "inactive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative">
      {stats.map((s) => {
        const c = toneColor(s.tone);
        return (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium opacity-75"
                  style={{ color: colors.text.secondary }}
                >
                  {s.label}
                </p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{
                    color:
                      s.tone === "success"
                        ? colors.status.success
                        : s.tone === "info"
                          ? colors.status.info
                          : s.tone === "error"
                            ? colors.status.error
                            : colors.text.primary,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-1 opacity-60"
                  style={{ color: colors.text.secondary }}
                >
                  {s.subtitle}
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${c}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {ICONS[s.icon]()}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hidden lg:block absolute right-0 top-0">
        <div className="relative">
          <button
            type="button"
            className="px-3 py-2 rounded-lg text-sm font-medium border flex items-center space-x-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onClick={() => setExportOpen((v) => !v)}
            onBlur={() => setTimeout(() => setExportOpen(false), 150)}
          >
            <span>Export</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {exportOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-10"
              style={{
                background: colors.background.secondary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                style={{ color: colors.text.primary }}
                onClick={async () => {
                  await onExportExcel();
                  setExportOpen(false);
                }}
              >
                Export to Excel
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                style={{ color: colors.text.primary }}
                onClick={async () => {
                  await onExportJSON();
                  setExportOpen(false);
                }}
              >
                Export to JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPageStatsRow;
