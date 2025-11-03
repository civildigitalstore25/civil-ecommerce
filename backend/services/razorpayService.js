"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class RazorpayService {
    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            console.error('❌ Razorpay credentials not found in environment variables');
            throw new Error('Razorpay configuration missing');
        }
        this.razorpay = new razorpay_1.default({
            key_id: keyId,
            key_secret: keySecret
        });
        console.log('✅ Razorpay service initialized');
    }
    /**
     * Create a Razorpay order
     */
    async createOrder(amount, orderId, customerInfo) {
        try {
            // Razorpay expects amount in paise (smallest currency unit)
            const amountInPaise = Math.round(amount * 100);
            const options = {
                amount: amountInPaise,
                currency: 'INR',
                receipt: orderId,
                notes: {
                    orderId: orderId,
                    customerName: customerInfo.name,
                    customerEmail: customerInfo.email,
                    customerPhone: customerInfo.phone
                }
            };
            const order = await this.razorpay.orders.create(options);
            console.log('✅ Razorpay order created:', order.id);
            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            };
        }
        catch (error) {
            console.error('❌ Error creating Razorpay order:', error);
            return {
                success: false,
                message: error.message || 'Failed to create Razorpay order'
            };
        }
    }
    /**
     * Verify payment signature
     */
    verifyPaymentSignature(orderId, paymentId, signature) {
        try {
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            const generatedSignature = crypto_1.default
                .createHmac('sha256', keySecret)
                .update(`${orderId}|${paymentId}`)
                .digest('hex');
            const isValid = generatedSignature === signature;
            if (isValid) {
                console.log('✅ Payment signature verified successfully');
            }
            else {
                console.error('❌ Payment signature verification failed');
            }
            return isValid;
        }
        catch (error) {
            console.error('❌ Error verifying signature:', error);
            return false;
        }
    }
    /**
     * Fetch payment details
     */
    async getPaymentDetails(paymentId) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                payment
            };
        }
        catch (error) {
            console.error('❌ Error fetching payment details:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch payment details'
            };
        }
    }
    /**
     * Initiate refund
     */
    async initiateRefund(paymentId, amount) {
        try {
            const refundData = {
                payment_id: paymentId
            };
            if (amount) {
                refundData.amount = Math.round(amount * 100); // Convert to paise
            }
            const refund = await this.razorpay.payments.refund(paymentId, refundData);
            console.log('✅ Refund initiated:', refund.id);
            return {
                success: true,
                refund
            };
        }
        catch (error) {
            console.error('❌ Error initiating refund:', error);
            return {
                success: false,
                message: error.message || 'Failed to initiate refund'
            };
        }
    }
}
exports.default = new RazorpayService();
