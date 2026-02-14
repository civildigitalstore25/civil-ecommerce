import { useEffect } from 'react';
import type { ProductForm } from '../constants/productFormConstants';

const DRAFT_STORAGE_KEY = 'product-form-draft';
const DRAFT_TIMESTAMP_KEY = 'product-form-draft-timestamp';
const AUTO_SAVE_INTERVAL = 3000; // 3 seconds

/**
 * Custom hook for managing product form draft with auto-save functionality
 * @param formData - Current form data to auto-save
 * @param isEditing - Whether editing an existing product (disables auto-save for edits)
 */
export const useProductFormDraft = (
  formData: ProductForm,
  isEditing: boolean = false
) => {
  // Auto-save draft to localStorage (only for new products, not edits)
  useEffect(() => {
    if (isEditing) return; // Don't auto-save when editing existing products

    const timer = setTimeout(() => {
      saveDraft(formData);
    }, AUTO_SAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [formData, isEditing]);

  /**
   * Save draft to localStorage
   */
  const saveDraft = (data: ProductForm) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  /**
   * Load draft from localStorage
   */
  const loadDraft = (): ProductForm | null => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };

  /**
   * Clear draft from localStorage
   */
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  /**
   * Get the last saved timestamp
   */
  const getLastSavedTime = (): Date | null => {
    try {
      const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Failed to get last saved time:', error);
      return null;
    }
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    getLastSavedTime,
  };
};
