import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../api/productApi";
import type { Product } from "../../../api/types/productTypes.ts";
import AddProductModal from "./AddProductModal";
import ProductViewModal from "./ProductViewModal";
import AdminPagination from "../components/AdminPagination";
import Swal from "sweetalert2";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

const DraftProducts: React.FC = () => {
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
      (product as any).adminSubscription && (product as any).adminSubscription.length > 0
        ? (product as any).adminSubscription
          .map((ad: any, idx: number) => {
            const price = pickFirstPositive(ad?.priceINR, ad?.price, 0);
            if (!price) return null;
            return {
              label: ad?.duration || `Admin Option ${idx + 1}`,
              price,
            };
          })
          .filter(isPricingLine)
        : [];

    if (adminSubscriptionLines.length > 0) {
      groups.push({ title: "Admin Subscription Pricing", lines: adminSubscriptionLines });
    }

    return groups;
  };

  const { colors } = useAdminTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showBestSellers, setShowBestSellers] = useState(false);

  // Fetch data - only use enabled parameters
  const { data: productsData, isLoading } = useProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showBestSellers, pageSize]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    const result = await Swal.fire({
      title: "Delete Draft Product?",
      text: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
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
    });

    if (result.isConfirmed) {
      deleteProduct.mutate(product._id!, {
        onSuccess: () => {
          Swal.fire({
            title: "Deleted!",
            text: "Draft product has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: () => {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the draft product.",
            icon: "error",
          });
        },
      });
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const rawProducts = productsData?.products || [];

  // Only show draft products
  const allFilteredProducts = rawProducts.filter((product: Product) => {
    // Only show draft products
    if (product.status !== "draft") return false;

    // Enhanced search
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
    console.log('💾 Frontend - Saving draft product with driveLink:', productData.driveLink || 'NOT PROVIDED');

    if (editingProduct && editingProduct._id) {
      updateProduct.mutate(
        { id: editingProduct._id, updatedProduct: productData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            Swal.fire({
              title: "Success!",
              text: productData.status === 'active' 
                ? "Draft product has been published to Products!" 
                : "Draft product updated successfully!",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          },
          onError: (error: any) => {
            console.error('❌ Update failed:', error);
            const errorMessage = error?.response?.data?.message 
              || error?.message 
              || "Failed to save draft product. Please check all required fields.";
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          },
        },
      );
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setIsModalOpen(false);
          Swal.fire({
            title: "Success!",
            text: "Draft product created successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: (error: any) => {
          console.error('❌ Create failed:', error);
          const errorMessage = error?.response?.data?.message 
            || error?.message 
            || "Failed to create draft product. Please check all required fields.";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        },
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setShowBestSellers(false);
    setCurrentPage(1);
  };

  // Calculate statistics
  const totalDrafts = allFilteredProducts.length;

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <div className="p-6 space-y-6">
        {/* Dashboard Statistics Card */}
        <div className="grid grid-cols-1 gap-6 mb-8 relative">
          {/* Total Drafts Card */}
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
                  Total Draft Products
                </p>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.text.primary }}
                >
                  {totalDrafts}
                </p>
                <p
                  className="text-xs mt-1 opacity-60"
                  style={{ color: colors.text.secondary }}
                >
                  Not yet published
                </p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${colors.status.warning}20` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.status.warning }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className="text-2xl font-bold transition-colors duration-200"
              style={{ color: colors.text.primary }}
            >
              Draft Products
            </h1>
            <p
              className="text-sm mt-1 transition-colors duration-200"
              style={{ color: colors.text.secondary }}
            >
              Manage your draft products before publishing
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg text-white"
            style={{
              backgroundColor: colors.status.success,
            }}
          >
            <Plus className="w-5 h-5" />
            Add New Draft
          </button>
        </div>

        {/* Filters and Search */}
        <div
          className="rounded-xl p-6 shadow-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: colors.text.secondary }}
              />
              <input
                type="text"
                placeholder="Search draft products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || showBestSellers) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                  backgroundColor: colors.background.secondary,
                }}
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(searchTerm || showBestSellers) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.status.info}20`,
                    color: colors.status.info,
                  }}
                >
                  Search: {searchTerm}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Table */}
        <div
          className="rounded-xl shadow-lg overflow-hidden border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"></div>
              <p className="mt-2" style={{ color: colors.text.secondary }}>
                Loading draft products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <FileText
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                style={{ color: colors.text.secondary }}
              />
              <p
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
              >
                No draft products found
              </p>
              <p className="mt-2" style={{ color: colors.text.secondary }}>
                Create a new draft to get started
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className="transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      color: colors.text.secondary,
                    }}
                  >
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: colors.border.primary }}>
                    {products.map((product) => {
                      const pricingGroups = buildPricingGroups(product);

                      return (
                        <tr
                          key={product._id}
                          className="transition-colors duration-200 hover:opacity-80"
                          style={{ backgroundColor: colors.background.secondary }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl || product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p
                                  className="font-medium"
                                  style={{ color: colors.text.primary }}
                                >
                                  {product.name}
                                </p>
                                <p
                                  className="text-sm"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {product.version}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ color: colors.text.primary }}
                          >
                            {product.category}
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ color: colors.text.primary }}
                          >
                            {product.brand || product.company}
                          </td>
                          <td className="px-6 py-4">
                            {pricingGroups.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {pricingGroups.map((group, idx) => (
                                  <div key={idx}>
                                    <div
                                      className="text-xs opacity-75 mb-1"
                                      style={{ color: colors.text.secondary }}
                                    >
                                      {group.title}
                                    </div>
                                    {group.lines.map((line, lineIdx) => (
                                      <div
                                        key={lineIdx}
                                        className="flex items-center gap-2 text-sm"
                                        style={{ color: colors.text.primary }}
                                      >
                                        <span className="opacity-75">{line.label}:</span>
                                        <span className="font-semibold">
                                          ₹{line.price.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: colors.text.secondary }}>N/A</span>
                            )}
                          </td>
                          <td
                            className="px-6 py-4 text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewProduct(product)}
                                className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                                style={{
                                  backgroundColor: `${colors.status.info}20`,
                                  color: colors.status.info,
                                }}
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                                style={{
                                  backgroundColor: `${colors.status.warning}20`,
                                  color: colors.status.warning,
                                }}
                                title="Edit & Publish"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                                style={{
                                  backgroundColor: `${colors.status.error}20`,
                                  color: colors.status.error,
                                }}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                className="px-6 py-4 border-t transition-colors duration-200"
                style={{ borderColor: colors.border.primary }}
              >
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <AddProductModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={editingProduct}
        />
      )}

      {/* View Product Modal */}
      {isViewModalOpen && viewingProduct && (
        <ProductViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          product={viewingProduct}
        />
      )}
    </div>
  );
};

export default DraftProducts;
