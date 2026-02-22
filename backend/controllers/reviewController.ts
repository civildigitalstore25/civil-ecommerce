import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import mongoose from 'mongoose';

// Get all reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format reviews to handle anonymous ones
        const formattedReviews = reviews.map(review => {
            const reviewObj = review.toObject();
            if (review.isAnonymous) {
                return {
                    ...reviewObj,
                    user: {
                        _id: 'anonymous',
                        fullName: review.anonymousName || 'Anonymous User',
                        email: '',
                    },
                };
            }
            return reviewObj;
        });

        const total = await Review.countDocuments({ product: productId });

        res.json({
            reviews: formattedReviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { rating, comment, isAnonymous, anonymousName } = req.body;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdminUser = userRole === 'admin' || userRole === 'superadmin';

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If reviewing as themselves (not anonymous)
        if (!isAnonymous) {
            // Check if user already reviewed this product
            const existingReview = await Review.findOne({ 
                product: productId, 
                user: userId,
                isAnonymous: false 
            });
            if (existingReview) {
                return res.status(400).json({ message: 'You have already reviewed this product' });
            }

            const review = new Review({
                product: productId,
                user: userId,
                rating,
                comment,
                isAnonymous: false,
            });

            await review.save();

            // Populate user details for response
            await review.populate('user', 'fullName email');

            return res.status(201).json(review);
        }

        // Anonymous review (admin/superadmin only)
        if (isAnonymous) {
            // Only admins can create anonymous reviews
            if (!isAdminUser) {
                return res.status(403).json({ message: 'Only admins can create anonymous reviews' });
            }

            // Validate anonymous name
            if (!anonymousName || anonymousName.trim() === '') {
                return res.status(400).json({ message: 'Anonymous name is required for anonymous reviews' });
            }

            const review = new Review({
                product: productId,
                user: null, // No user for anonymous reviews
                rating,
                comment,
                isAnonymous: true,
                anonymousName: anonymousName.trim(),
                createdBy: userId, // Track which admin created this
            });

            await review.save();

            return res.status(201).json(review);
        }

        return res.status(400).json({ message: 'Invalid review data' });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdmin = userRole === 'admin' || userRole === 'superadmin';

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // For anonymous reviews, only the admin who created it can update
        if (review.isAnonymous) {
            if (!isAdmin || (review.createdBy && review.createdBy.toString() !== userId)) {
                return res.status(403).json({ message: 'Not authorized to update this review' });
            }
        } else {
            // For regular reviews, check if user owns the review or is admin
            if (review.user && review.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to update this review' });
            }
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();
        
        if (!review.isAnonymous) {
            await review.populate('user', 'fullName email');
        }

        res.json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdmin = userRole === 'admin' || userRole === 'superadmin';

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // For anonymous reviews, only the admin who created it can delete
        if (review.isAnonymous) {
            if (!isAdmin || (review.createdBy && review.createdBy.toString() !== userId)) {
                return res.status(403).json({ message: 'Not authorized to delete this review' });
            }
        } else {
            // For regular reviews, check if user owns the review or is admin
            if (review.user && review.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to delete this review' });
            }
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all reviews for admin (with pagination)
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const reviews = await Review.find()
            .populate('user', 'fullName email')
            .populate('product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments();

        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get review statistics for a product
export const getProductReviewStats = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        console.log('Getting review stats for productId:', productId);
        console.log('productId type:', typeof productId);
        console.log('productId length:', productId?.length);

        // Check if productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.log('Invalid ObjectId:', productId);
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const objectId = new mongoose.Types.ObjectId(productId);
        console.log('Converted ObjectId:', objectId);

        // Check total reviews in database
        const totalReviewsInDb = await Review.countDocuments();
        console.log('Total reviews in database:', totalReviewsInDb);

        // Check reviews for this product
        const reviewsForProduct = await Review.countDocuments({ product: objectId });
        console.log('Reviews for this product:', reviewsForProduct);

        const stats = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
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
        stats[0].ratingDistribution.forEach((rating: number) => {
            distribution[rating as keyof typeof distribution]++;
        });

        res.json({
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalReviews: stats[0].totalReviews,
            ratingDistribution: distribution
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};