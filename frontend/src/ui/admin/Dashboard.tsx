import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useAdminDashboard } from "./dashboard/useAdminDashboard";
import { DashboardStatCards } from "./dashboard/DashboardStatCards";
import { DashboardSalesAnalyticsSection } from "./dashboard/DashboardSalesAnalyticsSection";

const Dashboard: React.FC = () => {
  const { colors } = useAdminTheme();
  const {
    period,
    setPeriod,
    downloading,
    handleDownload,
    stats,
    comparisonData,
    analyticsData,
    analyticsLoading,
    analyticsError,
  } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <DashboardStatCards colors={colors} stats={stats} />
      <DashboardSalesAnalyticsSection
        colors={colors}
        period={period}
        onPeriodChange={setPeriod}
        downloading={downloading}
        onDownload={handleDownload}
        analyticsData={analyticsData}
        analyticsLoading={analyticsLoading}
        analyticsError={analyticsError}
        comparisonData={comparisonData}
      />
    </div>
  );
};

export default Dashboard;
