import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('❌ Razorpay credentials not found in environment variables');
      throw new Error('Razorpay configuration missing');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    console.log('✅ Razorpay service initialized');
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(amount: number, orderId: string, customerInfo: any) {
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
    } catch (error: any) {
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
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET!;
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = generatedSignature === signature;
      
      if (isValid) {
        console.log('✅ Payment signature verified successfully');
      } else {
        console.error('❌ Payment signature verification failed');
      }

      return isValid;
    } catch (error) {
      console.error('❌ Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Fetch payment details
   */
  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment
      };
    } catch (error: any) {
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
  async initiateRefund(paymentId: string, amount?: number) {
    try {
      const refundData: any = {
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
    } catch (error: any) {
      console.error('❌ Error initiating refund:', error);
      return {
        success: false,
        message: error.message || 'Failed to initiate refund'
      };
    }
  }
}

export default new RazorpayService();