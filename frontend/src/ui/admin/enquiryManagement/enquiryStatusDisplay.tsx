import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

export function EnquiryStatusIcon({
  status,
  colors,
}: {
  status: string;
  colors: ThemeColors;
}) {
  switch (status) {
    case "pending":
      return (
        <Clock className="w-5 h-5" style={{ color: colors.status.warning }} />
      );
    case "replied":
      return (
        <CheckCircle
          className="w-5 h-5"
          style={{ color: colors.status.success }}
        />
      );
    case "closed":
      return (
        <XCircle className="w-5 h-5" style={{ color: colors.status.error }} />
      );
    default:
      return null;
  }
}

export function enquiryStatusColor(
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
