import type { AnalyticsData, SalesDataPoint } from "../../../api/analyticsApi";

export type DashboardComparisonRow = SalesDataPoint & {
  revenueChange: number;
  ordersChange: number;
  previousRevenue: number;
  previousOrderCount: number;
};

export type DashboardComparisonData = {
  salesData: DashboardComparisonRow[];
  currentPeriodRevenue: number;
  currentPeriodOrders: number;
  previousPeriodRevenue: number;
  previousPeriodOrders: number;
  revenueChange: number;
  ordersChange: number;
};

export function buildDashboardComparisonData(
  analyticsData: AnalyticsData | undefined,
): DashboardComparisonData {
  if (!analyticsData || analyticsData.salesData.length === 0) {
    return {
      salesData: [],
      currentPeriodRevenue: 0,
      currentPeriodOrders: 0,
      previousPeriodRevenue: 0,
      previousPeriodOrders: 0,
      revenueChange: 0,
      ordersChange: 0,
    };
  }

  const salesData = analyticsData.salesData.map((item, index) => {
    const previousItem = analyticsData.salesData[index - 1];
    const revenueChange =
      previousItem && previousItem.revenue > 0
        ? ((item.revenue - previousItem.revenue) / previousItem.revenue) * 100
        : 0;
    const ordersChange =
      previousItem && previousItem.orderCount > 0
        ? ((item.orderCount - previousItem.orderCount) / previousItem.orderCount) * 100
        : 0;

    return {
      ...item,
      revenueChange,
      ordersChange,
      previousRevenue: previousItem?.revenue || 0,
      previousOrderCount: previousItem?.orderCount || 0,
    };
  });

  const currentPeriodData = salesData[salesData.length - 1];
  const previousPeriodData =
    salesData.length >= 2 ? salesData[salesData.length - 2] : null;

  const currentPeriodRevenue = currentPeriodData?.revenue || 0;
  const currentPeriodOrders = currentPeriodData?.orderCount || 0;
  const previousPeriodRevenue = previousPeriodData?.revenue || 0;
  const previousPeriodOrders = previousPeriodData?.orderCount || 0;

  const revenueChange =
    previousPeriodRevenue > 0
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : 0;
  const ordersChange =
    previousPeriodOrders > 0
      ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100
      : 0;

  return {
    salesData,
    currentPeriodRevenue,
    currentPeriodOrders,
    previousPeriodRevenue,
    previousPeriodOrders,
    revenueChange,
    ordersChange,
  };
}
