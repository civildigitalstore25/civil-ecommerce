"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Basic auth routes
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
// Password reset routes
router.post('/forgot-password', authController_1.forgotPassword);
router.get('/validate-reset-token/:token', authController_1.validateResetToken);
router.post('/reset-password/:token', authController_1.resetPassword);
// Protected routes
router.get('/me', auth_1.authenticate, authController_1.getCurrentUser);
router.put('/profile', auth_1.authenticate, authController_1.updateProfile);
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), authController_1.googleCallback);
exports.default = router;
