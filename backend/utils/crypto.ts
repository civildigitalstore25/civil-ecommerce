import crypto from 'crypto';

/**
 * Generate SHA256 checksum for PhonePe API
 */
export const generateChecksum = (
  payload: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string
): string => {
  const stringToHash = payload + endpoint + saltKey;
  const sha256Hash = crypto
    .createHash('sha256')
    .update(stringToHash)
    .digest('hex');
  return `${sha256Hash}###${saltIndex}`;
};

/**
 * Verify callback checksum from PhonePe
 */
export const verifyChecksum = (
  receivedChecksum: string,
  payload: string,
  saltKey: string,
  saltIndex: string
): boolean => {
  const stringToHash = payload + saltKey;
  const sha256Hash = crypto
    .createHash('sha256')
    .update(stringToHash)
    .digest('hex');
  const expectedChecksum = `${sha256Hash}###${saltIndex}`;
  return receivedChecksum === expectedChecksum;
};

/**
 * Generate unique transaction ID
 */
export const generateTransactionId = (prefix: string = 'TXN'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
};

export default {
  generateChecksum,
  verifyChecksum,
  generateTransactionId
};