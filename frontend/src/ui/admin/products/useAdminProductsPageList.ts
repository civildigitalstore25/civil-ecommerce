import { useEffect, useMemo, useState } from "react";
import {
  useProducts,
  useCategories,
  useCompanies,
} from "../../../api/productApi";
import type { Product } from "../../../api/types/productTypes";
import { filterAdminProductsPageList } from "./filterAdminProductsPageList";

export function useAdminProductsPageList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCompany, setSelectedCompany] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedCategory,
    selectedCompany,
    selectedStatus,
    showBestSellers,
    pageSize,
  ]);

  const queryParams = {
    search: debouncedSearch || undefined,
    category:
      selectedCategory !== "All Categories" ? selectedCategory : undefined,
    company: selectedCompany !== "All Brands" ? selectedCompany : undefined,
    limit: 1000,
  };

  const { data: productsData, isLoading, error } = useProducts(queryParams);
  const { data: categories = [] } = useCategories();
  const { data: companies = [] } = useCompanies();

  const rawProducts = productsData?.products || [];

  const allFilteredProducts = useMemo(
    () =>
      rawProducts.filter((product: Product) =>
        filterAdminProductsPageList(product, {
          selectedStatus,
          showBestSellers,
          searchTerm,
          debouncedSearch,
        }),
      ),
    [
      rawProducts,
      selectedStatus,
      showBestSellers,
      searchTerm,
      debouncedSearch,
    ],
  );

  const totalPages = Math.ceil(allFilteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const products = allFilteredProducts.slice(startIndex, endIndex);

  const totalProducts = rawProducts.length;
  const activeProducts = rawProducts.filter(
    (p: Product) => (p.status || "active") === "active",
  ).length;
  const draftProducts = rawProducts.filter(
    (p: Product) => p.status === "draft",
  ).length;
  const inactiveProducts = rawProducts.filter(
    (p: Product) => p.status === "inactive",
  ).length;

  return {
    isLoading,
    error,
    categories,
    companies,
    products,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedCompany,
    setSelectedCompany,
    selectedStatus,
    setSelectedStatus,
    showBestSellers,
    setShowBestSellers,
    totalProducts,
    activeProducts,
    draftProducts,
    inactiveProducts,
  };
}
