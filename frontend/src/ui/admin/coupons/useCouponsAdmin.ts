import { useState, useEffect, useCallback } from "react";
import { swalFire } from "../../../utils/swal";
import type { Coupon, CouponFormPayload } from "./types";
import { getCouponApiBase } from "./couponApiBase";

export function useCouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const apiBase = getCouponApiBase();

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, coupons.length]);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBase}/api/coupons`);
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void fetchCoupons();
  }, [fetchCoupons]);

  const handleAddCoupon = async (coupon: CouponFormPayload) => {
    const editing = editingCoupon;
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${apiBase}/api/coupons/${editing._id}` : `${apiBase}/api/coupons`;
      const payload = { ...coupon, applicableProductIds: coupon.applicableProductIds ?? [] };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      const data = await res.json();
      if (editing) {
        setCoupons((prev) => prev.map((c) => (c._id === editing._id ? data : c)));
      } else {
        setCoupons((prev) => [data, ...prev]);
      }
      setShowForm(false);
      setEditingCoupon(null);

      await swalFire({
        icon: "success",
        title: editing ? "Coupon Updated!" : "Coupon Created!",
        text: editing
          ? `Coupon "${coupon.code}" has been updated successfully.`
          : `Coupon "${coupon.code}" has been created successfully.`,
        confirmButtonColor: "#10b981",
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save coupon. Please try again.";
      await swalFire({
        icon: "error",
        title: "Operation Failed",
        text: message,
        confirmButtonColor: "#ef4444",
      });
      throw err;
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = async (coupon: Coupon) => {
    const result = await swalFire({
      icon: "warning",
      title: "Delete Coupon?",
      text: `Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${apiBase}/api/coupons/${coupon._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));

      await swalFire({
        icon: "success",
        title: "Deleted!",
        text: `Coupon "${coupon.code}" has been deleted successfully.`,
        confirmButtonColor: "#10b981",
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete coupon. Please try again.";
      await swalFire({
        icon: "error",
        title: "Delete Failed",
        text: message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  return {
    coupons,
    showForm,
    setShowForm,
    editingCoupon,
    setEditingCoupon,
    loading,
    error,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    fetchCoupons,
    handleAddCoupon,
    handleEdit,
    handleDelete,
    openCreate,
  };
}
