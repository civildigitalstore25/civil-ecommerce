import { Request, Response } from "express";
import Order from "../models/Order";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SalesDataPoint {
  period: string;
  revenue: number;
  orderCount: number;
  date: Date;
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    salesData: SalesDataPoint[];
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
}

// Get sales analytics data
export const getSalesAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { period = "monthly" } = req.query; // weekly, monthly, yearly

    // Get all paid orders
    const orders = await Order.find({ paymentStatus: "paid" }).sort({
      createdAt: 1,
    });

    if (!orders || orders.length === 0) {
      res.json({
        success: true,
        data: {
          salesData: [],
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
        },
      });
      return;
    }

    let salesData: SalesDataPoint[] = [];

    // Get date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        // Last 12 weeks
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 84); // 12 weeks
        salesData = aggregateWeekly(orders, startDate, now);
        break;

      case "yearly":
        // Last 5 years
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        salesData = aggregateYearly(orders, startDate, now);
        break;

      case "monthly":
      default:
        // Last 12 months
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 11);
        startDate.setDate(1);
        salesData = aggregateMonthly(orders, startDate, now);
        break;
    }

    // Calculate totals
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      success: true,
      data: {
        salesData,
        totalRevenue,
        totalOrders,
        averageOrderValue,
      },
    });
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales analytics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to aggregate data by week
function aggregateWeekly(
  orders: any[],
  startDate: Date,
  endDate: Date
): SalesDataPoint[] {
  const weekMap = new Map<string, SalesDataPoint>();

  // Initialize all weeks
  const current = new Date(startDate);
  while (current <= endDate) {
    const weekStart = getWeekStart(current);
    const weekKey = formatWeek(weekStart);

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        period: weekKey,
        revenue: 0,
        orderCount: 0,
        date: new Date(weekStart),
      });
    }

    current.setDate(current.getDate() + 7);
  }

  // Aggregate orders
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= startDate && orderDate <= endDate) {
      const weekStart = getWeekStart(orderDate);
      const weekKey = formatWeek(weekStart);

      const existing = weekMap.get(weekKey);
      if (existing) {
        existing.revenue += order.totalAmount;
        existing.orderCount += 1;
      }
    }
  });

  return Array.from(weekMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

// Helper function to aggregate data by month
function aggregateMonthly(
  orders: any[],
  startDate: Date,
  endDate: Date
): SalesDataPoint[] {
  const monthMap = new Map<string, SalesDataPoint>();

  // Initialize all months
  const current = new Date(startDate);
  while (current <= endDate) {
    const monthKey = formatMonth(current);

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        period: monthKey,
        revenue: 0,
        orderCount: 0,
        date: new Date(current),
      });
    }

    current.setMonth(current.getMonth() + 1);
  }

  // Aggregate orders
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= startDate && orderDate <= endDate) {
      const monthKey = formatMonth(orderDate);

      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.revenue += order.totalAmount;
        existing.orderCount += 1;
      }
    }
  });

  return Array.from(monthMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

// Helper function to aggregate data by year
function aggregateYearly(
  orders: any[],
  startDate: Date,
  endDate: Date
): SalesDataPoint[] {
  const yearMap = new Map<string, SalesDataPoint>();

  // Initialize all years
  for (
    let year = startDate.getFullYear();
    year <= endDate.getFullYear();
    year++
  ) {
    const yearKey = year.toString();
    yearMap.set(yearKey, {
      period: yearKey,
      revenue: 0,
      orderCount: 0,
      date: new Date(year, 0, 1),
    });
  }

  // Aggregate orders
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= startDate && orderDate <= endDate) {
      const yearKey = orderDate.getFullYear().toString();

      const existing = yearMap.get(yearKey);
      if (existing) {
        existing.revenue += order.totalAmount;
        existing.orderCount += 1;
      }
    }
  });

  return Array.from(yearMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

// Helper functions for date formatting
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function formatWeek(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

function formatMonth(date: Date): string {
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

// Download sales analytics as Excel
export const downloadSalesExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { period = "monthly" } = req.query;

    // Get all paid orders
    const orders = await Order.find({ paymentStatus: "paid" }).sort({
      createdAt: 1,
    });

    if (!orders || orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "No sales data available to download",
      });
      return;
    }

    let salesData: SalesDataPoint[] = [];
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 84);
        salesData = aggregateWeekly(orders, startDate, now);
        break;
      case "yearly":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        salesData = aggregateYearly(orders, startDate, now);
        break;
      case "monthly":
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 11);
        startDate.setDate(1);
        salesData = aggregateMonthly(orders, startDate, now);
        break;
    }

    // Prepare data for Excel
    const excelData = salesData.map((item) => ({
      Period: item.period,
      "Total Orders": item.orderCount,
      "Total Revenue": `₹${item.revenue.toLocaleString("en-IN")}`,
      "Avg Order Value": item.orderCount > 0 
        ? `₹${Math.round(item.revenue / item.orderCount).toLocaleString("en-IN")}`
        : "₹0",
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // Period
      { wch: 15 }, // Total Orders
      { wch: 20 }, // Total Revenue
      { wch: 20 }, // Avg Order Value
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Sales Analytics");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-analytics-${period}-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate Excel file",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Download sales analytics as PDF
export const downloadSalesPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { period = "monthly" } = req.query;

    // Get all paid orders
    const orders = await Order.find({ paymentStatus: "paid" }).sort({
      createdAt: 1,
    });

    if (!orders || orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "No sales data available to download",
      });
      return;
    }

    let salesData: SalesDataPoint[] = [];
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 84);
        salesData = aggregateWeekly(orders, startDate, now);
        break;
      case "yearly":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 5);
        salesData = aggregateYearly(orders, startDate, now);
        break;
      case "monthly":
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 11);
        startDate.setDate(1);
        salesData = aggregateMonthly(orders, startDate, now);
        break;
    }

    // Calculate totals
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Create PDF
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Sales Analytics Report", 14, 20);

    // Add metadata
    doc.setFontSize(10);
    const periodStr = String(period);
    doc.text(`Period: ${periodStr.charAt(0).toUpperCase() + periodStr.slice(1)}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    // Add summary
    doc.setFontSize(12);
    doc.text("Summary", 14, 46);
    doc.setFontSize(10);
    doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString("en-IN")}`, 14, 54);
    doc.text(`Total Orders: ${totalOrders}`, 14, 60);
    doc.text(`Average Order Value: ₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`, 14, 66);

    // Prepare table data
    const tableData = salesData.map((item) => [
      item.period,
      item.orderCount.toString(),
      `₹${item.revenue.toLocaleString("en-IN")}`,
      item.orderCount > 0
        ? `₹${Math.round(item.revenue / item.orderCount).toLocaleString("en-IN")}`
        : "₹0",
    ]);

    // Add table
    autoTable(doc, {
      startY: 75,
      head: [["Period", "Total Orders", "Total Revenue", "Avg Order Value"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35, halign: "center" },
        2: { cellWidth: 50, halign: "right" },
        3: { cellWidth: 50, halign: "right" },
      },
    });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-analytics-${period}-${new Date().toISOString().split("T")[0]}.pdf`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF file",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
