export interface PhonePeConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  hostUrl: string;
  redirectUrl: string;
  callbackUrl: string;
}

export const phonePeConfig: PhonePeConfig = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || '',
  saltKey: process.env.PHONEPE_SALT_KEY || '',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  hostUrl: process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  redirectUrl: process.env.PAYMENT_REDIRECT_URL || 'http://localhost:5173/payment/callback',
  callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:5000/api/payments/callback',
};

// Validate config on import
export const validatePhonePeConfig = (): boolean => {
  const requiredFields: (keyof PhonePeConfig)[] = ['merchantId', 'saltKey', 'saltIndex'];
  const missingFields = requiredFields.filter(field => !phonePeConfig[field]);
  
  if (missingFields.length > 0) {
    console.warn('⚠️  Missing PhonePe configuration:', missingFields.join(', '));
    return false;
  }
  
  return true;
};

export default phonePeConfig;