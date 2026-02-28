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
            .populate('replies.user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format reviews to handle anonymous ones and anonymous replies
        const formattedReviews = reviews.map(review => {
            const reviewObj: any = review.toObject();
            if (review.isAnonymous) {
                reviewObj.user = {
                    _id: 'anonymous',
                    fullName: review.anonymousName || 'Anonymous User',
                    email: '',
                };
            }
            // Format replies
            if (reviewObj.replies && reviewObj.replies.length > 0) {
                reviewObj.replies = reviewObj.replies.map((reply: any) => {
                    if (reply.isAnonymous) {
                        return {
                            ...reply,
                            user: {
                                _id: 'anonymous',
                                fullName: reply.anonymousName || 'Anonymous User',
                                email: '',
                            },
                        };
                    }
                    return reply;
                });
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
        const { rating, comment, isAnonymous, anonymousName, createdAt } = req.body;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdminUser = userRole === 'admin' || userRole === 'superadmin';

        console.log('Creating review:', { productId, userId, isAnonymous, rating, comment });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Admin/superadmin can create multiple anonymous reviews with different names
        if (isAnonymous) {
            console.log('Processing anonymous review:', { anonymousName, userId, isAdminUser });

            // Only admins can create anonymous reviews
            if (!isAdminUser) {
                console.log('Non-admin tried to create anonymous review');
                return res.status(403).json({ message: 'Only admins can create anonymous reviews' });
            }

            // Validate anonymous name
            if (!anonymousName || anonymousName.trim() === '') {
                console.log('Anonymous name missing or empty');
                return res.status(400).json({ message: 'Anonymous name is required for anonymous reviews' });
            }

            // Allow multiple anonymous reviews from the same admin (no duplicate check)
            // This enables admins to post reviews as different users
            const reviewData: any = {
                product: productId,
                user: null, // No user for anonymous reviews
                rating,
                comment,
                isAnonymous: true,
                anonymousName: anonymousName.trim(),
                createdBy: userId, // Track which admin created this
            };

            // Allow admin to set custom createdAt
            if (createdAt) {
                reviewData.createdAt = new Date(createdAt);
            }

            console.log('Creating anonymous review with data:', reviewData);

            const review = new Review(reviewData);
            await review.save();
            console.log('Anonymous review saved successfully:', review._id);

            return res.status(201).json({
                ...review.toObject(),
                user: {
                    _id: 'anonymous',
                    fullName: anonymousName.trim(),
                    email: '',
                },
            });
        }

        // If reviewing as themselves (not anonymous)
        if (!isAnonymous) {
            // Allow users to post multiple reviews - no duplicate check
            console.log('Creating non-anonymous review for user:', userId);

            const reviewData: any = {
                product: productId,
                user: userId,
                rating,
                comment,
                isAnonymous: false,
            };

            // Allow admin to set custom createdAt
            if (isAdminUser && createdAt) {
                reviewData.createdAt = new Date(createdAt);
            }

            const review = new Review(reviewData);
            await review.save();

            // Populate user details for response
            await review.populate('user', 'fullName email');

            return res.status(201).json(review);
        }

        return res.status(400).json({ message: 'Invalid review data' });
    } catch (error: any) {
        console.error('Error creating review:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });

        // Handle MongoDB duplicate key error (11000)
        if (error.code === 11000) {
            console.error('MongoDB duplicate key error - unique index violation:', error);
            console.error('This usually means the database has a unique index on { product, user }');
            console.error('Please run: npm run script:drop-review-index on production');
            return res.status(500).json({
                message: 'Database constraint error. Multiple reviews detected. Please contact support.',
                hint: 'Database migration needed - run drop-review-unique-index script'
            });
        }
        
        // Handle other MongoDB errors
        if (error.name === 'MongoServerError') {
            console.error('MongoDB server error:', error);
            return res.status(500).json({
                message: 'Database error occurred'
            });
        }

        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment, createdAt } = req.body;
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

        // Allow admin to update createdAt
        if (isAdmin && createdAt) {
            review.createdAt = new Date(createdAt);
        }

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

// Get all reviews for admin (with pagination, search, and filters)
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = (req.query.search as string) || '';
        const rating = req.query.rating as string;
        const dateFilter = (req.query.dateFilter as string) || 'all';
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (rating && !isNaN(parseInt(rating))) {
            filter.rating = parseInt(rating);
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            let startDate: Date;

            if (dateFilter === 'last-week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (dateFilter === 'last-month') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            } else if (dateFilter === 'last-year') {
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            } else {
                startDate = new Date(0);
            }
            filter.createdAt = { $gte: startDate };
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            const matchingProducts = await Product.find({ name: searchRegex }).select('_id').lean();
            const productIds = matchingProducts.map((p: any) => p._id);
            filter.$or = [
                { comment: searchRegex },
                { anonymousName: searchRegex },
                ...(productIds.length > 0 ? [{ product: { $in: productIds } }] : []),
            ];
        }

        const reviews = await Review.find(filter)
            .populate('user', 'fullName email')
            .populate('product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Review.countDocuments(filter);

        const formattedReviews = reviews.map((review: any) => {
            if (review.isAnonymous) {
                review.user = {
                    _id: null,
                    fullName: review.anonymousName || 'Anonymous User',
                    email: 'Anonymous Review',
                };
            }
            return review;
        });

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

// Add a reply to a review
export const addReplyToReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { comment, isAnonymous, anonymousName } = req.body;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdminUser = userRole === 'admin' || userRole === 'superadmin';

        console.log('Adding reply to review:', { reviewId, userId, isAnonymous, comment });

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Validate comment
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Reply comment is required' });
        }

        // Prepare reply data
        const replyData: any = {
            comment: comment.trim(),
            isAnonymous: isAnonymous || false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // If anonymous reply
        if (isAnonymous) {
            // Only admins can post anonymous replies
            if (!isAdminUser) {
                return res.status(403).json({ message: 'Only admins can post anonymous replies' });
            }

            // Validate anonymous name
            if (!anonymousName || anonymousName.trim() === '') {
                return res.status(400).json({ message: 'Anonymous name is required for anonymous replies' });
            }

            replyData.anonymousName = anonymousName.trim();
            replyData.user = null;
            replyData.createdBy = userId;
        } else {
            replyData.user = userId;
        }

        // Add reply to review
        review.replies.push(replyData);
        await review.save();

        // Populate the review with user details
        await review.populate('user', 'fullName email');
        await review.populate('replies.user', 'fullName email');

        // Format the review to handle anonymous replies
        const reviewObj: any = review.toObject();
        if (reviewObj.replies && reviewObj.replies.length > 0) {
            reviewObj.replies = reviewObj.replies.map((reply: any) => {
                if (reply.isAnonymous) {
                    return {
                        ...reply,
                        user: {
                            _id: 'anonymous',
                            fullName: reply.anonymousName || 'Anonymous User',
                            email: '',
                        },
                    };
                }
                return reply;
            });
        }

        res.status(201).json(reviewObj);
    } catch (error: any) {
        console.error('Error adding reply:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a reply
export const updateReply = async (req: Request, res: Response) => {
    try {
        const { reviewId, replyId } = req.params;
        const { comment } = req.body;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdmin = userRole === 'admin' || userRole === 'superadmin';

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Find the reply
        const reply = review.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check authorization
        if (reply.isAnonymous) {
            // For anonymous replies, only the admin who created it can update
            if (!isAdmin || (reply.createdBy && reply.createdBy.toString() !== userId)) {
                return res.status(403).json({ message: 'Not authorized to update this reply' });
            }
        } else {
            // For regular replies, check if user owns the reply or is admin
            if (reply.user && reply.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to update this reply' });
            }
        }

        // Update the reply
        reply.comment = comment || reply.comment;
        reply.updatedAt = new Date();

        await review.save();

        // Populate user details
        await review.populate('user', 'fullName email');
        await review.populate('replies.user', 'fullName email');

        res.json(review);
    } catch (error: any) {
        console.error('Error updating reply:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a reply
export const deleteReply = async (req: Request, res: Response) => {
    try {
        const { reviewId, replyId } = req.params;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;
        const isAdmin = userRole === 'admin' || userRole === 'superadmin';

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Find the reply
        const reply = review.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check authorization
        if (reply.isAnonymous) {
            // For anonymous replies, only the admin who created it can delete
            if (!isAdmin || (reply.createdBy && reply.createdBy.toString() !== userId)) {
                return res.status(403).json({ message: 'Not authorized to delete this reply' });
            }
        } else {
            // For regular replies, check if user owns the reply or is admin
            if (reply.user && reply.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to delete this reply' });
            }
        }

        // Remove the reply using pull
        review.replies.pull(replyId);
        await review.save();

        res.json({ message: 'Reply deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting reply:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};