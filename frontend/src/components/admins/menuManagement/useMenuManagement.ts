import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from "react";
import { getAllMenus, createMenu } from "../../../api/menuApi";
import type { IMenu, CreateMenuDTO } from "../../../api/menuApi";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import { initialCreateMenuForm } from "./initialMenuForm";

function axiosErrorMessage(err: unknown, fallback: string): string {
  const ax = err as { response?: { data?: { message?: string } } };
  return ax.response?.data?.message || fallback;
}

export function useMenuManagement() {
  const { colors } = useAdminTheme();
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateMenuDTO>(initialCreateMenuForm);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllMenus(true);
      setMenus(response.data);
      setError(null);
    } catch (err: unknown) {
      setError(axiosErrorMessage(err, "Failed to fetch menus"));
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = useCallback(() => {
    setFormData(initialCreateMenuForm());
    setShowAddForm(false);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createMenu(formData);
      fetchMenus();
      resetForm();
    } catch (err: unknown) {
      setError(axiosErrorMessage(err, "Failed to create menu"));
      console.error("Error creating menu:", err);
    }
  };

  return {
    colors,
    menus,
    loading,
    error,
    setError,
    showAddForm,
    setShowAddForm,
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
