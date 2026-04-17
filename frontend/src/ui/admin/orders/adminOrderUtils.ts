/** Checkout contact email is stored in notes as `Email: ...` when it differs from account email. */
export function emailFromOrderNotes(notes: string | undefined | null): string {
  if (!notes || typeof notes !== "string") return "";
  const m = notes.match(/^Email:\s*(.+)$/im);
  return m ? m[1].trim() : "";
}

export type AdminOrderLike = {
  _id?: string;
  orderId?: string;
  orderNumber?: number;
  orderStatus?: string;
  paymentStatus?: string;
  notes?: string;
  createdAt?: string;
  subtotal?: number;
  discount?: number;
  shippingCharges?: number;
  totalAmount?: number;
  cashfreePaymentId?: string;
  cashfreeOrderId?: string;
  userId?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
  shippingAddress?: {
    fullName?: string;
    phoneNumber?: string;
  };
  items?: Array<{
    name: string;
    productId?: string;
    quantity: number;
    price: number;
    image?: string;
    version?: string;
    pricingPlan?: string;
  }>;
};

export function displayOrderCustomerPhone(order: AdminOrderLike): string {
  return order.shippingAddress?.phoneNumber || order.userId?.phoneNumber || "";
}

export function displayOrderCustomerEmail(order: AdminOrderLike): string {
  return order.userId?.email || emailFromOrderNotes(order.notes) || "";
}

export type ExportRangeType = "all" | "date" | "week" | "month" | "year" | "custom";

export function formatDateForParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseWeekToDateRange(weekValue: string): { fromDate: string; toDate: string } | null {
  const match = weekValue.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (Number.isNaN(year) || Number.isNaN(week) || week < 1 || week > 53) return null;

  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4Day + 1);

  const start = new Date(week1Monday);
  start.setDate(week1Monday.getDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    fromDate: formatDateForParam(start),
    toDate: formatDateForParam(end),
  };
}

export type ExportRangeInput = {
  exportRangeType: ExportRangeType;
  exportDate: string;
  exportWeek: string;
  exportMonth: string;
  exportYear: string;
  exportCustomFromDate: string;
  exportCustomToDate: string;
};

export function computeExportDateRange(input: ExportRangeInput): {
  fromDate?: string;
  toDate?: string;
  error?: string;
} {
  const {
    exportRangeType,
    exportDate,
    exportWeek,
    exportMonth,
    exportYear,
    exportCustomFromDate,
    exportCustomToDate,
  } = input;

  if (exportRangeType === "all") return {};

  if (exportRangeType === "date") {
    if (!exportDate) return { error: "Please select a date for export" };
    return { fromDate: exportDate, toDate: exportDate };
  }

  if (exportRangeType === "week") {
    if (!exportWeek) return { error: "Please select a week for export" };
    const weekRange = parseWeekToDateRange(exportWeek);
    if (!weekRange) return { error: "Invalid week selected" };
    return weekRange;
  }

  if (exportRangeType === "month") {
    if (!exportMonth) return { error: "Please select a month for export" };
    const [yearText, monthText] = exportMonth.split("-");
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;
    if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
      return { error: "Invalid month selected" };
    }
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    return {
      fromDate: formatDateForParam(start),
      toDate: formatDateForParam(end),
    };
  }

  if (exportRangeType === "year") {
    const year = Number(exportYear);
    if (Number.isNaN(year) || year < 1970 || year > 9999) {
      return { error: "Please enter a valid year" };
    }
    return {
      fromDate: `${year}-01-01`,
      toDate: `${year}-12-31`,
    };
  }

  if (exportRangeType === "custom") {
    if (!exportCustomFromDate || !exportCustomToDate) {
      return { error: "Please select both from and to dates" };
    }
    if (exportCustomFromDate > exportCustomToDate) {
      return { error: "From date cannot be later than to date" };
    }
    return { fromDate: exportCustomFromDate, toDate: exportCustomToDate };
  }

  return {};
}

export function getOrderId(order: AdminOrderLike): string {
  return order.orderId || order._id || "";
}

export function normOrderStatus(s: string | undefined): string {
  const v = (s || "").toLowerCase();
  return v === "shipped" ? "processing" : v;
}

export function getStatusLabel(status: string | undefined): string {
  const n = normOrderStatus(status) || "processing";
  if (n === "delivered") return "Success";
  return n.charAt(0).toUpperCase() + n.slice(1);
}

export function filterOrdersBySearch<T extends AdminOrderLike>(
  orders: T[],
  searchTerm: string,
): T[] {
  if (!searchTerm.trim()) return orders;

  const search = searchTerm.toLowerCase();
  const searchCompact = search.replace(/\s/g, "");
  return orders.filter((order) => {
    const userName = order.userId?.fullName?.toLowerCase() || "";
    const userEmail = order.userId?.email?.toLowerCase() || "";
    const shippingName = order.shippingAddress?.fullName?.toLowerCase() || "";
    const notesEmail = emailFromOrderNotes(order.notes).toLowerCase();
    const phone =
      displayOrderCustomerPhone(order).toLowerCase().replace(/\s/g, "") || "";
    return (
      userName.includes(search) ||
      userEmail.includes(search) ||
      shippingName.includes(search) ||
      notesEmail.includes(search) ||
      (phone && phone.includes(searchCompact))
    );
  });
}

export function filterExportRowsBySearch(rows: Record<string, unknown>[], searchTerm: string) {
  if (!searchTerm.trim()) return rows;

  const search = searchTerm.toLowerCase();
  const searchCompact = search.replace(/\s/g, "");

  return rows.filter((row) => {
    const customerName = String(row["Customer Name"] || "").toLowerCase();
    const customerEmail = String(row["Customer Email"] || "").toLowerCase();
    const customerPhone = String(row["Customer Phone"] || "")
      .toLowerCase()
      .replace(/\s/g, "");
    return (
      customerName.includes(search) ||
      customerEmail.includes(search) ||
      (customerPhone && customerPhone.includes(searchCompact))
    );
  });
}
