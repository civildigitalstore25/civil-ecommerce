import { useCallback } from "react";
import { userApi } from "../../../api/userApi";
import { swalError } from "../../../utils/swal";

function exportFilenameBase() {
  return `users_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}`;
}

export function useUserManagementExport(searchTerm: string, roleFilter: string) {
  const fetchAllUsers = useCallback(async () => {
    const resp = await userApi.getUsers({
      search: searchTerm,
      role: roleFilter,
    });
    const list = resp.users || [];
    return list.map((u) => ({
      id: u._id,
      fullName: u.fullName || "",
      email: u.email,
      phoneNumber: u.phoneNumber || "",
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }, [searchTerm, roleFilter]);

  const exportExcel = useCallback(async () => {
    try {
      const data = await fetchAllUsers();
      const XLSX: typeof import("xlsx") = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      XLSX.writeFile(wb, `${exportFilenameBase()}.xlsx`);
    } catch {
      await swalError("Error", "Failed to export users");
    }
  }, [fetchAllUsers]);

  const exportJSON = useCallback(async () => {
    try {
      const data = await fetchAllUsers();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportFilenameBase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      await swalError("Error", "Failed to export users");
    }
  }, [fetchAllUsers]);

  return { exportExcel, exportJSON };
}
