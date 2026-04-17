import { useState, useCallback } from "react";
import type { Product } from "../../../api/types/productTypes";
import { swalError } from "../../../utils/swal";

function buildExportRows(products: Product[]) {
  return products.map((p) => ({
    Name: p.name,
    Version: p.version,
    Category: p.category,
    Company: p.company,
    Brand: p.brand || "",
    Status: p.status || "active",
    "Best Seller": p.isBestSeller ? "Yes" : "No",
    Price:
      p.subscriptionDurations && p.subscriptionDurations.length > 0
        ? p.subscriptionDurations[0].price
        : p.price1,
    Tags: p.tags ? p.tags.join(", ") : "",
    Rating: p.rating || "",
    "Rating Count": p.ratingCount || "",
    "Created At": p.createdAt || "",
    "Updated At": p.updatedAt || "",
  }));
}

export function useAdminProductsExport(products: Product[]) {
  const [exportOpen, setExportOpen] = useState(false);

  const handleExportExcel = useCallback(async () => {
    try {
      const data = buildExportRows(products);
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(
        wb,
        `products_export_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")}.xlsx`,
      );
    } catch {
      void swalError("Failed to export products", "Error");
    }
  }, [products]);

  const handleExportJSON = useCallback(async () => {
    try {
      const data = buildExportRows(products);
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products_export_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      void swalError("Failed to export products", "Error");
    }
  }, [products]);

  return {
    exportOpen,
    setExportOpen,
    handleExportExcel,
    handleExportJSON,
  };
}
