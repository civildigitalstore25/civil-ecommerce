"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviewStats = exports.getAllReviews = exports.deleteReview = exports.updateReview = exports.createReview = exports.getProductReviews = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const reviews = await Review_1.default.find({ product: productId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Review_1.default.countDocuments({ product: productId });
        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProductReviews = getProductReviews;
// Create a new review
const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        // Check if product exists
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if user already reviewed this product
        const existingReview = await Review_1.default.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        const review = new Review_1.default({
            product: productId,
            user: userId,
            rating,
            comment,
        });
        await review.save();
        // Populate user details for response
        await review.populate('user', 'fullName email');
        res.status(201).json(review);
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createReview = createReview;
// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const review = await Review_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Check if user owns the review or is admin
        if (review.user.toString() !== userId && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();
        await review.populate('user', 'fullName email');
        res.json(review);
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateReview = updateReview;
// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const review = await Review_1.default.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Check if user owns the review or is admin
        if (review.user.toString() !== userId && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        await Review_1.default.findByIdAndDelete(reviewId);
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteReview = deleteReview;
// Get all reviews for admin (with pagination)
const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const reviews = await Review_1.default.find()
            .populate('user', 'fullName email')
            .populate('product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Review_1.default.countDocuments();
        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllReviews = getAllReviews;
// Get review statistics for a product
const getProductReviewStats = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log('Getting review stats for productId:', productId);
        console.log('productId type:', typeof productId);
        console.log('productId length:', productId?.length);
        // Check if productId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            console.log('Invalid ObjectId:', productId);
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const objectId = new mongoose_1.default.Types.ObjectId(productId);
        console.log('Converted ObjectId:', objectId);
        // Check total reviews in database
        const totalReviewsInDb = await Review_1.default.countDocuments();
        console.log('Total reviews in database:', totalReviewsInDb);
        // Check reviews for this product
        const reviewsForProduct = await Review_1.default.countDocuments({ product: objectId });
        console.log('Reviews for this product:', reviewsForProduct);
        const stats = await Review_1.default.aggregate([
            { $match: { product: new mongoose_1.default.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);
        console.log('Aggregation result:', stats);
        if (stats.length === 0) {
            return res.json({
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
        }
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        stats[0].ratingDistribution.forEach((rating) => {
            distribution[rating]++;
        });
        res.json({
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalReviews: stats[0].totalReviews,
            ratingDistribution: distribution
        });
    }
    catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProductReviewStats = getProductReviewStats;
