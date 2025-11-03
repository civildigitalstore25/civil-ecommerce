"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleReviewsController_1 = require("../controllers/googleReviewsController");
const router = express_1.default.Router();
// Public route to get Google Reviews
router.get('/', googleReviewsController_1.getGoogleReviews);
exports.default = router;
