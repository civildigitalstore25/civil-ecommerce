"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getCompaniesWithCount = exports.getCategoriesWithCount = exports.getBrands = exports.getCompanies = exports.getCategories = exports.getProductsWithFilters = exports.getProductsByCompany = exports.getProductsByCategory = exports.getProductsByName = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// Create new product
const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        if (productData.brand && !productData.company) {
            productData.company = productData.brand;
        }
        if (productData.imageUrl && !productData.image) {
            productData.image = productData.imageUrl;
        }
        if (productData.subscriptionDurations && productData.subscriptionDurations.length > 0) {
            productData.price1 = productData.subscriptionDurations[0].price;
            if (productData.subscriptionDurations.length > 1) {
                productData.price3 = productData.subscriptionDurations[1].price;
            }
        }
        if (productData.hasLifetime && productData.lifetimePrice) {
            productData.priceLifetime = Number(productData.lifetimePrice);
        }
        const product = new Product_1.default(productData);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
// Get all products with search and filter
const getProducts = async (req, res) => {
    try {
        const { search, category, company, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { version: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        if (company) {
            filter.company = { $regex: company, $options: 'i' };
        }
        const products = await Product_1.default.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
// Get products filtered by name
const getProductsByName = async (req, res) => {
    try {
        const { name, page = 1, limit = 10 } = req.query;
        if (!name) {
            res.status(400).json({ message: 'Name query parameter is required' });
            return;
        }
        const filter = {
            name: { $regex: name, $options: 'i' }
        };
        const products = await Product_1.default.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            filter: { name: name }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsByName = getProductsByName;
// Get products filtered by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
        if (!category) {
            res.status(400).json({ message: 'Category parameter is required' });
            return;
        }
        const filter = {
            category: { $regex: category, $options: 'i' }
        };
        const sortOption = {};
        sortOption[sort] = -1;
        const products = await Product_1.default.find(filter)
            .sort(sortOption)
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            filter: { category }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsByCategory = getProductsByCategory;
// Get products filtered by company/brand
const getProductsByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
        if (!company) {
            res.status(400).json({ message: 'Company parameter is required' });
            return;
        }
        // Search in both company and brand fields for backward compatibility
        const filter = {
            $or: [
                { company: { $regex: company, $options: 'i' } },
                { brand: { $regex: company, $options: 'i' } }
            ]
        };
        const sortOption = {};
        sortOption[sort] = -1;
        const products = await Product_1.default.find(filter)
            .sort(sortOption)
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            filter: { company }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsByCompany = getProductsByCompany;
// Get products with multiple filters (advanced filter)
const getProductsWithFilters = async (req, res) => {
    try {
        const { name, category, company, minPrice, maxPrice, isBestSeller, status, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
        const filter = {};
        // Name filter
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        // Category filter
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        // Company/Brand filter
        if (company) {
            filter.$or = [
                { company: { $regex: company, $options: 'i' } },
                { brand: { $regex: company, $options: 'i' } }
            ];
        }
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price1 = {};
            if (minPrice)
                filter.price1.$gte = Number(minPrice);
            if (maxPrice)
                filter.price1.$lte = Number(maxPrice);
        }
        // Best seller filter
        if (isBestSeller !== undefined) {
            filter.isBestSeller = isBestSeller === 'true';
        }
        // Status filter
        if (status) {
            filter.status = status;
        }
        const sortOption = {};
        sortOption[sort] = order === 'asc' ? 1 : -1;
        const products = await Product_1.default.find(filter)
            .sort(sortOption)
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            filters: { name, category, company, minPrice, maxPrice, isBestSeller, status }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsWithFilters = getProductsWithFilters;
// Get unique categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product_1.default.distinct('category');
        res.json(categories.filter(cat => cat)); // Filter out null/undefined
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
// Get unique companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Product_1.default.distinct('company');
        res.json(companies.filter(comp => comp)); // Filter out null/undefined
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCompanies = getCompanies;
// Get unique brands (for new structure)
const getBrands = async (req, res) => {
    try {
        const brands = await Product_1.default.distinct('brand');
        const companies = await Product_1.default.distinct('company');
        const allBrands = [...new Set([...brands.filter(b => b), ...companies])];
        res.json(allBrands);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBrands = getBrands;
// Get category with product count
const getCategoriesWithCount = async (req, res) => {
    try {
        const categories = await Product_1.default.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, category: '$_id', count: 1 } }
        ]);
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategoriesWithCount = getCategoriesWithCount;
// Get companies with product count
const getCompaniesWithCount = async (req, res) => {
    try {
        const companies = await Product_1.default.aggregate([
            { $group: { _id: '$company', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, company: '$_id', count: 1 } }
        ]);
        res.json(companies);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCompaniesWithCount = getCompaniesWithCount;
// Get single product by id
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
// Update product by id
const updateProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        if (productData.brand && !productData.company) {
            productData.company = productData.brand;
        }
        if (productData.imageUrl && !productData.image) {
            productData.image = productData.imageUrl;
        }
        if (productData.subscriptionDurations && productData.subscriptionDurations.length > 0) {
            productData.price1 = productData.subscriptionDurations[0].price;
            if (productData.subscriptionDurations.length > 1) {
                productData.price3 = productData.subscriptionDurations[1].price;
            }
        }
        if (productData.hasLifetime && productData.lifetimePrice) {
            productData.priceLifetime = Number(productData.lifetimePrice);
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
// Delete product by id
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
