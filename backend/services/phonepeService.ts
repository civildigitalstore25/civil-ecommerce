import axios from 'axios';
import crypto from 'crypto';

class PhonePeService {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: string;
  private apiUrl: string;

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || '';
    this.saltKey = process.env.PHONEPE_SALT_KEY || '';
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    // Use sandbox URL for testing, production URL for live
    this.apiUrl = process.env.PHONEPE_ENV === 'production'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    if (!this.merchantId || !this.saltKey) {
      console.error('❌ PhonePe credentials not found in environment variables');
      throw new Error('PhonePe configuration missing');
    }

    console.log('✅ PhonePe service initialized');
  }

  /**
   * Generate checksum for PhonePe API requests
   */
  private generateChecksum(payload: string): string {
    const stringToHash = payload + '/pg/v1/pay' + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return sha256 + '###' + this.saltIndex;
  }

  /**
   * Verify checksum for PhonePe callbacks
   */
  private verifyChecksum(receivedChecksum: string, payload: string): boolean {
    const stringToHash = payload + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const expectedChecksum = sha256 + '###' + this.saltIndex;
    return receivedChecksum === expectedChecksum;
  }

  /**
   * Create a PhonePe payment order
   */
  async createOrder(amount: number, orderId: string, customerInfo: any) {
    try {
      // PhonePe expects amount in paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);

      // Prepare payment payload
      const paymentPayload = {
        merchantId: this.merchantId,
        merchantTransactionId: orderId,
        merchantUserId: customerInfo.userId || `USER_${Date.now()}`,
        amount: amountInPaise,
        redirectUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/callback`,
        redirectMode: 'POST',
        callbackUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/callback`,
        mobileNumber: customerInfo.phone?.replace(/\D/g, '').slice(-10) || '',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // Convert payload to base64
      const payloadBase64 = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

      // Generate checksum
      const checksum = this.generateChecksum(payloadBase64);

      // Make API request to PhonePe
      const response = await axios.post(
        `${this.apiUrl}/pg/v1/pay`,
        {
          request: payloadBase64
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
          }
        }
      );

      console.log('✅ PhonePe order created:', orderId);

      if (response.data.success) {
        return {
          success: true,
          orderId: orderId,
          transactionId: orderId,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
          amount: amountInPaise,
          currency: 'INR'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to create PhonePe order'
        };
      }
    } catch (error: any) {
      console.error('❌ Error creating PhonePe order:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create PhonePe order'
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(merchantTransactionId: string) {
    try {
      const url = `${this.apiUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
      const stringToHash = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey;
      const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const checksum = sha256 + '###' + this.saltIndex;

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': this.merchantId
        }
      });

      console.log('✅ PhonePe payment status checked:', merchantTransactionId);

      if (response.data.success) {
        return {
          success: true,
          status: response.data.data.state,
          transactionId: response.data.data.transactionId,
          paymentInstrument: response.data.data.paymentInstrument,
          amount: response.data.data.amount,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Payment status check failed'
        };
      }
    } catch (error: any) {
      console.error('❌ Error checking PhonePe payment status:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to check payment status'
      };
    }
  }

  /**
   * Verify payment callback
   */
  verifyCallback(receivedChecksum: string, base64Response: string): boolean {
    try {
      // Decode base64 response
      const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf8');
      const responseData = JSON.parse(decodedResponse);

      // Verify checksum
      const isValid = this.verifyChecksum(receivedChecksum, base64Response);

      if (isValid) {
        console.log('✅ PhonePe callback signature verified successfully');
      } else {
        console.error('❌ PhonePe callback signature verification failed');
      }

      return isValid;
    } catch (error) {
      console.error('❌ Error verifying PhonePe callback:', error);
      return false;
    }
  }

  /**
   * Parse callback response
   */
  parseCallbackResponse(base64Response: string): any {
    try {
      const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf8');
      return JSON.parse(decodedResponse);
    } catch (error) {
      console.error('❌ Error parsing PhonePe callback response:', error);
      return null;
    }
  }

  /**
   * Initiate refund
   */
  async initiateRefund(originalTransactionId: string, refundAmount: number, refundId: string) {
    try {
      const amountInPaise = Math.round(refundAmount * 100);

      const refundPayload = {
        merchantId: this.merchantId,
        merchantTransactionId: refundId,
        originalTransactionId: originalTransactionId,
        amount: amountInPaise,
        callbackUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/refund-callback`
      };

      const payloadBase64 = Buffer.from(JSON.stringify(refundPayload)).toString('base64');
      const checksum = this.generateChecksum(payloadBase64);

      const response = await axios.post(
        `${this.apiUrl}/pg/v1/refund`,
        {
          request: payloadBase64
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
          }
        }
      );

      console.log('✅ PhonePe refund initiated:', refundId);

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error initiating PhonePe refund:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to initiate refund'
      };
    }
  }
}

// Export singleton instance
export default new PhonePeService();
