import React from "react";
import { AlertCircle, TrendingUp } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  totalExpiredCount: number;
  recentlyExpired: number; // 0-7 days
  moderatelyExpired: number; // 7-30 days
  oldExpiry: number; // 30-90 days
  veryOldExpiry: number; // 90+ days
};

const ExpiryStatsGrid: React.FC<Props> = ({
  colors,
  totalExpiredCount,
  recentlyExpired,
  moderatelyExpired,
  oldExpiry,
  veryOldExpiry,
}) => {
  const statCards = [
    {
      label: "Total Expired",
      value: totalExpiredCount,
      icon: AlertCircle,
      color: "#ef4444", // red
      bgKey: "red",
    },
    {
      label: "Recently (0-7 days)",
      value: recentlyExpired,
      icon: TrendingUp,
      color: "#f97316", // orange
      bgKey: "orange",
    },
    {
      label: "Moderately (7-30 days)",
      value: moderatelyExpired,
      icon: AlertCircle,
      color: "#eab308", // yellow
      bgKey: "yellow",
    },
    {
      label: "Old (30-90 days)",
      value: oldExpiry,
      icon: TrendingUp,
      color: "#8b5cf6", // purple
      bgKey: "purple",
    },
    {
      label: "Very Old (90+ days)",
      value: veryOldExpiry,
      icon: AlertCircle,
      color: "#6366f1", // indigo
      bgKey: "indigo",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl p-6 border transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold mt-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
              <IconComponent
                className="w-10 h-10 opacity-20"
                style={{ color: stat.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpiryStatsGrid;
