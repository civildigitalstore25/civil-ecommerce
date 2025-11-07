"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Filter lists (MUST come before parameterized routes like /:id)
router.get('/filters/categories', productController_1.getCategories);
router.get('/filters/companies', productController_1.getCompanies);
router.get('/filters/brands', productController_1.getBrands);
router.get('/filters/categories-count', productController_1.getCategoriesWithCount);
router.get('/filters/companies-count', productController_1.getCompaniesWithCount);
// Filtered product queries (MUST come before /:id route)
router.get('/filter/name', productController_1.getProductsByName);
router.get('/filter/category/:category', productController_1.getProductsByCategory);
router.get('/filter/company/:company', productController_1.getProductsByCompany);
router.get('/filter/advanced', productController_1.getProductsWithFilters);
// CRUD operations (parameterized routes like /:id MUST come last)
// Admin only routes - require authentication and admin role
router.post('/', auth_1.authenticate, auth_1.requireAdmin, productController_1.createProduct);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, productController_1.updateProduct);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, productController_1.deleteProduct);
// Public routes - no authentication required
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
exports.default = router;
