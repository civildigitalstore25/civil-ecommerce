import { useState } from "react";
import { exportOrders } from "../../../api/adminOrderApi";
import {
  computeExportDateRange,
  filterExportRowsBySearch,
  type ExportRangeType,
} from "./adminOrderUtils";
import { swalError, swalFire, swalWarning } from "../../../utils/swal";

type Params = {
  statusFilter: string;
  searchTerm: string;
};

export function useAdminOrdersExport({ statusFilter, searchTerm }: Params) {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportRangeType, setExportRangeType] = useState<ExportRangeType>("all");
  const [exportDate, setExportDate] = useState("");
  const [exportWeek, setExportWeek] = useState("");
  const [exportMonth, setExportMonth] = useState("");
  const [exportYear, setExportYear] = useState(String(new Date().getFullYear()));
  const [exportCustomFromDate, setExportCustomFromDate] = useState("");
  const [exportCustomToDate, setExportCustomToDate] = useState("");

  const getExportDataFromBackend = async () => {
    const { fromDate, toDate, error } = computeExportDateRange({
      exportRangeType,
      exportDate,
      exportWeek,
      exportMonth,
      exportYear,
      exportCustomFromDate,
      exportCustomToDate,
    });

    if (error) {
      void swalWarning("Warning", error);
      return [];
    }

    const response = await exportOrders("json", {
      status: statusFilter ? statusFilter.toLowerCase() : undefined,
      dateRangeType: exportRangeType,
      fromDate,
      toDate,
    });

    const rows = Array.isArray(response?.data) ? response.data : [];
    return filterExportRowsBySearch(rows as Record<string, unknown>[], searchTerm);
  };

  const handleExportExcel = async () => {
    try {
      const data = await getExportDataFromBackend();
      if (data.length === 0) {
        void swalWarning("Warning", "No orders to export");
        return;
      }
      const XLSX: typeof import("xlsx") = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.xlsx`,
      );
      void swalFire({ icon: "success", title: "Success", text: "Orders exported to Excel" });
    } catch {
      void swalError("Failed to export orders to Excel", "Error");
    }
  };

  const handleExportJSON = async () => {
    try {
      const data = await getExportDataFromBackend();
      if (data.length === 0) {
        void swalWarning("Warning", "No orders to export");
        return;
      }
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      void swalFire({ icon: "success", title: "Success", text: "Orders exported to JSON" });
    } catch {
      void swalError("Failed to export orders to JSON", "Error");
    }
  };

  return {
    exportOpen,
    setExportOpen,
    exportRangeType,
    setExportRangeType,
    exportDate,
    setExportDate,
    exportWeek,
    setExportWeek,
    exportMonth,
    setExportMonth,
    exportYear,
    setExportYear,
    exportCustomFromDate,
    setExportCustomFromDate,
    exportCustomToDate,
    setExportCustomToDate,
    handleExportExcel,
    handleExportJSON,
  };
}
