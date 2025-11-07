"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const router = express_1.default.Router();
// Specific routes must come BEFORE parameterized routes
router.post('/validate', couponController_1.validateCoupon);
router.post('/apply', couponController_1.applyCoupon);
// General CRUD routes
router.get('/', couponController_1.getCoupons);
router.post('/', couponController_1.createCoupon);
router.get('/:id', couponController_1.getCoupon);
router.put('/:id', couponController_1.updateCoupon);
router.delete('/:id', couponController_1.deleteCoupon);
exports.default = router;
