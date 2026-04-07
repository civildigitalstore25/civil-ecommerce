import { useState, useEffect, useCallback } from "react";
import type { Banner } from "../../../types/Banner";
import {
  fetchBannersList,
  deleteBannerById,
  saveBannerRequest,
} from "./bannerAdminApi";

export function useBannerAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchBannersList();
      setBanners(list);
    } catch (err) {
      console.error(err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, banners.length]);

  const totalPages = Math.max(1, Math.ceil(banners.length / pageSize));
  const paginatedBanners = banners.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteBannerById(id);
      loadBanners();
    } catch (err) {
      console.error(err);
      alert("Error deleting banner");
    }
  };

  const handleFormSubmit = async (data: Banner) => {
    try {
      await saveBannerRequest(editingBanner, data);
      setShowForm(false);
      setEditingBanner(null);
      loadBanners();
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  };

  const openCreate = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditingBanner(b);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  return {
    banners,
    loading,
    showForm,
    editingBanner,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedBanners,
    handleDelete,
    handleFormSubmit,
    openCreate,
    openEdit,
    closeForm,
  };
}
