import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | null;
    rating: number; // 1-5 stars
    comment: string;
    isAnonymous: boolean; // True if admin reviewing as anonymous user
    anonymousName?: string; // Custom name for anonymous reviews
    createdBy?: mongoose.Types.ObjectId; // Admin who created the anonymous review
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Not required for anonymous reviews
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    anonymousName: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Admin who created the anonymous review
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

// Compound index to ensure one review per user per product (only for non-anonymous reviews)
ReviewSchema.index({ product: 1, user: 1 }, { 
    unique: true, 
    sparse: true, // Allow null user for anonymous reviews
    partialFilterExpression: { isAnonymous: false } // Only apply to non-anonymous reviews
});

// Virtual for populating user details
ReviewSchema.virtual('userDetails', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true,
});

export default mongoose.model<IReview>('Review', ReviewSchema);