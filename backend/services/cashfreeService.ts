import crypto from 'crypto';
import axios from 'axios';

interface CashfreeConfig {
    appId: string;
    secretKey: string;
    apiVersion: string;
    environment: 'sandbox' | 'production';
}

class CashfreeService {
    private config: CashfreeConfig;
    private baseUrl: string;

    constructor() {
        const appId = process.env.CASHFREE_APP_ID;
        const secretKey = process.env.CASHFREE_SECRET_KEY;
        const environment = (process.env.CASHFREE_ENV || 'sandbox') as 'sandbox' | 'production';

        if (!appId || !secretKey) {
            console.error('❌ Cashfree credentials not found in environment variables');
            throw new Error('Cashfree configuration missing');
        }

        this.config = {
            appId,
            secretKey,
            apiVersion: '2023-08-01',
            environment
        };

        this.baseUrl = environment === 'production'
            ? 'https://api.cashfree.com/pg'
            : 'https://sandbox.cashfree.com/pg';

        console.log('✅ Cashfree service initialized in', environment, 'mode');
    }

    /**
     * Generate headers for Cashfree API requests
     */
    private getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion
        };
    }

    /**
     * Create a Cashfree order
     */
    async createOrder(amount: number, orderId: string, customerInfo: any) {
        try {
            const orderData = {
                order_id: orderId,
                order_amount: amount,
                order_currency: 'INR',
                customer_details: {
                    customer_id: customerInfo.customerId || customerInfo.email,
                    customer_name: customerInfo.name,
                    customer_email: customerInfo.email,
                    customer_phone: customerInfo.phone
                },
                order_meta: {
                    return_url: `${process.env.FRONTEND_URL}/payment-status?order_id={order_id}`,
                    notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`
                },
                order_note: `Order for ${customerInfo.name}`
            };

            console.log('📤 Creating Cashfree order:', orderId);

            const response = await axios.post(
                `${this.baseUrl}/orders`,
                orderData,
                { headers: this.getHeaders() }
            );

            console.log('✅ Cashfree order created:', response.data);

            return {
                success: true,
                orderId: response.data.order_id,
                paymentSessionId: response.data.payment_session_id,
                orderStatus: response.data.order_status,
                amount: response.data.order_amount,
                currency: response.data.order_currency
            };
        } catch (error: any) {
            console.error('❌ Error creating Cashfree order:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to create Cashfree order'
            };
        }
    }

    /**
     * Verify payment signature (webhook verification)
     */
    verifyWebhookSignature(
        rawBody: string,
        receivedSignature: string,
        timestamp: string
    ): boolean {
        try {
            const signatureData = timestamp + rawBody;
            const generatedSignature = crypto
                .createHmac('sha256', this.config.secretKey)
                .update(signatureData)
                .digest('base64');

            const isValid = generatedSignature === receivedSignature;

            if (isValid) {
                console.log('✅ Webhook signature verified successfully');
            } else {
                console.error('❌ Webhook signature verification failed');
            }

            return isValid;
        } catch (error) {
            console.error('❌ Error verifying signature:', error);
            return false;
        }
    }

    /**
     * Fetch order details from Cashfree
     */
    async getOrderDetails(orderId: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/orders/${orderId}`,
                { headers: this.getHeaders() }
            );

            console.log('✅ Order details fetched:', orderId);

            return {
                success: true,
                order: response.data
            };
        } catch (error: any) {
            console.error('❌ Error fetching order details:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to fetch order details'
            };
        }
    }

    /**
     * Fetch payment details
     */
    async getPaymentDetails(orderId: string, cfPaymentId?: string) {
        try {
            let url = `${this.baseUrl}/orders/${orderId}/payments`;
            if (cfPaymentId) {
                url = `${this.baseUrl}/orders/${orderId}/payments/${cfPaymentId}`;
            }

            const response = await axios.get(url, { headers: this.getHeaders() });

            return {
                success: true,
                payments: response.data
            };
        } catch (error: any) {
            console.error('❌ Error fetching payment details:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to fetch payment details'
            };
        }
    }

    /**
     * Initiate refund
     */
    async initiateRefund(orderId: string, cfPaymentId: string, refundAmount: number, refundId: string) {
        try {
            const refundData = {
                refund_id: refundId,
                refund_amount: refundAmount,
                refund_note: `Refund for order ${orderId}`
            };

            const response = await axios.post(
                `${this.baseUrl}/orders/${orderId}/refunds`,
                refundData,
                { headers: this.getHeaders() }
            );

            console.log('✅ Refund initiated:', response.data.cf_refund_id);

            return {
                success: true,
                refund: response.data
            };
        } catch (error: any) {
            console.error('❌ Error initiating refund:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to initiate refund'
            };
        }
    }

    /**
     * Get refund details
     */
    async getRefundDetails(orderId: string, refundId: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/orders/${orderId}/refunds/${refundId}`,
                { headers: this.getHeaders() }
            );

            return {
                success: true,
                refund: response.data
            };
        } catch (error: any) {
            console.error('❌ Error fetching refund details:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to fetch refund details'
            };
        }
    }
}

export default new CashfreeService();
