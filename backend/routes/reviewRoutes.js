"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes
router.get('/product/:productId', reviewController_1.getProductReviews);
router.get('/product/:productId/stats', reviewController_1.getProductReviewStats);
// Protected routes (require authentication)
router.post('/product/:productId', auth_1.authenticate, reviewController_1.createReview);
router.put('/:reviewId', auth_1.authenticate, reviewController_1.updateReview);
router.delete('/:reviewId', auth_1.authenticate, reviewController_1.deleteReview);
// Admin routes
router.get('/admin/all', auth_1.authenticate, reviewController_1.getAllReviews);
exports.default = router;
