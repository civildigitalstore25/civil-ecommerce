// backend/services/phonepeService.ts
// Service for PhonePe payment gateway integration

import axios from 'axios';
import crypto from 'crypto';

// Force production URL for PhonePe
const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

interface PhonePePaymentRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: string;
  };
}

/**
 * Generate checksum for PhonePe API
 */
function generateChecksum(payload: string, endpoint: string): string {
  const checksumString = payload + endpoint + SALT_KEY;
  const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
  return checksum + '###' + SALT_INDEX;
}

/**
 * Create PhonePe payment
 */
export async function createPhonePePayment(
  orderId: string,
  amount: number,
  callbackUrl: string,
  mobileNumber?: string
) {
  try {
    // Debug logging
    console.log('🔍 PhonePe Configuration Check:');
    console.log('MERCHANT_ID:', MERCHANT_ID ? '✅ Set' : '❌ Missing');
    console.log('SALT_KEY:', SALT_KEY ? '✅ Set' : '❌ Missing');
    console.log('SALT_INDEX:', SALT_INDEX);
    console.log('Base URL:', PHONEPE_BASE_URL);
    
    if (!MERCHANT_ID || !SALT_KEY) {
      console.error('❌ PhonePe credentials not configured properly');
      throw new Error('PhonePe credentials not configured');
    }

    console.log('📱 Creating PhonePe payment for order:', orderId);

    // PhonePe expects amount in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;
    const merchantUserId = `USER_${Date.now()}`;

    const paymentRequest: PhonePePaymentRequest = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId,
      amount: amountInPaise,
      redirectUrl: callbackUrl,
      redirectMode: 'POST',
      callbackUrl,
      mobileNumber,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payload = JSON.stringify(paymentRequest);
    const base64Payload = Buffer.from(payload).toString('base64');
    const endpoint = '/pg/v1/pay';
    const xVerify = generateChecksum(base64Payload, endpoint);

    // Debug logging
    console.log('🔍 Request Details:');
    console.log('Payload:', payload);
    console.log('Base64 Payload:', base64Payload.substring(0, 50) + '...');
    console.log('X-VERIFY Header:', xVerify);
    console.log('Request URL:', `${PHONEPE_BASE_URL}${endpoint}`);

    const response = await axios.post(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
        }
      }
    );

    console.log('✅ PhonePe payment created:', response.data);

    if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId,
        code: response.data.code
      };
    } else {
      throw new Error('Failed to create PhonePe payment');
    }
  } catch (error: any) {
    console.error('❌ PhonePe payment creation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'PhonePe payment failed');
  }
}

/**
 * Verify PhonePe payment status
 */
export async function verifyPhonePePayment(merchantTransactionId: string) {
  try {
    if (!MERCHANT_ID || !SALT_KEY) {
      throw new Error('PhonePe credentials not configured');
    }

    console.log('🔍 Verifying PhonePe payment:', merchantTransactionId);

    const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    const checksumString = endpoint + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    const xVerify = checksum + '###' + SALT_INDEX;

    const response = await axios.get(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': MERCHANT_ID
        }
      }
    );

    console.log('✅ PhonePe payment verification response:', response.data);

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error: any) {
    console.error('❌ PhonePe verification error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'PhonePe verification failed');
  }
}

/**
 * Handle PhonePe callback
 */
export async function handlePhonePeCallback(callbackData: any) {
  try {
    console.log('📞 PhonePe callback received:', callbackData);

    // Decode base64 response
    const decodedData = Buffer.from(callbackData.response, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);

    // Verify checksum
    const receivedChecksum = callbackData['x-verify'];
    const calculatedChecksum = generateChecksum(callbackData.response, '');

    if (receivedChecksum !== calculatedChecksum) {
      throw new Error('Invalid checksum');
    }

    return {
      success: parsedData.success,
      code: parsedData.code,
      message: parsedData.message,
      data: parsedData.data
    };
  } catch (error: any) {
    console.error('❌ PhonePe callback handling error:', error.message);
    throw error;
  }
}
