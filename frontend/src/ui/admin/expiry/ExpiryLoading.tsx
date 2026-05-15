import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
};

const ExpiryLoading: React.FC<Props> = ({ colors }) => (
  <div className="space-y-6">
    {/* Toolbar skeleton */}
    <div
      className="rounded-xl shadow-sm border p-6 transition-colors duration-200 animate-pulse"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div
            className="h-6 w-40 rounded"
            style={{ backgroundColor: `${colors.text.primary}20` }}
          />
          <div
            className="h-4 w-32 rounded mt-2"
            style={{ backgroundColor: `${colors.text.secondary}20` }}
          />
        </div>
        <div className="flex gap-3">
          <div
            className="h-10 w-32 rounded"
            style={{ backgroundColor: `${colors.text.accent}20` }}
          />
        </div>
      </div>
    </div>

    {/* Stats grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-6 animate-pulse"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div
              className="h-4 w-24 rounded"
              style={{ backgroundColor: `${colors.text.secondary}20` }}
            />
            <div
              className="h-8 w-16 rounded mt-3"
              style={{ backgroundColor: `${colors.text.primary}20` }}
            />
          </div>
        ))}
    </div>

    {/* Search skeleton */}
    <div
      className="rounded-xl border p-6 animate-pulse"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div
        className="h-10 rounded-lg"
        style={{ backgroundColor: `${colors.border.primary}40` }}
      />
    </div>

    {/* Table skeleton */}
    <div
      className="rounded-xl shadow-sm border overflow-hidden"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="p-6 space-y-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-12 rounded animate-pulse" style={{ backgroundColor: `${colors.border.primary}40` }} />
          ))}
      </div>
    </div>
  </div>
);

export default ExpiryLoading;
