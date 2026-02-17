import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories,
    getCompanies,
    getBrands,
    getProductsByName,
    getProductsByCategory,
    getProductsByCompany,
    getProductsWithFilters,
    getCategoriesWithCount,
    getCompaniesWithCount,
    trackProductViewer,
    getProductViewerCount,
    removeProductViewer,
    incrementProductViewCount,
    getProductViewCount
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Filter lists (MUST come before parameterized routes like /:id)
router.get('/filters/categories', getCategories);
router.get('/filters/companies', getCompanies);
router.get('/filters/brands', getBrands);
router.get('/filters/categories-count', getCategoriesWithCount);
router.get('/filters/companies-count', getCompaniesWithCount);

// Filtered product queries (MUST come before /:id route)
router.get('/filter/name', getProductsByName);
router.get('/filter/category/:category', getProductsByCategory);
router.get('/filter/company/:company', getProductsByCompany);
router.get('/filter/advanced', getProductsWithFilters);

// Viewer tracking routes (MUST come before /:id route)
router.post('/:id/track-viewer', trackProductViewer);
router.get('/:id/viewer-count', getProductViewerCount);
router.post('/:id/remove-viewer', removeProductViewer);
router.post('/:id/increment-view', incrementProductViewCount);
router.get('/:id/view-count', getProductViewCount);

// CRUD operations (parameterized routes like /:id MUST come last)
// Admin only routes - require authentication and admin role
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

// Public routes - no authentication required
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;