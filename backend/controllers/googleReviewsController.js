"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleReviews = void 0;
const googleReviewsService_1 = __importDefault(require("../services/googleReviewsService"));
const getGoogleReviews = async (req, res) => {
    try {
        const reviews = await googleReviewsService_1.default.getReviews();
        res.json(reviews);
    }
    catch (error) {
        console.error('Error in getGoogleReviews:', error);
        res.status(500).json({
            error: 'Failed to fetch reviews',
            message: 'Unable to load Google Reviews at this time. Please try again later.'
        });
    }
};
exports.getGoogleReviews = getGoogleReviews;
