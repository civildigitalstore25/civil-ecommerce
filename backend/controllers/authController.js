"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.validateResetToken = exports.forgotPassword = exports.updateProfile = exports.logout = exports.getCurrentUser = exports.googleCallback = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = __importDefault(require("../services/emailService"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};
const register = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, role } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const user = new User_1.default({
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            role: role === 'admin' ? 'admin' : 'user' // Allow admin role for testing
        });
        const savedUser = await user.save();
        const userId = savedUser._id.toString();
        const token = generateToken(userId);
        res.status(201).json({
            token,
            user: {
                id: userId,
                email: savedUser.email,
                fullName: savedUser.fullName,
                phoneNumber: savedUser.phoneNumber,
                role: savedUser.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: 'Please use Google login' });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const userId = user._id.toString();
        const token = generateToken(userId);
        res.json({
            token,
            user: {
                id: userId,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }
        const userId = user._id.toString();
        const token = generateToken(userId);
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.googleCallback = googleCallback;
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        console.log('👤 Current user ID:', user._id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
const logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.logout = logout;
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        const { fullName, phoneNumber } = req.body;
        // Input validation
        if (!fullName && !phoneNumber) {
            res.status(400).json({ message: 'No fields to update' });
            return;
        }
        const updateData = {};
        if (fullName !== undefined)
            updateData.fullName = fullName;
        if (phoneNumber !== undefined)
            updateData.phoneNumber = phoneNumber;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updatedUserId = updatedUser._id.toString();
        res.json({
            id: updatedUserId,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            phoneNumber: updatedUser.phoneNumber,
            role: updatedUser.role
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.updateProfile = updateProfile;
// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists or not for security
            res.status(200).json({
                message: 'If an account with that email exists, we have sent a password reset link.'
            });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        // Send email
        try {
            await emailService_1.default.sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({
                message: 'Password reset email sent successfully'
            });
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Clear the reset token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(500).json({
                message: 'Failed to send password reset email'
            });
        }
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
// Validate Reset Token
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }
        res.status(200).json({ message: 'Token is valid' });
    }
    catch (error) {
        console.error('Validate reset token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.validateResetToken = validateResetToken;
// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, email } = req.body;
        if (!token || !password) {
            res.status(400).json({ message: 'Token and password are required' });
            return;
        }
        // Validate password
        if (password.length < 8) {
            res.status(400).json({ message: 'Password must be at least 8 characters long' });
            return;
        }
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }
        // Optional: Verify email matches (additional security)
        if (email && user.email.toLowerCase() !== email.toLowerCase()) {
            res.status(400).json({ message: 'Email does not match the account associated with this token' });
            return;
        }
        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        // Send confirmation email
        try {
            await emailService_1.default.sendPasswordChangeConfirmation(user.email);
        }
        catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the password reset if email fails
        }
        res.status(200).json({
            message: 'Password reset successfully',
            success: true
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.resetPassword = resetPassword;
