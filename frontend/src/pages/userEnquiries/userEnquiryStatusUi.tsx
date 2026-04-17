import { Clock } from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

export function getUserEnquiryStatusColor(
  status: string,
  colors: ThemeColors,
): string {
  switch (status) {
    case "pending":
      return colors.status.warning;
    case "replied":
      return colors.status.success;
    case "closed":
      return colors.status.error;
    default:
      return colors.text.secondary;
  }
}

export function getUserEnquiryStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "replied":
      return "Replied";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}

export function UserEnquiryStatusIcon({
  status,
  colors,
}: {
  status: string;
  colors: ThemeColors;
}) {
  if (status === "pending") {
    return (
      <Clock className="w-5 h-5" style={{ color: colors.status.warning }} />
    );
  }
  return null;
}
