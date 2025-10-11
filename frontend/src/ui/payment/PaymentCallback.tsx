import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const merchantTransactionId = localStorage.getItem('merchantTransactionId');
      const token = localStorage.getItem('token');

      // Wait for PhonePe callback
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/status/${merchantTransactionId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();

      if (data.success && data.data.status === 'SUCCESS') {
        setStatus('success');
        setMessage('Payment successful!');
        setTimeout(() => navigate('/orders'), 3000);
      } else if (data.data.status === 'PENDING') {
        setTimeout(() => verifyPayment(), 3000);
      } else {
        setStatus('error');
        setMessage('Payment failed');
        setTimeout(() => navigate('/cart'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to verify payment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && <p>Processing...</p>}
        {status === 'success' && <p className="text-green-600">{message}</p>}
        {status === 'error' && <p className="text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentCallback;