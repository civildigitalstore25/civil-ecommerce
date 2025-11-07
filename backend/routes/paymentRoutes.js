"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// User routes (require authentication)
router.post('/create-order', auth_1.authenticate, paymentController_1.createOrder);
router.post('/verify', auth_1.authenticate, paymentController_1.verifyPayment);
router.post('/failed', auth_1.authenticate, paymentController_1.paymentFailed);
router.get('/orders', auth_1.authenticate, paymentController_1.getUserOrders);
router.get('/orders/:orderId', auth_1.authenticate, paymentController_1.getOrder);
router.delete('/orders/:orderId', auth_1.authenticate, paymentController_1.deleteOrder);
// Admin routes
router.get('/admin/orders', auth_1.authenticate, auth_1.requireAdmin, paymentController_1.getAllOrders);
router.put('/admin/orders/:orderId/status', auth_1.authenticate, auth_1.requireAdmin, paymentController_1.updateOrderStatus);
router.delete('/admin/orders/:orderId', auth_1.authenticate, auth_1.requireAdmin, paymentController_1.adminDeleteOrder);
router.post('/refund/:orderId', auth_1.authenticate, auth_1.requireAdmin, paymentController_1.initiateRefund);
exports.default = router;
