/**
 * Product API: queries, mutations, and stats helpers.
 * Implementation lives under `./products/`; import from here to keep call sites stable.
 */
export {
  useProducts,
  useProductDetail,
  useCategories,
  useCompanies,
  useBestSellingProducts,
  getBestSellingProducts,
  useLatestProducts,
  getLatestProducts,
} from "./products/productQueries";

export {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./products/productMutations";

export {
  trackProductViewer,
  getProductViewerCount,
  removeProductViewer,
  incrementProductViewCount,
  getProductViewCountStatic,
  getProductSoldQuantity,
} from "./products/productStatsApi";
