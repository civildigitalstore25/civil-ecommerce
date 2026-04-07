import type { CSSProperties } from "react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

export interface CartSubscriptionPlanLike {
  planType?: string;
  planLabel?: string;
}

export function getLicenseBadgeStyle(
  colors: ThemeColors,
  licenseType: string,
  subscriptionPlan?: CartSubscriptionPlanLike,
): CSSProperties {
  const base: CSSProperties = {
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    border: `1px solid ${colors.border.primary}`,
  };

  const withAccent = (accentColor: string): CSSProperties => ({
    ...base,
    borderLeft: `4px solid ${accentColor}`,
  });

  if (subscriptionPlan?.planType) {
    switch (subscriptionPlan.planType) {
      case "admin-subscription":
        return withAccent(colors.interactive.primary);
      case "subscription":
        return withAccent(colors.status.success);
      case "membership":
        return withAccent(colors.interactive.secondary);
      case "lifetime":
        return withAccent(colors.interactive.secondary);
      default:
        return base;
    }
  }

  switch (licenseType) {
    case "1year":
      return withAccent(colors.interactive.primary);
    case "3year":
      return withAccent(colors.status.success);
    case "lifetime":
      return withAccent(colors.interactive.secondary);
    default:
      return base;
  }
}

export function getLicenseLabel(
  licenseType: string,
  subscriptionPlan?: CartSubscriptionPlanLike,
): string {
  if (subscriptionPlan?.planLabel) {
    return subscriptionPlan.planLabel;
  }

  switch (licenseType) {
    case "1year":
      return "1 Year License";
    case "3year":
      return "3 Year License";
    case "lifetime":
      return "Lifetime License";
    default:
      return "License";
  }
}
