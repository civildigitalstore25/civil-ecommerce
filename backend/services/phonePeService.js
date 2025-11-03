"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const phonepe_1 = require("../config/phonepe");
class PhonePeService {
    constructor() {
        this.merchantId = phonepe_1.phonePeConfig.merchantId;
        this.saltKey = phonepe_1.phonePeConfig.saltKey;
        this.saltIndex = phonepe_1.phonePeConfig.saltIndex;
        this.apiUrl = phonepe_1.phonePeConfig.hostUrl;
    }
    /**
     * Generate X-VERIFY header for PhonePe API
     */
    generateXVerify(payload, endpoint) {
        // PhonePe checksum format: SHA256(base64Body + endpoint + saltKey) + ### + saltIndex
        const stringToHash = payload + endpoint + this.saltKey;
        const sha256 = crypto_1.default.createHash('sha256').update(stringToHash).digest('hex');
        const xVerify = `${sha256}###${this.saltIndex}`;
        console.log('🔐 Checksum Generation Debug:');
        console.log('  Base64 Payload Length:', payload.length);
        console.log('  Endpoint:', endpoint);
        console.log('  Salt Key:', this.saltKey);
        console.log('  String to Hash:', stringToHash.substring(0, 100) + '...');
        console.log('  SHA256:', sha256);
        console.log('  Final X-VERIFY:', xVerify);
        return xVerify;
    }
    /**
     * Initiate payment with PhonePe
     */
    async initiatePayment(paymentRequest) {
        try {
            console.log('🚀 Initiating PhonePe payment:', {
                transactionId: paymentRequest.merchantTransactionId,
                amount: paymentRequest.amount
            });
            // Convert amount from rupees to paise (PhonePe expects amount in paise)
            const amountInPaise = Math.round(paymentRequest.amount * 100);
            const payload = {
                merchantId: this.merchantId,
                merchantTransactionId: paymentRequest.merchantTransactionId,
                merchantUserId: paymentRequest.merchantUserId,
                amount: amountInPaise,
                redirectUrl: paymentRequest.redirectUrl,
                redirectMode: paymentRequest.redirectMode,
                callbackUrl: paymentRequest.callbackUrl,
                mobileNumber: paymentRequest.mobileNumber,
                paymentInstrument: {
                    type: 'PAY_PAGE'
                }
            };
            console.log('📦 Payment payload:', payload);
            // Base64 encode the payload
            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            // Generate X-VERIFY header
            const endpoint = '/pg/v1/pay';
            const xVerify = this.generateXVerify(base64Payload, endpoint);
            console.log('🔐 X-VERIFY:', xVerify);
            // Make API request
            const response = await axios_1.default.post(`${this.apiUrl}${endpoint}`, {
                request: base64Payload
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': xVerify,
                    'accept': 'application/json'
                }
            });
            console.log('✅ PhonePe response:', response.data);
            if (response.data.success) {
                return {
                    success: true,
                    code: response.data.code,
                    message: response.data.message,
                    data: response.data.data
                };
            }
            else {
                console.error('❌ PhonePe payment initiation failed:', response.data);
                return {
                    success: false,
                    code: response.data.code,
                    message: response.data.message
                };
            }
        }
        catch (error) {
            console.error('❌ PhonePe API error:', error.response?.data || error.message);
            return {
                success: false,
                code: 'INTERNAL_ERROR',
                message: error.response?.data?.message || 'Payment initiation failed'
            };
        }
    }
    /**
     * Check payment status
     */
    async checkPaymentStatus(merchantTransactionId) {
        try {
            console.log('🔍 Checking payment status for:', merchantTransactionId);
            const endpoint = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
            const xVerify = this.generateXVerify('', endpoint);
            const response = await axios_1.default.get(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': xVerify,
                    'accept': 'application/json'
                }
            });
            console.log('✅ Status check response:', response.data);
            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data
            };
        }
        catch (error) {
            console.error('❌ Status check error:', error.response?.data || error.message);
            return {
                success: false,
                code: 'INTERNAL_ERROR',
                message: 'Failed to check payment status'
            };
        }
    }
    /**
     * Verify callback signature
     */
    verifyCallback(xVerify, base64Response) {
        try {
            const expectedXVerify = this.generateXVerify(base64Response, '');
            return xVerify === expectedXVerify;
        }
        catch (error) {
            console.error('❌ Callback verification error:', error);
            return false;
        }
    }
    /**
     * Initiate refund
     */
    async initiateRefund(merchantTransactionId, originalTransactionId, amount) {
        try {
            console.log('💸 Initiating refund:', {
                merchantTransactionId,
                originalTransactionId,
                amount
            });
            const amountInPaise = Math.round(amount * 100);
            const payload = {
                merchantId: this.merchantId,
                merchantTransactionId,
                originalTransactionId,
                amount: amountInPaise,
                callbackUrl: phonepe_1.phonePeConfig.callbackUrl
            };
            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const endpoint = '/pg/v1/refund';
            const xVerify = this.generateXVerify(base64Payload, endpoint);
            const response = await axios_1.default.post(`${this.apiUrl}${endpoint}`, {
                request: base64Payload
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': xVerify,
                    'accept': 'application/json'
                }
            });
            console.log('✅ Refund response:', response.data);
            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data
            };
        }
        catch (error) {
            console.error('❌ Refund error:', error.response?.data || error.message);
            return {
                success: false,
                code: 'INTERNAL_ERROR',
                message: 'Refund initiation failed'
            };
        }
    }
}
exports.default = new PhonePeService();
