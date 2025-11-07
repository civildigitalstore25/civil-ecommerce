"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = exports.verifyChecksum = exports.generateChecksum = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate SHA256 checksum for PhonePe API
 */
const generateChecksum = (payload, endpoint, saltKey, saltIndex) => {
    const stringToHash = payload + endpoint + saltKey;
    const sha256Hash = crypto_1.default
        .createHash('sha256')
        .update(stringToHash)
        .digest('hex');
    return `${sha256Hash}###${saltIndex}`;
};
exports.generateChecksum = generateChecksum;
/**
 * Verify callback checksum from PhonePe
 */
const verifyChecksum = (receivedChecksum, payload, saltKey, saltIndex) => {
    const stringToHash = payload + saltKey;
    const sha256Hash = crypto_1.default
        .createHash('sha256')
        .update(stringToHash)
        .digest('hex');
    const expectedChecksum = `${sha256Hash}###${saltIndex}`;
    return receivedChecksum === expectedChecksum;
};
exports.verifyChecksum = verifyChecksum;
/**
 * Generate unique transaction ID
 */
const generateTransactionId = (prefix = 'TXN') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}`;
};
exports.generateTransactionId = generateTransactionId;
exports.default = {
    generateChecksum: exports.generateChecksum,
    verifyChecksum: exports.verifyChecksum,
    generateTransactionId: exports.generateTransactionId
};
