import mongoose, { Document, Schema } from 'mongoose';

export interface IReply {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | null;
    comment: string;
    isAnonymous: boolean;
    anonymousName?: string;
    createdBy?: mongoose.Types.ObjectId; // Admin who created the anonymous reply
    createdAt: Date;
    updatedAt: Date;
}

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | null;
    rating: number; // 1-5 stars
    comment: string;
    isAnonymous: boolean; // True if admin reviewing as anonymous user
    anonymousName?: string; // Custom name for anonymous reviews
    createdBy?: mongoose.Types.ObjectId; // Admin who created the anonymous review
    replies: mongoose.Types.DocumentArray<IReply & mongoose.Types.Subdocument>;
    createdAt: Date;
    updatedAt: Date;
}

// Reply subdocument schema
const ReplySchema = new Schema<IReply>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Not required for anonymous replies
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
        required: false, // Admin who created the anonymous reply
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false,
});

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
    replies: [ReplySchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false, // Disable automatic timestamps to allow manual control
    toJSON: { virtuals: true },
});

// Index for efficient querying - allows multiple reviews per user per product
ReviewSchema.index({ product: 1, user: 1 });
ReviewSchema.index({ product: 1, createdAt: -1 }); // For sorting reviews by date

// Virtual for populating user details
ReviewSchema.virtual('userDetails', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true,
});

// Pre-save hook to update updatedAt timestamp on modifications
ReviewSchema.pre('save', function(next) {
    // Always update updatedAt when document is modified
    if (!this.isNew) {
        this.updatedAt = new Date();
    }
    // For new documents, if createdAt is not set, set it to now
    if (this.isNew && !this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

export default mongoose.model<IReview>('Review', ReviewSchema);