import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Star,
  Award,
  CheckCircle,
} from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  useCompanies,
} from "../../../api/productApi";
import type { Product } from "../../../api/types/productTypes.ts";
import AddProductModal from "./AddProductModal";
import ProductViewModal from "./ProductViewModal";
import AdminPagination from "../components/AdminPagination";
import Swal from "sweetalert2";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

const Products: React.FC = () => {
  const [exportOpen, setExportOpen] = useState(false);

  type PricingLine = { label: string; price: number };
  type PricingGroup = { title: string; lines: PricingLine[] };

  const isPricingLine = (value: PricingLine | null): value is PricingLine =>
    value !== null;

  const pickFirstPositive = (...values: Array<number | undefined | null>) =>
    values.find((v) => typeof v === "number" && Number.isFinite(v) && v > 0) ??
    null;

  const buildPricingGroups = (product: Product): PricingGroup[] => {
    const groups: PricingGroup[] = [];

    const subscriptionDurationLines: PricingLine[] =
      product.subscriptionDurations && product.subscriptionDurations.length > 0
        ? product.subscriptionDurations
            .map((sd: any, idx: number) => {
              const price = pickFirstPositive(sd?.priceINR, sd?.price, 0);
              if (!price) return null;
              return {
                label: sd?.duration || `Option ${idx + 1}`,
                price,
              };
            })
            .filter(isPricingLine)
        : [];

    if (subscriptionDurationLines.length > 0) {
      groups.push({ title: "Subscription Pricing", lines: subscriptionDurationLines });
    } else {
      const legacyLines: PricingLine[] = [];
      if (typeof product.price1 === "number" && product.price1 > 0) {
        legacyLines.push({ label: "Price 1", price: product.price1 });
      }
      if (typeof product.price2 === "number" && product.price2 > 0) {
        legacyLines.push({ label: "Price 2", price: product.price2 });
      }
      if (typeof product.price3 === "number" && product.price3 > 0) {
        legacyLines.push({ label: "Price 3", price: product.price3 });
      }
      if (legacyLines.length > 0) {
        groups.push({ title: "Legacy Pricing", lines: legacyLines });
      }
    }

    const lifetimePrice = pickFirstPositive(
      (product as any).lifetimePriceINR,
      (product as any).priceLifetimeINR,
      (product as any).priceLifetime,
      (product as any).lifetimePrice,
    );
    if (lifetimePrice) {
      groups.push({
        title: "Lifetime Pricing",
        lines: [{ label: "Lifetime", price: lifetimePrice }],
      });
    }

    const membershipPrice = pickFirstPositive(
      (product as any).membershipPriceINR,
      (product as any).membershipPrice,
    );
    if (membershipPrice) {
      groups.push({
        title: "Membership Pricing",
        lines: [{ label: "Membership", price: membershipPrice }],
      });
    }

    const adminSubscriptionLines: PricingLine[] =
      (product as any).subscriptions && Array.isArray((product as any).subscriptions)
        ? (product as any).subscriptions
            .map((sub: any, idx: number) => {
              const price = pickFirstPositive(sub?.priceINR, sub?.price, 0);
              if (!price) return null;
              return {
                label: sub?.duration || `Plan ${idx + 1}`,
                price,
              };
            })
            .filter(isPricingLine)
        : [];
    if (adminSubscriptionLines.length > 0) {
      groups.push({ title: "Subscription Plans", lines: adminSubscriptionLines });
    }

    return groups;
  };

  // Export handlers
  const getExportData = () => {
    // Only export visible/filtered products with key fields
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
  };

  const handleExportExcel = async () => {
    try {
      const data = getExportData();
      const XLSX = (await import("xlsx")) as any;
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(
        wb,
        `products_export_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")}.xlsx`
      );
    } catch (err) {
      Swal.fire("Error", "Failed to export products", "error");
    }
  };

  const handleExportJSON = async () => {
    try {
      const data = getExportData();
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
    } catch (err) {
      Swal.fire("Error", "Failed to export products", "error");
    }
  };
  const { colors } = useAdminTheme();
  // Removed unused viewMode state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedCompany, selectedStatus, showBestSellers, pageSize]);

  // Build query params
  const queryParams = {
    search: debouncedSearch || undefined,
    category:
      selectedCategory !== "All Categories" ? selectedCategory : undefined,
    company: selectedCompany !== "All Companies" ? selectedCompany : undefined,
    limit: 1000, // Fetch up to 1000 products for admin panel
  };
  const { data: productsData, isLoading, error } = useProducts(queryParams);
  const { data: categories = [] } = useCategories();
  const { data: companies = [] } = useCompanies();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Selection state for bulk operations
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id!));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedProducts.length} product(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete each selected product
        selectedProducts.forEach(id => {
          deleteProductMutation.mutate(id);
        });
        setSelectedProducts([]);
        Swal.fire({
          title: "Deleted!",
          text: `${selectedProducts.length} product(s) have been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const rawProducts = productsData?.products || [];

  // Apply client-side filtering for new attributes
  const allFilteredProducts = rawProducts.filter((product: Product) => {
    // Filter by status
    if (selectedStatus !== "All Status") {
      const productStatus = product.status || "active"; // Default to active if no status
      if (productStatus !== selectedStatus) return false;
    }

    // Filter by best sellers
    if (showBestSellers && !product.isBestSeller) return false;

    // Enhanced search that includes new fields
    if (searchTerm && debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesBasicFields =
        product.name.toLowerCase().includes(searchLower) ||
        product.version.toLowerCase().includes(searchLower) ||
        product.company.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
        (product.shortDescription &&
          product.shortDescription.toLowerCase().includes(searchLower)) ||
        (product.description &&
          product.description.toLowerCase().includes(searchLower));

      const matchesTags =
        product.tags &&
        product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesBasicFields && !matchesTags) return false;
    }

    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(allFilteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const products = allFilteredProducts.slice(startIndex, endIndex);

  const handleSaveProduct = (productData: any) => {
    console.log('💾 Frontend - Saving product with driveLink:', productData.driveLink || 'NOT PROVIDED');

    if (editingProduct && editingProduct._id) {
      updateProductMutation.mutate(
        {
          id: editingProduct._id,
          updatedProduct: productData,
        },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Product updated successfully",
              timer: 2000,
              showConfirmButton: false,
            });
            setModalOpen(false);
            setEditingProduct(null);
          },
          onError: (error: any) => {
            console.error("Update product error:", error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: error.response?.data?.message || "Failed to update product",
            });
          },
        },
      );
    } else {
      createProductMutation.mutate(productData, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product created successfully",
            timer: 2000,
            showConfirmButton: false,
          });
          setModalOpen(false);
          setEditingProduct(null);
        },
        onError: (error: any) => {
          console.error("Create product error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response?.data?.message || "Failed to create product",
          });
        },
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = (id: string, productName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${productName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductMutation.mutate(id);

        Swal.fire({
          title: "Deleted!",
          text: `"${productName}" has been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-xl",
          },
        });
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedCompany("All Companies");
    setSelectedStatus("All Status");
    setShowBestSellers(false);
  };

  const handleToggleBestSeller = (product: Product) => {
    if (!product._id) return;

    const updatedProduct = {
      ...product,
      isBestSeller: !product.isBestSeller,
    };

    updateProductMutation.mutate(
      {
        id: product._id,
        updatedProduct: updatedProduct,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Product ${updatedProduct.isBestSeller ? "marked as" : "removed from"} best seller`,
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (error: any) => {
          console.error("Update best seller error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text:
              error.response?.data?.message ||
              "Failed to update best seller status",
          });
        },
      },
    );
  };

  const handleToggleOutOfStock = (product: Product) => {
    if (!product._id) return;

    const updatedProduct = {
      ...product,
      isOutOfStock: !product.isOutOfStock,
    };

    updateProductMutation.mutate(
      {
        id: product._id,
        updatedProduct: updatedProduct,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Product marked as ${updatedProduct.isOutOfStock ? "out of stock" : "in stock"}`,
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (error: any) => {
          console.error("Update out of stock error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text:
              error.response?.data?.message ||
              "Failed to update out of stock status",
          });
        },
      },
    );
  };

  // Calculate statistics
  const totalProducts = rawProducts.length;
  const activeProducts = rawProducts.filter(
    (product: Product) => (product.status || "active") === "active",
  ).length;

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <div className="p-6 space-y-6">
        {/* Dashboard Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative">
          {/* Total Products Card */}
          <div
            className="relative overflow-hidden rounded-xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium opacity-75"
                  style={{ color: colors.text.secondary }}
                >
                  Total Products
                </p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.text.primary }}
                >
                  {totalProducts}
                </p>
                <p
                  className="text-xs mt-1 opacity-60"
                  style={{ color: colors.text.secondary }}
                >
                  +100% active
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.status.warning}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.status.warning }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Products Card */}
          <div
            className="relative overflow-hidden rounded-xl p-6 shadow-lg border transition-all duration-200 hover:shadow-xl"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium opacity-75"
                  style={{ color: colors.text.secondary }}
                >
                  Active Products
                </p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.status.success }}
                >
                  {activeProducts}
                </p>
                <p
                  className="text-xs mt-1 opacity-60"
                  style={{ color: colors.text.secondary }}
                >
                  Ready for sale
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.status.success}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.status.success }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Export Dropdown Button - move to right end of row */}
          <div className="hidden lg:block absolute right-0 top-0">
            <div className="relative">
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium border flex items-center space-x-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                onClick={() => setExportOpen((v) => !v)}
                onBlur={() => setTimeout(() => setExportOpen(false), 150)}
              >
                <span>Export</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {exportOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-10"
                  style={{ background: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
                >
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    style={{ color: colors.text.primary }}
                    onClick={async () => {
                      await handleExportExcel();
                      setExportOpen(false);
                    }}
                    type="button"
                  >
                    Export to Excel
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                    style={{ color: colors.text.primary }}
                    onClick={async () => {
                      await handleExportJSON();
                      setExportOpen(false);
                    }}
                    type="button"
                  >
                    Export to JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Export Dropdown Button moved above */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 w-full sm:w-64 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-48 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
            >
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-48 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
            >
              <option>All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            {/* <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-40 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
            >
              <option>All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select> */}

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showBestSellers}
                onChange={(e) => setShowBestSellers(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
              />
              <span style={{ color: colors.text.secondary }}>
                Best Sellers Only
              </span>
            </label>

            {(searchTerm ||
              selectedCategory !== "All Categories" ||
              selectedCompany !== "All Companies" ||
              selectedStatus !== "All Status" ||
              showBestSellers) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.text.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.text.secondary)
                  }
                >
                  <X className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              )}
          </div>

          <div className="flex items-center space-x-3">
            {selectedProducts.length > 0 && (
              <button
                className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedProducts.length})</span>
              </button>
            )}
            <div
              className="flex items-center border rounded-lg"
              style={{ borderColor: colors.border.primary }}
            >


            </div>
            <button
              className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200"
              style={{
                background: '#0068ff',
                color: '#fff',
                border: 'none',
              }}
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div
            className="text-center py-8"
            style={{ color: colors.text.primary }}
          >
            Loading products...
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-400">
            Error loading products
          </div>
        )}

        {!isLoading && !error && (
          <div
            className="overflow-hidden transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className="border-b transition-colors duration-200"
                  style={{
                    borderBottomColor: colors.border.primary,
                  }}
                >
                  <tr>
                    <th
                      className="text-center py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Product
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Brand
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Category
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Pricing
                    </th>
                    {/* <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Status
                    </th> */}
                    <th
                      className="text-center py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Best Seller
                    </th>
                    <th
                      className="text-center py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Out of Stock
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y transition-colors duration-200"
                  style={{ borderColor: colors.border.secondary }}
                >
                  {products.map((product: Product) => (
                    <tr
                      key={product._id}
                      className="transition-colors duration-200"
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.background.accent)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id!)}
                          onChange={() => handleSelectProduct(product._id!)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden relative"
                            style={{
                              backgroundColor: colors.background.accent,
                            }}
                          >
                            <img
                              src={product.imageUrl || product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            {product.isBestSeller && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                                <Award className="w-3 h-3 text-black" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <div
                                className="font-medium truncate"
                                style={{ color: colors.text.primary }}
                              >
                                {product.name}
                              </div>
                              {product.isBestSeller && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-black">
                                  Best Seller
                                </span>
                              )}
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              v{product.version}
                            </div>

                            {product.rating && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span
                                  className="text-xs"
                                  style={{ color: colors.text.primary }}
                                >
                                  {product.rating}
                                </span>
                                {product.ratingCount && (
                                  <span
                                    className="text-xs"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    ({product.ratingCount})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div style={{ color: colors.text.primary }}>
                          {(product.brand || product.company) ? (product.brand || product.company).charAt(0).toUpperCase() + (product.brand || product.company).slice(1) : ""}
                        </div>
                        {product.company !== product.brand && product.brand && (
                          <div
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {product.company ? product.company.charAt(0).toUpperCase() + product.company.slice(1) : ""}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-block text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: colors.background.accent,
                            color: colors.text.primary,
                          }}
                        >
                          {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ""}
                        </span>
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: colors.background.accent,
                                  color: colors.text.secondary,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 2 && (
                              <span
                                className="text-xs"
                                style={{ color: colors.text.secondary }}
                              >
                                +{product.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          {(() => {
                            const groups = buildPricingGroups(product);
                            if (groups.length === 0) {
                              return (
                                <div
                                  className="text-xs"
                                  style={{ color: colors.text.secondary }}
                                >
                                  —
                                </div>
                              );
                            }

                            return groups.map((group) => (
                              <div key={group.title} className="space-y-1">
                                <div
                                  className="text-[11px] font-semibold"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {group.title}
                                </div>
                                {group.lines.map((line) => (
                                  <div
                                    key={`${group.title}-${line.label}`}
                                    className="flex items-center justify-between gap-3"
                                  >
                                    <div
                                      className="text-xs"
                                      style={{ color: colors.text.secondary }}
                                    >
                                      {line.label}
                                    </div>
                                    <div
                                      className="font-medium text-sm"
                                      style={{ color: colors.text.primary }}
                                    >
                                      ₹{line.price.toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      </td>
                      {/* <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {product.status === "active" && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-400">
                                Active
                              </span>
                            </div>
                          )}
                          {product.status === "inactive" && (
                            <div className="flex items-center space-x-1">
                              <Circle className="w-4 h-4 text-red-400" />
                              <span className="text-xs text-red-400">
                                Inactive
                              </span>
                            </div>
                          )}
                          {product.status === "draft" && (
                            <div className="flex items-center space-x-1">
                              <Circle className="w-4 h-4 text-yellow-400" />
                              <span className="text-xs text-yellow-400">
                                Draft
                              </span>
                            </div>
                          )}
                          {!product.status && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-400">
                                Active
                              </span>
                            </div>
                          )}
                        </div>
                      </td> */}
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.isBestSeller || false}
                              onChange={() => handleToggleBestSeller(product)}
                              className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                              style={{
                                accentColor: colors.interactive.primary,
                              }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: colors.text.secondary }}
                            >
                              {product.isBestSeller ? "Yes" : "No"}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.isOutOfStock || false}
                              onChange={() => handleToggleOutOfStock(product)}
                              className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                              style={{
                                accentColor: colors.interactive.primary,
                              }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: colors.text.secondary }}
                            >
                              {product.isOutOfStock ? "Yes" : "No"}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-gray-400 hover:text-yellow-400"
                            onClick={() => {
                              setViewingProduct(product);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-green-400"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-400"
                            onClick={() =>
                              product._id &&
                              handleDeleteProduct(product._id, product.name)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
            }}
          />
        )}

        <AddProductModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          product={editingProduct}
        />

        <ProductViewModal
          product={viewingProduct}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProduct(null);
          }}
        />
      </div>
    </div>
  );
};

export default Products;
