import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Stats = { pending: number; replied: number; closed: number };

type Props = { colors: ThemeColors; stats: Stats };

export function EnquiryManagementStatsCards({ colors, stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        className="rounded-xl p-6 border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: colors.text.secondary }}
            >
              Pending
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: colors.status.warning }}
            >
              {stats.pending}
            </p>
          </div>
          <Clock
            className="w-12 h-12"
            style={{ color: colors.status.warning }}
          />
        </div>
      </div>

      <div
        className="rounded-xl p-6 border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: colors.text.secondary }}
            >
              Replied
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: colors.status.success }}
            >
              {stats.replied}
            </p>
          </div>
          <CheckCircle
            className="w-12 h-12"
            style={{ color: colors.status.success }}
          />
        </div>
      </div>

      <div
        className="rounded-xl p-6 border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: colors.text.secondary }}
            >
              Closed
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: colors.status.error }}
            >
              {stats.closed}
            </p>
          </div>
          <XCircle
            className="w-12 h-12"
            style={{ color: colors.status.error }}
          />
        </div>
      </div>
    </div>
  );
}
