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

    console.log(`[Analytics] Fetching sales analytics for period: ${period}`);

    // Get all paid orders
    const orders = await Order.find({ paymentStatus: "paid" }).sort({
      createdAt: 1,
    });

    console.log(`[Analytics] Found ${orders.length} paid orders`);

    if (!orders || orders.length === 0) {
      console.log("[Analytics] No paid orders found, returning empty data");
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

    console.log(`[Analytics] Generated ${salesData.length} data points`);

    // Calculate totals
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    console.log(`[Analytics] Total Revenue: ${totalRevenue}, Total Orders: ${totalOrders}, Avg: ${averageOrderValue}`);

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
    console.error("[Analytics] Error fetching sales analytics:", error);
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

    // Add title with better styling
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Sales Analytics Report", 105, 22, { align: "center" });

    // Add a separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(41, 128, 185);
    doc.line(20, 28, 190, 28);

    // Add metadata with better spacing
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const periodStr = String(period);
    doc.text(`Period: ${periodStr.charAt(0).toUpperCase() + periodStr.slice(1)}`, 20, 38);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 20, 44);

    // Add summary section with styling
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, 56);

    // Summary box
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(20, 60, 170, 24, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString("en-IN")}`, 25, 68);
    doc.text(`Total Orders: ${totalOrders}`, 25, 74);
    doc.text(`Average Order Value: ₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`, 25, 80);

    // Prepare table data
    const tableData = salesData.map((item) => [
      item.period,
      item.orderCount.toString(),
      `₹${item.revenue.toLocaleString("en-IN")}`,
      item.orderCount > 0
        ? `₹${Math.round(item.revenue / item.orderCount).toLocaleString("en-IN")}`
        : "₹0",
    ]);

    // Add table with better styling
    autoTable(doc, {
      startY: 92,
      head: [["Period", "Total Orders", "Total Revenue", "Avg Order Value"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
        halign: "center",
        cellPadding: 5
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 4,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 45, halign: "left" },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 50, halign: "right" },
        3: { cellWidth: 50, halign: "right" },
      },
      margin: { left: 20, right: 20 },
    } as any);

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
    }

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
